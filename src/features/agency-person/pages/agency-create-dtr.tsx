import { useNavigate } from "react-router-dom"

import { useStudents } from "@/api/hooks/use-get-students"
import {
    AttendanceSessionsForm,
    type AttendanceForm,
} from "../components/attendance-session-form"
import { useUser } from "@/hooks/use-user"
import { isAgency } from "@/types/user"
import { useCreateAttendanceBatch } from "@/api/hooks/use-create-attendance-batch"
import { useCreateSchedule } from "@/api/hooks/use-create-schedule"
import { setHours, setMinutes } from "date-fns"
import type { PlannedSession } from "@/types/scheduler"
import type { AttendanceSession } from "@/types/attendance"

export default function AgencyCreateDtr() {
    const navigate = useNavigate()
    const { user } = useUser()
    const agencyId = user && isAgency(user) ? user.companyData?.ownerId : null

    const { loading: isStudentsLoading, refetch: fetchStudents } = useStudents(
        { assignedAgencyID: agencyId || "" },
        { enabled: false }
    )

    const { mutate: createAttendanceBatch, loading: isCreateLoading } =
        useCreateAttendanceBatch()
    const { mutate: createSchedule, loading: isCreateScheduleLoading } =
        useCreateSchedule()

    return (
        <div className="flex flex-col p-4 gap-4">
            <div className="flex flex-col md:flex-row  md:justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Create New Session
                    </h1>
                    <p className="text-muted-foreground">
                        Create a new attendance session.
                    </p>
                </div>
            </div>

            <div className="grid auto-rows-auto grid-cols-12 gap-5">
                <div className="col-span-12">
                    <AttendanceSessionsForm
                        loading={
                            isStudentsLoading ||
                            !agencyId ||
                            isCreateLoading ||
                            isCreateScheduleLoading
                        }
                        onSubmit={async (values) => {
                            if (!agencyId || !user || !isAgency(user)) return
                            const agencyName =
                                user.companyData?.name || "unknown agency"

                            const today = new Date()

                            let address = ""
                            if (values.geo?.lat && values.geo?.lng) {
                                address = await getAddressFromCoords(
                                    values.geo.lat,
                                    values.geo.lng
                                )
                            }

                            const sessions: PlannedSession[] =
                                mapAttendanceFormToSessions(
                                    today,
                                    values,
                                    address
                                )

                            const attendanceSession: AttendanceSession[] = []

                            sessions.forEach((session) => {
                                attendanceSession.push({
                                    id: crypto.randomUUID(),
                                    schedule: session,
                                })
                            })

                            const schedule = await createSchedule({
                                date: today,
                                agency: { id: agencyId, name: agencyName },
                                sessions: sessions,
                            })
                            const studentResult = await fetchStudents()
                            const mappedStudent = studentResult.map(
                                (student) => ({
                                    id: student.id,
                                    name: `${student.firstName} ${student.lastName}`,
                                    photoUrl: student.photoUrl ?? null,
                                })
                            )

                            await createAttendanceBatch({
                                students: mappedStudent,
                                sessions: attendanceSession,
                                agency: { id: agencyId, name: agencyName },
                                schedule: { id: schedule.id, date: today },
                            })

                            navigate("/", { replace: true })
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

function mapAttendanceFormToSessions(
    date: Date,
    values: AttendanceForm,
    address: string
): PlannedSession[] {
    const sessions: PlannedSession[] = []

    if (values.am) {
        sessions.push({
            start: combineDateAndTime(date, values.am.start),
            end: combineDateAndTime(date, values.am.end),
            geoLocation: {
                lat: values.geo?.lat || 0,
                lng: values.geo?.lng || 0,
            },
            geoRadius: values.geo?.radius,
            address,
            photoStart: values.am.photoStart,
            photoEnd: values.am.photoEnd,
            lateThresholdMins: values.am.lateThresholdMins,
            undertimeThresholdMins: values.am.undertimeThresholdMins,
            earlyClockInMins: values.am.earlyClockInMins,
        })
    }

    if (values.pm) {
        sessions.push({
            start: combineDateAndTime(date, values.pm.start),
            end: combineDateAndTime(date, values.pm.end),
            geoLocation: {
                lat: values.geo?.lat || 0,
                lng: values.geo?.lng || 0,
            },
            geoRadius: values.geo?.radius,
            address,
            photoStart: values.pm.photoStart,
            photoEnd: values.pm.photoEnd,
            lateThresholdMins: values.pm.lateThresholdMins,
            undertimeThresholdMins: values.pm.undertimeThresholdMins,
            earlyClockInMins: values.pm.earlyClockInMins,
        })
    }

    return sessions
}

function combineDateAndTime(date: Date, time: string): Date {
    const [hours, minutes] = time.split(":").map(Number)
    const now = date

    return setMinutes(setHours(now, hours), minutes)
}

async function getAddressFromCoords(lat: number, lng: number): Promise<string> {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        )
        const data = await res.json()

        return data.display_name || ""
    } catch (error) {
        if (error instanceof Error) {
            return "unknown address"
        }

        return "unknown address"
    }
}
