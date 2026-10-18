// Milli's controller for the app shell: page, side panels, the map (view, selection, layers,
// filters, time), notes and downloads. Every command reuses the handler the UI itself uses.
import type { Dispatch, RefObject, SetStateAction } from 'react';
import type { MapHandle } from '../AtlasMap';
import { download, parcelCsv, MONTH_NAMES } from '../lib';
import { submissionCsv } from '../model';
import type { Atlas, LayerSettings, MapFilters, MapMode, Parcel, Phase } from '../types';
import { callWhenReady, peek, useMilliController } from './bridge';

type Left = 'layers' | 'basemap' | 'tabla' | 'filters' | 'settings' | 'scripts' | 'notes' | 'fuentes';
const LEFT_OF = { capas: 'layers', mapa_base: 'basemap', tabla: 'tabla', filtros: 'filters', ajustes: 'settings', notas: 'notes', ninguno: null } as const;
const LEFT_NAME: Record<Left, string> = { layers: 'capas', basemap: 'mapa_base', tabla: 'tabla', filters: 'filtros', settings: 'ajustes', scripts: 'scripts', notes: 'notas', fuentes: 'datos_y_fuentes' };
const MAP_PANELS = new Set<Left>(['layers', 'basemap', 'tabla', 'filters']);
const GROUP_OF = { all: 'all', reservadas: 'prediction', con_rendimiento: 'training', propias: 'custom' } as const;
const GROUP_NAME: Record<string, string> = { all: 'todas', prediction: 'reservadas', training: 'con_rendimiento', custom: 'propias' };
const CLASS_OF = { continua: 'continuous', cuantiles: 'quantile', intervalos: 'equal' } as const;
const CLASS_NAME: Record<string, string> = { continuous: 'continua', quantile: 'cuantiles', equal: 'intervalos' };

/** One parcel as Milli reads it (tables, selection, the parcel card). */
export const parcelRow = (p: Parcel) => {
  const f = p.properties;
  return { id: f.id, nombre: f.name ?? null, municipio: f.municipality, estado: f.state, conjunto: GROUP_NAME[f.group] ?? f.group, superficie_ha: round(f.area, 2),
    registrado_t_ha: round(f.observedYield, 3), estimado_t_ha: round(f.predictedYield, 3), produccion_t: f.predictedYield == null ? null : round(f.predictedYield * f.area, 1) };
};
export const round = (v: number | null | undefined, d: number) => v == null || !Number.isFinite(v) ? null : Math.round(v * 10 ** d) / 10 ** d;
/** A page of rows for read_table, optionally keeping only some columns. */
export function tableSlice(rows: Record<string, unknown>[], { offset = 0, limit = 50, columns }: { offset?: number; limit?: number; columns?: string[] }, extra: Record<string, unknown> = {}) {
  const all = rows.length ? Object.keys(rows[0]) : [];
  const keep = columns?.length ? all.filter(c => columns.includes(c)) : all;
  return { ...extra, columnas: keep, total: rows.length, offset, filas: rows.slice(offset, offset + limit).map(r => Object.fromEntries(keep.map(k => [k, r[k]]))) };
}

export type AppMilli = {
  atlas: Atlas | null; parcels: Parcel[]; visibleParcels: Parcel[]; selected: Parcel | null; selection: string[];
  phase: Phase; dashboard: boolean; economics: boolean; left: Left | null; right: string | null; assistant: boolean; dark: boolean; scheme: string;
  mode: MapMode; layers: LayerSettings; filters: MapFilters; year: number; month: number; keyDate: string;
  tools: { draftMode: string | null; measureKind: string | null; selectArea: boolean; swipe: number | null; plugins: Record<string, boolean> };
  map: RefObject<MapHandle | null>;
  setDashboard: (v: boolean) => void; setEconomics: (v: boolean) => void; setLeft: Dispatch<SetStateAction<Left | null>>;
  switchMode: (m: MapMode) => void; setLayers: Dispatch<SetStateAction<LayerSettings>>; setFilters: Dispatch<SetStateAction<MapFilters>>;
  setYear: (y: number) => void; setMonth: (m: number) => void;
  chooseParcel: (id: string, locate?: boolean) => void; showSelection: (ids: string[]) => void; exportMap: () => Promise<void>;
};

