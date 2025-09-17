import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
    AlertCircle,
    DownloadIcon,
    FileText,
    type Download,
} from "lucide-react"
import { Calendar } from "@/components/ui/calendar"

export default function StudentProfile() {
    return (
        <div className="flex flex-col p-4 gap-4">
            <div className="flex flex-col md:flex-row  md:justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Student Profile
                    </h1>
                    <p className="text-muted-foreground">
                        View details, progress, and evaluations
                    </p>
                </div>
            </div>

            <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid grid-cols-4 w-full max-w-lg">
                    <TabsTrigger value="info">Info</TabsTrigger>
                    <TabsTrigger value="progress">Progress</TabsTrigger>
                    <TabsTrigger value="evaluations">Evaluations</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="mt-4">
                    <div className="grid grid-cols-12 gap-5">
                        {/* Left (main area) */}
                        <div className="col-span-12 lg:col-span-8 space-y-5">
                            {/* Profile Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Profile</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <Info
                                        label="Full Name"
                                        value="Juan Dela Cruz"
                                    />
                                    <Info
                                        label="Student Number"
                                        value="2021-00001"
                                    />
                                    <Info
                                        label="Email"
                                        value="juan@example.com"
                                    />
                                    <Info
                                        label="Phone Number"
                                        value="+63 912 345 6789"
                                    />
                                    <Info
                                        label="Program"
                                        value="BS Computer Science"
                                    />
                                </CardContent>
                            </Card>

                            {/* Agency Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Agency</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <Info
                                        label="Agency Name"
                                        value="Department of Agriculture"
                                    />
                                    <Info
                                        label="Supervisor"
                                        value="Engr. Ramon Cruz"
                                    />
                                    <Info
                                        label="Location"
                                        value="Quezon City, Philippines"
                                    />
                                    <Info
                                        label="Contact"
                                        value="+63 987 654 3210"
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Adviser</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <Info
                                        label="Adviser"
                                        value="Dr. Maria Santos"
                                    />
                                    <Info
                                        label="Email"
                                        value="m.santos@univ.edu.ph"
                                    />
                                    <Info
                                        label="Phone"
                                        value="+63 923 111 2233"
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        <div className="col-span-12 lg:col-span-4 space-y-5">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Documents</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-0">
                                    {[
                                        {
                                            name: "Internship Report.pdf",
                                            date: "2 days ago",
                                        },
                                        {
                                            name: "Clearance Form.docx",
                                            date: "1 week ago",
                                        },
                                        {
                                            name: "Evaluation Sheet.pdf",
                                            date: "3 weeks ago",
                                        },
                                    ].map((doc, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center rounded justify-between py-3"
                                        >
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm font-medium truncate">
                                                        {doc.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {doc.date}
                                                    </p>
                                                </div>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-muted-foreground cursor-pointer"
                                            >
                                                <DownloadIcon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Complaints</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-0">
                                    {[
                                        {
                                            title: "Issue with attendance system",
                                            date: "1 week ago",
                                        },
                                        {
                                            title: "Unclear grading criteria",
                                            date: "3 weeks ago",
                                        },
                                    ].map((complaint, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center rounded justify-between py-3"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div>
                                                    <p className="text-sm font-medium truncate">
                                                        {complaint.title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {complaint.date}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="pt-2 flex justify-center">
                                        <a
                                            href="#"
                                            className="text-sm text-muted-foreground hover:underline"
                                        >
                                            See all
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* <Card>
                                <CardHeader>
                                    <CardTitle>Attendance</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Calendar
                                        mode="single"
                                        selected={new Date()}
                                        modifiers={{
                                            present: [
                                                new Date(2025, 8, 1),
                                                new Date(2025, 8, 2),
                                                new Date(2025, 8, 5),
                                            ],
                                            absent: [
                                                new Date(2025, 8, 3),
                                                new Date(2025, 8, 4),
                                            ],
                                        }}
                                        modifiersClassNames={{
                                            present:
                                                "bg-green-100 text-green-700 rounded-md",
                                            absent: "bg-red-100 text-red-700 rounded-md",
                                        }}
                                    />
                                </CardContent>
                            </Card> */}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="progress" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Progress / Attendance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Show clock-ins, hours, and completion % here
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="evaluations" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Evaluations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Adviser/agency reviews will be listed here
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="documents" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Documents</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Uploaded files and forms go here
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

function Info({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <Label className="text-sm text-muted-foreground">{label}</Label>
            <p className="font-medium text-sm">{value}</p>
        </div>
    )
}
