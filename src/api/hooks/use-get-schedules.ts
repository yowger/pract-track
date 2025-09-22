import { useEffect, useState } from "react"

import type { AppUser } from "@/types/user"
import { getPracticumAdviser } from "../advisers"

interface UseAdviserOptions {
    enabled?: boolean
}

export function useAdviser(
    uid: string | null,
    options: UseAdviserOptions = {}
) {
    const [data, setData] = useState<AppUser | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    async function fetchAdviser() {
        if (!uid) return
        setLoading(true)
        setError(null)

        try {
            const result = await getPracticumAdviser(uid)
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
        if (!uid) return

        fetchAdviser()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uid, options.enabled])

    return { data, loading, error, refetch: fetchAdviser }
}
