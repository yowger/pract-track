import { useEffect, useState, useMemo } from "react"
import { toast } from "sonner"

import { useGetExcuseRequests } from "@/api/hooks/use-real-time-excuse"
import ExcuseCard from "@/components/excuse-card"
import type { ColumnDef } from "@tanstack/react-table"
import type { ExcuseRequest } from "@/types/excuse"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import DataTable from "@/components/data-table"
import { EyeIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ExcuseTabProps {
    userId: string
}

const getExcuseColumns = (
    onView: (excuse: ExcuseRequest) => void
): ColumnDef<ExcuseRequest>[] => [
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => row.original.title,
    },
    {
        accessorKey: "reason",
        header: "Reason",
        cell: ({ row }) => (
            <div className="max-w-xs">
                <p className="truncate">{row.original.reason || "-"}</p>
            </div>
        ),
    },
    {
        accessorKey: "date",
        header: "Date of Absence",
        cell: ({ row }) =>
            row.original.date instanceof Date
                ? row.original.date.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                  })
                : "-",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            let variant: "default" | "destructive" | "secondary" = "secondary"
            if (row.original.status === "approved") variant = "default"
            if (row.original.status === "rejected") variant = "destructive"

            return <Badge variant={variant}>{row.original.status}</Badge>
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <Button
                size="icon"
                variant="ghost"
                onClick={() => onView(row.original)}
            >
                <EyeIcon />
            </Button>
        ),
    },
]

export default function ExcuseTab({ userId }: ExcuseTabProps) {
    const { data: excuses, error } = useGetExcuseRequests({ studentId: userId })
    const [selectedExcuse, setSelectedExcuse] = useState<ExcuseRequest | null>(
        null
    )

    useEffect(() => {
        if (error) {
            toast.error(error || "Something went wrong")
        }
    }, [error])

    const columns = useMemo(() => getExcuseColumns(setSelectedExcuse), [])

    return (
        <>
            {excuses.length > 0 ? (
                <DataTable data={excuses} columns={columns} />
            ) : (
                <p className="text-muted-foreground text-sm">
                    No excuse requests found.
                </p>
            )}

            <Sheet
                open={!!selectedExcuse}
                onOpenChange={(open) => !open && setSelectedExcuse(null)}
            >
                <SheetContent
                    style={{ maxWidth: "50vw" }}
                    className="overflow-auto"
                >
                    <SheetHeader>
                        <SheetTitle>{selectedExcuse?.title}</SheetTitle>
                    </SheetHeader>

                    {selectedExcuse && (
                        <ExcuseCard excuse={selectedExcuse} readOnly />
                    )}
                </SheetContent>
            </Sheet>
        </>
    )
}
