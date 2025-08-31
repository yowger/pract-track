import { type ColumnDef } from "@tanstack/react-table"
import type { Student } from "@/types/user"
import { Link } from "react-router-dom"

export const assignedStudentColumns: ColumnDef<Student>[] = [
    {
        accessorKey: "photoUrl",
        header: "Photo",
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
    },
    {
        accessorKey: "fullName",
        header: "Name",
        cell: ({ row }) => {
            const s = row.original
            return `${s.firstName} ${s.lastName}`
        },
    },
    {
        accessorKey: "program",
        header: "Program",
        cell: ({ row }) => {
            const program = row.getValue("program") as string
            return program || <span className="text-muted-foreground">N/A</span>
        },
    },
    {
        accessorKey: "yearLevel",
        header: "Year",
        cell: ({ row }) => {
            const year = row.getValue("yearLevel") as string | number
            return year ? (
                `${year} Year`
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
                        status === "Ongoing"
                            ? "bg-yellow-100 text-yellow-800"
                            : status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : status === "Inactive"
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
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const s = row.original
            return (
                <div className="space-x-2">
                    <button
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                        onClick={() => console.log("Reassign", s.uid)}
                    >
                        Reassign
                    </button>
                    <Link
                        to={`/students/${s.uid}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        View
                    </Link>
                </div>
            )
        },
    },
]
