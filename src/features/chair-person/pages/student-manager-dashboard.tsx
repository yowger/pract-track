import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function StudentManagerDashboardPage() {
    const students = [
        { id: "1", name: "John Doe", course: "BSIT", status: "Active" },
        { id: "2", name: "Jane Smith", course: "BSEd", status: "Pending" },
    ]

    return (
        <div className="space-y-6 p-6">
            {/* Dashboard cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">120</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Active</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">95</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Pending Agency</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">25</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Absent Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">8</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters / Search */}
            <div className="flex items-center justify-between">
                <Input placeholder="Search students..." className="max-w-sm" />
                <Button>Add Student</Button>
            </div>

            {/* Student Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Student List</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Course</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.map((s) => (
                                <TableRow key={s.id}>
                                    <TableCell>{s.name}</TableCell>
                                    <TableCell>{s.course}</TableCell>
                                    <TableCell>{s.status}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button size="sm" variant="outline">
                                            View
                                        </Button>
                                        <Button size="sm">Assign</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