export function useAppMilli(a: AppMilli) {
  const find = (id: string) => {
    const p = a.parcels.find(p => p.properties.id === id || p.properties.id === id.toUpperCase());
    if (!p) throw new Error(`No existe la parcela ${id}.`);
    return p;
  };
  /** Parcels for a download: what the screen shows, what is checked or selected, or all of them. */
  const scoped = (scope: string): Parcel[] => {
    const byIds = (ids: string[] | undefined) => ids?.length ? a.parcels.filter(p => ids.includes(p.properties.id)) : null;
    if (scope === 'todas') return a.parcels;
    if (scope === 'seleccionadas') {
      const chosen = byIds(peek<string[]>('estimacion', 'ids', { which: 'checked' })) ?? byIds(peek<string[]>('economia', 'ids', { which: 'checked' })) ?? byIds(a.selection) ?? (a.selected ? [a.selected] : null);
      if (!chosen) throw new Error('No hay parcelas seleccionadas ni marcadas en la pantalla.');
      return chosen;
    }
    return (a.dashboard && !a.economics ? byIds(peek<string[]>('estimacion', 'ids', { which: 'shown' })) : null) ?? a.visibleParcels;
  };

  useMilliController('app', {
    snapshot: () => {
      const { layers: l, filters: f } = a, s = a.selected;
      return {
        vista: { pagina: a.dashboard ? (a.economics ? 'economia' : 'panel') : 'mapa', panel_lateral: a.left ? LEFT_NAME[a.left] : null,
          panel_derecho: a.right === 'parcel' ? 'ficha_de_parcela' : a.right === 'selection' ? 'resumen_de_seleccion' : a.right === 'export' ? 'exportar' : a.right === 'draft' ? 'delimitacion' : null,
          tema: a.dark ? 'oscuro' : 'claro', esquema: a.scheme, chat_de_milli_abierto: a.assistant },
        mapa: {
          capa: a.mode === 'parcels' ? (l.yieldField === 'observed' ? 'Rendimiento registrado' : 'Rendimiento estimado') : a.mode === 'ndvi' ? 'Vegetación (NDVI Sentinel-2)' : a.mode,
          modo: a.mode === 'parcels' ? 'rendimiento' : a.mode === 'ndvi' ? 'vegetacion' : a.mode, campo_rendimiento: l.yieldField === 'observed' ? 'registrado' : 'estimado',
          clasificacion: CLASS_NAME[l.classification], mapa_de_calor: l.heatmap, opacidad: l.opacity, mapa_base: l.base, limites_estatales: l.states, limites_municipales: l.municipalities,
          filtros: { estado: f.state, conjunto: GROUP_NAME[f.group] ?? f.group, rango_rendimiento: f.yieldBand ?? null, busqueda: f.query || null },
          año: a.year, mes: a.month + 1, mes_nombre: MONTH_NAMES[a.month],
          parcelas_visibles: a.visibleParcels.length, parcelas_totales: a.parcels.length,
          parcela_seleccionada: s ? parcelRow(s) : null,
          seleccion: { parcelas: a.selection.length, ids: a.selection.slice(0, 60) },
          encuadre: a.dashboard ? null : a.map.current?.view() ?? null,
        },
        herramientas: { activa: a.tools.draftMode ? `delimitar_${a.tools.draftMode}` : a.tools.measureKind ? `medir_${a.tools.measureKind}` : a.tools.selectArea ? 'seleccionar_por_area' : null,
          comparador: a.tools.swipe != null, complementos: a.tools.plugins },
        notas: { panel_abierto: a.left === 'notes', nota: 'Lee el texto con read_notes.' },
      };
    },
    commands: {
      navigate: ({ page }) => {
        if (page === 'mapa') a.setDashboard(false);
        // Sheets that open over the dashboard (Notas, Ajustes) would hide what Milli is about to show.
        else { a.setDashboard(true); a.setEconomics(page === 'economia'); a.setLeft(l => l && !MAP_PANELS.has(l) ? null : l); }
        return { pagina: page };
      },
      open_panel: ({ panel }) => {
        const next = LEFT_OF[panel as keyof typeof LEFT_OF];
        if (next && MAP_PANELS.has(next)) a.setDashboard(false);
        a.setLeft(next); return { panel };
      },
      map_fly_to: ({ parcel_id, bbox, all }) => {
        a.setDashboard(false);
        if (parcel_id) { const p = find(String(parcel_id)); setTimeout(() => a.map.current?.fitParcel(p), 40); return { encuadre: p.properties.id }; }
        if (Array.isArray(bbox)) { setTimeout(() => a.map.current?.fitBounds(bbox as number[]), 40); return { encuadre: bbox }; }
        if (all) { setTimeout(() => a.map.current?.fitAll(), 40); return { encuadre: 'todas' }; }
        throw new Error('Indica parcel_id, bbox o all.');
      },
      select_parcel: ({ parcel_id }) => { const p = find(String(parcel_id)); a.setDashboard(false); a.chooseParcel(p.properties.id, true); return { parcela: parcelRow(p) }; },
      map_select_parcels: ({ parcel_ids }) => {
        const wanted = (parcel_ids as string[]).map(id => id.toUpperCase());
        const chosen = a.parcels.filter(p => wanted.includes(p.properties.id.toUpperCase()));
        if (!chosen.length) throw new Error('Ninguna de esas parcelas existe.');
        a.showSelection(chosen.map(p => p.properties.id));
        const area = chosen.reduce((t, p) => t + p.properties.area, 0), production = chosen.reduce((t, p) => t + (p.properties.predictedYield ?? 0) * p.properties.area, 0);
        return { seleccionadas: chosen.length, no_encontradas: wanted.filter(id => !chosen.some(p => p.properties.id.toUpperCase() === id)), superficie_ha: round(area, 2), produccion_estimada_t: round(production, 1) };
      },
      set_map_layer: args => {
        a.setDashboard(false);
        if (args.mode) a.switchMode(args.mode === 'vegetacion' ? 'ndvi' : 'parcels');
        a.setLayers(l => ({ ...l,
          ...(args.yield_field ? { yieldField: args.yield_field === 'registrado' ? 'observed' : 'predicted' } : {}),
          ...(args.classification ? { classification: CLASS_OF[args.classification as keyof typeof CLASS_OF] } : {}),
          ...(args.heatmap != null ? { heatmap: !!args.heatmap } : {}), ...(args.opacity != null ? { opacity: Number(args.opacity) } : {}),
          ...(args.basemap ? { base: args.basemap as LayerSettings['base'] } : {}),
          ...(args.states_overlay != null ? { states: !!args.states_overlay } : {}), ...(args.municipalities_overlay != null ? { municipalities: !!args.municipalities_overlay } : {}) }));
        return {};
      },
      set_map_filters: ({ state, group, yield_band, reset }) => {
        a.setDashboard(false);
        a.setFilters(f => reset ? { ...f, state: 'all', group: 'all', yieldBand: null, query: '' } : { ...f,
          ...(state ? { state: String(state) } : {}), ...(group ? { group: GROUP_OF[group as keyof typeof GROUP_OF] } : {}),
          ...(yield_band !== undefined ? { yieldBand: yield_band as [number, number] | null } : {}) });
        return {};
      },
      set_time: ({ year, month }) => { a.setYear(Number(year)); a.setMonth(Number(month) - 1); return { nota: a.mode === 'parcels' ? 'La capa de rendimiento no cambia por mes; usa set_map_layer(mode: "vegetacion") para ver el NDVI del mes.' : undefined }; },
      show_notes: async ({ text }) => {
        a.setLeft('notes');
        await callWhenReady('notas', 'show', { text });
        return { panel: 'notas' };
      },
      download: async ({ kind, scope }) => {
        if (!a.atlas) throw new Error('El atlas aún no carga.');
        if (kind === 'entrega_csv') { download('agrocebada-entrega-59.csv', submissionCsv(a.atlas.predictions), 'text/csv'); return { archivo: 'agrocebada-entrega-59.csv', filas: 59 }; }
        if (kind === 'mapa_png') { await a.exportMap(); return { archivo: `agrocebada-mapa-${a.keyDate}.png` }; }
        const list = scoped(String(kind === 'seleccion_csv' ? 'seleccionadas' : scope));
        if (kind === 'parcelas_geojson') { download('parcelas.geojson', JSON.stringify({ type: 'FeatureCollection', features: list }), 'application/geo+json'); return { archivo: 'parcelas.geojson', parcelas: list.length }; }
        const name = kind === 'seleccion_csv' || scope === 'seleccionadas' ? 'agrocebada-seleccion.csv' : 'agrocebada-estimaciones.csv';
        download(name, parcelCsv(list, a.atlas, a.keyDate), 'text/csv');
        return { archivo: name, filas: list.length };
      },
      read_table: args => tableSlice(a.visibleParcels.map(parcelRow), args, { tabla: 'atributos', nota: 'Parcelas visibles en el mapa (con los filtros del mapa).' }),
    },
  });
}
