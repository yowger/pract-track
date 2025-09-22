import { useState } from "react"

import type { AppUser } from "@/types/user"
import {
    createPracticumAdviser,
    type CreatePracticumAdviserInput,
} from "../advisers"

export const useCreatePracticumAdviser = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleCreatePracticumAdviser = async (
        data: Partial<CreatePracticumAdviserInput>
    ): Promise<AppUser> => {
        setLoading(true)
        setError(null)
        try {
            const result = await createPracticumAdviser(data)
            return result
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
                throw err
            } else {
                setError("Failed to create practicum adviser")
                throw new Error("Failed to create practicum adviser")
            }
        } finally {
            setLoading(false)
        }
    }

    return {
        loading,
        error,
        mutate: handleCreatePracticumAdviser,
    }
}
