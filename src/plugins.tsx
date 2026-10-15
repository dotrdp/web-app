// Complementos: map tools packaged like QGIS plugins / ArcGIS widgets. Each one
// can be switched on or off; enabled tools appear in the tool pill and as
// launcher commands. State lives in page memory only (no storage).
import type { LucideIcon } from 'lucide-react';
import { BoxSelect, Columns2, Download, Flame, LocateFixed, MousePointerClick, PenLine, Ruler, SquareDashed, Tags, Table2, WandSparkles } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export type PluginId = 'sam' | 'draw' | 'measure' | 'area' | 'identify' | 'swipe' | 'select' | 'heatmap' | 'labels' | 'table' | 'export' | 'locate';
export interface Plugin { id: PluginId; name: string; detail: string; origin: string; icon: LucideIcon; category: 'Delimitación' | 'Análisis' | 'Visualización' | 'Datos'; enabled: boolean }

export const PLUGINS: Plugin[] = [
  { id: 'sam', name: 'Delimitar con IA', detail: 'Haz clic dentro de un terreno y SAM 2.1 propone sus límites sobre Sentinel-2.', origin: 'Como Segment Anything en ArcGIS Pro', icon: WandSparkles, category: 'Delimitación', enabled: true },
  { id: 'draw', name: 'Dibujar parcela', detail: 'Traza un polígono vértice a vértice y guárdalo como terreno propio.', origin: 'Sketch · ArcGIS', icon: PenLine, category: 'Delimitación', enabled: true },
  { id: 'measure', name: 'Medir distancia', detail: 'Distancias geodésicas sobre el mapa.', origin: 'Measurement · ArcGIS', icon: Ruler, category: 'Análisis', enabled: true },
  { id: 'area', name: 'Medir área', detail: 'Superficie en hectáreas de cualquier polígono.', origin: 'Measurement · ArcGIS', icon: SquareDashed, category: 'Análisis', enabled: true },
  { id: 'identify', name: 'Identificar al pasar', detail: 'Ficha flotante con estimado, registrado y NDVI al pasar el cursor.', origin: 'Value Tool · QGIS · pop-ups ArcGIS', icon: MousePointerClick, category: 'Análisis', enabled: true },
  { id: 'select', name: 'Seleccionar por área', detail: 'Arrastra un rectángulo: suma superficie, producción y rendimiento medio.', origin: 'Select by rectangle · ArcGIS Dashboards', icon: BoxSelect, category: 'Análisis', enabled: true },
  { id: 'swipe', name: 'Comparar con deslizador', detail: 'Muestra la capa activa a un lado y el mapa base al otro.', origin: 'Swipe · ArcGIS · MapSwipe · QGIS', icon: Columns2, category: 'Visualización', enabled: true },
  { id: 'heatmap', name: 'Mapa de calor', detail: 'Concentración de la producción estimada (t).', origin: 'Heat map · smart mapping ArcGIS', icon: Flame, category: 'Visualización', enabled: true },
  { id: 'labels', name: 'Etiquetas de rendimiento', detail: 'Escribe t/ha en cada parcela al acercarte.', origin: 'Labeling · ArcGIS / QGIS', icon: Tags, category: 'Visualización', enabled: false },
  { id: 'table', name: 'Tabla de atributos', detail: 'Tabla enlazada al mapa con todas las parcelas visibles.', origin: 'Attribute table · ArcGIS / QGIS', icon: Table2, category: 'Datos', enabled: true },
  { id: 'export', name: 'Exportar', detail: 'Imagen del mapa, GeoJSON, CSV y archivo de entrega.', origin: 'Print / Export · ArcGIS', icon: Download, category: 'Datos', enabled: true },
  { id: 'locate', name: 'Mi ubicación', detail: 'Centra el mapa en tu posición (GPS del navegador).', origin: 'Locate · Field Maps', icon: LocateFixed, category: 'Datos', enabled: true },
];
export const DEFAULT_PLUGINS = Object.fromEntries(PLUGINS.map(p => [p.id, p.enabled])) as Record<PluginId, boolean>;

export function PluginsPanel({ enabled, onToggle }: { enabled: Record<PluginId, boolean>; onToggle: (id: PluginId, on: boolean) => void }) {
  const categories = [...new Set(PLUGINS.map(p => p.category))];
  return <div className="grid gap-4">
    <p className="px-1 text-xs text-pretty text-muted-foreground">Herramientas inspiradas en los complementos más usados de QGIS y los widgets de ArcGIS. Las activas aparecen en la barra de herramientas y en el lanzador (escribe «&gt;»).</p>
    {categories.map(category => <section key={category} className="grid gap-1.5" aria-label={category}>
      <h3 className="px-1 text-xs font-medium text-muted-foreground">{category}</h3>
      {PLUGINS.filter(p => p.category === category).map(p => <label key={p.id} className="flex cursor-pointer items-start gap-3 rounded-2xl bg-tile px-3 py-2.5 hover:bg-tile-strong">
        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-primary-container text-on-primary-container"><p.icon className="size-4"/></span>
        <span className="grid min-w-0 flex-1 gap-0.5 leading-tight"><span className="text-sm font-medium">{p.name}</span><span className="text-xs text-pretty text-muted-foreground">{p.detail}</span><span className="text-[10.5px] text-muted-foreground/80">{p.origin}</span></span>
        <Switch checked={enabled[p.id]} onCheckedChange={on => onToggle(p.id, on)} aria-label={`${enabled[p.id] ? 'Desactivar' : 'Activar'} ${p.name}`} className="mt-1"/>
      </label>)}
    </section>)}
  </div>;
}
