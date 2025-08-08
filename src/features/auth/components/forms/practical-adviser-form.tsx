import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const adviserSchema = z.object({
    firstName: z.string().min(1, "Given name is required"),
    middleName: z.string().max(1, "Only 1 character allowed").optional(),
    lastName: z.string().min(1, "Surname is required"),
    username: z.string().min(1, "Username is required"),
    department: z.string().min(1, "Department is required"),
})

type AdviserFormValues = z.infer<typeof adviserSchema>

export default function PracticumAdviserForm() {
    const [loading, setLoading] = useState(false)

    const form = useForm<AdviserFormValues>({
        resolver: zodResolver(adviserSchema),
        defaultValues: {
            firstName: "",
            middleName: "",
            lastName: "",
            username: "",
            department: "",
        },
    })

    function onSubmit(values: AdviserFormValues) {
        setLoading(true)
        console.log("Form submitted:", values)
        // TODO: Firebase create account logic
        setLoading(false)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Given Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="middleName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Middle Initial</FormLabel>
                                <FormControl>
                                    <Input maxLength={1} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Surname</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Department</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CS">
                                            Computer Science
                                        </SelectItem>
                                        <SelectItem value="IT">
                                            Information Technology
                                        </SelectItem>
                                        <SelectItem value="IS">
                                            Information Systems
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating..." : "Create Account"}
                </Button>
            </form>
        </Form>
    )
}
