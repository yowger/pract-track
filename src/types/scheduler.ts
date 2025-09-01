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
    scheduleName: string
    description?: string
    startDate: string
    endDate: string
    weeklySchedule: DaySchedule[]
}
