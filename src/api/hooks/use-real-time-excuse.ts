import { useEffect, useState } from "react"
import {
    collection,
    onSnapshot,
    query,
    where,
    orderBy,
    Timestamp,
    QueryConstraint,
    limit,
} from "firebase/firestore"
import { db } from "@/service/firebase/firebase"
import type { ExcuseRequest } from "@/types/excuse"
import { EXCUSES } from "@/features/dtr/components/excuse-form"

type ExcuseFilters = {
    studentId?: string
    agencyId?: string
    status?: "pending" | "approved" | "rejected"
    limitCount?: number
}

export const useGetExcuseRequests = (filters: ExcuseFilters = {}) => {
    const [excuses, setExcuses] = useState<ExcuseRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        try {
            const excuseRef = collection(db, "excuses")

            const conditions: QueryConstraint[] = []

            if (filters.studentId) {
                conditions.push(where("studentId", "==", filters.studentId))
            }

            if (filters.agencyId) {
                conditions.push(where("agencyId", "==", filters.agencyId))
            }

            if (filters.status) {
                conditions.push(where("status", "==", filters.status))
            }

            if (filters.limitCount) {
                conditions.push(limit(filters.limitCount))
            }

            const q = query(
                excuseRef,
                ...conditions,
                orderBy("createdAt", "desc")
            )

            const unsubscribe = onSnapshot(
                q,
                (snapshot) => {
                    const data: ExcuseRequest[] = snapshot.docs.map((doc) => {
                        const d = doc.data()

                        const titleLabel =
                            EXCUSES.find((e) => e.value === d.title)?.label ||
                            d.title

                        return {
                            id: doc.id,
                            date:
                                d.date instanceof Timestamp
                                    ? d.date.toDate()
                                    : d.date,
                            studentId: d.studentId,
                            studentName: d.studentName,
                            agencyId: d.agencyId,
                            agencyName: d.agencyName,
                            attendanceId: d.attendanceId ?? null,
                            title: titleLabel,
                            reason: d.reason,
                            filesUrl: d.filesUrl || [],
                            filesName: d.filesName || [],
                            photosUrl: d.photosUrl || [],
                            status: d.status,
                            reviewedBy: d.reviewedBy,
                            createdAt:
                                d.createdAt instanceof Timestamp
                                    ? d.createdAt.toDate()
                                    : d.createdAt,
                            updatedAt:
                                d.updatedAt instanceof Timestamp
                                    ? d.updatedAt.toDate()
                                    : d.updatedAt,
                        } as ExcuseRequest
                    })
                    setExcuses(data)
                    setLoading(false)
                },
                (err) => {
                    setError(err.message)
                    setLoading(false)
                }
            )

            return () => unsubscribe()
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("Failed to fetch excuse requests")
            }
            setLoading(false)
        }
    }, [
        filters.studentId,
        filters.agencyId,
        filters.status,
        filters.limitCount,
    ])

    return { data: excuses, loading, error }
}
