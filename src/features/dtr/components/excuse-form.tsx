import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import StarRequired from "@/components/star-required"

const today = new Date()
today.setHours(0, 0, 0, 0)

const excuseSchema = z.object({
    date: z.date().min(today, "Date cannot be in the past"),
    title: z.enum(["sick", "family", "school", "other"], {
        error: () => ({ message: "Please select a title" }),
    }),
    reason: z.string().min(3, "Reason must be at least 3 characters."),
    files: z
        .array(z.any())
        .max(5, "You can only upload up to 5 supporting files")
        .optional(),
    photos: z
        .array(z.any())
        .max(5, "You can only upload up to 3 photos")
        .optional(),
})

export type ExcuseFormValues = z.infer<typeof excuseSchema>

export function ExcuseForm({
    onSubmit,
    loading = false,
}: {
    onSubmit: (data: ExcuseFormValues) => Promise<void> | void
    loading?: boolean
}) {
    const form = useForm<ExcuseFormValues>({
        resolver: zodResolver(excuseSchema),
        defaultValues: {
            date: new Date(),
            reason: "",
        },
    })

    const isSubmitting = form.formState.isSubmitting || loading

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 max-w-md"
            >
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Date of Absence <StarRequired />
                            </FormLabel>
                            <FormControl>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="justify-start text-left font-normal"
                                            disabled={isSubmitting}
                                        >
                                            {field.value
                                                ? format(field.value, "PPP")
                                                : "Pick a date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={(d) =>
                                                field.onChange(d ?? new Date())
                                            }
                                            disabled={isSubmitting}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Title <StarRequired />
                            </FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                disabled={isSubmitting}
                            >
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a title" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="sick">Sick</SelectItem>
                                    <SelectItem value="family">
                                        Family Emergency
                                    </SelectItem>
                                    <SelectItem value="school">
                                        School Activity
                                    </SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Reason for Absence <StarRequired />
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="e.g. Sick leave, school activity..."
                                    className="w-full h-32"
                                    {...field}
                                    disabled={isSubmitting}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="files"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Supporting Files</FormLabel>
                            <FormControl>
                                <Input
                                    type="file"
                                    accept=".pdf,.jpg,.png,.docx"
                                    multiple
                                    onChange={(e) => {
                                        const files = Array.from(
                                            e.target.files || []
                                        )
                                        if (files.length > 5) {
                                            alert(
                                                "You can only upload up to 5 files"
                                            )
                                            return
                                        }
                                        field.onChange(files)
                                    }}
                                    disabled={isSubmitting}
                                />
                            </FormControl>
                            {field.value?.length ? (
                                <ul className="text-xs text-muted-foreground list-disc pl-4">
                                    {field.value.map((file, i) => (
                                        <li key={i}>{file.name}</li>
                                    ))}
                                </ul>
                            ) : null}
                            <FormDescription>
                                Max 5 supporting files can be uploaded.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="photos"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Photo Evidence</FormLabel>
                            <FormControl>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => {
                                        const files = Array.from(
                                            e.target.files || []
                                        )
                                        if (files.length > 3) {
                                            alert(
                                                "You can only upload up to 3 photos"
                                            )
                                            return
                                        }
                                        field.onChange(files)
                                    }}
                                    disabled={isSubmitting}
                                />
                            </FormControl>
                            <FormDescription>
                                Max 3 photos can be uploaded.
                            </FormDescription>
                            {field.value?.length ? (
                                <ul className="text-xs text-muted-foreground list-disc pl-4">
                                    {field.value.map((file, i) => (
                                        <li key={i}>{file.name}</li>
                                    ))}
                                </ul>
                            ) : null}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Submitting..." : "Submit Excuse"}
                </Button>
            </form>
        </Form>
    )
}
