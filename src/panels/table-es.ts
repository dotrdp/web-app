// Spanish strings and shared setup for shadcn-react-table, covering the features the dashboard
// tables use (sorting, search, column filters and visibility, row selection, empty state).
import type { DataTableLocalization } from '@/components/ui/data-table';

export const TABLE_ES: Partial<DataTableLocalization> = {
  selectAll: 'Seleccionar todo',
  selectRow: 'Seleccionar fila',
  clearSelection: 'Quitar selección',
  rowsSelected: (selected, total) => `${selected} de ${total} filas seleccionadas`,
  sortByColumnAsc: column => `Ordenar ${column} de menor a mayor`,
  sortByColumnDesc: column => `Ordenar ${column} de mayor a menor`,
  sortAscending: 'Orden ascendente',
  sortDescending: 'Orden descendente',
  clearSort: 'Quitar orden',
  sortedAscending: 'Orden ascendente',
  sortedDescending: 'Orden descendente',
  columnActions: 'Acciones de columna',
  hideColumn: 'Ocultar columna',
  showAllColumns: 'Mostrar todas las columnas',
  resizeColumn: 'Cambiar ancho de columna',
  columnVisibility: 'Columnas visibles',
  toggleColumnVisibility: 'Mostrar u ocultar columnas',
  filterByColumn: column => `Filtrar por ${column}`,
  clearFilter: 'Quitar filtro',
  filterMode: 'Modo de filtro',
  changeFilterMode: 'Cambiar modo de filtro',
  filterPlaceholder: column => `Filtrar ${column}…`,
  showColumnFilters: 'Mostrar filtros',
  hideColumnFilters: 'Ocultar filtros',
  min: 'Mín',
  max: 'Máx',
  search: 'Buscar',
  searchPlaceholder: 'Filtrar ID o municipio…',
  clearSearch: 'Borrar búsqueda',
  globalFilterMode: 'Modo de búsqueda',
  copy: 'Copiar',
  copied: 'Copiado',
  noRecordsToDisplay: 'No hay parcelas que mostrar',
  loading: 'Cargando…',
};

// Shared table setup: Spanish strings, no pager (every row in one scrolling surface that grows to the
// canvas height, so scrolled into view the table fills the page), search and
// per-column filters in popovers, no density or full-screen toggles.
export const TABLE_OPTIONS = { localization: TABLE_ES, enablePagination: false, enableDensityToggle: false, enableFullscreenToggle: false, columnFilterDisplayMode: 'popover', defaultDensity: 'compact', enableColumnActions: false } as const;
