import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AttendanceHistory({
    history,
}: {
    history: {
        date: string
        checkIn: string | null
        checkOut: string | null
        status: string
    }[]
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Attendance History</CardTitle>
            </CardHeader>
            <CardContent>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-muted-foreground/20">
                            <th className="py-2 px-3">Date</th>
                            <th className="py-2 px-3">Check-In</th>
                            <th className="py-2 px-3">Check-Out</th>
                            <th className="py-2 px-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map(({ date, checkIn, checkOut, status }) => (
                            <tr
                                key={date}
                                className="border-b last:border-b-0 border-muted-foreground/10"
                            >
                                <td className="py-2 px-3">{date}</td>
                                <td className="py-2 px-3">{checkIn || "-"}</td>
                                <td className="py-2 px-3">{checkOut || "-"}</td>
                                <td className="py-2 px-3">{status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    )
}
