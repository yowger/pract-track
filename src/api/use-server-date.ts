import { useEffect, useState } from "react"

import { getServerTimeOffset } from "@/api/get-server-time"
import { firebaseTimestampToDate } from "@/lib/date-utils"

export function useServerDate() {
    const [serverDate, setServerDate] = useState<Date | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        async function fetchDate() {
            try {
                setLoading(true)
                const serverTimeOffset = await getServerTimeOffset()
                const date = firebaseTimestampToDate(serverTimeOffset)

                if (date) {
                    setServerDate(date)
                }
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
