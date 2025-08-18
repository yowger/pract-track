import { useState, useEffect } from "react"
import type { DocumentSnapshot } from "firebase/firestore"
import type { Student } from "@/types/user"
import { getStudentsPaginated } from "@/api/students"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import { useDebounceValue } from "usehooks-ts"
import DataTable from "@/components/data-table"
import { studentColumns } from "../components/tables/users/columns"

export default function InternshipDashboardPage() {
    const numPerPage = 10
    const [data, setData] = useState<Student[]>([])
    const [firstDoc, setFirstDoc] = useState<DocumentSnapshot | undefined>(
        undefined
    )
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(
        undefined
    )
    const [pages, setPages] = useState<number | null>(null)
    const [page, setPage] = useState<number>(1)
    const [direction, setDirection] = useState<"prev" | "next" | undefined>(
        undefined
    )

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

    useEffect(() => {
        setPage(1)
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
        const startAfterDoc = direction === "next" ? lastDoc : undefined
        const endBeforeDoc = direction === "prev" ? firstDoc : undefined

        getStudentsPaginated({
            direction,
            startAfterDoc,
            endBeforeDoc,
            numPerPage,
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

            setPages(numPages)
            setData(data.result)
            setFirstDoc(data.firstDoc)
            setLastDoc(data.lastDoc)
        })
    }, [
        page,
        debouncedFirstName,
        debouncedLastName,
        debouncedSection,
        debouncedYearLevel,
        debouncedStatus,
        debouncedProgram,
    ])

    const handlePreviousClick = () => {
        if (page === 1) return
        setDirection("prev")
        setPage((prev) => prev - 1)
    }

    const handleNextClick = () => {
        if (page === pages) return
        setDirection("next")
        setPage((prev) => prev + 1)
    }

    return (
        <div>
            {/* Filters */}
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
                {data.length === 0 ? (
                    <p>No users found.</p>
                ) : (
                    <DataTable columns={studentColumns} data={data} />
                )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-start space-x-2 p-4">
                <Button
                    className="btn btn-outline"
                    disabled={page === 1}
                    onClick={handlePreviousClick}
                >
                    Previous
                </Button>

                <span>
                    Page {page} of {pages}
                </span>

                <Button
                    className="btn btn-outline"
                    disabled={page === pages}
                    onClick={handleNextClick}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
