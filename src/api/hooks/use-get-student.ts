import { useEffect, useState } from "react"
import type { Student } from "@/types/user"
import { getStudent } from "@/api/students"

interface UseStudentOptions {
    enabled?: boolean
}

type StudentFilter = {
    studentId?: string
    uid?: string
}

export function useStudent(
    filter: StudentFilter,
    options: UseStudentOptions = {}
) {
    const [data, setData] = useState<Student | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    async function fetchStudent() {
        setLoading(true)
        setError(null)

        try {
            const result = await getStudent(filter)
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

        fetchStudent()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(filter), options.enabled])

    return { data, loading, error, refetch: fetchStudent }
}
