import { useEffect, useState } from "react"
import type { RowSelectionState } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import DataTable from "@/components/data-table"

import { studentColumns } from "@/features/chair-person/components/tables/users/student-columns"
import { AssignAgencyModal } from "../components/assign-agency-modal"
import type { Student } from "@/types/user"
import { useUser } from "@/hooks/use-user"
import { usePaginatedStudents } from "@/api/hooks/use-get-paginated-students"
import { useDebounceValue } from "usehooks-ts"
import { useSearchAgencies } from "@/api/hooks/use-search-agencies"
import { useAssignStudentsToAgency } from "@/api/hooks/use-create-students-to-agency"
import { toast } from "sonner"
import { useStudentStats } from "@/api/hooks/use-student-stats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePracticumAdvisers } from "@/api/hooks/use-get-practicum-advisers"
import { AssignAdviserModal } from "../components/assign-adviser-modal"
import { useAssignStudentsToAdviser } from "@/api/hooks/use-create-students-to-advisers"

export default function StudentManagerDashboard() {
    const { user } = useUser()

    const [searchTerm, setSearchTerm] = useState("")
    const [debouncedSearchTerm] = useDebounceValue(searchTerm, 500)
    const [searchName, setSearchName] = useState("")
    const [debouncedSearchName] = useDebounceValue(searchName, 500)
    const [searchFields, setSearchFields] = useState({
        firstName: "",
        lastName: "",
    })

    const [filterNoAdviser, setFilterNoAdviser] = useState(false)
    const [filterNoAgency, setFilterNoAgency] = useState(false)

    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
    const [selectedStudents, setSelectedStudents] = useState<Student[]>([])

    const [modalOpen, setModalOpen] = useState(false)
    const [checkedIds, setCheckedIds] = useState<string[]>([])
    const [selectedAgencyId, setSelectedAgencyId] = useState<string | null>(
        null
    )

    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 })

    useEffect(() => {
        if (!debouncedSearchName) {
            setSearchFields({ firstName: "", lastName: "" })
            return
        }
        const query = debouncedSearchName.trim().toLowerCase()
        const [first, last] = query.split(" ")
        setSearchFields({ firstName: first, lastName: last ?? "" })
    }, [debouncedSearchName])

    const {
        students,
        loading: isStudentsLoading,
        totalItems: totalStudents,
        pageCount: studentPageCount,
        refetch: refetchStudents,
        nextPage,
        prevPage,
    } = usePaginatedStudents(
        {
            firstName: searchFields.firstName,
            lastName: searchFields.lastName,
            hasNoAdviser: filterNoAdviser,
            hasNoAgency: filterNoAgency,
        },
        { numPerPage: pagination.pageSize, enabled: !!user }
    )

    const handleSelectedRowsChange = (rows: Student[]) => {
        setSelectedStudents((prev) => {
            const newSelected = [...prev]
            rows.forEach((row) => {
                if (!newSelected.find((s) => s.studentID === row.studentID))
                    newSelected.push(row)
            })
            const currentPageIds = students.map((d) => d.studentID)
            return newSelected.filter(
                (s) =>
                    !currentPageIds.includes(s.studentID) ||
                    rows.find((r) => r.studentID === s.studentID)
            )
        })
    }

    const handleOpenModal = () => {
        setCheckedIds(selectedStudents.map((s) => s.uid))
        setModalOpen(true)
    }

    const { data: agencies } = useSearchAgencies(debouncedSearchTerm, {
        limitCount: 10,
    })
    const { loading: isAssignLoading, mutate: assignStudents } =
        useAssignStudentsToAgency()

    const {
        assignedAdviserCount,
        assignedAgencyCount,
        totalStudents: studentCount,
        refetch: refetchStats,
    } = useStudentStats({ enabled: !!user })

    const [adviserModalOpen, setAdviserModalOpen] = useState(false)
    const [selectedAdviserId, setSelectedAdviserId] = useState<string | null>(
        null
    )

    const handleOpenAdviserModal = () => {
        setCheckedIds(selectedStudents.map((s) => s.uid))
        setAdviserModalOpen(true)
    }

    const { data: advisers } = usePracticumAdvisers()
    const { mutate: assignStudentsToAdviser, loading: isAssignAdviserLoading } =
        useAssignStudentsToAdviser()

    return (
        <>
            <div className="flex flex-col p-4 gap-4">
                <div className="flex flex-col md:flex-row md:justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">
                            Manage Students
                        </h1>
                        <p className="text-muted-foreground">
                            View and manage students.
                        </p>
                    </div>
                </div>

                <div className="grid auto-rows-auto grid-cols-12 gap-5">
                    <div className="col-span-12">
                        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Total Students</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <span className="text-2xl font-bold">
                                        {studentCount}
                                    </span>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Students with Agencies
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <span className="text-2xl font-bold">
                                        {assignedAgencyCount}
                                    </span>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Total with Advisers</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <span className="text-2xl font-bold">
                                        {assignedAdviserCount}
                                    </span>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="col-span-12 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <div className="w-full max-w-xs flex gap-2">
                                <Input
                                    placeholder="Search by name"
                                    value={searchName}
                                    onChange={(e) =>
                                        setSearchName(e.target.value)
                                    }
                                />

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon">
                                            <Filter className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="start"
                                        className="w-48"
                                    >
                                        <DropdownMenuCheckboxItem
                                            checked={filterNoAdviser}
                                            onCheckedChange={setFilterNoAdviser}
                                        >
                                            Unassigned Adviser
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem
                                            checked={filterNoAgency}
                                            onCheckedChange={setFilterNoAgency}
                                        >
                                            Unassigned Agency
                                        </DropdownMenuCheckboxItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {rowSelection &&
                                Object.keys(rowSelection).length > 0 && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button>Actions</Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem
                                                onSelect={handleOpenModal}
                                            >
                                                Assign Agency
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onSelect={
                                                    handleOpenAdviserModal
                                                }
                                            >
                                                Assign Adviser
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                        </div>

                        <ScrollArea
                            type="always"
                            className="w-full overflow-x-auto"
                        >
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
                                    if (
                                        newState.pageIndex >
                                        pagination.pageIndex
                                    )
                                        nextPage()
                                    else if (
                                        newState.pageIndex <
                                        pagination.pageIndex
                                    )
                                        prevPage()
                                    setPagination(newState)
                                }}
                            />
                            <ScrollBar
                                orientation="horizontal"
                                className="w-full"
                            />
                        </ScrollArea>
                    </div>
                </div>
            </div>

            <AssignAgencyModal
                open={modalOpen}
                setOpen={setModalOpen}
                selectedIds={checkedIds}
                agencies={agencies || []}
                selectedAgencyId={selectedAgencyId}
                onAgencyChange={setSelectedAgencyId}
                onSearch={setSearchTerm}
                onCancel={() => setModalOpen(false)}
                loading={isAssignLoading}
                onSubmit={async () => {
                    if (!selectedAgencyId) return

                    await assignStudents({
                        studentIds: checkedIds,
                        newAgencyId: selectedAgencyId,
                        newAgencyName:
                            agencies?.find((a) => a.id === selectedAgencyId)
                                ?.name || "",
                    })
                        .then(() => {
                            refetchStudents()
                            refetchStats()
                            setCheckedIds([])
                            setSelectedStudents([])
                            setModalOpen(false)
                            setRowSelection({})
                            toast.success("Successfully assigned students")
                        })
                        .catch(() => {
                            toast.error("Failed to assign students to agency")
                            setModalOpen(false)
                        })
                }}
            />

            <AssignAdviserModal
                open={adviserModalOpen}
                setOpen={setAdviserModalOpen}
                selectedIds={checkedIds}
                advisers={advisers || []}
                selectedAdviserId={selectedAdviserId}
                onAdviserChange={setSelectedAdviserId}
                onSearch={() => {}} // TODO
                onCancel={() => setAdviserModalOpen(false)}
                loading={isAssignAdviserLoading}
                onSubmit={async () => {
                    if (!selectedAdviserId) return

                    await assignStudentsToAdviser({
                        studentIds: checkedIds,
                        newAdviserId: selectedAdviserId,
                        newAdviserName:
                            advisers?.find((a) => a.uid === selectedAdviserId)
                                ?.displayName || "",
                    })
                        .then(() => {
                            refetchStudents()
                            refetchStats()
                            setCheckedIds([])
                            setSelectedStudents([])
                            setAdviserModalOpen(false)
                            setRowSelection({})
                            toast.success(
                                "Successfully assigned students to adviser"
                            )
                        })
                        .catch(() => {
                            toast.error("Failed to assign students to adviser")
                            setAdviserModalOpen(false)
                        })
                }}
            />
        </>
    )
}
