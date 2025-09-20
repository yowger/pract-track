import { useEffect, useState, useMemo } from "react"

import type { Scheduler } from "@/types/scheduler"
import type { Attendance } from "@/types/attendance"
import { getOrCreateAttendance } from "../attendance"

interface AttendanceFilter {
    user: {
        id: string
        name: string
        photoUrl?: string
    }
    scheduler?: Scheduler
    today?: Date
}

interface UseAttendancesOptions {
    enabled?: boolean
}

export function useGetOrCreateAttendance(
    params: AttendanceFilter = { user: { id: "", name: "" } },
    options: UseAttendancesOptions = {}
) {
    const { user, scheduler, today: inputToday } = params
    const { enabled = true } = options

    const today = useMemo(() => inputToday ?? new Date(), [inputToday])

    const [attendance, setAttendance] = useState<Attendance | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function fetchAttendance() {
        if (!user || !scheduler) return null
        setLoading(true)
        setError(null)

        try {
            const att = await getOrCreateAttendance({
                agencyId: scheduler.companyId,
                user,
                scheduler,
                today,
            })
            setAttendance(att)
            return att
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message || "Failed to fetch attendance")
            }
            return null
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (enabled) {
            fetchAttendance()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled])

    return { attendance, loading, error, refetch: fetchAttendance }
}
