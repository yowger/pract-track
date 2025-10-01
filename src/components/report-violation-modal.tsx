import { z } from "zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { violationTypes } from "@/data/violations"

const violationSchema = z.object({
    studentId: z.string().min(1, "Student ID is required"),
    name: z.string().min(1, "Name is required"),
    violationType: z.string().min(1, "Violation type is required"),
    remarks: z.string().optional(),
})

export type ViolationFormValues = z.infer<typeof violationSchema>

interface ReportViolationModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (values: ViolationFormValues) => Promise<void> | void
    studentId?: string
    studentName?: string
}

export function ReportViolationModal({
    open,
    onOpenChange,
    onSubmit,
    studentId = "",
    studentName = "",
}: ReportViolationModalProps) {
    const form = useForm<ViolationFormValues>({
        resolver: zodResolver(violationSchema),
        defaultValues: {
            studentId,
            name: studentName,
            violationType: "",
            remarks: "",
        },
    })

    useEffect(() => {
        if (studentId || studentName) {
            form.reset({
                studentId: studentId || "",
                name: studentName || "",
                violationType: "",
                remarks: "",
            })
        }
    }, [studentId, studentName, form])

    async function handleSubmit(values: ViolationFormValues) {
        await onSubmit(values)
        form.reset()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Report Violation</DialogTitle>
                    <DialogDescription>
                        Fill out the form below to file a violation report.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-4"
                    >
                        <input type="hidden" {...form.register("studentId")} />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter student name"
                                            {...field}
                                            readOnly={!!studentName}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="violationType"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Type of Violation</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select violation type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="w-full">
                                            {violationTypes.map((type) => (
                                                <SelectItem
                                                    key={type.value}
                                                    value={type.value}
                                                >
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="remarks"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Remarks</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Add details about the violation"
                                            className="resize-none"
                                            rows={3}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting
                                    ? "Submitting..."
                                    : "Submit"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
