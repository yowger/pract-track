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
