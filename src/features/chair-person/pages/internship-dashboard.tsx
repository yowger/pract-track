import type { RowSelectionState } from "@tanstack/react-table"
import { useState } from "react"
// import { useDebounceValue } from "usehooks-ts"

import { Input } from "@/components/ui/input"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import DataTable from "@/components/data-table"
import { studentColumns } from "@/features/chair-person/components/tables/users/student-columns"
// import {  } from "@/features/chair-person/components/tables/users/assign-agency-drawer"
import type { Student } from "@/types/user"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useUser } from "@/hooks/use-user"
import { usePaginatedStudents } from "@/api/hooks/use-get-paginated-students"
import { useDebounceValue } from "usehooks-ts"

export default function InternshipDashboardPage() {
    const [searchFirstName, setSearchFirstName] = useState("")
    const [searchLastName, setSearchLastName] = useState("")
    const [section, setSection] = useState("")
    const [yearLevel, setYearLevel] = useState("")
    const [status, setStatus] = useState("")
    const [program, setProgram] = useState("")

    const [debouncedFirstName] = useDebounceValue(searchFirstName, 500)
    // const [debouncedLastName] = useDebounceValue(searchLastName, 500)
    // const [debouncedSection] = useDebounceValue(section, 500)
    // const [debouncedYearLevel] = useDebounceValue(yearLevel, 500)
    // const [debouncedStatus] = useDebounceValue(status, 500)
    // const [debouncedProgram] = useDebounceValue(program, 500)

    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
    const [selectedStudents, setSelectedStudents] = useState<Student[]>([])

    const { user } = useUser()

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 15,
    })
    const {
        students,
        loading: isStudentsLoading,
        // error: studentsError,
        totalItems: totalStudents,
        // totalReviewed: totalReviewedStudents,
        pageCount: studentPageCount,
        // refetch: refetchStudents,
        nextPage,
        prevPage,
    } = usePaginatedStudents(
        {
            firstName: debouncedFirstName,
        },
        {
            numPerPage: pagination.pageSize,
            enabled: !!user,
        }
    )

    const handleSelectedRowsChange = (rows: Student[]) => {
        setSelectedStudents((prev) => {
            const newSelected = [...prev]

            rows.forEach((row) => {
                if (!newSelected.find((s) => s.studentID === row.studentID)) {
                    newSelected.push(row)
                }
            })

            const currentPageIds = students.map((d) => d.studentID)
            return newSelected.filter(
                (s) =>
                    !currentPageIds.includes(s.studentID) ||
                    rows.find((r) => r.studentID === s.studentID)
            )
        })
    }

    return (
        <div className="flex flex-col">
            <div className="p-4 grid gap-2 md:grid-cols-3">
                <Input
                    placeholder="Search by first name"
                    value={searchFirstName}
                    onChange={(e) => setSearchFirstName(e.target.value)}
                />
                <Input
                    placeholder="Search by last name"
                    value={searchLastName}
                    onChange={(e) => setSearchLastName(e.target.value)}
                />
                <Input
                    placeholder="Section"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                />
                <Input
                    placeholder="Year Level"
                    value={yearLevel}
                    onChange={(e) => setYearLevel(e.target.value)}
                />
                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                </Select>
                <Input
                    placeholder="Program"
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                />
            </div>

            <div className="px-4 py-2 border-b flex items-center justify-between bg-muted/40">
                <span className="text-sm font-medium text-muted-foreground">
                    {selectedStudents.length} row(s) selected
                </span>

                {/* {selectedStudents.length > 0 && (
                    <AssignAgencyDrawer
                        selectedStudents={selectedStudents}
                        onSuccess={() => {
                            refetchStudents()
                            setSelectedStudents([])
                            setRowSelection({})
                        }}
                    />
                )} */}
            </div>

            <div className="p-4 flex">
                <ScrollArea type="always" className=" w-full overflow-x-auto">
                    <DataTable
                        data={students}
                        columns={studentColumns}
                        pagination={pagination}
                        manualPagination
                        pageCount={studentPageCount || 0}
                        totalItems={totalStudents || 0}
                        isLoading={isStudentsLoading}
                        rowSelection={rowSelection}
                        onRowSelectionChange={setRowSelection}
                        onSelectedRowsChange={handleSelectedRowsChange}
                        getRowId={(row) => row.studentID}
                        onPaginationChange={(updater) => {
                            const newState =
                                typeof updater === "function"
                                    ? updater(pagination)
                                    : updater

                            if (newState.pageIndex > pagination.pageIndex) {
                                nextPage()
                            } else if (
                                newState.pageIndex < pagination.pageIndex
                            ) {
                                prevPage()
                            }

                            setPagination(newState)
                        }}
                    />
                    <ScrollBar orientation="horizontal" className="w-full" />
                </ScrollArea>
            </div>
        </div>
    )
}
