import { useAttendances } from "@/api/hooks/use-fetch-attendance"
import { AttendanceSummary } from "../components/attendance-summary"

export default function AttendanceHistory() {
    const { data: Attendances } = useAttendances({})

    return (
        <div className="flex flex-col p-4 gap-4">
            <div className="flex flex-col items-start justify-between space-y-2 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Attendance History
                    </h1>
                    <p className="text-muted-foreground">
                        View your past work sessions and track your daily
                        schedule.
                    </p>
                </div>
            </div>

            <div className="grid auto-rows-auto grid-cols-12 gap-5">
                <div className="col-span-12 lg:col-span-8">
                    <AttendanceSummary attendances={Attendances || []} />
                </div>
            </div>
        </div>
    )
}
