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
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"
import { createAgencySupervisor } from "@/api/users"
import { useUser } from "@/hooks/use-user"

const agencySupervisorSchema = z.object({
    firstName: z.string().min(1, "Given name is required"),
    lastName: z.string().min(1, "Surname is required"),
    // position: z.string().min(1, "Position is required"),
    // role: z
    //     .enum(["owner", "supervisor", "assistant"], {})
    //     .refine((val) => !!val, {
    //         message: "Role is required",
    //     }),
})

type AgencySupervisorData = z.infer<typeof agencySupervisorSchema>

export default function AgencySupervisorForm() {
    const { user } = useUser()
    const [loading, setLoading] = useState(false)

    const form = useForm<AgencySupervisorData>({
        resolver: zodResolver(agencySupervisorSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            // role: "owner",
        },
    })

    async function onSubmit(values: AgencySupervisorData) {
        if (!user) return

        try {
            setLoading(true)
            await createAgencySupervisor({
                uid: user.uid,
                firstName: values.firstName,
                lastName: values.lastName,
                position: "owner",
                // agencyRole: values.role,
            })

            window.location.reload()
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

                    {/* <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Agency Role</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="w-full">
                                        <SelectItem value="owner">
                                            Owner
                                        </SelectItem>
                                        <SelectItem value="supervisor">
                                            Supervisor
                                        </SelectItem>
                                        <SelectItem value="assistant">
                                            Assistant
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Creating..." : "Create Account"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
