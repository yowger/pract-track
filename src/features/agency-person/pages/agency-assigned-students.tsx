import { useState } from "react"

import { usePaginatedStudents } from "@/api/hooks/use-get-paginated-students"
import DataTable from "@/components/data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { assignedStudentColumns } from "../components/table/assigned-student-column"
import { useUser } from "@/hooks/use-user"
import { isAgency } from "../../../types/user"

export default function AgencyAssignedSchedules() {
    const { user } = useUser()
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
    } = usePaginatedStudents(
        { assignedAgencyId: isAgencyUser ? user.uid : undefined },
        { numPerPage: pagination.pageSize, enabled: isAgencyUser }
    )

    return (
        <div className="flex flex-col p-4 gap-4">
            <div className="flex flex-col md:flex-row  md:justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Assigned Students
                    </h1>
                    <p className="text-muted-foreground">
                        List of students assigned to your agency
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
                                columns={assignedStudentColumns}
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
        </div>
    )
}
