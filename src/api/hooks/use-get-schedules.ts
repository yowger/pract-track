import { useEffect, useState } from "react"

import type { Scheduler } from "@/types/scheduler"
import { getSchedules } from "../scheduler"

interface UseSchedulesOptions {
    enabled?: boolean
}

type SchedulesFilter = {
    companyId?: string
}

export function useSchedules(
    filter: SchedulesFilter = {},
    options: UseSchedulesOptions = {}
) {
    const [data, setData] = useState<(Scheduler & { id: string })[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    async function fetchSchedules() {
        setLoading(true)
        setError(null)

        try {
            const result = await getSchedules(filter)
            setData(result)
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Unknown error"))
            throw err
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (options.enabled === false) return

        fetchSchedules()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(filter), options.enabled])

    return { data, loading, error, refetch: fetchSchedules }
}
