import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AttendanceRecord {
    date: Date
    morningIn?: Date
    morningOut?: Date
    afternoonIn?: Date
    afternoonOut?: Date
}

interface AttendanceHistoryProps {
    records: AttendanceRecord[]
}

export function AttendanceHistory({ records }: AttendanceHistoryProps) {
    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
                    Attendance History
                </CardTitle>
            </CardHeader>

            <CardContent>
                <table className="w-full text-sm text-muted-foreground border-collapse">
                    <thead>
                        <tr>
                            <th className="text-left py-1 pr-4">Date</th>
                            <th className="text-left py-1 pr-4">Morning In</th>
                            <th className="text-left py-1 pr-4">Morning Out</th>
                            <th className="text-left py-1 pr-4">
                                Afternoon In
                            </th>
                            <th className="text-left py-1 pr-4">
                                Afternoon Out
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record) => (
                            <tr key={record.date.toISOString()}>
                                <td className="py-1 pr-4">
                                    {format(record.date, "MMM d, yyyy")}
                                </td>
                                <td className="py-1 pr-4">
                                    {record.morningIn
                                        ? format(record.morningIn, "hh:mm a")
                                        : "-"}
                                </td>
                                <td className="py-1 pr-4">
                                    {record.morningOut
                                        ? format(record.morningOut, "hh:mm a")
                                        : "-"}
                                </td>
                                <td className="py-1 pr-4">
                                    {record.afternoonIn
                                        ? format(record.afternoonIn, "hh:mm a")
                                        : "-"}
                                </td>
                                <td className="py-1 pr-4">
                                    {record.afternoonOut
                                        ? format(record.afternoonOut, "hh:mm a")
                                        : "-"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    )
}
