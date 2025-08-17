import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form"
import { createAgencySupervisor } from "@/api/users"
import { useUser } from "@/hooks/use-user"

const agencySupervisorSchema = z.object({
    firstName: z.string().min(1, "Given name is required"),
    middleName: z.string().max(1, "Only initial allowed").optional(),
    lastName: z.string().min(1, "Surname is required"),
    username: z.string().min(1, "Username is required"),
    position: z.string().min(1, "Position is required"),
})

type AgencySupervisorData = z.infer<typeof agencySupervisorSchema>

export default function AgencySupervisorForm() {
    const { user } = useUser()
    const [loading, setLoading] = useState(false)

    const form = useForm<AgencySupervisorData>({
        resolver: zodResolver(agencySupervisorSchema),
        defaultValues: {
            firstName: "",
            middleName: "",
            lastName: "",
            username: "",
            position: "",
        },
    })

    async function onSubmit(values: AgencySupervisorData) {
        if (!user) return

        try {
            setLoading(true)
            await createAgencySupervisor({
                uid: user.uid,
                username: values.username,
                firstName: values.firstName,
                middleName: values.middleName,
                lastName: values.lastName,
                position: values.position,
            })

            window.location.reload() // TODO:
        } catch (err) {
            console.error("Error creating agency supervisor:", err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-6">
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
                        name="position"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Position</FormLabel>
                                <FormControl>
                                    <Input {...field} />
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
