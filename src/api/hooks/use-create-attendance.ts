import { toggleClock } from "@/service/attendance-service"
import type { Attendance, GeoLocation } from "@/types/attendance"
import { useState } from "react"

export const useCreateAttendance = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleToggleClock = async (params: {
        attendance: Attendance
        geo: GeoLocation
        date: Date
    }) => {
        const { attendance, geo, date } = params

        setLoading(true)
        setError(null)
        try {
            await toggleClock({ attendance, geo, date })
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
                throw err
            } else {
                setError("Failed to clock in/out")
            }
        } finally {
            setLoading(false)
        }
    }

    return { loading, error, handleToggleClock }
}
