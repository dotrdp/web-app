// Driving the dashboard tables (shadcn-react-table on TanStack) for Milli: search, column filters
// and sorting by column id or by the Spanish header the user sees, checkbox changes, and the
// table's state as Milli reads it.
import type { RowSelectionState, Table } from '@tanstack/react-table';

const plain = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const SYNONYMS: Record<string, string> = { municipio: 'municipality', superficie: 'area', area: 'area', registrado: 'observed', estimado: 'predicted', rendimiento: 'estimate', produccion: 'production', ingreso: 'income', margen: 'margin' };
const headerOf = (c: { id: string; columnDef: { header?: unknown } }) => typeof c.columnDef.header === 'string' ? c.columnDef.header : c.id;

/** Columns Milli can name: id and the header shown on screen. */
export function columnsOf<T>(table: Table<T>) {
  return table.getAllLeafColumns().filter(c => !/select$/.test(c.id) && c.id !== 'locate' && !c.id.startsWith('__')).map(c => ({ id: c.id, titulo: headerOf(c), filtrable: c.getCanFilter(), ordenable: c.getCanSort() }));
}
function resolve<T>(table: Table<T>, name: string) {
  const want = plain(name), cols = table.getAllLeafColumns();
  const hit = cols.find(c => plain(c.id) === want) ?? cols.find(c => plain(headerOf(c)) === want)
    ?? cols.find(c => c.id === SYNONYMS[want.split(' ')[0]]) ?? cols.find(c => plain(headerOf(c)).startsWith(want));
  if (!hit) throw new Error(`La tabla no tiene la columna "${name}". Columnas: ${columnsOf(table).map(c => `${c.id} (${c.titulo})`).join(', ')}.`);
  return hit;
}

/** table_set's search, column filters and sorting. */
export function applyTableSet<T>(table: Table<T>, { search, column_filters, sorting }: { search?: unknown; column_filters?: unknown; sorting?: unknown }) {
  if (typeof search === 'string') table.setGlobalFilter(search || undefined);
  if (Array.isArray(column_filters)) table.setColumnFilters(column_filters.map(({ column, value }: { column: string; value: unknown }) => {
    const c = resolve(table, column), variant = (c.columnDef.meta as { variant?: string } | undefined)?.variant;
    if (!c.getCanFilter()) throw new Error(`La columna ${headerOf(c)} no se puede filtrar.`);
    const v = variant === 'multi-select' && !Array.isArray(value) ? [value] : value;
    return { id: c.id, value: v };
  }));
  if (Array.isArray(sorting)) table.setSorting(sorting.map(({ column, desc }: { column: string; desc?: boolean }) => ({ id: resolve(table, column).id, desc: !!desc })));
}

/** The table's controls and size as Milli reads them. */
export function tableState<T>(table: Table<T>) {
  const s = table.getState();
  return { busqueda: s.globalFilter || null, filtros_columna: s.columnFilters.map(f => ({ columna: f.id, valor: f.value })), orden: s.sorting.map(x => ({ columna: x.id, desc: x.desc })),
    filas_mostradas: table.getRowModel().rows.length, columnas: columnsOf(table) };
}

/** table_check: set exactly these ids, add, remove, all shown rows or none. */
export function nextChecked(current: RowSelectionState, mode: string, ids: string[] = [], shown: string[]): RowSelectionState {
  const out: RowSelectionState = mode === 'set' || mode === 'none' ? {} : mode === 'all' ? {} : { ...current };
  if (mode === 'all') for (const id of shown) out[id] = true;
  if (mode === 'set' || mode === 'add') for (const id of ids) out[id] = true;
  if (mode === 'remove') for (const id of ids) delete out[id];
  return out;
}
