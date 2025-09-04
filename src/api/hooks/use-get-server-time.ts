import { useState, useEffect } from "react"
import { getServerTimeOffset } from "../get-server-time"

export function useServerTime() {
    const [offset, setOffset] = useState<number | null>(null)
    const [serverTime, setServerTime] = useState<Date | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        let isMounted = true

        const fetchOffset = async () => {
            setLoading(true)
            setError(null)
            try {
                const result = await getServerTimeOffset()
                if (isMounted) {
                    setOffset(result)
                    setServerTime(new Date(Date.now() + result))
                }
            } catch (err: unknown) {
                if (isMounted) {
                    if (err instanceof Error) {
                        setError(err)
                    } else {
                        setError(new Error("Unknown error occurred"))
                    }
                }
            } finally {
                if (isMounted) setLoading(false)
            }
        }

        fetchOffset()

        return () => {
            isMounted = false
        }
    }, [])

    return { offset, serverTime, loading, error }
}
