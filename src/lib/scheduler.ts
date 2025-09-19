import {
    differenceInMinutes,
    parse,
    addDays,
    differenceInCalendarDays,
    isBefore,
} from "date-fns"
import type { Scheduler, WeekDay } from "@/types/scheduler"

export function calculateWeeklyHours(scheduler: Scheduler): number {
    return (
        scheduler.weeklySchedule.reduce((weekTotal, day) => {
            if (!day.available) return weekTotal

            const dayTotal = day.sessions.reduce((sum, session) => {
                if (!session.start || !session.end) return sum
                const start = parse(session.start, "HH:mm", new Date())
                const end = parse(session.end, "HH:mm", new Date())
                const mins = differenceInMinutes(end, start)
                return sum + Math.max(mins, 0)
            }, 0)

            return weekTotal + dayTotal
        }, 0) / 60
    )
}

const weekDayMap: Record<number, WeekDay> = {
    0: "sunday",
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday",
}

export function calculateContractHours(scheduler: Scheduler): number {
    const start = new Date(scheduler.startDate)
    const end = new Date(scheduler.endDate)

    const totalDays = differenceInCalendarDays(end, start) + 1
    let totalMinutes = 0

    for (let i = 0; i < totalDays; i++) {
        const current = addDays(start, i)
        const weekday = weekDayMap[current.getDay()]
        const daySchedule = scheduler.weeklySchedule.find(
            (d) => d.day === weekday
        )

        if (!daySchedule || !daySchedule.available) continue

        for (const session of daySchedule.sessions) {
            if (!session.start || !session.end) continue
            const startTime = parse(session.start, "HH:mm", current)
            const endTime = parse(session.end, "HH:mm", current)
            const mins = differenceInMinutes(endTime, startTime)
            totalMinutes += Math.max(mins, 0)
        }
    }

    return totalMinutes / 60
}

export function calculateTotalWorkingDays(scheduler: Scheduler): number {
    const start = new Date(scheduler.startDate)
    const end = new Date(scheduler.endDate)

    let count = 0
    let current = new Date(start)

    while (isBefore(current, addDays(end, 1))) {
        const weekday = current
            .toLocaleDateString("en-US", { weekday: "long" })
            .toLowerCase()
        const daySchedule = scheduler.weeklySchedule.find(
            (d) => d.day === weekday
        )

        if (daySchedule?.available) {
            count++
        }

        current = addDays(current, 1)
    }

    return count
}
