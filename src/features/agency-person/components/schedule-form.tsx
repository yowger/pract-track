import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type UseFormReturn } from "react-hook-form"
import * as z from "zod"

import { Input } from "@/components/ui/input"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

const scheduleSchema = z.object({
    scheduleName: z.string().min(1, "Schedule name is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    description: z.string().optional(),
})

export type ScheduleFormValues = z.infer<typeof scheduleSchema>

type ScheduleFormProps = {
    onSubmit: (values: ScheduleFormValues) => void
    formRef?: React.RefObject<UseFormReturn<ScheduleFormValues> | null>
}

export function ScheduleForm({ onSubmit, formRef }: ScheduleFormProps) {
    const form = useForm<ScheduleFormValues>({
        resolver: zodResolver(scheduleSchema),
        defaultValues: {
            scheduleName: "",
            startDate: "",
            endDate: "",
            description: "",
        },
    })

    if (formRef && formRef.current === null) {
        formRef.current = form
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="scheduleName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Schedule Name</FormLabel>
                            <Input placeholder="Schedule name" {...field} />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Start Date</FormLabel>
                                <Input type="date" {...field} />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>End Date</FormLabel>
                                <Input type="date" {...field} />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <Input
                                placeholder="Optional description"
                                {...field}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}
