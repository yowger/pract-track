import { DownloadIcon, FileText } from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"

import { useStudent } from "@/api/hooks/use-get-student"
import { useAgency } from "@/api/hooks/use-get-agency"
import { useGetViolations } from "@/api/hooks/use-get-real-violations"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { violationTypeMap } from "@/data/violationts"
import { StudentInfo } from "../components/student-info"
import { AgencyInfo } from "../components/tables/agency-info"

interface StudentProfileProps {
    studentId: string
}

function formatViolationDate(date: Date) {
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24)

    if (diffInDays < 7) {
        return formatDistanceToNow(date, { addSuffix: true })
    }

    return format(date, "M/d/yy")
}

export default function StudentProfile({ studentId }: StudentProfileProps) {
    const { data: student, loading: studentLoading } = useStudent({
        uid: studentId,
    })
    const { data: agency, loading: agencyLoading } = useAgency(
        {
            ownerId: student?.assignedAgencyID || "",
        },
        {
            enabled: Boolean(student?.assignedAgencyID),
        }
    )
    const adviser = undefined
    const { data: violations, loading: violationsLoading } = useGetViolations({
        studentId,
        limitCount: 3,
    })

    if (!studentLoading && !student) {
        return (
            <div className="flex flex-col p-4 items-center justify-center text-center gap-2">
                <h1 className="text-xl font-semibold">Student not found</h1>
                <p className="text-muted-foreground text-sm">
                    We couldn’t find a student with this ID.
                </p>
            </div>
        )
    }

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
                        <div className="col-span-12 lg:col-span-8 space-y-5">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Profile</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <StudentInfo
                                        isLoading={studentLoading}
                                        fullName={student?.displayName || ""}
                                        studentNumber={student?.studentID || ""}
                                        email={student?.email || ""}
                                        phoneNumber={"-"}
                                        program={
                                            student?.program.toUpperCase() || ""
                                        }
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Agency</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {agency ? (
                                        <AgencyInfo
                                            isLoading={
                                                agencyLoading || studentLoading
                                            }
                                            agencyName={agency.name}
                                            supervisor={agency.ownerName ?? "-"}
                                            location={agency.address ?? "-"}
                                            contact={"-"}
                                        />
                                    ) : (
                                        <p className="text-muted-foreground text-sm">
                                            No agency assigned
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Adviser</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {adviser ? (
                                        <div>Adviser</div>
                                    ) : (
                                        // <AgencyInfo
                                        //     agencyName={
                                        //         adviser.department ?? "-"
                                        //     }
                                        //     supervisor={adviser.name}
                                        //     location={adviser.location ?? "-"}
                                        //     contact={adviser.contact ?? "-"}
                                        // />
                                        <p className="text-muted-foreground text-sm">
                                            No adviser assigned
                                        </p>
                                    )}
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
                                    {violationsLoading && (
                                        <p className="text-sm text-muted-foreground">
                                            Loading...
                                        </p>
                                    )}

                                    {!violationsLoading &&
                                        violations?.length === 0 && (
                                            <p className="text-sm text-muted-foreground">
                                                No complaints
                                            </p>
                                        )}

                                    {!violationsLoading &&
                                        violations
                                            ?.slice(0, 3)
                                            .map((violation) => (
                                                <div
                                                    key={violation.id}
                                                    className="flex items-center rounded justify-between py-3"
                                                >
                                                    <div>
                                                        <p className="text-sm font-medium truncate">
                                                            {violationTypeMap[
                                                                violation
                                                                    .violationType
                                                            ] ||
                                                                violation.violationType}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {violation.createdAt instanceof
                                                            Date
                                                                ? formatViolationDate(
                                                                      violation.createdAt
                                                                  )
                                                                : ""}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}

                                    {violations && (
                                        <div className="pt-2 flex justify-center">
                                            <a
                                                href="#"
                                                className="text-sm text-muted-foreground hover:underline"
                                            >
                                                See all
                                            </a>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
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

{
    /* <Card>
    <CardContent>
        <Calendar
            mode="single"
            selected={new Date()}
            modifiers={{
                present: [
                    new Date(2025, 8, 1),
                    new Date(2025, 8, 2),
                    new Date(2025, 8, 5),
                    new Date(2025, 8, 17),
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
</Card> */
}
