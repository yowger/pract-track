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
import type { AppUser } from "@/types/user"

interface AssignAdviserModalProps {
    open: boolean
    selectedIds: string[]
    advisers: AppUser[]
    selectedAdviserId: string | null
    loading?: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    onAdviserChange: (id: string) => void
    onSearch: (query: string) => void
    onCancel: () => void
    onSubmit: () => void
}

export function AssignAdviserModal({
    open,
    selectedIds,
    advisers,
    selectedAdviserId,
    loading = false,
    setOpen,
    onAdviserChange,
    onSearch,
    onCancel,
    onSubmit,
}: AssignAdviserModalProps) {
    const selectedCount = selectedIds.length
    const selectedAdviser = advisers.find((a) => a.uid === selectedAdviserId)

    const [popoverOpen, setPopoverOpen] = useState(false)

    const handleSelect = (id: string) => {
        onAdviserChange(id)
        setPopoverOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Assign Adviser</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>

                <div className="text-sm">
                    Confirm assigning <span>{selectedCount}</span> student
                    {selectedCount !== 1 && "s"} to an adviser.
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
                                {selectedAdviser
                                    ? selectedAdviser.displayName
                                    : "Select adviser"}
                                <ChevronsUpDown className="opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                            <Command className="w-[var(--radix-popover-trigger-width)]">
                                <CommandInput
                                    placeholder="Search adviser..."
                                    className="w-full"
                                    onValueChange={onSearch}
                                    disabled={loading}
                                />
                                <CommandList>
                                    <CommandEmpty>
                                        No advisers found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                        {advisers.map((adviser) => (
                                            <CommandItem
                                                key={adviser.uid}
                                                onSelect={() =>
                                                    handleSelect(adviser.uid)
                                                }
                                                disabled={loading}
                                            >
                                                {adviser.displayName}
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
                        disabled={!selectedAdviserId || loading}
                    >
                        {loading ? "Assigning..." : "Confirm Assignment"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
