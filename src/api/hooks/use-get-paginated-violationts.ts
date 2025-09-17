import { useEffect, useState, useCallback } from "react"
import type { DocumentSnapshot } from "firebase/firestore"

import type { Violation } from "@/types/violation"
import { getViolationsPaginated } from "../violation"

interface ViolationFilter {
    agencyId?: string
    studentId?: string
}

interface UsePaginatedViolationsOptions {
    enabled?: boolean
    numPerPage?: number
}

export function usePaginatedViolations(
    filter: ViolationFilter = {},
    options: UsePaginatedViolationsOptions = {}
) {
    const { enabled = true, numPerPage = 20 } = options

    const [violations, setViolations] = useState<Violation[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null)
    const [hasMore, setHasMore] = useState(true)

    const fetchViolations = useCallback(
        async ({ append = false }: { append?: boolean } = {}) => {
            if (!enabled || !hasMore) return
            setLoading(true)
            setError(null)
            try {
                const { violations: newViolations, lastDoc: newLastDoc } =
                    await getViolationsPaginated(
                        filter,
                        numPerPage,
                        lastDoc ?? undefined
                    )

                setViolations((prev) =>
                    append ? [...prev, ...newViolations] : newViolations
                )
                setLastDoc(newLastDoc)
                setHasMore(!!newLastDoc && newViolations.length === numPerPage)
            } catch (err) {
                console.error(err)
                setError("Failed to fetch violations")
            } finally {
                setLoading(false)
            }
        },
        [enabled, numPerPage, filter, lastDoc, hasMore]
    )

    useEffect(() => {
        if (enabled) {
            // Reset when filter changes
            setViolations([])
            setLastDoc(null)
            setHasMore(true)
            fetchViolations()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, filter])

    return {
        violations,
        loading,
        error,
        fetchNextPage: () => fetchViolations({ append: true }),
        hasMore,
        refetch: () => {
            setViolations([])
            setLastDoc(null)
            setHasMore(true)
            fetchViolations()
        },
    }
}
