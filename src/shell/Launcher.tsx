// Launcher after Caelestia's: rises from the bottom edge, the query sits at the
// bottom and results stack above. Plain text finds parcels, municipalities and
// coordinates; ">" lists commands. ">base" and ">esquema" open a carousel whose
// centred item grows, like the wallpaper picker.
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { CornerDownLeft, Landmark, LocateFixed, MapPin, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LogoMark } from '../Logo';
import { fmt, normalize, parseCoordinates } from '../lib';
import type { Parcel } from '../types';

export interface Command { id: string; title: string; subtitle: string; icon: ReactNode; keywords?: string; carousel?: 'base' | 'scheme'; run?: () => void }
export interface CarouselItem { key: string; label: string; preview: ReactNode }
type Row = { key: string; icon: ReactNode; title: string; subtitle: string; hint?: string; run: () => void };
type Municipality = { name: string; state: string; geometry: object };

let municipalities: Promise<Municipality[]> | undefined;
const loadMunicipalities = () => municipalities ||= fetch('/data/municipios.geojson').then(r => r.json()).then((d: { features: { properties: { nomgeo: string; cve_ent?: string }; geometry: object }[] }) =>
  d.features.map(f => ({ name: f.properties.nomgeo, state: ({ '13': 'Hidalgo', '21': 'Puebla', '29': 'Tlaxcala' } as Record<string, string>)[f.properties.cve_ent ?? ''] ?? 'Municipio', geometry: f.geometry }))).catch(() => { municipalities = undefined; return []; });

