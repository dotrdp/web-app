import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronsUpDownIcon,
  CircleCheckIcon,
  CircleDashedIcon,
  Columns3Icon,
  CopyIcon,
  DownloadIcon,
  EllipsisVerticalIcon,
  MapPinIcon,
  MapPinnedIcon,
  SearchIcon,
  SearchXIcon,
} from "lucide-react"

import type { Atlas, Parcel } from "@/types"
import { download, fmt, normalize, parcelCsv } from "@/lib"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Group = Parcel["properties"]["group"]

export const GROUP_LABELS: Record<Group, string> = {
  training: "Entrenamiento",
  prediction: "Predicción",
  custom: "Mi parcela",
}

const COLUMN_LABELS: Record<string, string> = {
  location: "Ubicación",
  area: "Superficie",
  group: "Conjunto",
  observedYield: "Rendimiento",
  ndvi: "NDVI · Landsat",
}

type ParcelRow = {
  parcel: Parcel
  id: string
  label: string
  municipality: string
  state: string
  area: number
  group: Group
  observedYield: number | null
  ndvi: number | null
}

const searchFilter: FilterFn<ParcelRow> = (row, _columnId, value: string) =>
  normalize(`${row.original.id} ${row.original.label} ${row.original.municipality} ${row.original.state}`).includes(normalize(value))

/** Status badge for the parcel set, mirroring dashboard-01's status column. */
export function GroupBadge({ group }: { group: Group }) {
  return (
    <Badge variant="outline" className="px-1.5 text-muted-foreground">
      {group === "training" ? (
        <CircleCheckIcon className="fill-chart-1 stroke-background" />
      ) : group === "prediction" ? (
        <CircleDashedIcon />
      ) : (
        <MapPinIcon className="text-chart-4" />
      )}
      {GROUP_LABELS[group]}
    </Badge>
  )
}

function NdviCell({ value }: { value: number | null }) {
  const filled = value == null ? 0 : Math.max(0, Math.min(1, value)) * 100
  return (
    <div className="flex items-center justify-end gap-2.5">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted" aria-hidden="true">
        <div className="h-full rounded-full bg-chart-1" style={{ width: `${filled}%` }} />
      </div>
      <span className="w-10 text-right tabular-nums">{fmt(value, 3)}</span>
    </div>
  )
}

function SortHeader({ column, label, align = "left" }: { column: Column<ParcelRow, unknown>; label: string; align?: "left" | "right" }) {
  const sorted = column.getIsSorted()
  const Icon = sorted === "asc" ? ArrowUpIcon : sorted === "desc" ? ArrowDownIcon : ChevronsUpDownIcon
  return (
    <div className={cn("flex", align === "right" && "justify-end")}>
      <Button
        variant="ghost"
        size="sm"
        className={cn("-mx-2.5 data-[sorted=false]:text-foreground", sorted && "text-foreground")}
        data-sorted={!!sorted}
        onClick={() => column.toggleSorting(sorted === "asc")}
      >
        {label}
        <Icon data-icon="inline-end" className={cn(!sorted && "text-muted-foreground")} />
      </Button>
    </div>
  )
}

