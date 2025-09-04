import { doc, setDoc, serverTimestamp } from "firebase/firestore"

import { db } from "@/service/firebase/firebase"
import type { Attendance, AttendanceSession } from "@/types/attendance"

const computeSession = (session?: AttendanceSession) => {
    if (
        !session ||
        !session.checkIn ||
        !session.checkOut ||
        !session.scheduledStart ||
        !session.scheduledEnd
    )
        return session

    const scheduledMinutes = Math.round(
        (session.scheduledEnd.getTime() - session.scheduledStart.getTime()) /
            60000
    )
    const totalWorkMinutes = Math.round(
        (session.checkOut.getTime() - session.checkIn.getTime()) / 60000
    )
    const overtimeMinutes =
        totalWorkMinutes > scheduledMinutes
            ? totalWorkMinutes - scheduledMinutes
            : 0
    const undertimeMinutes =
        totalWorkMinutes < scheduledMinutes
            ? scheduledMinutes - totalWorkMinutes
            : 0

    let status: AttendanceSession["status"] = "present"
    if (totalWorkMinutes === 0) status = "absent"
    else if (overtimeMinutes > 0) status = "overtime"
    else if (undertimeMinutes > 0) status = "undertime"

    return {
        ...session,
        scheduledMinutes,
        totalWorkMinutes,
        overtimeMinutes,
        undertimeMinutes,
        status,
    }
}

const computeOverallStatus = (
    session1?: AttendanceSession,
    session2?: AttendanceSession
) => {
    const s1 = session1?.status
    const s2 = session2?.status

    if (s1 === "excused" && s2 === "excused") return "excused"
    if (
        (s1 === "present" ||
            s1 === "late" ||
            s1 === "overtime" ||
            s1 === "undertime") &&
        (s2 === "present" ||
            s2 === "late" ||
            s2 === "overtime" ||
            s2 === "undertime")
    )
        return "present"
    if (
        s1 === "present" ||
        s1 === "late" ||
        s1 === "overtime" ||
        s1 === "undertime" ||
        s1 === "excused" ||
        s2 === "present" ||
        s2 === "late" ||
        s2 === "overtime" ||
        s2 === "undertime" ||
        s2 === "excused"
    )
        return "half-day"
    return "absent"
}

export const saveAttendance = async (
    attendance: Omit<
        Attendance,
        | "createdAt"
        | "updatedAt"
        | "session1"
        | "session2"
        | "overallStatus"
        | "scheduledWorkMinutes"
        | "totalWorkMinutes"
        | "totalOvertimeMinutes"
        | "totalUndertimeMinutes"
    > & { session1?: AttendanceSession; session2?: AttendanceSession }
) => {
    const computedSession1 = computeSession(attendance.session1)
    const computedSession2 = computeSession(attendance.session2)

    const scheduledWorkMinutes =
        (computedSession1?.scheduledMinutes || 0) +
        (computedSession2?.scheduledMinutes || 0)
    const totalWorkMinutes =
        (computedSession1?.totalWorkMinutes || 0) +
        (computedSession2?.totalWorkMinutes || 0)
    const totalOvertimeMinutes =
        (computedSession1?.overtimeMinutes || 0) +
        (computedSession2?.overtimeMinutes || 0)
    const totalUndertimeMinutes =
        (computedSession1?.undertimeMinutes || 0) +
        (computedSession2?.undertimeMinutes || 0)

    const overallStatus = computeOverallStatus(
        computedSession1,
        computedSession2
    )

    const docRef = doc(db, "attendances", attendance.id)

    const data: Attendance = {
        ...attendance,
        session1: computedSession1,
        session2: computedSession2,
        scheduledWorkMinutes,
        totalWorkMinutes,
        totalOvertimeMinutes,
        totalUndertimeMinutes,
        overallStatus,
        updatedAt: serverTimestamp() as unknown as Date,
        createdAt: serverTimestamp() as unknown as Date,
    }

    await setDoc(docRef, data, { merge: true })
    return data
}
