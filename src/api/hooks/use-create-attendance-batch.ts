import { useState } from "react"
import type { AttendanceSession } from "@/types/attendance"
import type { Timestamp } from "firebase/firestore"
import { createAttendanceForStudents } from "../attendance"

interface CreateAttendanceInput {
    students: { id: string; name: string; photoUrl: string | null }[]
    sessions: AttendanceSession[]
    schedule: { id: string; date: Date | Timestamp }
    agency: { id: string; name: string }
}

export const useCreateAttendanceBatch = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleCreateAttendanceBatch = async (
        data: CreateAttendanceInput
    ): Promise<void> => {
        setLoading(true)
        setError(null)
        try {
            await createAttendanceForStudents({
                students: data.students,
                sessions: data.sessions,
                schedule: data.schedule,
                agency: data.agency,
            })
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
                throw err
            } else {
                setError("Failed to create attendance batch")
                throw new Error("Failed to create attendance batch")
            }
        } finally {
            setLoading(false)
        }
    }

    return {
        loading,
        error,
        mutate: handleCreateAttendanceBatch,
    }
}
