import { doc, getDoc, Timestamp } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "@/service/firebase/firebase"

import type { ExcuseRequest } from "@/types/excuse"

interface UseExcuseOptions {
    enabled?: boolean
}

type ExcuseFilter = {
    id: string
}

export function useExcuseRequest(
    filter: ExcuseFilter,
    options: UseExcuseOptions = {}
) {
    const [data, setData] = useState<ExcuseRequest | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    async function fetchExcuse() {
        if (!filter.id) return
        setLoading(true)
        setError(null)

        try {
            const result = await getExcuseRequest(filter.id)
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
        if (!filter.id) return

        fetchExcuse()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter.id, options.enabled])

    return { data, loading, error, refetch: fetchExcuse }
}

export async function getExcuseRequest(
    id: string
): Promise<ExcuseRequest | null> {
    const ref = doc(db, "excuses", id)
    const snap = await getDoc(ref)

    if (!snap.exists()) return null

    const d = snap.data()
    return {
        id: snap.id,
        ...d,
        createdAt:
            d.createdAt instanceof Timestamp
                ? d.createdAt.toDate()
                : d.createdAt,
        updatedAt:
            d.updatedAt instanceof Timestamp
                ? d.updatedAt.toDate()
                : d.updatedAt,
    } as ExcuseRequest
}