function useColumns({ onSelect, onAnalyze }: { onSelect: (id: string) => void; onAnalyze: (p: Parcel) => void }) {
  return React.useMemo<ColumnDef<ParcelRow>[]>(() => [
    {
      accessorKey: "id",
      header: ({ column }) => <SortHeader column={column} label="Parcela" />,
      cell: ({ row }) => (
        <Button
          variant="link"
          className="h-auto px-0 font-medium text-foreground"
          title="Ver en el mapa"
          onClick={() => onSelect(row.original.id)}
        >
          {row.original.label}
        </Button>
      ),
      filterFn: searchFilter,
      enableHiding: false,
    },
    {
      id: "location",
      accessorFn: row => `${row.municipality}, ${row.state}`,
      header: "Ubicación",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span>{row.original.municipality}</span>
          <span className="text-xs text-muted-foreground">{row.original.state}</span>
        </div>
      ),
    },
    {
      accessorKey: "area",
      header: ({ column }) => <SortHeader column={column} label="Superficie" align="right" />,
      cell: ({ row }) => (
        <div className="text-right tabular-nums">
          {fmt(row.original.area)} <span className="text-xs text-muted-foreground">ha</span>
        </div>
      ),
    },
    {
      accessorKey: "group",
      header: "Conjunto",
      cell: ({ row }) => <GroupBadge group={row.original.group} />,
      filterFn: "equalsString",
      enableSorting: false,
    },
    {
      id: "observedYield",
      accessorFn: row => row.observedYield ?? undefined,
      header: ({ column }) => <SortHeader column={column} label="Rendimiento" align="right" />,
      sortUndefined: "last",
      cell: ({ row }) => (
        <div className="text-right tabular-nums">
          {row.original.observedYield == null ? (
            <span className="text-muted-foreground">—</span>
          ) : (
            <>
              {fmt(row.original.observedYield)} <span className="text-xs text-muted-foreground">t/ha</span>
            </>
          )}
        </div>
      ),
    },
    {
      id: "ndvi",
      accessorFn: row => row.ndvi ?? undefined,
      header: ({ column }) => <SortHeader column={column} label="NDVI · Landsat" align="right" />,
      sortUndefined: "last",
      cell: ({ row }) => <NdviCell value={row.original.ndvi} />,
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Acciones</span>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="sm" className="font-medium text-brand hover:bg-brand/10 hover:text-brand" onClick={() => onAnalyze(row.original.parcel)}>
            Analizar
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8 text-muted-foreground data-[state=open]:bg-muted">
                <EllipsisVerticalIcon />
                <span className="sr-only">Más acciones para {row.original.label}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onSelect={() => onSelect(row.original.id)}>
                <MapPinnedIcon />
                Ver en el mapa
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => void navigator.clipboard?.writeText(row.original.id)}>
                <CopyIcon />
                Copiar ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => download(`${row.original.id}.geojson`, JSON.stringify(row.original.parcel, null, 2), "application/geo+json")}
              >
                <DownloadIcon />
                Descargar GeoJSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ], [onSelect, onAnalyze])
}

const isNarrow = () => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches

