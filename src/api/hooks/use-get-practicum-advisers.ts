import { useEffect, useState } from "react"
import type { AppUser } from "@/types/user"
import { getPracticumAdvisers } from "../advisers"

interface UsePracticumAdvisersOptions {
    enabled?: boolean
}

export function usePracticumAdvisers(
    options: UsePracticumAdvisersOptions = {}
) {
    const { enabled = true } = options
    const [advisers, setAdvisers] = useState<AppUser[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchAdvisers = async () => {
        setLoading(true)
        setError(null)
        try {
            const all = await getPracticumAdvisers()
            setAdvisers(all)
        } catch (err) {
            setError("Failed to fetch practicum advisers")
            throw err
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!enabled) return
        fetchAdvisers()
    }, [enabled])

    return { data: advisers, loading, error, refetch: fetchAdvisers }
}
