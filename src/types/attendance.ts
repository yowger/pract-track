import type { FieldValue, Timestamp } from "firebase/firestore"

export interface GeoLocation {
    lat: number
    lng: number
}

export interface AttendanceSession {
    scheduledStart?: Date
    scheduledEnd?: Date
    scheduledMinutes?: number
    checkIn?: Date
    checkOut?: Date
    totalWorkMinutes?: number
    overtimeMinutes?: number
    undertimeMinutes?: number
    status?:
        | "present"
        | "absent"
        | "late"
        | "excused"
        | "undertime"
        | "overtime"
    remarks?: string
    geoLocation?: GeoLocation
    photoUrl?: string
}

export interface Attendance {
    id: string
    scheduleId: string
    scheduleName?: string
    userId: string
    session1?: AttendanceSession
    session2?: AttendanceSession
    overallStatus?:
        | "present"
        | "half-day"
        | "absent"
        | "excused"
        | "undertime"
        | "overtime"
    scheduledWorkMinutes?: number
    totalWorkMinutes?: number
    totalOvertimeMinutes?: number
    totalUndertimeMinutes?: number
    markedBy: "self" | "admin" | "agency"
    createdAt: Date | Timestamp | FieldValue
    updatedAt: Date | Timestamp | FieldValue
}
