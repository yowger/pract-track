// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
// import type { Attendance, AttendanceSession } from "@/types/attendance"
// import DataTable from "@/components/data-table"
// import type { ColumnDef } from "@tanstack/react-table"
// import { format } from "date-fns"

// // Mock attendances
// // Mock attendances with new shape
// const mockAttendances: Attendance[] = [
//     {
//         id: "1",
//         schedule: {
//             id: "sched1",
//             name: "Morning Shift",
//             date: new Date(),
//         },
//         user: {
//             id: "u1",
//             name: "John Doe",
//             photoUrl: "https://placehold.co/40x40",
//         },
//         sessions: [
//             {
//                 schedule: { start: new Date(), end: new Date() },
//                 checkIn: new Date(new Date().setHours(8, 5)),
//                 checkOut: new Date(new Date().setHours(12, 0)),
//                 photoUrl: "https://placehold.co/40x40",
//                 geoLocation: { lat: 14.5995, lng: 120.9842 },
//                 remarks: "Morning shift",
//                 status: "present",
//             },
//             {
//                 schedule: { start: new Date(), end: new Date() },
//                 checkIn: new Date(new Date().setHours(13, 15)),
//                 checkOut: new Date(new Date().setHours(17, 0)),
//                 photoUrl: "https://placehold.co/40x40",
//                 geoLocation: { lat: 14.5995, lng: 120.9842 },
//                 remarks: "Afternoon shift",
//                 status: "present",
//             },
//         ],
//         overallStatus: "present",
//         totalWorkMinutes: 480,
//         markedBy: "self",
//         createdAt: new Date(),
//         updatedAt: new Date(),
//     },
//     {
//         id: "2",
//         schedule: {
//             id: "sched2",
//             name: "Morning Shift",
//             date: new Date(),
//         },
//         user: {
//             id: "u2",
//             name: "Jane Smith",
//         },
//         sessions: [
//             {
//                 schedule: { start: new Date(), end: new Date() },
//                 checkIn: new Date(new Date().setHours(9, 15)),
//                 checkOut: new Date(new Date().setHours(17, 30)),
//                 geoLocation: { lat: 14.55, lng: 121.0 },
//                 remarks: "Late arrival",
//                 status: "late",
//             },
//         ],
//         overallStatus: "late",
//         totalWorkMinutes: 435,
//         markedBy: "self",
//         createdAt: new Date(),
//         updatedAt: new Date(),
//     },
// ]

// // Flatten helper → turn Attendance into "session rows"
// interface FlattenedSession extends AttendanceSession {
//     user: Attendance["user"]
//     schedule: Attendance["schedule"]
//     overallStatus?: Attendance["overallStatus"]
// }

// function flattenAttendances(attendances: Attendance[]): FlattenedSession[] {
//     return attendances.flatMap((att) =>
//         att.sessions.map((session) => ({
//             ...session,
//             user: att.user,
//             schedule: att.schedule,
//             overallStatus: att.overallStatus,
//         }))
//     )
// }

// // Columns now match FlattenedSession
// const attendanceColumns: ColumnDef<FlattenedSession>[] = [
//     // {
//     //     accessorKey: "user.name",
//     //     header: "Employee",
//     //     cell: ({ row }) => (
//     //         <div className="flex items-center gap-2">
//     //             {row.original.user.photoUrl && (
//     //                 <img
//     //                     src={row.original.user.photoUrl}
//     //                     alt={row.original.user.name}
//     //                     width={32}
//     //                     height={32}
//     //                     className="rounded-full object-cover"
//     //                 />
//     //             )}
//     //             <span className="font-medium">{row.original.user.name}</span>
//     //         </div>
//     //     ),
//     // },
//     // {
//     //     accessorKey: "schedule.date",
//     //     header: "Date",
//     //     cell: ({ row }) => {
//     //         const d = row.original.schedule.date
//     //         return d ? format(d as Date, "MMM d, yyyy") : "-"
//     //     },
//     // },
//     {
//         accessorKey: "timeRange",
//         header: "Clock-in & Out",
//         cell: ({ row }) => {
//             const checkIn = row.original.checkIn as Date
//             const checkOut = row.original.checkOut as Date
//             if (!checkIn && !checkOut) return "-"

//             const formatTime = (d?: Date) =>
//                 d
//                     ? d.toLocaleTimeString([], {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                       })
//                     : "—"

//             return (
//                 <div className="flex items-center gap-2">
//                     <span>{formatTime(checkIn)}</span>
//                     <span className="text-muted-foreground">→</span>
//                     <span>{formatTime(checkOut)}</span>
//                 </div>
//             )
//         },
//     },
//     {
//         accessorKey: "overallTime",
//         header: "Duration",
//         cell: ({ row }) => {
//             const checkIn = row.original.checkIn as Date
//             const checkOut = row.original.checkOut as Date

