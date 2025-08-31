import { type ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Link } from "react-router-dom"
import type { Agency } from "@/api/agency"

export const agencyColumns: ColumnDef<Agency>[] = [
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
        accessorKey: "name",
        header: "Agency Name",
        cell: ({ row }) => {
            const agency = row.original
            return (
                <Link
                    to={`/agencies/${agency.id}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                    {agency.name}
                </Link>
            )
        },
    },
    {
        accessorKey: "address",
        header: "Address",
        cell: ({ row }) => {
            const address = row.getValue("address") as string
            return address ? (
                address
            ) : (
                <span className="text-muted-foreground">N/A</span>
            )
        },
    },
    {
        accessorKey: "contactPerson",
        header: "Contact Person",
        cell: ({ row }) => {
            const contact = row.getValue("contactPerson") as string
            return contact ? (
                contact
            ) : (
                <span className="text-muted-foreground">N/A</span>
            )
        },
    },
    {
        accessorKey: "contactNumber",
        header: "Contact Number",
        cell: ({ row }) => {
            const contact = row.getValue("contactNumber") as string
            return contact ? (
                contact
            ) : (
                <span className="text-muted-foreground">N/A</span>
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
    {
        accessorKey: "studentsCount",
        header: "Students",
        cell: ({ row }) => {
            const count = row.getValue("studentsCount") as number | undefined
            return count !== undefined ? (
                <span>{count}</span>
            ) : (
                <span className="text-muted-foreground">0</span>
            )
        },
    },
]
