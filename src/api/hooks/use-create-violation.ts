import { useState } from "react"

import { reportViolation, type ViolationInput } from "../violation"

export const useReportViolation = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const reportViolationFunc = async (data: ViolationInput) => {
        setLoading(true)
        setError(null)

        try {
            const result = await reportViolation(data)
            return result
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
                throw err
            } else {
                setError("Failed to report violation")
                throw new Error("Failed to report violation")
            }
        } finally {
            setLoading(false)
        }
    }

    return { loading, error, mutate: reportViolationFunc }
}
