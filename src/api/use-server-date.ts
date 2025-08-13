import { useEffect, useState } from "react"

import { getServerDate } from "@/api/get-server-time"

export function useServerDate() {
    const [serverDate, setServerDate] = useState<Date | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        async function fetchDate() {
            try {
                setLoading(true)
                const date = await getServerDate()
                setServerDate(date)
            } catch (err) {
                setError(err as Error)
            } finally {
                setLoading(false)
            }
        }

        fetchDate()
    }, [])

    return { serverDate, loading, error }
}
