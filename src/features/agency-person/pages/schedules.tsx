import { Link } from "react-router-dom"
import type { ColumnDef } from "@tanstack/react-table"

import { useSchedules } from "@/api/hooks/use-get-schedules"
import DataTable from "@/components/data-table"
import { useUser } from "@/hooks/use-user"
import {
    calculateContractHours,
    calculateTotalWorkingDays,
} from "@/lib/scheduler"
import type { Scheduler } from "@/types/scheduler"
import { isAgency } from "@/types/user"

const schedulerColumns: ColumnDef<Scheduler>[] = [
    {
        accessorKey: "scheduleName",
        header: "Name",
        cell: ({ row }) => (
            <Link
                to={`/schedules/${row.original.id}`}
                className="hover:underline cursor-pointer"
            >
                {row.original.scheduleName}
            </Link>
        ),
    },
    {
        accessorKey: "startDate",
        header: "Start",
        cell: ({ row }) => {
            const d = new Date(row.original.startDate)
            return d.toLocaleDateString("en-US", {
                year: "2-digit",
                month: "numeric",
                day: "numeric",
            })
        },
    },
    {
        accessorKey: "endDate",
        header: "End",
        cell: ({ row }) => {
            const d = new Date(row.original.endDate)
            return d.toLocaleDateString("en-US", {
                year: "2-digit",
                month: "numeric",
                day: "numeric",
            })
        },
    },
    {
        id: "totalWorkingDays",
        header: "Working Days",
        cell: ({ row }) => {
            const days = calculateTotalWorkingDays(row.original)
            return days
        },
    },
    {
        id: "totalHours",
        header: "Total Hours",
        cell: ({ row }) => {
            const hours = calculateContractHours(row.original)
            return `${hours.toFixed(1)}h`
        },
    },
    {
        accessorKey: "totalAssigned",
        header: "Assigned",
        cell: ({ row }) =>
            row.original.totalAssigned ? row.original.totalAssigned : "",
    },
]

export default function Schedules() {
    const { user } = useUser()

    const {
        data: schedules,
        loading: loadingSchedules,
        error: errorSchedules,
    } = useSchedules(
        {
            companyId: user && isAgency(user) ? user.companyData?.ownerId : "",
        },
        { enabled: !!user }
    )

    return (
        <div className="flex flex-col p-4 gap-4">
            <div className="flex flex-col md:flex-row  md:justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Schedules
                    </h1>
                    <p className="text-muted-foreground">
                        View and manage your schedules.
                    </p>
                </div>
            </div>

            <div className="grid auto-rows-auto grid-cols-12 gap-5">
                <div className="col-span-12">
                    {loadingSchedules && <p>Loading schedules...</p>}
                    {errorSchedules && (
                        <p className="text-red-500">{errorSchedules.message}</p>
                    )}

                    {!loadingSchedules &&
                        schedules.length === 0 &&
                        !errorSchedules && <p>No schedules found.</p>}

                    <DataTable columns={schedulerColumns} data={schedules} />
                </div>
            </div>
        </div>
    )
}
