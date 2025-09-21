import { useEffect, useState, useCallback } from "react"
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore"

import { db } from "@/service/firebase/firebase"
import type { Agency } from "../agency"

interface UseSearchAgenciesOptions {
    enabled?: boolean
    limitCount?: number
}

export function useSearchAgencies(
    search: string,
    options: UseSearchAgenciesOptions = {}
) {
    const [data, setData] = useState<Agency[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const fetchAgencies = useCallback(async () => {
        if (options.enabled === false) return

        setLoading(true)
        setError(null)

        try {
            const agenciesCol = collection(db, "agencies")
            const q = query(
                agenciesCol,
                orderBy("createdAt", "desc"),
                limit(options.limitCount ?? 10)
            )

            const snapshot = await getDocs(q)
            const results: Agency[] = []

            snapshot.forEach((doc) => {
                const data = doc.data()
                if (
                    !search ||
                    data.name.toLowerCase().includes(search.toLowerCase())
                ) {
                    results.push({
                        id: doc.id,
                        name: data.name,
                        address: data.address ?? undefined,
                        ownerId: data.ownerId,
                        ownerName: data.ownerName,
                        createdAt: data.createdAt?.toDate?.(),
                        updatedAt: data.updatedAt?.toDate?.(),
                    })
                }
            })

            setData(results)
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Unknown error"))
            throw err
        } finally {
            setLoading(false)
        }
    }, [search, options.enabled, options.limitCount])

    useEffect(() => {
        fetchAgencies()
    }, [fetchAgencies])

    return { data, loading, error, refetch: fetchAgencies }
}
