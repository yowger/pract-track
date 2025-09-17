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
import type { Violation } from "@/types/violation"

type ViolationFilters = {
    agencyId?: string
    studentId?: string
    limitCount?: number
}

export const useGetViolations = (filters: ViolationFilters = {}) => {
    const [violations, setViolations] = useState<Violation[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        try {
            const violationsRef = collection(db, "violations")

            const conditions: QueryConstraint[] = []
            if (filters.agencyId) {
                conditions.push(where("agencyId", "==", filters.agencyId))
            }
            if (filters.studentId) {
                conditions.push(where("studentId", "==", filters.studentId))
            }

            if (filters.limitCount) {
                conditions.push(limit(filters.limitCount))
            }

            const q = query(
                violationsRef,
                ...conditions,
                orderBy("createdAt", "desc")
            )

            const unsubscribe = onSnapshot(
                q,
                (snapshot) => {
                    const data: Violation[] = snapshot.docs.map((doc) => {
                        const d = doc.data()
                        return {
                            id: doc.id,
                            studentId: d.studentId,
                            name: d.name,
                            violationType: d.violationType,
                            remarks: d.remarks,
                            agencyId: d.agencyId,
                            agencyName: d.agencyName,
                            reportedBy: d.reportedBy,
                            createdAt:
                                d.createdAt instanceof Timestamp
                                    ? d.createdAt.toDate()
                                    : d.createdAt,
                            updatedAt:
                                d.updatedAt instanceof Timestamp
                                    ? d.updatedAt.toDate()
                                    : d.updatedAt,
                        } as Violation
                    })
                    setViolations(data)
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
                setError("Failed to fetch violations")
            }
            setLoading(false)
        }
    }, [filters.agencyId, filters.studentId, filters.limitCount])

    return { data: violations, loading, error }
}
