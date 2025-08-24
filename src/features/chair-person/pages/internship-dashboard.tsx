import { useState, useEffect, useRef } from "react"
import { useDebounceValue } from "usehooks-ts"
import type { DocumentSnapshot } from "firebase/firestore"

import { getStudentsPaginated } from "@/api/students"
import type { Student } from "@/types/user"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import DataTable from "@/features/chair-person/components/tables/users/student-data-table"
import { studentColumns } from "@/features/chair-person/components/tables/users/student-columns"

export default function InternshipDashboardPage() {
    const numPerPage = 10
    const [data, setData] = useState<Student[]>([])
    const [firstDoc, setFirstDoc] = useState<DocumentSnapshot | undefined>(
        undefined
    )
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(
        undefined
    )
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

    const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>(
        {}
    )
    const lastPageIndexRef = useRef(0)

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
        let direction: "next" | "prev" | undefined

        if (pagination.pageIndex > lastPageIndexRef.current) {
            direction = "next"
        } else if (pagination.pageIndex < lastPageIndexRef.current) {
            direction = "prev"
        }

        lastPageIndexRef.current = pagination.pageIndex

        const startAfterDoc = direction === "next" ? lastDoc : undefined
        const endBeforeDoc = direction === "prev" ? firstDoc : undefined

        getStudentsPaginated({
            direction,
            startAfterDoc,
            endBeforeDoc,
            numPerPage: pagination.pageSize,
            filter: {
                firstName: debouncedFirstName,
                lastName: debouncedLastName,
                section: debouncedSection,
                yearLevel: debouncedYearLevel,
                status: debouncedStatus,
                program: debouncedProgram,
            },
        }).then((data) => {
            const numPages = Math.ceil(data.totalItems / numPerPage)

            setTotalItems(data.totalItems)
            setPages(numPages)
            setData(data.result)
            setFirstDoc(data.firstDoc)
            setLastDoc(data.lastDoc)
        })
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

    return (
        <div>
            <div className="p-4 grid gap-2 md:grid-cols-3">
                <Input
                    placeholder="Search by first name"
                    value={searchFirstName}
                    onChange={(event) => setSearchFirstName(event.target.value)}
                />
                <Input
                    placeholder="Search by last name"
                    value={searchLastName}
                    onChange={(event) => setSearchLastName(event.target.value)}
                />
                <Input
                    placeholder="Section"
                    value={section}
                    onChange={(event) => setSection(event.target.value)}
                />
                <Input
                    placeholder="Year Level"
                    value={yearLevel}
                    onChange={(event) => setYearLevel(event.target.value)}
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
                    onChange={(event) => setProgram(event.target.value)}
                />
            </div>

            <div className="p-4">
                <DataTable
                    columns={studentColumns}
                    data={data}
                    rowSelection={selectedRows}
                    onRowSelectionChange={setSelectedRows}
                    onSelectedRowsChange={(selected) => {
                        console.log("Selected:", selected)
                    }}
                    pagination={pagination}
                    getRowId={(row) => row.studentID}
                    manualPagination
                    pageCount={pages || 0}
                    totalItems={totalItems || 0}
                    onPaginationChange={setPagination}
                />
            </div>
        </div>
    )
}
