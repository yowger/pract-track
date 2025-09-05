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
} from "firebase/firestore"

import { db } from "@/service/firebase/firebase"
import type { Attendance } from "@/types/attendance"

// const computeSession = (session?: AttendanceSession) => {
//     if (
//         !session ||
//         !session.checkIn ||
//         !session.checkOut ||
//         !session.scheduledStart ||
//         !session.scheduledEnd
//     )
//         return session

//     const scheduledMinutes = Math.round(
//         (session.scheduledEnd.getTime() - session.scheduledStart.getTime()) /
//             60000
//     )
//     const totalWorkMinutes = Math.round(
//         (session.checkOut.getTime() - session.checkIn.getTime()) / 60000
//     )
//     const overtimeMinutes =
//         totalWorkMinutes > scheduledMinutes
//             ? totalWorkMinutes - scheduledMinutes
//             : 0
//     const undertimeMinutes =
//         totalWorkMinutes < scheduledMinutes
//             ? scheduledMinutes - totalWorkMinutes
//             : 0

//     let status: AttendanceSession["status"] = "present"
//     if (totalWorkMinutes === 0) status = "absent"
//     else if (overtimeMinutes > 0) status = "overtime"
//     else if (undertimeMinutes > 0) status = "undertime"

//     return {
//         ...session,
//         scheduledMinutes,
//         totalWorkMinutes,
//         overtimeMinutes,
//         undertimeMinutes,
//         status,
//     }
// }

// const computeOverallStatus = (sessions: AttendanceSession[] = []) => {
//     const statuses = sessions.map((s) => s.status)

//     if (statuses.every((s) => s === "excused")) return "excused"
//     if (
//         statuses.every(
//             (s) =>
//                 s === "present" ||
//                 s === "late" ||
//                 s === "overtime" ||
//                 s === "undertime"
//         )
//     )
//         return "present"
//     if (
//         statuses.some(
//             (s) =>
//                 s === "present" ||
//                 s === "late" ||
//                 s === "overtime" ||
//                 s === "undertime" ||
//                 s === "excused"
//         )
//     )
//         return "half-day"

//     return "absent"
// }

// export const saveAttendance = async (
//     attendance: Omit<
//         Attendance,
//         | "id"
//         | "createdAt"
//         | "updatedAt"
//         | "sessions"
//         | "overallStatus"
//         | "scheduledWorkMinutes"
//         | "totalWorkMinutes"
//         | "totalOvertimeMinutes"
//         | "totalUndertimeMinutes"
//     > & { sessions: AttendanceSession[] }
// ) => {
//     const computedSessions = attendance.sessions.map(computeSession)

//     const validSessions = computedSessions.filter(
//         (s): s is AttendanceSession => s !== undefined
//     )

//     const scheduledWorkMinutes = computedSessions.reduce(
//         (sum, s) => sum + (s?.scheduledMinutes || 0),
//         0
//     )
//     const totalWorkMinutes = computedSessions.reduce(
//         (sum, s) => sum + (s?.totalWorkMinutes || 0),
//         0
//     )
//     const totalOvertimeMinutes = computedSessions.reduce(
//         (sum, s) => sum + (s?.overtimeMinutes || 0),
//         0
//     )
//     const totalUndertimeMinutes = computedSessions.reduce(
//         (sum, s) => sum + (s?.undertimeMinutes || 0),
//         0
//     )

//     const overallStatus = computeOverallStatus(validSessions)

//     const docRef = doc(collection(db, "attendances"))

//     const data: Attendance = {
//         ...attendance,
//         id: docRef.id,
//         sessions: validSessions,
//         scheduledWorkMinutes,
//         totalWorkMinutes,
//         totalOvertimeMinutes,
//         totalUndertimeMinutes,
//         overallStatus,
//         updatedAt: serverTimestamp(),
//         createdAt: serverTimestamp(),
//     }

//     await setDoc(docRef, data, { merge: true })
//     return data
// }

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

export async function updateAttendanceRaw(
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
        conditions.push(where("scheduleId", "==", filter.scheduleId))
    }

    if (filter.status) {
        conditions.push(where("overallStatus", "==", filter.status))
    }

    if (filter.from) {
        conditions.push(
            where("attendanceDate", ">=", Timestamp.fromDate(filter.from))
        )
    }

    if (filter.to) {
        conditions.push(
            where("attendanceDate", "<=", Timestamp.fromDate(filter.to))
        )
    }

    const q = query(colRef, ...conditions, orderBy("attendanceDate", "desc"))

    const snapshot = await getDocs(q)

    const attendances: Attendance[] = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as Attendance
    })

    return attendances
}
