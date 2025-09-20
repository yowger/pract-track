import { useGetRealAttendances } from "@/api/hooks/use-get-real-attendances"
import DataTable from "@/components/data-table"
import { useUser } from "@/hooks/use-user"
import { firebaseTimestampToDate, formatTime } from "@/lib/date-utils"
import type { Attendance } from "@/types/attendance"
import { isAgency } from "@/types/user"
import type { ColumnDef } from "@tanstack/react-table"

const attendanceColumns: ColumnDef<Attendance>[] = [
    {
        accessorKey: "schedule.date",
        header: "Date",
        cell: ({ row }) => {
            const date = row.original.schedule.date
            const d = date instanceof Date ? date : date?.toDate?.()
            return (
                <div className="align-top flex items-start">
                    <span>{d ? d.toLocaleDateString("en-US") : null}</span>
                </div>
            )
        },
    },
    {
        id: "am",
        header: "AM",
        cell: ({ row }) => {
            const session = row.original.sessions[0]
            if (!session) return null

            const inDate = session.checkInInfo
                ? firebaseTimestampToDate(session.checkInInfo.time)
                : null
            const outDate = session.checkOutInfo
                ? firebaseTimestampToDate(session.checkOutInfo.time)
                : null

            if (!inDate && !outDate) return null

            return (
                <div className="inline-flex items-center gap-1">
                    <span className={inDate ? "" : "text-muted-foreground"}>
                        {inDate ? formatTime(inDate) : "-"}
                    </span>
                    <span className="text-muted-foreground">-</span>
                    <span className={outDate ? "" : "text-muted-foreground"}>
                        {outDate ? formatTime(outDate) : ""}
                    </span>
                </div>
            )
        },
    },
    {
        id: "pm",
        header: "PM",
        cell: ({ row }) => {
            const session = row.original.sessions[1]
            if (!session) return null

            const inDate = session.checkInInfo
                ? firebaseTimestampToDate(session.checkInInfo.time)
                : null
            const outDate = session.checkOutInfo
                ? firebaseTimestampToDate(session.checkOutInfo.time)
                : null

            if (!inDate && !outDate) return null

            return (
                <div className="inline-flex items-center gap-1">
                    <span className={inDate ? "" : "text-muted-foreground"}>
                        {inDate ? formatTime(inDate) : "-"}
                    </span>
                    <span className="text-muted-foreground">-</span>
                    <span className={outDate ? "" : "text-muted-foreground"}>
                        {outDate ? formatTime(outDate) : ""}
                    </span>
                </div>
            )
        },
    },
    {
        id: "duration",
        header: "Duration",
        cell: ({ row }) => {
            const sessions = row.original.sessions
            let totalMins = 0

            sessions.forEach((s) => {
                const inDate = s.checkInInfo
                    ? firebaseTimestampToDate(s.checkInInfo.time)
                    : null
                const outDate = s.checkOutInfo
                    ? firebaseTimestampToDate(s.checkOutInfo.time)
                    : null
                if (inDate && outDate) {
                    totalMins += Math.floor((+outDate - +inDate) / 60000)
                }
            })

            if (!totalMins)
                return <span className="text-muted-foreground"></span>

            const h = Math.floor(totalMins / 60)
            const m = totalMins % 60
            return <span>{`${h}h ${m}m`}</span>
        },
    },
    {
        id: "photos",
        header: "Photos",
        cell: ({ row }) => {
            const sessions = row.original.sessions
            const photos: string[] = []

            sessions.forEach((s) => {
                if (s.checkInInfo?.photoUrl) photos.push(s.checkInInfo.photoUrl)
                if (s.checkOutInfo?.photoUrl)
                    photos.push(s.checkOutInfo.photoUrl)
            })

            if (!photos.length)
                return <span className="text-muted-foreground"></span>

            return (
                <div className="flex flex-col gap-1">
                    {photos.map((url, idx) => (
                        <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 block max-w-[150px] truncate"
                            title={url}
                        >
                            {url}
                        </a>
                    ))}
                </div>
            )
        },
    },
    {
        id: "location",
        header: "Location",
        cell: ({ row }) => {
            const sessions = row.original.sessions
            const geo =
                sessions[0]?.checkInInfo?.geo ||
                sessions[0]?.checkOutInfo?.geo ||
                sessions[1]?.checkInInfo?.geo ||
                sessions[1]?.checkOutInfo?.geo
            const address =
                sessions[0]?.checkInInfo?.address ||
                sessions[0]?.checkOutInfo?.address ||
                sessions[1]?.checkInInfo?.address ||
                sessions[1]?.checkOutInfo?.address

            if (!geo) return <span className="text-muted-foreground"></span>

            return (
                <a
                    href={`https://maps.google.com/?q=${geo.lat},${geo.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 block max-w-[150px] truncate"
                    title={address || "Unknown Address"}
                >
                    {address || "Unknown Address"}
                </a>
            )
        },
    },
]

export default function AgencyDashboardPage() {
    const { user } = useUser()
    console.log("🚀 ~ AgencyDashboardPage ~ user:", user)

    const { data: attendances, error: attendancesError } =
        useGetRealAttendances({
            agencyId: user && isAgency(user) ? user.companyData?.ownerId : "",
        })
    console.log(
        "🚀 ~ AgencyDashboardPage ~ attendancesError:",
        attendancesError
    )
    console.log("🚀 ~ AgencyDashboardPage ~ attendances:", attendances)

    return (
        <div className="flex flex-col p-4 gap-4">
            <div className="flex flex-col md:flex-row  md:justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        View attendance history, complains and more in real
                        time.
                    </p>
                </div>
            </div>

            <div className="grid auto-rows-auto grid-cols-12 gap-5">
                <div className="col-span-12">
                    <DataTable
                        columns={attendanceColumns}
                        data={attendances || []}
                    />
                </div>
            </div>
        </div>
    )
}
