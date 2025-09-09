import type { FieldValue, Timestamp } from "firebase/firestore"

export interface GeoLocation {
    lat: number
    lng: number
}

export type StatusTypes =
    | "present"
    | "absent"
    | "late"
    | "excused"
    | "undertime"
    | "overtime"

export interface AttendanceSession {
    id: string
    schedule: {
        start?: Date | Timestamp
        end?: Date | Timestamp
        geoLocation?: GeoLocation
        geoRadius?: number
        photoStart?: boolean
        photoEnd?: boolean
        lateThresholdMins?: number
        undertimeThresholdMins?: number
        earlyClockInMins?: number
    }
    checkIn?: Date | Timestamp
    checkOut?: Date | Timestamp
    status?: Array<StatusTypes>
    remarks?: string
    geoLocation?: GeoLocation
    address?: string
    photoStartUrl?: string
    photoEndUrl?: string
}

export interface Attendance {
    id: string
    schedule: {
        id: string
        name: string
        date: Date | Timestamp
    }
    user: {
        id: string
        name: string
        photoUrl?: string
    }
    sessions: AttendanceSession[]
    overallStatus?:
        | "present"
        | "late"
        | "absent"
        | "excused"
        | "undertime"
        | "overtime"
    markedBy: "self" | "admin" | "agency"
    totalWorkMinutes?: number
    createdAt: Date | Timestamp | FieldValue
    updatedAt: Date | Timestamp | FieldValue
}
