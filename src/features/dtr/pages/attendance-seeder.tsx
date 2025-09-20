// import {
//     addDoc,
//     collection,
//     serverTimestamp,
//     Timestamp,
// } from "firebase/firestore"
// import { db } from "@/service/firebase/firebase"
// import { faker } from "@faker-js/faker"
// import { nanoid } from "nanoid"
// import type {
//     Attendance,
//     AttendanceSession,
//     GeoLocation,
// } from "@/types/attendance"
// import { Button } from "@/components/ui/button"

// const WORK_START = 9
// const WORK_END = 17

// function randomGeoLocation(): GeoLocation {
//     return {
//         lat: 14.5995 + Math.random() * 0.02,
//         lng: 120.9842 + Math.random() * 0.02,
//     }
// }

// function makeRandomSession(date: Date): AttendanceSession {
//     const startHour = WORK_START + Math.floor(Math.random() * 2)
//     const endHour = WORK_END - Math.floor(Math.random() * 2)

//     const scheduledStart = new Date(date)
//     scheduledStart.setHours(startHour, 0, 0, 0)

//     const scheduledEnd = new Date(date)
//     scheduledEnd.setHours(endHour, 0, 0, 0)

//     const checkedIn = faker.datatype.boolean()
//     const checkedOut = checkedIn ? faker.datatype.boolean() : false

//     const session: AttendanceSession = {
//         id: nanoid(),
//         schedule: {
//             start: scheduledStart,
//             end: scheduledEnd,
//             geoLocation: randomGeoLocation(),
//             geoRadius: 50,
//             photoStart: true,
//             photoEnd: true,
//             lateThresholdMins: 15,
//             undertimeThresholdMins: 15,
//             earlyClockInMins: 15,
//         },
//         totalWorkMinutes: 0,
//     }

//     let actualCheckIn: Date | null = null
//     let actualCheckOut: Date | null = null

//     if (checkedIn) {
//         actualCheckIn = new Date(
//             scheduledStart.getTime() +
//                 faker.number.int({ min: -10, max: 40 }) * 60000
//         )
//         session.checkInInfo = {
//             time: actualCheckIn,
//             geo: randomGeoLocation(),
//             address: faker.location.streetAddress(),
//             photoUrl: `https://picsum.photos/200?random=${faker.number.int({
//                 min: 0,
//                 max: 1000,
//             })}`,
//             status:
//                 actualCheckIn.getTime() >
//                 scheduledStart.getTime() +
//                     (session.schedule.lateThresholdMins ?? 15) * 60000
//                     ? "late"
//                     : "present",
//         }
//     }

//     if (checkedOut) {
//         actualCheckOut = new Date(
//             scheduledEnd.getTime() +
//                 faker.number.int({ min: -40, max: 20 }) * 60000
//         )
//         session.checkOutInfo = {
//             time: actualCheckOut,
//             geo: randomGeoLocation(),
//             address: faker.location.streetAddress(),
//             photoUrl: `https://picsum.photos/200?random=${faker.number.int({
//                 min: 0,
//                 max: 1000,
//             })}`,
//             status:
//                 actualCheckOut.getTime() <
//                 scheduledEnd.getTime() -
//                     (session.schedule.undertimeThresholdMins ?? 15) * 60000
//                     ? "undertime"
//                     : "present",
//         }
//     }

//     if (actualCheckIn && actualCheckOut) {
//         session.totalWorkMinutes = Math.floor(
//             (actualCheckOut.getTime() - actualCheckIn.getTime()) / 60000
//         )
//     }

//     return session
// }

// async function seedRandomAttendances(
//     user: { id: string; name: string; photoUrl?: string },
//     days = 10
// ) {
//     const attendances: Attendance[] = []

//     for (let i = 0; i < days; i++) {
//         const date = new Date()
//         date.setDate(date.getDate() - i)

//         const numSessions = 1 + Math.floor(Math.random() * 2) // 1-2 sessions per day
//         const sessions: AttendanceSession[] = []

//         for (let s = 0; s < numSessions; s++) {
//             const randomSession = makeRandomSession(date)

//             sessions.push(randomSession)
//         }

//         const totalWorkMinutes = sessions.reduce(
//             (sum, s) => sum + (s.totalWorkMinutes || 0),
//             0
//         )
//         const overallStatus = sessions.some((s) => s.checkInInfo)
//             ? "present"
//             : "absent"

//         const attendance: Attendance = {
//             id: nanoid(),
//             schedule: {
//                 id: "sched-" + nanoid(4),
//                 name: "Default Schedule",
//                 date: Timestamp.fromDate(date),
//             },
//             user,
//             sessions,
//             overallStatus,
//             markedBy: "self",
//             totalWorkMinutes,
//             createdAt: serverTimestamp(),
//             updatedAt: serverTimestamp(),
//         }

//         attendances.push(attendance)
//     }

//     for (const att of attendances) {
//         await addDoc(collection(db, "attendances"), att)
//     }

//     console.log(
//         `${attendances.length} random attendances seeded for ${user.name}`
//     )
// }

// const user = { id: "xtB1yKlcRZcFVw0KaXAj0F9YwAN2", name: "roger pantil" }

// export default function AttendanceSeeder() {
//     async function handleClick() {
//         try {
//             await seedRandomAttendances(user)
//         } catch (error) {
//             if (error instanceof Error) {
//                 console.error(error.message)
//             }
//         }
//     }

//     return (
//         <div>
//             <Button onClick={handleClick}>Seed attendance</Button>
//         </div>
//     )
// }
