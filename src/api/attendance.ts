import {
    doc,
    setDoc,
    serverTimestamp,
    collection,
    where,
    Timestamp,
    orderBy,
    query,
    getDocs,
    updateDoc,
    getDoc,
    writeBatch,
} from "firebase/firestore"
import { nanoid } from "nanoid"

import { parseScheduleTime } from "@/lib/date-utils"
import { db } from "@/service/firebase/firebase"
import type { Attendance, AttendanceSession } from "@/types/attendance"
import type { Scheduler } from "@/types/scheduler"

export async function saveAttendance(
    attendance: Omit<Attendance, "id" | "createdAt" | "updatedAt"> & {
        id?: string
    }
) {
    const docRef = attendance.id
        ? doc(db, "attendances", attendance.id)
        : doc(collection(db, "attendances"))

    const data: Attendance = {
        ...attendance,
        id: attendance.id ?? docRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    }

    await setDoc(docRef, data, { merge: true })

    return data
}

export async function updateAttendance(
    id: string,
    updates: Partial<Omit<Attendance, "id">>
) {
    const docRef = doc(db, "attendances", id)

    await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
    })
}

type AttendanceFilter = {
    userId?: string
    scheduleId?: string
    agencyId?: string
    status?: Attendance["overallStatus"]
    from?: Date
    to?: Date
}

export async function getAttendances(filter: AttendanceFilter = {}) {
    const colRef = collection(db, "attendances")

    const conditions = []

    if (filter.userId) {
        conditions.push(where("userId", "==", filter.userId))
    }

    if (filter.scheduleId) {
        conditions.push(where("schedule.id", "==", filter.scheduleId))
    }

    if (filter.status) {
        conditions.push(where("overallStatus", "==", filter.status))
    }

    if (filter.agencyId) {
        conditions.push(where("schedule.agencyId", "==", filter.agencyId))
    }

    if (filter.from) {
        conditions.push(
            where("schedule.date", ">=", Timestamp.fromDate(filter.from))
        )
    }

    if (filter.to) {
        conditions.push(
            where("schedule.date", "<=", Timestamp.fromDate(filter.to))
        )
    }

    const q = query(colRef, ...conditions, orderBy("schedule.date", "desc"))

    const snapshot = await getDocs(q)

    const attendances: Attendance[] = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as Attendance
    })

    return attendances
}

export async function getOrCreateAttendance(data: {
    user: {
        id: string
        name: string
        photoUrl?: string
    }
    agencyId: string
    scheduler: Scheduler
    today: Date
}): Promise<Attendance | null> {
    const { user, agencyId, scheduler, today = new Date() } = data

    const attendanceId = `${user.id}_${today.toISOString().split("T")[0]}`
    const docRef = doc(db, "attendances", attendanceId)
    const snapshot = await getDoc(docRef)

    if (snapshot.exists()) {
        return snapshot.data() as Attendance
    }

    const weekday = today
        .toLocaleDateString("en-US", { weekday: "long" })
        .toLowerCase() as Scheduler["weeklySchedule"][number]["day"]

    const daySchedule = scheduler.weeklySchedule.find((d) => d.day === weekday)

    if (!daySchedule || !daySchedule.available) {
        return null
    }

    const sessions: AttendanceSession[] = daySchedule.sessions.map(
        (session) => {
            const sessionId = nanoid()
            const sessionStart = parseScheduleTime(session.start, today)
            const sessionEnd = parseScheduleTime(session.end, today)

            return {
                id: sessionId,
                schedule: {
                    start: sessionStart,
                    end: sessionEnd,
                    photoStart: session.photoStart,
                    photoEnd: session.photoEnd,
                    lateThresholdMins: session.lateThresholdMins ?? 0,
                    undertimeThresholdMins: session.undertimeThresholdMins ?? 0,
                },
            }
        }
    )

    const attendance: Attendance = {
        id: attendanceId,
        schedule: {
            id: scheduler.id!,
            name: scheduler.scheduleName,
            date: today,
        },
        agencyId,
        agencyName: "",
        user: { id: user.id, name: user.name, photoUrl: user.photoUrl },
        sessions,
        markedBy: "self",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    }

    try {
        await setDoc(docRef, attendance, { merge: true })
        return attendance
    } catch (err) {
        console.error("Failed to create attendance:", err)
        return null
    }
}

interface CreateAttendanceForStudentsInput {
    students: { id: string; name: string; photoUrl: string | null }[]
    sessions: AttendanceSession[]
    schedule: { id: string; date: Date | Timestamp }
    agency: { id: string; name: string }
}

export async function createAttendanceForStudents({
    students,
    sessions,
    schedule,
    agency,
}: CreateAttendanceForStudentsInput) {
    const batch = writeBatch(db)

    students.forEach((student) => {
        const attendanceRef = doc(collection(db, "attendances"))

        const sessionsWithId = sessions.map((s) => ({
            ...s,
            id: crypto.randomUUID(),
        }))

        batch.set(attendanceRef, {
            id: attendanceRef.id,
            agencyId: agency.id,
            agencyName: agency.name,
            schedule,
            user: student,
            sessions: sessionsWithId,
            overallStatus: "absent",
            markedBy: "agency",
            totalWorkMinutes: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        })
    })

    await batch.commit()
}
