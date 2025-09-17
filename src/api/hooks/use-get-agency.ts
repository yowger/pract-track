import { useEffect, useState } from "react"
import { fetchAgency, type Agency } from "../agency"

interface UseAgencyOptions {
    enabled?: boolean
}

type AgencyFilter = {
    ownerId?: string
}

export function useAgency(
    filter: AgencyFilter,
    options: UseAgencyOptions = {}
) {
    const [data, setData] = useState<Agency | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    async function fetchData() {
        if (!filter.ownerId) return
        setLoading(true)
        setError(null)

        try {
            const result = await fetchAgency(filter.ownerId)
            setData(result)
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Unknown error"))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (options.enabled === false || !filter.ownerId) return
        fetchData()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter.ownerId, options.enabled])

    return { data, loading, error, refetch: fetchData }
}
