import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover"
import {
    Command,
    CommandInput,
    CommandItem,
    CommandList,
    CommandEmpty,
    CommandGroup,
} from "@/components/ui/command"
import { ChevronsUpDown } from "lucide-react"
import { useState } from "react"

interface Agency {
    id: string
    name: string
}

interface AssignAgencyModalProps {
    open: boolean
    selectedIds: string[]
    agencies: Agency[]
    selectedAgencyId: string | null
    loading?: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    onAgencyChange: (id: string) => void
    onSearch: (query: string) => void
    onCancel: () => void
    onSubmit: () => void
}

export function AssignAgencyModal({
    open,
    selectedIds,
    agencies,
    selectedAgencyId,
    loading = false,
    setOpen,
    onAgencyChange,
    onSearch,
    onCancel,
    onSubmit,
}: AssignAgencyModalProps) {
    const selectedCount = selectedIds.length
    const selectedAgency = agencies.find((a) => a.id === selectedAgencyId)

    const [popoverOpen, setPopoverOpen] = useState(false)

    const handleSelect = (id: string) => {
        onAgencyChange(id)
        setPopoverOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Assign Agency</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>

                <div className="text-sm">
                    Confirm assigning <span>{selectedCount}</span> student
                    {selectedCount !== 1 && "s"} to an agency.
                </div>

                <div className="mt-4">
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={popoverOpen}
                                className="flex justify-between w-full"
                                disabled={loading}
                            >
                                {selectedAgency
                                    ? selectedAgency.name
                                    : "Select agency"}
                                <ChevronsUpDown className="opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                            <Command className="w-[var(--radix-popover-trigger-width)]">
                                <CommandInput
                                    placeholder="Search agency..."
                                    className="w-full"
                                    onValueChange={onSearch}
                                    disabled={loading}
                                />
                                <CommandList>
                                    <CommandEmpty>
                                        No agencies found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                        {agencies.map((agency) => (
                                            <CommandItem
                                                key={agency.id}
                                                onSelect={() =>
                                                    handleSelect(agency.id)
                                                }
                                                disabled={loading}
                                            >
                                                {agency.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onSubmit}
                        disabled={!selectedAgencyId || loading}
                    >
                        {loading ? "Assigning..." : "Confirm Assignment"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