export default function Launcher({ initial = '', parcels, commands, carousels, onClose, onParcel, onPlace, onMunicipality }: {
  initial?: string; parcels: Parcel[]; commands: Command[];
  carousels: Record<'base' | 'scheme', { items: CarouselItem[]; value: string; onPick: (key: string) => void }>;
  onClose: () => void; onParcel: (id: string) => void; onPlace: (coords: [number, number]) => void; onMunicipality: (name: string, geometry: object) => void;
}) {
  const [query, setQuery] = useState(initial);
  const [active, setActive] = useState(0);
  const [places, setPlaces] = useState<Municipality[]>([]);
  const input = useRef<HTMLInputElement>(null), list = useRef<HTMLUListElement>(null);
  useEffect(() => { input.current?.focus(); void loadMunicipalities().then(setPlaces); }, []);
  useEffect(() => setActive(0), [query]);

  const commandMode = query.startsWith('>');
  const carouselKey = commandMode ? (/^>\s*(base|mapa base)\b/i.test(query) ? 'base' : /^>\s*esquema\b/i.test(query) ? 'scheme' : null) : null;
  const carousel = carouselKey ? carousels[carouselKey] : null;
  const [slide, setSlide] = useState(0);
  useEffect(() => { if (carousel) setSlide(Math.max(0, carousel.items.findIndex(i => i.key === carousel.value))); }, [carouselKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const rows = useMemo<Row[]>(() => {
    const term = normalize(commandMode ? query.slice(1) : query);
    const commandRows = commands.filter(c => !term || normalize(`${c.title} ${c.id} ${c.keywords ?? ''}`).includes(term)).map(c => ({
      key: 'cmd:' + c.id, icon: c.icon, title: c.title, subtitle: c.subtitle, hint: '>' + c.id,
      run: () => { if (c.carousel) setQuery(`>${c.carousel === 'base' ? 'base' : 'esquema'} `); else { c.run?.(); onClose(); } },
    }));
    if (commandMode) return commandRows;
    if (!term) return [
      ...parcels.slice(0, 4).map(p => parcelRow(p)),
      ...commandRows.slice(0, 5),
    ];
    const coords = parseCoordinates(query);
    const found: Row[] = [];
    if (coords) found.push({ key: 'coords', icon: <LocateFixed/>, title: `Ir a ${fmt(coords[1], 4)}, ${fmt(coords[0], 4)}`, subtitle: 'Coordenadas WGS 84', run: () => { onPlace(coords); onClose(); } });
    found.push(...parcels.filter(p => normalize(`${p.properties.id} ${p.properties.name ?? ''} ${p.properties.municipality} ${p.properties.state}`).includes(term)).slice(0, 7).map(parcelRow));
    found.push(...places.filter(m => normalize(m.name).includes(term)).slice(0, 4).map(m => ({ key: 'mun:' + m.name + m.state, icon: <Landmark/>, title: m.name, subtitle: `Municipio · ${m.state}`, run: () => { onMunicipality(m.name, m.geometry); onClose(); } })));
    found.push(...commandRows.slice(0, 3));
    return found;
    function parcelRow(p: Parcel): Row {
      const f = p.properties;
      return { key: 'parcel:' + f.id, icon: <MapPin/>, title: f.name || f.id, subtitle: `${f.municipality} · ${f.state} · ${fmt(f.area, 1)} ha`, hint: f.predictedYield != null ? `${fmt(f.predictedYield)} t/ha` : undefined, run: () => { onParcel(f.id); onClose(); } };
    }
  }, [query, commandMode, commands, parcels, places, onClose, onParcel, onPlace, onMunicipality]);

  useEffect(() => { list.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' }); }, [active]);

  function key(event: React.KeyboardEvent) {
    if (event.key === 'Escape') { event.preventDefault(); if (carousel) setQuery('>'); else onClose(); return; }
    if (carousel) {
      if (event.key === 'ArrowRight') { event.preventDefault(); setSlide(s => Math.min(carousel.items.length - 1, s + 1)); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); setSlide(s => Math.max(0, s - 1)); }
      if (event.key === 'Enter') { event.preventDefault(); carousel.onPick(carousel.items[slide].key); }
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'Tab' && !event.shiftKey) { event.preventDefault(); setActive(a => Math.min(rows.length - 1, a + 1)); }
    if (event.key === 'ArrowUp' || event.key === 'Tab' && event.shiftKey) { event.preventDefault(); setActive(a => Math.max(0, a - 1)); }
    if (event.key === 'Enter') { event.preventDefault(); rows[active]?.run(); }
  }

  return <div className="flex w-[min(620px,calc(100vw-2rem))] flex-col gap-2 p-3" onKeyDown={key}>
    {carousel ? <div className="flex items-end justify-center gap-3 overflow-hidden px-2 pt-3 pb-1" role="listbox" aria-label={carouselKey === 'base' ? 'Mapas base' : 'Esquemas de color'}>
      {carousel.items.map((item, i) => { const d = i - slide; if (Math.abs(d) > 2) return null; return <button key={item.key} type="button" role="option" aria-selected={i === slide} onClick={() => { setSlide(i); carousel.onPick(item.key); }}
        className={cn('carousel-item grid shrink-0 justify-items-center gap-1.5 text-xs outline-none', i === slide ? 'z-10 scale-110' : 'opacity-75 hover:opacity-100')}>
        <span className={cn('block h-[68px] w-[104px] overflow-hidden rounded-xl bg-tile ring-1 ring-border ring-offset-2 ring-offset-frame', i === slide && 'ring-2 ring-primary', item.key === carousel.value && i !== slide && 'ring-1 ring-primary/50')}>{item.preview}</span>
        <span className={cn('text-muted-foreground', i === slide && 'font-medium text-foreground')}>{item.label}</span>
      </button>; })}
    </div> : rows.length ? <ul ref={list} role="listbox" aria-label="Resultados" className="grid max-h-[min(23rem,50svh)] gap-0.5 overflow-y-auto">
      {rows.map((row, i) => <li key={row.key} role="option" aria-selected={i === active} data-index={i} onMouseMove={() => setActive(i)} onClick={row.run}
        className="flex cursor-pointer items-center gap-3 rounded-2xl px-2.5 py-1.5 aria-selected:bg-tile [&>span>svg]:size-4">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-container text-on-primary-container">{row.icon}</span>
        <span className="grid min-w-0 flex-1 leading-tight"><span className="truncate text-sm font-medium">{row.title}</span><span className="truncate text-xs text-muted-foreground">{row.subtitle}</span></span>
        {row.hint && <span className="shrink-0 text-[11px] text-muted-foreground tabular-nums">{row.hint}</span>}
        {i === active && <CornerDownLeft className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true"/>}
      </li>)}
    </ul> : <p className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground"><LogoMark size={18} tone="bare"/>Sin resultados. Prueba un municipio, un ID como AGC_001 o &gt; para ver los comandos.</p>}
    <label className="flex h-11 items-center gap-2.5 rounded-full bg-tile px-4">
      <Search className="size-4 shrink-0 text-muted-foreground"/>
      <input ref={input} value={query} onChange={e => setQuery(e.target.value)} aria-label="Buscar parcela, municipio, coordenadas o comando" placeholder="Buscar o >comando"
        role="combobox" aria-expanded aria-controls="launcher-results" className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"/>
      {query && <button type="button" aria-label="Limpiar" onClick={() => setQuery('')} className="grid size-6 place-items-center rounded-full text-muted-foreground hover:bg-tile-strong"><X className="size-3.5"/></button>}
    </label>
  </div>;
}
