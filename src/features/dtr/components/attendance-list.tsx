import { format } from "date-fns"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { firebaseTimestampToDate } from "@/lib/date-utils"
import type { Attendance } from "@/types/attendance"

interface AttendanceListProps {
    attendances: Attendance[]
}

export function AttendanceList({ attendances }: AttendanceListProps) {
    return (
        <Card className="col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-4">
            <CardHeader>
                <CardTitle>Todays Summary</CardTitle>
            </CardHeader>
            <CardContent>
                {attendances.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No attendance records found.
                    </p>
                ) : (
                    <ul className="space-y-3">
                        {attendances.map((record) => (
                            <li
                                key={record.id}
                                className="flex flex-col border-b pb-2 last:border-b-0 last:pb-0"
                            >
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <span>{record.scheduleName}</span>
                                    <span
                                        className={`px-2 py-0.5 rounded text-xs ${
                                            record.overallStatus === "present"
                                                ? "bg-emerald-100 text-emerald-800"
                                                : record.overallStatus ===
                                                  "absent"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-yellow-100 text-yellow-800"
                                        }`}
                                    >
                                        {record.overallStatus}
                                    </span>
                                </div>

                                <div className="text-xs text-muted-foreground">
                                    {record.sessions.map((s, i) => {
                                        return (
                                            <div key={i}>
                                                {s.checkIn
                                                    ? `In: ${format(
                                                          firebaseTimestampToDate(
                                                              s.checkIn
                                                          )!,
                                                          "hh:mm a"
                                                      )}`
                                                    : "No Check-in"}{" "}
                                                –{" "}
                                                {s.checkOut
                                                    ? `Out: ${format(
                                                          firebaseTimestampToDate(
                                                              s.checkOut
                                                          )!,
                                                          "hh:mm a"
                                                      )}`
                                                    : "No Check-out"}
                                            </div>
                                        )
                                    })}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    )
}
