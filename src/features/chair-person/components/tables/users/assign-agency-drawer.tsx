import { useState, useEffect } from "react"

import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import type { Student } from "@/types/user"
import DataTable from "@/components/data-table"
import { studentColumns } from "@/features/chair-person/components/tables/users/student-columns"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    assignStudentsToAgency,
    fetchAgencies,
    type Agency,
} from "@/api/agency"
import { toast } from "sonner"

interface AssignAgencySheetProps {
    selectedStudents: Student[]
    onSuccess?: () => void
    onError?: (err: unknown) => void
}

export default function AssignAgencySheet({
    selectedStudents,
    onSuccess,
    onError,
}: AssignAgencySheetProps) {
    const [localSelected, setLocalSelected] = useState<Student[]>([])
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>(
        {}
    )
    const [selectedAgent, setSelectedAgent] = useState<string | undefined>()
    const [agencies, setAgencies] = useState<Agency[]>([])

    useEffect(() => {
        setLocalSelected(selectedStudents)
        setRowSelection(
            Object.fromEntries(selectedStudents.map((s) => [s.uid, true]))
        )
    }, [selectedStudents])

    useEffect(() => {
        setLocalSelected(selectedStudents.filter((s) => rowSelection[s.uid]))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowSelection])

    useEffect(() => {
        const load = async () => {
            const data = await fetchAgencies()
            setAgencies(data)
        }

        load()
    }, [])

    async function handleConfirm() {
        if (!selectedAgent) return

        const agency = agencies.find((a) => a.id === selectedAgent)
        if (!agency) return

        try {
            await assignStudentsToAgency(
                localSelected.map((s) => s.uid),
                agency.id,
                agency.name
            )
            toast.success("Students assigned successfully")
            onSuccess?.()
        } catch (err) {
            console.error(err)
            toast.error("Failed to assign students")
            onError?.(err)
        }
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    size="sm"
                    className="bg-primary text-white hover:bg-primary/90"
                >
                    Assign to Agency
                </Button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="w-[400px] sm:w-[540px] md:max-w-lg max-h-screen overflow-y-scroll"
            >
                <SheetHeader>
                    <SheetTitle>Assign Students to Agency</SheetTitle>
                    <SheetDescription>
                        Select and confirm student assignments.
                    </SheetDescription>
                </SheetHeader>

                <div className="p-4 w-full flex-1 flex flex-col">
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-1">
                            Assign to Agency
                        </label>

                        <Select
                            value={selectedAgent}
                            onValueChange={setSelectedAgent}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select an agency" />
                            </SelectTrigger>
                            <SelectContent>
                                {agencies.map((agency) => (
                                    <SelectItem
                                        key={agency.id}
                                        value={agency.id}
                                    >
                                        {agency.name} ({agency.ownerName})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <p className="mb-2 text-sm">
                        {localSelected.length} student(s) selected
                    </p>

                    <ScrollArea
                        type="always"
                        className="w-full overflow-x-auto h-96"
                    >
                        <DataTable
                            columns={studentColumns}
                            data={selectedStudents}
                            showFooter={false}
                            rowSelection={rowSelection}
                            onRowSelectionChange={setRowSelection}
                            getRowId={(row) => row.uid}
                        />
                        <ScrollBar
                            orientation="horizontal"
                            className="w-full"
                        />
                    </ScrollArea>
                </div>

                <SheetFooter>
                    <Button onClick={handleConfirm}>Confirm Assignment</Button>
                    <SheetClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
