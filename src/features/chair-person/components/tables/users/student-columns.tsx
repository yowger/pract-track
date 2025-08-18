import { type ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"
import type { Student } from "@/types/user"

export const studentColumns: ColumnDef<Student>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 20,
    },

    {
        accessorKey: "photoUrl",
        header: "",
        cell: ({ row }) => {
            const student = row.original
            return student.photoUrl ? (
                <img
                    src={student.photoUrl}
                    alt={student.firstName}
                    className="h-8 w-8 rounded-full"
                />
            ) : (
                <div className="h-8 w-8 rounded-full bg-gray-200" />
            )
        },
        enableSorting: false,
        enableHiding: false,
    },

    {
        accessorKey: "fullName",
        header: "Name",
        cell: ({ row }) => {
            const student = row.original
            return (
                <span>
                    {student.firstName} {student.lastName}
                </span>
            )
        },
    },

    {
        accessorKey: "program",
        header: "Program",
    },
    {
        accessorKey: "yearLevel",
        header: "Year",
    },
    {
        accessorKey: "assignedAgencyName",
        header: "Agency",
        cell: ({ row }) => {
            const agency = row.getValue("assignedAgencyName") as string
            return agency ? (
                agency
            ) : (
                <span className="text-muted-foreground">Unassigned</span>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                        status === "active"
                            ? "bg-green-100 text-green-800"
                            : status === "inactive"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                >
                    {status || "N/A"}
                </span>
            )
        },
    },
]
