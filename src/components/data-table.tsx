import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    type OnChangeFn,
    type RowSelectionState,
    useReactTable,
} from "@tanstack/react-table"
import { useEffect, useState } from "react"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Spinner } from "./ui/shadcn-io/spinner"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    manualPagination?: boolean
    pageCount?: number
    pagination?: { pageIndex: number; pageSize: number }
    rowSelection?: RowSelectionState
    totalItems?: number
    showFooter?: boolean
    isLoading?: boolean
    getRowId?: (row: TData) => string
    onRowSelectionChange?: OnChangeFn<RowSelectionState>
    onSelectedRowsChange?: (rows: TData[]) => void

    onPaginationChange?: OnChangeFn<{ pageIndex: number; pageSize: number }>
}

export default function DataTable<TData, TValue>({
    columns,
    data,
    rowSelection: externalSelection,
    manualPagination = false,
    pageCount,
    pagination,
    showFooter = true,
    totalItems,
    isLoading = false,
    getRowId,
    onRowSelectionChange,
    onSelectedRowsChange,
    onPaginationChange,
}: DataTableProps<TData, TValue>) {
    const [internalSelection, setInternalSelection] = useState({})

    const rowSelection = externalSelection ?? internalSelection
    const setRowSelection = onRowSelectionChange ?? setInternalSelection

    const table = useReactTable({
        data,
        columns,
        state: {
            rowSelection,
            pagination: pagination ?? { pageIndex: 0, pageSize: data.length },
        },
        manualPagination,
        pageCount: manualPagination ? pageCount : undefined,
        onPaginationChange: onPaginationChange,
        onRowSelectionChange: setRowSelection,
        getRowId: getRowId ?? ((_, index) => String(index)),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: manualPagination
            ? undefined
            : getPaginationRowModel(),
    })

    useEffect(() => {
        if (onSelectedRowsChange) {
            onSelectedRowsChange(
                table.getSelectedRowModel().rows.map((r) => r.original as TData)
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowSelection])

    return (
        <div className="rounded-md">
            <div className="rounded-md border w-full whitespace-nowrap">
                <Table>
                    <TableHeader className="sticky top-0">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className="font-medium text-muted-foreground"
                                            style={{
                                                width: header.getSize(),
                                            }}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
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
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {showFooter && (
                <div className="flex items-center justify-between py-4">
                    {pagination && (
                        <div className="flex gap-2 items-center">
                            <span className="text-sm text-muted-foreground">
                                Showing{" "}
                                {pagination.pageIndex * pagination.pageSize + 1}
                                –
                                {Math.min(
                                    (pagination.pageIndex + 1) *
                                        pagination.pageSize,
                                    totalItems ?? data.length
                                )}{" "}
                                of {totalItems ?? data.length} rows
                            </span>

                            {isLoading && (
                                <Spinner variant="circle" size={16} />
                            )}
                        </div>
                    )}

                    {pagination && (
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                Previous
                            </Button>
                            <span>
                                Page {table.getState().pagination.pageIndex + 1}{" "}
                                of{" "}
                                {manualPagination
                                    ? pageCount
                                    : table.getPageCount()}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
