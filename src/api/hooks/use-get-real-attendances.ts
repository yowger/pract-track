import { useEffect, useState } from "react"
import {
    collection,
    onSnapshot,
    query,
    where,
    orderBy,
    Timestamp,
    QueryConstraint,
} from "firebase/firestore"
import { db } from "@/service/firebase/firebase"
import type { Attendance } from "@/types/attendance"

export type AttendanceFilter = {
    userId?: string
    scheduleId?: string
    agencyId?: string
    status?: string
    from?: Date
    to?: Date
}

export const useGetRealAttendances = (filters: AttendanceFilter = {}) => {
    const [attendances, setAttendances] = useState<Attendance[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        try {
            const attendancesRef = collection(db, "attendances")

            const conditions: QueryConstraint[] = []

            if (filters.userId) {
                conditions.push(where("userId", "==", filters.userId))
            }

            if (filters.scheduleId) {
                conditions.push(where("schedule.id", "==", filters.scheduleId))
            }

            if (filters.agencyId) {
                conditions.push(where("agencyId", "==", filters.agencyId))
            }

            if (filters.status) {
                conditions.push(where("overallStatus", "==", filters.status))
            }

            if (filters.from) {
                conditions.push(
                    where(
                        "schedule.date",
                        ">=",
                        Timestamp.fromDate(filters.from)
                    )
                )
            }

            if (filters.to) {
                conditions.push(
                    where("schedule.date", "<=", Timestamp.fromDate(filters.to))
                )
            }

            const q = query(
                attendancesRef,
                ...conditions,
                orderBy("updatedAt", "desc")
            )

            const unsubscribe = onSnapshot(
                q,
                (snapshot) => {
                    const data: Attendance[] = snapshot.docs.map((doc) => {
                        const d = doc.data()
                        return {
                            id: doc.id,
                            ...d,
                            schedule: {
                                ...d.schedule,
                                date:
                                    d.schedule?.date instanceof Timestamp
                                        ? d.schedule.date.toDate()
                                        : d.schedule?.date,
                            },
                            createdAt:
                                d.createdAt instanceof Timestamp
                                    ? d.createdAt.toDate()
                                    : d.createdAt,
                            updatedAt:
                                d.updatedAt instanceof Timestamp
                                    ? d.updatedAt.toDate()
                                    : d.updatedAt,
                        } as Attendance
                    })
                    setAttendances(data)
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
                setError("Failed to fetch attendances")
            }
            setLoading(false)
        }
    }, [
        filters.agencyId,
        filters.userId,
        filters.scheduleId,
        filters.status,
        filters.from,
        filters.to,
    ])

    return { data: attendances, loading, error }
}
