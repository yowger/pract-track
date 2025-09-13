import { useEffect, useState, useCallback } from "react"
import type { DocumentSnapshot } from "firebase/firestore"

import type { Student } from "@/types/user"
import { getStudentsPaginated } from "../students"

interface StudentFilter {
    firstName?: string
    lastName?: string
    program?: string
    yearLevel?: string
    section?: string
    status?: string
    assignedAgencyId?: string
}

interface UsePaginatedStudentsOptions {
    enabled?: boolean
    numPerPage?: number
}

export function usePaginatedStudents(
    filter: StudentFilter = {},
    options: UsePaginatedStudentsOptions = {}
) {
    const { enabled = true, numPerPage = 20 } = options

    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [firstDoc, setFirstDoc] = useState<DocumentSnapshot | null>(null)
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null)
    const [totalItems, setTotalItems] = useState(0)

    const fetchStudents = useCallback(
        async ({
            direction = "next",
            startAfterDoc,
            endBeforeDoc,
        }: {
            direction?: "next" | "prev"
            startAfterDoc?: DocumentSnapshot | null
            endBeforeDoc?: DocumentSnapshot | null
        } = {}) => {
            if (!enabled) return
            setLoading(true)
            setError(null)
            try {
                const { result, firstDoc, lastDoc, totalItems } =
                    await getStudentsPaginated({
                        direction,
                        numPerPage,
                        startAfterDoc: startAfterDoc ?? undefined,
                        endBeforeDoc: endBeforeDoc ?? undefined,
                        filter,
                    })

                setStudents(result)
                setFirstDoc(firstDoc ?? null)
                setLastDoc(lastDoc ?? null)
                setTotalItems(totalItems)
            } catch (err) {
                console.error(err)
                setError("Failed to fetch students")
            } finally {
                setLoading(false)
            }
        },
        [enabled, numPerPage, filter]
    )

    useEffect(() => {
        if (enabled) {
            fetchStudents()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled])

    const nextPage = () =>
        fetchStudents({ direction: "next", startAfterDoc: lastDoc })
    const prevPage = () =>
        fetchStudents({ direction: "prev", endBeforeDoc: firstDoc })

    const pageCount = Math.ceil(totalItems / numPerPage)

    return {
        students,
        loading,
        error,
        totalItems,
        pageCount,
        refetch: () => fetchStudents(),
        nextPage,
        prevPage,
        hasNextPage: !!lastDoc,
        hasPrevPage: !!firstDoc,
    }
}
