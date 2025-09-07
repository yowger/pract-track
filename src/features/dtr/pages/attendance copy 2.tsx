// import { endOfDay, format, startOfDay } from "date-fns"
// import { useEffect, useState, useCallback } from "react"
// import { useGeolocated } from "react-geolocated"

// import { useSchedule } from "@/api/hooks/use-fetch-schedule-by-id"
// import { useServerTime } from "@/api/hooks/use-get-server-time"
// import { useAttendances } from "@/api/hooks/use-fetch-attendance"
// import { saveAttendance } from "@/api/attendance"
// import TimeTrackingCard from "../components/time-tracking-card"
// import { AttendanceList } from "../components/attendance-list"
// import { useUser } from "@/hooks/use-user"
// import { isStudent } from "@/types/user"
// import { firebaseTimestampToDate, parseScheduleTime } from "@/lib/date-utils"
// import type { Attendance } from "@/types/attendance"
// import type { Session } from "@/types/scheduler"

// const getCurrentOrNextSession = (
//     sessions: Session[],
//     now: Date
// ): Session | undefined => {
//     if (!sessions?.length) return undefined

//     const inProgress = sessions.find((s) => {
//         const start = firebaseTimestampToDate(s.start)!
//         const end = firebaseTimestampToDate(s.end)!
//         return now >= start && now <= end
//     })
//     if (inProgress) return inProgress

//     return (
//         sessions.find((s) => now < firebaseTimestampToDate(s.start)!) ??
//         sessions[sessions.length - 1]
//     )
// }

// const reverseGeocode = async (
//     coords?: GeolocationCoordinates
// ): Promise<string> => {
//     if (!coords) return "Unknown address"

//     try {
//         const res = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`
//         )
//         if (!res.ok) throw new Error(res.statusText)
//         const data = await res.json()
//         return data.display_name ?? "Unknown address"
//     } catch (err) {
//         console.error("Reverse geocoding error:", err)
//         return "Unknown address"
//     }
// }

// export default function Attendance() {
//     const { user } = useUser()
//     const { serverTime } = useServerTime()

//     const [currentTime, setCurrentTime] = useState(serverTime || null)
//     const [isClockedIn, setIsClockedIn] = useState(false)

//     const attendance =
//         user && isStudent(user) ? user.studentData.assignedSchedule : null
//     const { schedule } = useSchedule(attendance?.id, { enabled: !!attendance })
//     const { data: attendanceList } = useAttendances(
//         serverTime && user?.uid
//             ? {
//                   userId: user.uid,
//                   from: startOfDay(serverTime),
//                   to: endOfDay(serverTime),
//               }
//             : {},
//         { enabled: !!serverTime && !!user?.uid }
//     )
//     const { coords } = useGeolocated({
//         positionOptions: { enableHighAccuracy: false },
//         userDecisionTimeout: 5000,
//     })

//     const today = format(new Date(), "EEEE").toLowerCase()
//     const todaysSchedule = schedule?.weeklySchedule.find(
//         (day) => day.day === today
//     )
//     const hasSession = todaysSchedule?.sessions.some((s) => s.start && s.end)
//     const isInRange = true

//     async function handleClockToggle() {
//         if (
//             !user ||
//             !todaysSchedule ||
//             !schedule ||
//             !currentTime ||
//             !hasSession
//         )
//             return

//         const todaysDate = serverTime || new Date()
//         const currentSession = getCurrentOrNextSession(
//             todaysSchedule.sessions,
//             todaysDate
//         )

//         if (!currentSession) return

//         const sessionStart =
//             typeof currentSession.start === "string"
//                 ? parseScheduleTime(currentSession.start, todaysDate)
//                 : firebaseTimestampToDate(currentSession.start!)

//         const sessionEnd =
//             typeof currentSession.end === "string"
//                 ? parseScheduleTime(currentSession.end, todaysDate)
//                 : firebaseTimestampToDate(currentSession.end!)

//         const address = await reverseGeocode(coords)

//         const newAttendance: Omit<
//             Attendance,
//             "id" | "createdAt" | "updatedAt"
//         > = {
//             schedule: {
//                 id: schedule.id,
//                 name: schedule.scheduleName,
//                 date: todaysDate,
//             },
//             user: {
//                 id: user.uid,
//                 name: `${user.firstName} ${user.lastName}`,
//                 photoUrl: user.photoUrl ?? "",
//             },
//             sessions: [
//                 {
//                     schedule: {
//                         start: sessionStart!,
//                         end: sessionEnd!,
//                         photoStart: currentSession.photoStart,
//                         photoEnd: currentSession.photoEnd,
//                     },
//                     checkIn: currentTime,
//                     status: ["present"],
//                     address,
//                     geoLocation: coords
//                         ? { lat: coords.latitude, lng: coords.longitude }
//                         : undefined,
//                     checkOut: undefined,
//                     remarks: "",
//                     photoUrl: undefined,
//                 },
//             ],
//             markedBy: "self",
//         }

//         await saveAttendance(newAttendance)
//     }

//     useEffect(() => {
//         const todayAttendance = attendanceList?.[0] ?? null

//         setIsClockedIn(
//             !!todayAttendance?.sessions?.some((s) => s.checkIn && !s.checkOut)
//         )
//     }, [attendanceList])

//     useEffect(() => {
//         if (!serverTime) return
//         const offset = serverTime.getTime() - Date.now()
//         const timer = setInterval(
//             () => setCurrentTime(new Date(Date.now() + offset)),
//             1000
//         )
//         return () => clearInterval(timer)
//     }, [serverTime])

//     return (
//         <div className="flex flex-col p-4 gap-4">
//             <div className="flex flex-col items-start justify-between space-y-2 md:flex-row md:items-center">
//                 <div>
//                     <h1 className="text-2xl font-bold tracking-tight">
//                         Clock-in & Out
//                     </h1>
//                     <p className="text-muted-foreground">
//                         Manage your work sessions and track your daily schedule.
//                     </p>
//                 </div>
//             </div>

//             <div className="grid auto-rows-auto grid-cols-12 gap-5">
//                 <TimeTrackingCard
//                     todaysSchedule={todaysSchedule}
//                     time={currentTime || new Date()}
//                     isClockedIn={isClockedIn}
//                     isInRange={isInRange}
//                     onClockToggle={handleClockToggle}
//                     isLoading={!currentTime}
//                     isDisabled={!todaysSchedule || !isInRange || !hasSession}
//                 />
//                 <AttendanceList attendances={attendanceList ?? []} />
//             </div>
//         </div>
//     )
// }
