import { useState } from "react"
import { addStudentEvaluation } from "../users"

type EvaluationInput = {
    evaluator: {
        id: string
        docID: string
        name: string
    }
    agency: {
        id: string
        name: string
    }
}

export const useAddStudentEvaluation = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleAddEvaluation = async (
        uid: string,
        evaluation: EvaluationInput
    ) => {
        setLoading(true)
        setError(null)
        try {
            await addStudentEvaluation(uid, evaluation)
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
                throw err
            } else {
                setError("Failed to add evaluation")
            }
        } finally {
            setLoading(false)
        }
    }

    return { loading, error, mutate: handleAddEvaluation }
}
