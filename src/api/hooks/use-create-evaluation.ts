import { useState } from "react"

import type { Evaluation } from "@/types/evaluation"
import { createEvaluation } from "../evaluation"

export const useCreateEvaluation = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleCreateEvaluation = async (data: Evaluation) => {
        setLoading(true)
        setError(null)
        try {
            await createEvaluation(data)
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("Failed to create evaluation")
            }
        } finally {
            setLoading(false)
        }
    }

    return { loading, error, mutate: handleCreateEvaluation }
}
