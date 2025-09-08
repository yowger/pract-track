import {
    addDoc,
    collection,
    serverTimestamp,
    Timestamp,
} from "firebase/firestore"

import type { Attendance, AttendanceSession } from "@/types/attendance"
import type { Scheduler, Session } from "@/types/scheduler"
import { db } from "@/service/firebase/firebase"
import { Button } from "@/components/ui/button"
import { nanoid } from "nanoid"

function makeSessionFromTemplate(
    session: Session,
    baseDate: Date
): AttendanceSession {
    const [startH, startM] = session.start.split(":").map(Number)
    const [endH, endM] = session.end.split(":").map(Number)

    const start = new Date(baseDate)
    start.setHours(startH, startM, 0, 0)

    const end = new Date(baseDate)
    end.setHours(endH, endM, 0, 0)

    return {
        id: crypto.randomUUID(),
        schedule: {
            start,
            end,
            photoStart: session.photoStart,
            photoEnd: session.photoEnd,
            lateThresholdMins: session.lateThresholdMins ?? 10,
            undertimeThresholdMins: session.undertimeThresholdMins ?? 10,
            earlyClockInMins: 15,
            geoLocation: {
                lat: 14.5995 + Math.random() * 0.01,
                lng: 120.9842 + Math.random() * 0.01,
            },
            geoRadius: 50, // meters
        },
        status: ["absent"],
        geoLocation: {
            lat: 14.5995 + Math.random() * 0.01,
            lng: 120.9842 + Math.random() * 0.01,
        },
        address: "Sample Address, Manila, PH",
        photoUrl:
            "https://picsum.photos/200?random=" +
            Math.floor(Math.random() * 1000),
    }
}

async function seedAttendancesForUser(
    user: { id: string; name: string; photoUrl?: string },
    scheduler: Scheduler
) {
    const start = new Date(scheduler.startDate)
    const end = new Date(scheduler.endDate)

    const current = new Date(start)
    while (current <= end) {
        const weekday = current
            .toLocaleDateString("en-US", { weekday: "long" })
            .toLowerCase()

        const dayTemplate = scheduler.weeklySchedule.find(
            (d) => d.day === weekday
        )
        if (!dayTemplate || !dayTemplate.available) {
            current.setDate(current.getDate() + 1)
            continue
        }

        const sessions = dayTemplate.sessions.map((s) =>
            makeSessionFromTemplate(s, current)
        )

        const attendance: Attendance = {
            id: nanoid(),
            schedule: {
                id: scheduler.id!,
                name: scheduler.scheduleName,
                date: Timestamp.fromDate(new Date(current)),
            },
            user,
            sessions,
            overallStatus: "absent",
            markedBy: "self",
            totalWorkMinutes: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }

        try {
            await addDoc(collection(db, "attendances"), attendance)
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message)
                throw error
            }
        }

        current.setDate(current.getDate() + 1)
    }
}

const scheduler: Scheduler = {
    id: "sched-123",
    companyId: "comp-001",
    scheduleName: "Default 9-5",
    startDate: "2025-09-01",
    endDate: "2025-09-30",
    weeklySchedule: [
        {
            day: "monday",
            available: true,
            sessions: [
                {
                    start: "09:00",
                    end: "17:00",
                    photoStart: true,
                    photoEnd: true,
                },
            ],
        },
        {
            day: "tuesday",
            available: true,
            sessions: [
                {
                    start: "09:00",
                    end: "17:00",
                    photoStart: true,
                    photoEnd: true,
                },
            ],
        },
        {
            day: "wednesday",
            available: true,
            sessions: [
                {
                    start: "09:00",
                    end: "17:00",
                    photoStart: true,
                    photoEnd: true,
                },
            ],
        },
        {
            day: "thursday",
            available: true,
            sessions: [
                {
                    start: "09:00",
                    end: "17:00",
                    photoStart: true,
                    photoEnd: true,
                },
            ],
        },
        {
            day: "friday",
            available: true,
            sessions: [
                {
                    start: "09:00",
                    end: "17:00",
                    photoStart: true,
                    photoEnd: true,
                },
            ],
        },
        { day: "saturday", available: false, sessions: [] },
        { day: "sunday", available: false, sessions: [] },
    ],
}

const user = { id: "xtB1yKlcRZcFVw0KaXAj0F9YwAN2", name: "roger pantil" }

export default function AttendanceSeeder() {
    async function handleClick() {
        try {
            await seedAttendancesForUser(user, scheduler)
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message)
            }
        }
    }

    return (
        <div>
            <Button onClick={handleClick}>Seed attendance</Button>
        </div>
    )
}
