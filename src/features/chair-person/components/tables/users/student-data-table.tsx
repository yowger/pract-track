import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    type OnChangeFn,
    type RowSelectionState,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface StudentDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    getRowId?: (row: TData) => string
    rowSelection?: Record<string, boolean>
    onRowSelectionChange?: OnChangeFn<RowSelectionState>
    onSelectedRowsChange?: (rows: TData[]) => void
}

export default function StudentDataTable<TData, TValue>({
    columns,
    data,
    getRowId,
    rowSelection: externalSelection,
    onRowSelectionChange,
    onSelectedRowsChange,
}: StudentDataTableProps<TData, TValue>) {
    const [internalSelection, setInternalSelection] = useState({})

    const rowSelection = externalSelection ?? internalSelection
    const setRowSelection = onRowSelectionChange ?? setInternalSelection

    const table = useReactTable({
        data,
        columns,
        state: { rowSelection },
        onRowSelectionChange: setRowSelection,
        getRowId: (row, index) => (getRowId ? getRowId(row) : String(index)),
        getCoreRowModel: getCoreRowModel(),
    })

    const selectedData = table.getSelectedRowModel().rows.map((r) => r.original)

    if (onSelectedRowsChange) {
        onSelectedRowsChange(selectedData)
    }

    return (
        <div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader className="bg-muted">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
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

            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
