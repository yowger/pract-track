import { useState } from "react"
import {
    writeBatch,
    doc,
    serverTimestamp,
    increment,
    getDoc,
} from "firebase/firestore"
import { db } from "@/service/firebase/firebase"

interface ReassignStudentsInput {
    studentIds: string[]
    newAgencyId: string
    newAgencyName: string
}

export const useAssignStudentsToAgency = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const reassignStudents = async (data: ReassignStudentsInput) => {
        setLoading(true)
        setError(null)

        try {
            const { studentIds, newAgencyId, newAgencyName } = data
            const batch = writeBatch(db)

            const decrementMap: Record<string, number> = {}

            for (const studentId of studentIds) {
                const studentRef = doc(db, "students", studentId)
                const snap = await getDoc(studentRef)

                if (snap.exists()) {
                    const prevAgencyId = snap.data().assignedAgencyID
                    if (prevAgencyId && prevAgencyId !== newAgencyId) {
                        decrementMap[prevAgencyId] =
                            (decrementMap[prevAgencyId] || 0) + 1
                    }
                }

                batch.update(studentRef, {
                    assignedAgencyID: newAgencyId,
                    assignedAgencyName: newAgencyName,
                    updatedAt: serverTimestamp(),
                })
            }

            Object.entries(decrementMap).forEach(([agencyId, count]) => {
                const agencyRef = doc(db, "agencies", agencyId)
                batch.update(agencyRef, {
                    studentCount: increment(-count),
                })
            })

            const newAgencyRef = doc(db, "agencies", newAgencyId)
            batch.update(newAgencyRef, {
                studentCount: increment(studentIds.length),
            })

            await batch.commit()
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
                throw err
            } else {
                setError("Failed to reassign students")
                throw new Error("Failed to reassign students")
            }
        } finally {
            setLoading(false)
        }
    }

    return { loading, error, mutate: reassignStudents }
}
