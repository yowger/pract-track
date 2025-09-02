import {
    addDoc,
    collection,
    getDoc,
    getDocs,
    doc,
    query,
    where,
    type Query,
} from "firebase/firestore"
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
    const timestamp = new Date().toISOString()

    const docRef = await addDoc(collection(db, "schedules"), {
        ...schedule,
        companyId: companyId || null,
        createdAt: timestamp,
        updatedAt: timestamp,
    })

    return docRef.id
}

type GetSchedulesParams = {
    companyId?: string
}

export async function getSchedules({ companyId }: GetSchedulesParams = {}) {
    const schedulesRef = collection(db, "schedules")
    let q: Query = schedulesRef

    if (companyId) {
        q = query(schedulesRef, where("companyId", "==", companyId))
    }

    const snapshot = await getDocs(q)
    const schedules: (Scheduler & { id: string })[] = snapshot.docs.map(
        (doc) =>
            ({
                id: doc.id,
                ...doc.data(),
            } as Scheduler & { id: string })
    )

    return schedules
}

export async function getScheduleById(
    scheduleId: string
): Promise<(Scheduler & { id: string }) | null> {
    const scheduleRef = doc(db, "schedules", scheduleId)
    const snapshot = await getDoc(scheduleRef)

    if (!snapshot.exists()) {
        return null
    }

    return {
        id: snapshot.id,
        ...snapshot.data(),
    } as Scheduler & { id: string }
}
