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

import { useUser } from "@/hooks/use-user"
import { createAgency } from "@/api/agency"

const agencySchema = z.object({
    name: z.string().min(1, "Agency name is required"),
    address: z.string().min(1, "Address is required"),
})

type AgencyData = z.infer<typeof agencySchema>

export default function CreateAgencyForm() {
    const { user } = useUser()
    const [loading, setLoading] = useState(false)

    const form = useForm<AgencyData>({
        resolver: zodResolver(agencySchema),
        defaultValues: {
            name: "",
            address: "",
        },
    })

    async function onSubmit(values: AgencyData) {
        if (!user) return

        try {
            setLoading(true)
            await createAgency({
                uid: user.uid,
                ...values,
            })

            window.location.reload()
        } catch (err) {
            console.error("Error creating agency:", err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Agency Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Creating..." : "Create Agency"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
