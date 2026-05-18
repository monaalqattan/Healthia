import * as React from "react"
import {
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import type { PatientRecord } from "@/store/patientsStore"

interface DataTableProps {
  data:          PatientRecord[]
  columns:       ColumnDef<PatientRecord>[]
  onRowClick?:   (patient: PatientRecord) => void
  pageSize?:     number
  showSearch?:   boolean
  showHeader?:   boolean   // عنوان Recent Patients
  onAddPatient?: () => void
}

export function DataTable({
  data,
  columns,
  onRowClick,
  pageSize    = 5,
  showSearch  = true,
  showHeader  = false,
  onAddPatient,
}: DataTableProps) {
  const [sorting,       setSorting]       = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [pagination,    setPagination]    = React.useState({ pageIndex: 0, pageSize })

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel:       getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel:     getSortedRowModel(),
    getFilteredRowModel:   getFilteredRowModel(),
    onSortingChange:       setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange:    setPagination,
    state: { sorting, columnFilters, pagination },
  })

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

      {/* Header — بيظهر بس لو showHeader=true */}
      {showHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 pt-5 pb-3">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Recent Patients</h2>
            <p className="text-xs text-gray-400 mt-0.5">Managing the most recent interactions and record updates.</p>
          </div>
          {showSearch && (
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search patients..."
                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                onChange={e => table.getColumn("name")?.setFilterValue(e.target.value)}
                className="pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-full bg-gray-50 outline-none focus:border-green-400 w-44"
              />
            </div>
          )}
        </div>
      )}

      {/* Search standalone — لو مفيش header */}
      {!showHeader && showSearch && (
        <div className="px-5 pt-4">
          <div className="relative w-fit">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search patients..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={e => table.getColumn("name")?.setFilterValue(e.target.value)}
              className="pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-full bg-gray-50 outline-none focus:border-green-400 w-48"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[580px]">
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id} className="text-left text-xs text-gray-400 bg-gray-50 border-b border-gray-100">
                {hg.headers.map(header => (
                  <th key={header.id} className="px-5 py-3 font-semibold tracking-wide"
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ cursor: header.column.getCanSort() ? "pointer" : "default" }}>
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === "asc"  && " ↑"}
                      {header.column.getIsSorted() === "desc" && " ↓"}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <tr key={row.id}
                  className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors cursor-pointer"
                  onClick={() => onRowClick?.(row.original)}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-5 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-5 py-10 text-center text-gray-400 text-sm">
                  No patients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          Showing{" "}
          <strong className="text-gray-700">{table.getRowModel().rows.length}</strong>
          {" "}of{" "}
          <strong className="text-gray-700">{data.length}</strong> patients
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
          </span>
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-30">
            <ChevronLeft size={14} />
          </button>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-30">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Add Button */}
      {onAddPatient && (
        <div className="px-5 pb-5">
          <button onClick={onAddPatient}
            className="bg-green-700 text-white font-semibold text-sm px-5 py-2.5 rounded-full shadow-md hover:bg-green-800 transition-colors">
            + Add New Patient
          </button>
        </div>
      )}
    </div>
  )
}