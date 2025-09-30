import type { ColumnDef } from "@tanstack/react-table"
import { Eye } from "lucide-react"
import { useEffect } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"

import { useGetExcuseRequests } from "@/api/hooks/use-real-time-excuse"
import type { ExcuseRequest } from "@/types/excuse"
import { Badge } from "@/components/ui/badge"
import DataTable from "@/components/data-table"

const columns: ColumnDef<ExcuseRequest>[] = [
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "reason",
        header: "Reason",
        cell: ({ row }) => (
            <span className="line-clamp-2 max-w-xs">{row.original.reason}</span>
        ),
    },
    {
        accessorKey: "filesUrl",
        header: "Files",
        cell: ({ row }) => {
            const files = row.original.filesUrl ?? []
            return files.length > 0 ? (
                <span>
                    {files.length} file{files.length > 1 ? "s" : ""}
                </span>
            ) : (
                <span className="text-muted-foreground">—</span>
            )
        },
    },
    {
        accessorKey: "photosUrl",
        header: "Photos",
        cell: ({ row }) => {
            const photos = row.original.photosUrl ?? []
            return photos.length > 0 ? (
                <span>
                    {photos.length} photo{photos.length > 1 ? "s" : ""}
                </span>
            ) : (
                <span className="text-muted-foreground">—</span>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status
            return (
                <Badge
                    variant={
                        status === "approved"
                            ? "default"
                            : status === "rejected"
                            ? "destructive"
                            : "secondary"
                    }
                >
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => {
            const date = row.original.createdAt as Date
            return date
                ? date.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                  })
                : "-"
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <Link
                to={`/excuses/${row.original.id}`}
                className="text-sm font-medium text-primary hover:underline"
            >
                <Eye className="h-4 w-4" />
            </Link>
        ),
    },
]

interface ExcuseTabProps {
    userId: string
}

export default function ExcuseTab({ userId }: ExcuseTabProps) {
    const { data: excuses, error } = useGetExcuseRequests({
        studentId: userId,
    })

    useEffect(() => {
        if (error) {
            toast.error(error || "Something went wrong")
        }
    }, [error])

    return <DataTable columns={columns} data={excuses} />
}
