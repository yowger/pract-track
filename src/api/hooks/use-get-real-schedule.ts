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
import type { Schedule } from "@/types/scheduler"

type ScheduleFilters = {
    agencyId?: string
    date?: Date | Timestamp
    limitCount?: number
}

export const useGetSchedules = (filters: ScheduleFilters = {}) => {
    const [schedules, setSchedules] = useState<Schedule[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        try {
            const schedulesRef = collection(db, "schedules")

            const conditions: QueryConstraint[] = []

            if (filters.agencyId) {
                conditions.push(where("agencyId", "==", filters.agencyId))
            }

            if (filters.date) {
                const date =
                    filters.date instanceof Date
                        ? filters.date
                        : (filters.date as Timestamp).toDate()

                const startOfDay = new Date(date)
                startOfDay.setHours(0, 0, 0, 0)

                const endOfDay = new Date(date)
                endOfDay.setHours(23, 59, 59, 999)

                conditions.push(
                    where("date", ">=", Timestamp.fromDate(startOfDay)),
                    where("date", "<=", Timestamp.fromDate(endOfDay))
                )
            }

            if (filters.limitCount) {
                conditions.push(limit(filters.limitCount))
            }

            const q = query(schedulesRef, ...conditions, orderBy("date", "asc"))

            const unsubscribe = onSnapshot(
                q,
                (snapshot) => {
                    const data: Schedule[] = snapshot.docs.map((doc) => {
                        const d = doc.data()
                        return {
                            id: doc.id,
                            agencyId: d.agencyId,
                            agencyName: d.agencyName,
                            date:
                                d.date instanceof Timestamp
                                    ? d.date.toDate()
                                    : d.date,
                            sessions: d.sessions || [],
                            createdAt:
                                d.createdAt instanceof Timestamp
                                    ? d.createdAt.toDate()
                                    : d.createdAt,
                            updatedAt:
                                d.updatedAt instanceof Timestamp
                                    ? d.updatedAt.toDate()
                                    : d.updatedAt,
                        } as Schedule
                    })
                    setSchedules(data)
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
                setError("Failed to fetch schedules")
            }
            setLoading(false)
        }
    }, [filters.agencyId, filters.date, filters.limitCount])

    return { data: schedules, loading, error }
}
