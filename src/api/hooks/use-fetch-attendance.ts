import { useEffect, useState } from "react"
import type { Attendance } from "@/types/attendance"
import { getAttendances } from "@/api/attendance"

type AttendanceFilter = {
    userId?: string
    scheduleId?: string
    status?: Attendance["overallStatus"]
    from?: Date
    to?: Date
}

interface UseAttendancesOptions {
    enabled?: boolean
}

export function useAttendances(
    filter: AttendanceFilter = {},
    options: UseAttendancesOptions = {}
) {
    const [data, setData] = useState<Attendance[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    async function fetchAttendances() {
        setLoading(true)
        setError(null)

        try {
            const result = await getAttendances(filter)

            setData(result)
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Unknown error"))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (options.enabled === false) return

        fetchAttendances()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(filter), options.enabled])

    return { data, loading, error, refetch: fetchAttendances }
}
