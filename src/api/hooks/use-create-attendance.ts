import {
    toggleClock,
    type ToggleClockParams,
} from "@/service/attendance-service"
import { useState } from "react"

export const useCreateAttendance = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleToggleClock = async (params: ToggleClockParams) => {
        setLoading(true)
        setError(null)

        try {
            await toggleClock(params)
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
                throw err
            }
            setError("Failed to clock in/out")
            throw new Error("Failed to clock in/out")
        } finally {
            setLoading(false)
        }
    }

    return { loading, error, handleToggleClock }
}
