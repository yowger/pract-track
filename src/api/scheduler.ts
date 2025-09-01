import { addDoc, collection } from "firebase/firestore"

import type { Scheduler } from "@/types/scheduler"
import { db } from "@/service/firebase/firebase"

type SaveScheduleParams = {
    schedule: Scheduler
    companyId?: string
}

export async function saveSchedule({
    schedule,
    companyId,
}: SaveScheduleParams) {
    try {
        const timestamp = new Date().toISOString()

        const docRef = await addDoc(collection(db, "schedules"), {
            ...schedule,
            companyId: companyId || null,
            createdAt: timestamp,
            updatedAt: timestamp,
        })

        console.log("Schedule saved with ID:", docRef.id)
        return docRef.id
    } catch (error) {
        console.error("Error saving schedule:", error)
        throw error
    }
}
