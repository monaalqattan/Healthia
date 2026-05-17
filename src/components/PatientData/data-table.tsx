"use client"

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

import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = React.useState({})
  
  // 1. إضافة State خاصة بالـ Pagination لضمان التحكم الكامل
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5, // عدد الصفوف في كل صفحة
  })

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    
    // 2. ربط الـ State بالجدول
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      pagination, // تفعيل الـ State هنا
    },
  })

  return (
    <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm">
      {/* Header Section */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Recent Patients
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Managing the most recent interactions and record updates.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <Input
            placeholder="Search patients..."
            value={
              (table.getColumn("patientName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("patientName")?.setFilterValue(event.target.value)
            }
            className="max-w-xs rounded-full border-none bg-gray-50 px-4 focus-visible:ring-emerald-500"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden">
        <Table>
          <TableHeader className="border-none bg-[#F8F9FA]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-none hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-4 py-5 text-[11px] font-bold uppercase tracking-wide text-gray-400"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b border-gray-50 transition-colors hover:bg-gray-50/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-4 py-5 text-gray-600"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-gray-400"
                >
                  No patients found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Section */}
      <div className="mt-8 flex items-center justify-between">
        <div className="text-sm font-medium text-gray-400">
          Showing <span className="text-gray-900">{table.getRowModel().rows.length}</span> of{" "}
          <span className="text-gray-900">{data.length}</span> patients
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="rounded-xl border border-gray-100 px-4 py-2 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-30"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </button>
            <button
              className="rounded-xl border border-gray-100 px-4 py-2 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-30"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}