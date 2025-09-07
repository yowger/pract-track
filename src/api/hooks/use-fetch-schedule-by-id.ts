import { useEffect, useState } from "react"
import { getScheduleById } from "@/api/scheduler"
import type { Scheduler } from "@/types/scheduler"

interface UseScheduleOptions {
    enabled?: boolean
}

export function useSchedule(
    scheduleId?: string,
    options: UseScheduleOptions = {}
) {
    const [schedule, setSchedule] = useState<Scheduler | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!scheduleId || options.enabled === false) return

        const fetchSchedule = async () => {
            setLoading(true)
            setError(null)
            try {
                const data = await getScheduleById(scheduleId)
                setSchedule(data)
            } catch (err) {
                console.error(err)
                setError("Failed to load schedule")
            } finally {
                setLoading(false)
            }
        }

        fetchSchedule()
    }, [scheduleId, options.enabled])

    return { schedule, loading, error }
}
