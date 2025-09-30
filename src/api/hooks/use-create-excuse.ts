import { useState } from "react"
import { addDoc, collection, serverTimestamp, setDoc } from "firebase/firestore"
import { db } from "@/service/firebase/firebase"

export interface CreateExcuseRequestParams {
    studentId: string
    agencyId: string
    attendanceId?: string | null
    title: string
    reason: string
    filesUrl?: string[]
    photosUrl?: string[]
}

export const useCreateExcuseRequest = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleCreateExcuseRequest = async (
        params: CreateExcuseRequestParams
    ) => {
        setLoading(true)
        setError(null)

        try {
            await createExcuseRequest(params)
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
                throw err
            }
            setError("Failed to create excuse request")
            throw new Error("Failed to create excuse request")
        } finally {
            setLoading(false)
        }
    }

    return { loading, error, handleCreateExcuseRequest }
}

export async function createExcuseRequest(params: CreateExcuseRequestParams) {
    const docRef = await addDoc(collection(db, "excuses"), {
        ...params,
        attendanceId: params.attendanceId ?? null,
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    })

    await setDoc(docRef, { id: docRef.id }, { merge: true })

    return docRef.id
}
