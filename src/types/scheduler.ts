export interface Session {
    start: string
    end: string
    photoStart: boolean
    photoEnd: boolean
}

export interface DaySchedule {
    day: string
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
