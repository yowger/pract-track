import { useState, useEffect, useCallback } from "react"
import {
    collection,
    query,
    where,
    getCountFromServer,
} from "firebase/firestore"
import { db } from "@/service/firebase/firebase"

interface UseStudentStatsOptions {
    enabled?: boolean
}

export function useStudentStats(options: UseStudentStatsOptions = {}) {
    const { enabled = true } = options
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [stats, setStats] = useState({
        totalStudents: 0,
        assignedAgencyCount: 0,
        assignedAdviserCount: 0,
    })

    const fetchStats = useCallback(async () => {
        if (!enabled) return

        setLoading(true)
        setError(null)

        try {
            const studentsCol = collection(db, "students")

            const totalSnap = await getCountFromServer(studentsCol)
            const total = totalSnap.data().count

            const assignedAgencySnap = await getCountFromServer(
                query(studentsCol, where("assignedAgencyID", "!=", null))
            )

            const assignedAdviserSnap = await getCountFromServer(
                query(studentsCol, where("assignedAdviserID", "!=", null))
            )

            setStats({
                totalStudents: total,
                assignedAgencyCount: assignedAgencySnap.data().count,
                assignedAdviserCount: assignedAdviserSnap.data().count,
            })
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Unknown error"))
        } finally {
            setLoading(false)
        }
    }, [enabled])

    useEffect(() => {
        if (!enabled) return
        fetchStats()
    }, [fetchStats, enabled])

    return { ...stats, loading, error, refetch: fetchStats }
}
