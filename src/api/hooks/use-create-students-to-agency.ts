import { useState } from "react"
import { writeBatch, doc, serverTimestamp, increment } from "firebase/firestore"
import { db } from "@/service/firebase/firebase"

interface AssignStudentsToAgencyInput {
    studentIds: string[]
    agencyId: string
    agencyName: string
}

export const useAssignStudentsToAgency = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const assignStudents = async (data: AssignStudentsToAgencyInput) => {
        setLoading(true)
        setError(null)

        try {
            const { studentIds, agencyId, agencyName } = data
            const batch = writeBatch(db)

            studentIds.forEach((studentId) => {
                const studentRef = doc(db, "students", studentId)
                batch.update(studentRef, {
                    assignedAgencyID: agencyId,
                    assignedAgencyName: agencyName,
                    updatedAt: serverTimestamp(),
                })
            })

            const agencyRef = doc(db, "agencies", agencyId)
            batch.update(agencyRef, {
                studentCount: increment(studentIds.length),
            })

            await batch.commit()
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
                throw err
            } else {
                setError("Failed to assign students to agency")
                throw new Error("Failed to assign students to agency")
            }
        } finally {
            setLoading(false)
        }
    }

    return { loading, error, mutate: assignStudents }
}
