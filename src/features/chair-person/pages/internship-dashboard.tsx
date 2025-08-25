import type { RowSelectionState } from "@tanstack/react-table"
import type { DocumentSnapshot } from "firebase/firestore"
import { useState, useEffect, useRef } from "react"
import { useDebounceValue } from "usehooks-ts"

import { getStudentsPaginated } from "@/api/students"
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
import AssignAgencyDrawer from "@/features/chair-person/components/tables/users/assign-agency-drawer"
import type { Student } from "@/types/user"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export default function InternshipDashboardPage() {
    const numPerPage = 10
    const [data, setData] = useState<Student[]>([])
    const [firstDoc, setFirstDoc] = useState<DocumentSnapshot | undefined>()
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>()
    const [totalItems, setTotalItems] = useState<number | null>(null)
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: numPerPage,
    })
    const [pages, setPages] = useState<number>(0)

    const [searchFirstName, setSearchFirstName] = useState("")
    const [searchLastName, setSearchLastName] = useState("")
    const [section, setSection] = useState("")
    const [yearLevel, setYearLevel] = useState("")
    const [status, setStatus] = useState("")
    const [program, setProgram] = useState("")

    const [debouncedFirstName] = useDebounceValue(searchFirstName, 500)
    const [debouncedLastName] = useDebounceValue(searchLastName, 500)
    const [debouncedSection] = useDebounceValue(section, 500)
    const [debouncedYearLevel] = useDebounceValue(yearLevel, 500)
    const [debouncedStatus] = useDebounceValue(status, 500)
    const [debouncedProgram] = useDebounceValue(program, 500)

    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
    const [selectedStudents, setSelectedStudents] = useState<Student[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const lastPageIndexRef = useRef(0)

    async function loadStudents(direction?: "next" | "prev") {
        setIsLoading(true)
        try {
            const data = await getStudentsPaginated({
                direction,
                startAfterDoc: direction === "next" ? lastDoc : undefined,
                endBeforeDoc: direction === "prev" ? firstDoc : undefined,
                numPerPage: pagination.pageSize,
                filter: {
                    firstName: debouncedFirstName,
                    lastName: debouncedLastName,
                    section: debouncedSection,
                    yearLevel: debouncedYearLevel,
                    status: debouncedStatus,
                    program: debouncedProgram,
                },
            })

            setTotalItems(data.totalItems)
            setPages(Math.ceil(data.totalItems / numPerPage))
            setData(data.result)
            setFirstDoc(data.firstDoc)
            setLastDoc(data.lastDoc)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        setPagination({ pageIndex: 0, pageSize: numPerPage })
        setFirstDoc(undefined)
        setLastDoc(undefined)
    }, [
        debouncedFirstName,
        debouncedLastName,
        debouncedSection,
        debouncedYearLevel,
        debouncedStatus,
        debouncedProgram,
    ])

    useEffect(() => {
        const direction =
            pagination.pageIndex > lastPageIndexRef.current
                ? "next"
                : pagination.pageIndex < lastPageIndexRef.current
                ? "prev"
                : undefined

        lastPageIndexRef.current = pagination.pageIndex
        loadStudents(direction)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        pagination,
        debouncedFirstName,
        debouncedLastName,
        debouncedSection,
        debouncedYearLevel,
        debouncedStatus,
        debouncedProgram,
    ])

    const handleSelectedRowsChange = (rows: Student[]) => {
        setSelectedStudents((prev) => {
            const newSelected = [...prev]

            rows.forEach((row) => {
                if (!newSelected.find((s) => s.studentID === row.studentID)) {
                    newSelected.push(row)
                }
            })

            const currentPageIds = data.map((d) => d.studentID)
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

                {selectedStudents.length > 0 && (
                    <AssignAgencyDrawer
                        selectedStudents={selectedStudents}
                        onSuccess={() => {
                            loadStudents()
                            setSelectedStudents([])
                            setRowSelection({})
                        }}
                    />
                )}
            </div>

            <div className="p-4 flex">
                <ScrollArea type="always" className=" w-full overflow-x-auto">
                    <DataTable
                        columns={studentColumns}
                        data={data}
                        rowSelection={rowSelection}
                        onRowSelectionChange={setRowSelection}
                        onSelectedRowsChange={handleSelectedRowsChange}
                        pagination={pagination}
                        getRowId={(row) => row.studentID}
                        manualPagination
                        pageCount={pages || 0}
                        totalItems={totalItems || 0}
                        onPaginationChange={setPagination}
                        isLoading={isLoading}
                    />
                    <ScrollBar orientation="horizontal" className="w-full" />
                </ScrollArea>
            </div>
        </div>
    )
}
