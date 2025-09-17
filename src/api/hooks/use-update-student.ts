import { useState } from "react"

import type { Student } from "@/types/user"
import { updateStudent } from "../students"

export const useUpdateStudent = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleUpdateStudent = async (
        uid: string,
        updates: Partial<Omit<Student, "uid" | "createdAt">> & {
            incrementViolationCount?: number
        }
    ) => {
        setLoading(true)
        setError(null)
        try {
            await updateStudent(uid, updates)
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
                throw err
            } else {
                setError("Failed to update student")
                throw new Error("Failed to update student")
            }
        } finally {
            setLoading(false)
        }
    }

    return { loading, error, mutate: handleUpdateStudent }
}
