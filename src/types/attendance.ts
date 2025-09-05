import type { FieldValue, Timestamp } from "firebase/firestore"

export interface GeoLocation {
    lat: number
    lng: number
}

export interface AttendanceSession {
    schedule: {
        start?: Date | Timestamp
        end?: Date | Timestamp
        geoLocation?: GeoLocation
        geoRadius?: number
        photoStart?: boolean
        photoEnd?: boolean
    }
    checkIn?: Date | Timestamp
    checkOut?: Date | Timestamp
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
    sessions: AttendanceSession[]
    attendanceDate: Date | Timestamp
    overallStatus?:
        | "present"
        | "half-day"
        | "absent"
        | "excused"
        | "undertime"
        | "overtime"
    markedBy: "self" | "admin" | "agency"
    createdAt: Date | Timestamp | FieldValue
    updatedAt: Date | Timestamp | FieldValue
}
