import type { FieldValue, Timestamp } from "firebase/firestore"
import type { GeoLocation } from "./attendance"

export type WeekDay =
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday"

export interface Session {
    start: string
    end: string
    photoStart: boolean
    photoEnd: boolean
    lateThresholdMins?: number
    undertimeThresholdMins?: number
}

export interface DaySchedule {
    day: WeekDay
    available: boolean
    sessions: Session[]
}

export interface Scheduler {
    id?: string
    companyId: string
    scheduleName: string
    description?: string
    startDate: string
    endDate: string
    weeklySchedule: DaySchedule[]
    totalAssigned?: number
}

export interface PlannedSession {
    start: Date | Timestamp
    end: Date | Timestamp
    geoLocation?: GeoLocation
    geoRadius?: number
    photoStart?: boolean
    photoEnd?: boolean
    lateThresholdMins?: number
    undertimeThresholdMins?: number
    earlyClockInMins?: number
}

export interface Schedule {
    id: string
    date: Date | Timestamp
    agencyId: string
    agencyName: string

    sessions: PlannedSession[]
    createdAt: Date | Timestamp | FieldValue
    updatedAt: Date | Timestamp | FieldValue
}
