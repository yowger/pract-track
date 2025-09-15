import { useEffect, useState } from "react"

import type { Evaluation } from "@/types/evaluation"
import { getEvaluation } from "../evaluation"

interface UseEvaluationOptions {
    enabled?: boolean
}

type EvaluationFilter = {
    uid?: string
}

export function useEvaluation(
    filter: EvaluationFilter,
    options: UseEvaluationOptions = {}
) {
    const [data, setData] = useState<(Evaluation & { id: string }) | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    async function fetchEvaluation() {
        if (!filter.uid) return
        setLoading(true)
        setError(null)

        try {
            const result = await getEvaluation(filter.uid)
            setData(result)
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Unknown error"))
            throw err
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (options.enabled === false || !filter.uid) return

        fetchEvaluation()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter.uid, options.enabled])

    return { data, loading, error, refetch: fetchEvaluation }
}
