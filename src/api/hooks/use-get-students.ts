import type { Student } from "@/types/user"
import { useEffect, useState } from "react"
import { getAllStudents } from "../students"

interface AssignedStudentsFilter {
    scheduleId?: string
    assignedAgencyID?: string
    status?: string
}

interface UseStudentsOptions {
    enabled?: boolean
}

export function useStudents(
    filter: AssignedStudentsFilter = {},
    options: UseStudentsOptions = {}
) {
    const { enabled = true } = options
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchStudents = async () => {
        setLoading(true)
        setError(null)
        try {
            const all = await getAllStudents(filter)
            setStudents(all)
            return all
        } catch (err) {
            setError("Failed to fetch students")
            throw err
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!enabled) return

        fetchStudents()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(filter), enabled])

    return { students, loading, error, refetch: fetchStudents }
}
