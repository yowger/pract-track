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
import { useUser } from "@/hooks/use-user"
import { useCreatePracticumAdviser } from "@/api/hooks/use-create-practicum-adviser"

const adviserSchema = z.object({
    firstName: z.string().min(1, "Given name is required"),
    middleName: z.string().max(1, "Only 1 character allowed").optional(),
    lastName: z.string().min(1, "Surname is required"),
    department: z.string().min(1, "Department is required"),
})

type AdviserFormValues = z.infer<typeof adviserSchema>

export default function PracticumAdviserForm() {
    const { loading, error, mutate } = useCreatePracticumAdviser()

    const { user } = useUser()

    const form = useForm<AdviserFormValues>({
        resolver: zodResolver(adviserSchema),
        defaultValues: {
            firstName: "",
            middleName: "",
            lastName: "",
            department: "",
        },
    })

    function onSubmit(values: AdviserFormValues) {
        if (!user) return

        mutate({
            uid: user.uid,
            firstName: values.firstName,
            lastName: values.lastName,
            email: user.email ?? null,
            displayName: `${values.firstName} ${values.lastName}`,
            department: values.department,
        }).then(() => {
            window.location.reload()
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
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
                                <FormLabel>Last name</FormLabel>
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

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating..." : "Create Account"}
                </Button>
            </form>
        </Form>
    )
}
