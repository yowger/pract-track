import { useState } from "react"
import {
    writeBatch,
    doc,
    serverTimestamp,
    increment,
    getDoc,
} from "firebase/firestore"
import { db } from "@/service/firebase/firebase"

interface ReassignStudentsToAdviserInput {
    studentIds: string[]
    newAdviserId: string
    newAdviserName: string
}

export const useAssignStudentsToAdviser = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const reassignStudentsToAdviser = async (
        data: ReassignStudentsToAdviserInput
    ) => {
        setLoading(true)
        setError(null)

        try {
            const { studentIds, newAdviserId, newAdviserName } = data
            const batch = writeBatch(db)

            const decrementMap: Record<string, number> = {}

            for (const studentId of studentIds) {
                const studentRef = doc(db, "students", studentId)
                const snap = await getDoc(studentRef)

                if (snap.exists()) {
                    const prevAdviserId = snap.data().assignedAdviserID
                    if (prevAdviserId && prevAdviserId !== newAdviserId) {
                        decrementMap[prevAdviserId] =
                            (decrementMap[prevAdviserId] || 0) + 1
                    }
                }

                batch.update(studentRef, {
                    assignedAdviserID: newAdviserId,
                    assignedAdviserName: newAdviserName,
                    updatedAt: serverTimestamp(),
                })
            }

            Object.entries(decrementMap).forEach(([adviserId, count]) => {
                const adviserRef = doc(db, "users", adviserId)
                batch.update(adviserRef, {
                    "adviserData.studentCount": increment(-count),
                })
            })

            const newAdviserRef = doc(db, "users", newAdviserId)
            batch.update(newAdviserRef, {
                "adviserData.studentCount": increment(studentIds.length),
            })

            await batch.commit()
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
                throw err
            } else {
                setError("Failed to reassign students to adviser")
                throw new Error("Failed to reassign students to adviser")
            }
        } finally {
            setLoading(false)
        }
    }

    return { loading, error, mutate: reassignStudentsToAdviser }
}
