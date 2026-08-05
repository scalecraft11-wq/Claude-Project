"use client";

import { flexRender } from "@tanstack/react-table";
import type {
  ColumnFiltersState,
  RowData,
  SortingState,
} from "@tanstack/table-core";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type LegacyColumnDef,
  useLegacyTable,
} from "@tanstack/react-table/legacy";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
} from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { downloadCsv } from "@/lib/admin/csv";

export interface DataTableFilter {
  columnId: string;
  label: string;
  options: { label: string; value: string }[];
}

export interface DataTableExportColumn<TData> {
  header: string;
  accessor: (row: TData) => unknown;
}

export interface DataTableProps<TData extends RowData> {
  /* A heterogeneous column array can't share one cell-value type parameter;
   * each column's own accessor/cell stays fully typed at its call site. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: LegacyColumnDef<TData, any>[];
  data: TData[];
  searchPlaceholder?: string;
  /** Faceted `<select>` filters rendered next to the search box. */
  filters?: DataTableFilter[];
  /** Drives the CSV export button — decoupled from `columns` since those
   * often render badges/JSX that don't serialize cleanly to a cell. */
  exportColumns?: DataTableExportColumn<TData>[];
  exportFilename?: string;
  /** Extra controls (e.g. an "Add product" button) rendered in the toolbar. */
  toolbarActions?: React.ReactNode;
  emptyMessage?: string;
  /** Prefills the search box — e.g. a "View orders" link from Customers
   * lands here with the customer's email already typed in. */
  initialSearch?: string;
}

/**
 * The one DataTable every admin section reuses — TanStack Table under the
 * hood, wired for global search, per-column faceted filters, sorting, client
 * pagination, and CSV export of the current filtered/sorted view.
 */
export function DataTable<TData extends RowData>({
  columns,
  data,
  searchPlaceholder = "Search...",
  filters = [],
  exportColumns,
  exportFilename = "export",
  toolbarActions,
  emptyMessage = "No results.",
  initialSearch = "",
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState(initialSearch);

  const table = useLegacyTable({
    data,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  });

  const handleExport = () => {
    if (!exportColumns) return;
    const rows = table
      .getFilteredRowModel()
      .rows.map((row) =>
        exportColumns.map((col) => col.accessor(row.original)),
      );
    downloadCsv(
      exportFilename,
      exportColumns.map((col) => col.header),
      rows,
    );
  };

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-content-muted"
              aria-hidden="true"
            />
            <Input
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              placeholder={searchPlaceholder}
              className="pl-9"
              aria-label="Search table"
            />
          </div>
          {filters.map((filter) => {
            const column = table.getColumn(filter.columnId);
            return (
              <select
                key={filter.columnId}
                value={(column?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  column?.setFilterValue(event.target.value || undefined)
                }
                aria-label={filter.label}
                className="h-11 rounded-sm border border-hairline-subtle bg-surface px-3 text-body-sm text-content-primary focus-visible:border-accent focus-visible:outline-none"
              >
                <option value="">{filter.label}: All</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            );
          })}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {toolbarActions}
          {exportColumns && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleExport}
            >
              <Download className="size-4" aria-hidden="true" />
              Export CSV
            </Button>
          )}
        </div>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const sortDirection = header.column.getIsSorted();
                return (
                  <TableHead
                    key={header.id}
                    aria-sort={
                      sortDirection === "asc"
                        ? "ascending"
                        : sortDirection === "desc"
                          ? "descending"
                          : "none"
                    }
                  >
                    {header.isPlaceholder ? null : canSort ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="flex items-center gap-1.5 text-overline text-content-muted transition-colors duration-fast hover:text-content-primary"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {sortDirection === "asc" ? (
                          <ArrowUp className="size-3.5" aria-hidden="true" />
                        ) : sortDirection === "desc" ? (
                          <ArrowDown className="size-3.5" aria-hidden="true" />
                        ) : (
                          <ArrowUpDown
                            className="size-3.5 opacity-40"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="py-10 text-center text-content-muted"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-body-sm text-content-muted">
          {table.getFilteredRowModel().rows.length} row
          {table.getFilteredRowModel().rows.length === 1 ? "" : "s"}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-body-sm text-content-muted">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {Math.max(table.getPageCount(), 1)}
          </span>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next page"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
