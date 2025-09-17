import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { usePaginatedStudents } from "@/api/hooks/use-get-paginated-students"
import { useReportViolation } from "@/api/hooks/use-create-violation"
import DataTable from "@/components/data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { assignedStudentColumns } from "../components/table/assigned-student-column"
import { useUser } from "@/hooks/use-user"
import { ReportViolationModal } from "@/components/report-violation-modal"
import { isAgency } from "../../../types/user"

// import StudentEvaluationSheet from "../components/student-evaluation-sheet"
// import { useEvaluation } from "@/api/hooks/use-get-evaluation"

export default function AgencyAssignedSchedules() {
    const navigate = useNavigate()
    const { user } = useUser()
    console.log("🚀 ~ AgencyAssignedSchedules ~ user:", user)
    const isAgencyUser = !!(user && isAgency(user))

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 15,
    })
    const {
        students,
        loading: isStudentsLoading,
        error: studentsError,
        totalItems: totalStudents,
        totalReviewed: totalReviewedStudents,
        pageCount: studentPageCount,
        refetch: refetchStudents,
    } = usePaginatedStudents(
        { assignedAgencyId: isAgencyUser ? user.uid : undefined },
        { numPerPage: pagination.pageSize, enabled: isAgencyUser }
    )

    const [openViolationForm, setOpenViolationForm] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<{
        id: string
        name: string
    } | null>(null)

    const { loading: reportLoading, mutate: reportViolation } =
        useReportViolation()

    // const [evaluationSheet, setEvaluationSheet] = useState<{
    //     visible: boolean
    //     evaluationId: string | null
    // }>({ visible: false, evaluationId: null })

    // const { data: evaluation } = useEvaluation(
    //     { uid: evaluationSheet.evaluationId || "" },
    //     {
    //         enabled: evaluationSheet.visible && !!evaluationSheet.evaluationId,
    //     }
    // )

    // console.log("🚀 ~ AgencyAssignedSchedules ~ evaluation:", evaluation)

    // const openEvaluation = (evaluationId: string) => {
    //     setEvaluationSheet({ visible: true, evaluationId: evaluationId })
    // }

    // const closeEvaluation = () => {
    //     setEvaluationSheet({ visible: false, evaluationId: null })
    // }

    return (
        <div className="flex flex-col p-4 gap-4">
            <div className="flex flex-col md:flex-row  md:justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Assigned Students
                    </h1>
                    <p className="text-muted-foreground">
                        View assigned students, track their details, and provide
                        feedback on their performance
                    </p>
                </div>
            </div>

            <div className="grid auto-rows-auto grid-cols-12 gap-5">
                <div className="col-span-12 md:col-span-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Assigned</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">
                                {totalStudents}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-span-12 md:col-span-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Reviewed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">
                                {totalReviewedStudents}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-span-12 lg:col-span-12">
                    {studentsError ? (
                        <div>
                            <p>{studentsError}</p>
                        </div>
                    ) : (
                        <ScrollArea
                            type="always"
                            className=" w-full overflow-x-auto"
                        >
                            <DataTable
                                columns={assignedStudentColumns({
                                    agencyId: isAgencyUser
                                        ? user.companyData?.id
                                        : undefined,
                                    onSeeEvaluation(evaluationId) {
                                        if (!evaluationId) {
                                            toast.error(
                                                "No evaluation found for this student."
                                            )

                                            return
                                        }

                                        // openEvaluation(evaluationId)
                                    },
                                    onCreateEvaluation(studentId) {
                                        navigate(`${studentId}/review`)
                                    },
                                    onStudentNameClick(studentId) {
                                        navigate(`${studentId}`)
                                    },
                                    onReportViolation(studentId, studentName) {
                                        setSelectedStudent({
                                            id: studentId,
                                            name: studentName,
                                        })
                                        setOpenViolationForm(true)
                                    },
                                })}
                                data={students}
                                pagination={pagination}
                                manualPagination
                                pageCount={studentPageCount || 0}
                                totalItems={totalStudents || 0}
                                onPaginationChange={setPagination}
                                isLoading={isStudentsLoading}
                            />
                            <ScrollBar
                                orientation="horizontal"
                                className="w-full"
                            />
                        </ScrollArea>
                    )}
                </div>
            </div>

            {/* <StudentEvaluationSheet
                evaluation={
                    evaluationSheet.evaluationId && evaluation
                        ? evaluation
                        : null
                }
                open={evaluationSheet.visible}
                onClose={closeEvaluation}
            /> */}

            <ReportViolationModal
                open={openViolationForm}
                onOpenChange={setOpenViolationForm}
                studentId={selectedStudent?.id || ""}
                studentName={selectedStudent?.name || ""}
                onSubmit={async (values) => {
                    if (
                        !user ||
                        reportLoading ||
                        !isAgencyUser ||
                        !user.companyData?.id
                    )
                        return

                    try {
                        const violationData = {
                            studentId: values.studentId,
                            name: values.name,
                            violationType: values.violationType,
                            remarks: values.remarks || "",
                            agencyId: user.companyData?.id || "",
                            agencyName: user.companyData?.name || "",
                            reportedBy: {
                                id: user.uid,
                                name: user.displayName || "",
                            },
                        }

                        await reportViolation(violationData)
                        await refetchStudents()

                        setSelectedStudent(null)
                        setOpenViolationForm(false)

                        toast.success(`Violation reported for ${values.name}`)
                    } catch (err) {
                        const message =
                            err instanceof Error
                                ? err.message
                                : "Failed to report violation"
                        toast.error(message)
                    }
                }}
            />
        </div>
    )
}

// Todo: come back after creating student page
