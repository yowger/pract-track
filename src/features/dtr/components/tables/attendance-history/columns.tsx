import { type ColumnDef } from "@tanstack/react-table"
import { differenceInMinutes, format, parseISO } from "date-fns"

export type ShiftEntry = {
    name: string
    time?: string
}

export type DTR = {
    date: string
    entries: ShiftEntry[]
}

function parseTime(time?: string): Date | null {
    if (!time) return null

    const [hours, minutes] = time.split(":").map(Number)
    const d = new Date()
    d.setHours(hours, minutes, 0, 0)
    return d
}

const baseColumns: ColumnDef<DTR>[] = [
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => {
            const rawDate = row.getValue("date") as string | undefined
            return (
                <div>
                    {rawDate ? format(parseISO(rawDate), "MMM dd, yyyy") : "-"}
                </div>
            )
        },
    },
]

function createEntryColumns(data: DTR[], maxEntries: number): ColumnDef<DTR>[] {
    const columns: ColumnDef<DTR>[] = []

    for (let i = 0; i < maxEntries; i++) {
        const headerName = data[0]?.entries[i]?.name || `Entry ${i + 1}`

        columns.push({
            id: `${i}`,
            header: headerName,
            cell: ({ row }) => {
                const entry = row.original.entries[i]
                return <div>{entry ? entry.time || "-" : "-"}</div>
            },
        })
    }

    return columns
}

const totalHoursColumn: ColumnDef<DTR> = {
    id: "totalHours",
    header: "Total Hours",
    cell: ({ row }) => {
        const entries = row.original.entries
        let totalMinutes = 0

        for (let i = 0; i < entries.length; i += 2) {
            const inTime = parseTime(entries[i]?.time)
            const outTime = parseTime(entries[i + 1]?.time)
            if (inTime && outTime) {
                totalMinutes += differenceInMinutes(outTime, inTime)
            }
        }

        const hours = Math.floor(totalMinutes / 60)
        const minutes = totalMinutes % 60
        return <div>{totalMinutes > 0 ? `${hours}h ${minutes}m` : "-"}</div>
    },
}

export function getColumns(data: DTR[]): ColumnDef<DTR>[] {
    const maxEntries = data.reduce(
        (max, row) => Math.max(max, row.entries.length),
        0
    )

    return [
        ...baseColumns,
        ...createEntryColumns(data, maxEntries),
        totalHoursColumn,
    ]
}
