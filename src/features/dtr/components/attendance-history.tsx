import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import DataTableColumnsVisibilityDemo from "./table-test"

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

export default function AttendanceHistory({ records }: AttendanceHistoryProps) {
    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
                    Attendance History
                </CardTitle>
            </CardHeader>

            <CardContent>
                <DataTableColumnsVisibilityDemo />
                {/* <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-left">Date</TableHead>
                            <TableHead className="text-left">
                                Morning In
                            </TableHead>
                            <TableHead className="text-left">
                                Morning Out
                            </TableHead>
                            <TableHead className="text-left">
                                Afternoon In
                            </TableHead>
                            <TableHead className="text-left">
                                Afternoon Out
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {records.map((record) => (
                            <TableRow key={record.date.toISOString()}>
                                <TableCell>
                                    {format(record.date, "MMM d, yyyy")}
                                </TableCell>
                                <TableCell>
                                    {record.morningIn
                                        ? format(record.morningIn, "hh:mm a")
                                        : "-"}
                                </TableCell>
                                <TableCell>
                                    {record.morningOut
                                        ? format(record.morningOut, "hh:mm a")
                                        : "-"}
                                </TableCell>
                                <TableCell>
                                    {record.afternoonIn
                                        ? format(record.afternoonIn, "hh:mm a")
                                        : "-"}
                                </TableCell>
                                <TableCell>
                                    {record.afternoonOut
                                        ? format(record.afternoonOut, "hh:mm a")
                                        : "-"}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table> */}
            </CardContent>
        </Card>
    )
}
