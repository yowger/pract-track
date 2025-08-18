import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form"
import { createChairperson } from "@/api/users"
import { useUser } from "@/hooks/use-user"

const chairpersonSchema = z.object({
    firstName: z.string().min(1, "Given name is required"),
    middleName: z.string().max(1, "Only 1 character allowed").optional(),
    lastName: z.string().min(1, "Surname is required"),
    position: z.string().min(1, "Position is required"),
})

type ChairpersonData = z.infer<typeof chairpersonSchema>

export default function ChairpersonForm() {
    const { user } = useUser()
    const [loading, setLoading] = useState(false)

    const form = useForm<ChairpersonData>({
        resolver: zodResolver(chairpersonSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            position: "",
        },
    })

    async function onSubmit(values: ChairpersonData) {
        if (!user) return

        try {
            setLoading(true)
            await createChairperson({
                uid: user.uid,
                firstName: values.firstName,
                lastName: values.lastName,
                position: values.position,
            })

            window.location.reload() // TODO:
        } catch (err) {
            console.error("Error creating chairperson:", err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-6">
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
                        name="position"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Position</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select position" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Chairperson">
                                                Chairperson
                                            </SelectItem>
                                            <SelectItem value="Co-Chairperson">
                                                Co-Chairperson
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
                </div>
            </form>
        </Form>
    )
}