//             const mins =
//                 checkIn && checkOut
//                     ? Math.floor((+checkOut - +checkIn) / 60000)
//                     : 0
//             const h = Math.floor(mins / 60)
//             const m = mins % 60
//             const duration = mins > 0 ? `${h}h ${m}m` : "—"

//             return <span>{duration}</span>
//         },
//     },
//     // {
//     //     accessorKey: "geoLocation",
//     //     header: "Location",
//     //     cell: ({ row }) => {
//     //         const geo = row.original.geoLocation
//     //         return geo ? (
//     //             <a
//     //                 href={`https://maps.google.com/?q=${geo.lat},${geo.lng}`}
//     //                 target="_blank"
//     //                 rel="noopener noreferrer"
//     //                 className="text-blue-600 underline"
//     //             >
//     //                 {row.original.address || "Unknown Address"}
//     //             </a>
//     //         ) : (
//     //             <span className="text-muted-foreground">-</span>
//     //         )
//     //     },
//     // },
//     // {
//     //     accessorKey: "photoUrl",
//     //     header: "Photo",
//     //     cell: ({ row }) =>
//     //         row.original.photoUrl ? (
//     //             <a
//     //                 href={row.original.photoUrl}
//     //                 target="_blank"
//     //                 rel="noopener noreferrer"
//     //                 className="text-blue-600 underline"
//     //             >
//     //                 {row.original.photoUrl || "no photo"}
//     //             </a>
//     //         ) : (
//     //             <span className="text-muted-foreground">-</span>
//     //         ),
//     // },
//     {
//         accessorKey: "status",
//         header: "Status",
//         cell: ({ row }) => (
//             <span
//                 className={`px-2 py-1 text-xs rounded ${
//                     row.original.status === "present"
//                         ? "bg-green-100 text-green-800"
//                         : row.original.status === "late"
//                         ? "bg-yellow-100 text-yellow-800"
//                         : "bg-red-100 text-red-800"
//                 }`}
//             >
//                 {row.original.status}
//             </span>
//         ),
//     },
//     // {
//     //     accessorKey: "remarks",
//     //     header: "Notes",
//     //     cell: ({ row }) => row.original.remarks ?? "-",
//     // },
// ]

// export function AttendanceList() {
//     const flattened = flattenAttendances(mockAttendances)

//     return (
//         <Card className="col-span-12">
//             <CardHeader>
//                 <CardTitle>Today's Attendance (Flattened)</CardTitle>
//             </CardHeader>
//             <CardContent>
//                 <DataTable columns={attendanceColumns} data={flattened} />
//             </CardContent>
//         </Card>
//     )
// }

// {
//     /* {attendances.length === 0 ? (
//                     <p className="text-sm text-muted-foreground">
//                         No attendance records found.
//                     </p>
//                 ) : (
//                     <ul className="space-y-3">
//                         {attendances.map((record) => (
//                             <li
//                                 key={record.id}
//                                 className="flex flex-col border-b pb-2 last:border-b-0 last:pb-0"
//                             >
//                                 <div className="flex justify-between items-center text-sm font-medium">
//                                     <span>{record.scheduleName}</span>
//                                     <span
//                                         className={`px-2 py-0.5 rounded text-xs ${
//                                             record.overallStatus === "present"
//                                                 ? "bg-emerald-100 text-emerald-800"
//                                                 : record.overallStatus ===
//                                                   "absent"
//                                                 ? "bg-red-100 text-red-800"
//                                                 : "bg-yellow-100 text-yellow-800"
//                                         }`}
//                                     >
//                                         {record.overallStatus}
//                                     </span>
//                                 </div>

//                                 <div className="text-xs text-muted-foreground">
//                                     {record.sessions.map((s, i) => {
//                                         return (
//                                             <div key={i}>
//                                                 {s.checkIn
//                                                     ? `In: ${format(
//                                                           firebaseTimestampToDate(
//                                                               s.checkIn
//                                                           )!,
//                                                           "hh:mm a"
//                                                       )}`
//                                                     : "No Check-in"}{" "}
//                                                 –{" "}
//                                                 {s.checkOut
//                                                     ? `Out: ${format(
//                                                           firebaseTimestampToDate(
//                                                               s.checkOut
//                                                           )!,
//                                                           "hh:mm a"
//                                                       )}`
//                                                     : "No Check-out"}
//                                             </div>
//                                         )
//                                     })}
//                                 </div>
//                             </li>
//                         ))}
//                     </ul>
//                 )} */
// }
