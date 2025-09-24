import { useState } from "react"
import type { PlannedSession, Schedule } from "@/types/scheduler"
import { createSchedule } from "../scheduler"

interface CreateScheduleInput {
    date: Date
    agency: { id: string; name: string }
    sessions?: PlannedSession[]
}

export const useCreateSchedule = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleCreateSchedule = async (
        data: CreateScheduleInput
    ): Promise<Schedule> => {
        setLoading(true)
        setError(null)
        try {
            const result = await createSchedule(
                data.date,
                data.agency,
                data.sessions ?? []
            )
            return result
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
                throw err
            } else {
                setError("Failed to create schedule")
                throw new Error("Failed to create schedule")
            }
        } finally {
            setLoading(false)
        }
    }

    return { loading, error, mutate: handleCreateSchedule }
}
