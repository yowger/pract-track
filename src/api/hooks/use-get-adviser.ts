import { useState } from "react"

import type { AppUser } from "@/types/user"
import { getPracticumAdviser } from "../advisers"

export const useGetPracticumAdviser = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [adviser, setAdviser] = useState<AppUser | null>(null)

    const fetchAdviser = async (uid: string) => {
        setLoading(true)
        setError(null)
        try {
            const result = await getPracticumAdviser(uid)
            setAdviser(result)
            return result
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
                throw err
            } else {
                setError("Failed to fetch practicum adviser")
                throw new Error("Failed to fetch practicum adviser")
            }
        } finally {
            setLoading(false)
        }
    }

    return { adviser, loading, error, fetchAdviser }
}