export function ParcelsTable({
  parcels,
  atlas,
  keyDate,
  onSelect,
  onAnalyze,
}: {
  parcels: Parcel[]
  atlas: Atlas
  keyDate: string
  onSelect: (id: string) => void
  onAnalyze: (p: Parcel) => void
}) {
  const data = React.useMemo<ParcelRow[]>(() => parcels.map(p => ({
    parcel: p,
    id: p.properties.id,
    label: p.properties.name || p.properties.id,
    municipality: p.properties.municipality,
    state: p.properties.state,
    area: p.properties.area,
    group: p.properties.group,
    observedYield: p.properties.observedYield,
    ndvi: atlas.landsat[keyDate]?.parcels[p.properties.id]?.mean ?? null,
  })), [parcels, atlas, keyDate])
  const counts = React.useMemo(() => ({
    all: parcels.length,
    training: parcels.filter(p => p.properties.group === "training").length,
    prediction: parcels.filter(p => p.properties.group === "prediction").length,
    custom: parcels.filter(p => p.properties.group === "custom").length,
  }), [parcels])

  const columns = useColumns({ onSelect, onAnalyze })
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "id", desc: false }])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>((): VisibilityState => isNarrow() ? { location: false, ndvi: false, group: false } : {})
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, columnVisibility, pagination },
    getRowId: row => row.id,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const search = (table.getColumn("id")?.getFilterValue() as string) ?? ""
  const group = (table.getColumn("group")?.getFilterValue() as string) ?? "all"
  const setGroup = (value: string) => table.getColumn("group")?.setFilterValue(value === "all" ? undefined : value)
  const filteredRows = table.getFilteredRowModel().rows
  const groupOptions: [string, string, number][] = [
    ["all", "Todas", counts.all],
    ["training", "Entrenamiento", counts.training],
    ["prediction", "Predicción", counts.prediction],
    ...(counts.custom ? [["custom", "Mis terrenos", counts.custom] as [string, string, number]] : []),
  ]

  return (
    <Tabs value={group} onValueChange={setGroup} className="w-full flex-col justify-start gap-4">
      <div className="flex flex-col gap-3 @3xl/main:flex-row @3xl/main:items-center @3xl/main:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3 @lg/main:flex-row @lg/main:items-center">
          <TabsList className="hidden **:data-[slot=badge]:h-5 **:data-[slot=badge]:min-w-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1 @5xl/main:flex">
            {groupOptions.map(([value, label, count]) => (
              <TabsTrigger key={value} value={value}>
                {label} <Badge variant="secondary" className="tabular-nums">{count}</Badge>
              </TabsTrigger>
            ))}
          </TabsList>
          <Label htmlFor="parcel-group" className="sr-only">Conjunto de parcelas</Label>
          <Select value={group} onValueChange={setGroup}>
            <SelectTrigger id="parcel-group" size="sm" className="w-full @lg/main:w-48 @5xl/main:hidden" aria-label="Conjunto de parcelas">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {groupOptions.map(([value, label, count]) => (
                  <SelectItem key={value} value={value}>
                    {value === "all" ? "Todos los conjuntos" : label}
                    <span className="ml-auto text-muted-foreground tabular-nums">{count}</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <InputGroup className="h-7 @lg/main:max-w-64">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              value={search}
              onChange={e => table.getColumn("id")?.setFilterValue(e.target.value || undefined)}
              placeholder="ID, municipio o estado…"
              aria-label="Buscar en mis parcelas"
            />
          </InputGroup>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Columns3Icon data-icon="inline-start" />
                Columnas
                <ChevronDownIcon data-icon="inline-end" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>Columnas visibles</DropdownMenuLabel>
              {table.getAllColumns().filter(column => column.getCanHide()).map(column => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={value => column.toggleVisibility(!!value)}
                  onSelect={e => e.preventDefault()}
                >
                  {COLUMN_LABELS[column.id] ?? column.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto @3xl/main:ml-0"
            onClick={() => download("agrocebada-parcelas.csv", parcelCsv(table.getSortedRowModel().rows.map(r => r.original.parcel), atlas, keyDate), "text/csv;charset=utf-8")}
          >
            <DownloadIcon data-icon="inline-start" />
            Exportar CSV
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table aria-label="Parcelas del espacio">
          <TableHeader className="sticky top-0 z-10 bg-muted">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map(header => {
                  const sorted = header.column.getIsSorted()
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      aria-sort={header.column.getCanSort() ? (sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : "none") : undefined}
                      className="first:pl-4 last:pr-4"
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="first:pl-4 last:pr-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={table.getVisibleLeafColumns().length} className="p-0">
                  <Empty className="py-10">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <SearchXIcon />
                      </EmptyMedia>
                      <EmptyTitle>No encontramos parcelas</EmptyTitle>
                      <EmptyDescription>Prueba con otro ID, municipio o conjunto.</EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <Button variant="outline" size="sm" onClick={() => table.resetColumnFilters()}>
                        Limpiar filtros
                      </Button>
                    </EmptyContent>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-4 px-1 @3xl/main:px-4">
        <div className="hidden flex-1 text-sm text-muted-foreground @3xl/main:flex">
          {filteredRows.length} de {data.length} parcelas · datos originales FIRA
        </div>
        <div className="flex w-full items-center gap-6 @3xl/main:w-fit @3xl/main:gap-8">
          <div className="hidden items-center gap-2 @3xl/main:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">Filas por página</Label>
            <Select value={`${pagination.pageSize}`} onValueChange={value => table.setPageSize(Number(value))}>
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue placeholder={pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                <SelectGroup>
                  {[10, 20, 30, 50].map(size => (
                    <SelectItem key={size} value={`${size}`}>{size}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium tabular-nums">
            Página {pagination.pageIndex + 1} de {Math.max(1, table.getPageCount())}
          </div>
          <div className="ml-auto flex items-center gap-2 @3xl/main:ml-0">
            <Button variant="outline" size="icon" className="hidden size-8 @3xl/main:flex" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
              <span className="sr-only">Primera página</span>
              <ChevronsLeftIcon />
            </Button>
            <Button variant="outline" size="icon" className="size-8" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <span className="sr-only">Página anterior</span>
              <ChevronLeftIcon />
            </Button>
            <Button variant="outline" size="icon" className="size-8" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              <span className="sr-only">Página siguiente</span>
              <ChevronRightIcon />
            </Button>
            <Button variant="outline" size="icon" className="hidden size-8 @3xl/main:flex" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
              <span className="sr-only">Última página</span>
              <ChevronsRightIcon />
            </Button>
          </div>
        </div>
      </div>
    </Tabs>
  )
}
