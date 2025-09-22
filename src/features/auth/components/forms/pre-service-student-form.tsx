import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { FirebaseError } from "firebase/app"
import { z } from "zod"

import { useUser } from "@/hooks/use-user"
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
import { firebaseFirestoreErrorMessages } from "@/service/firebase/error-messages"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createStudent } from "@/api/users"

const preServiceSchema = z.object({
    firstName: z.string().min(1, "Given name is required"),
    lastName: z.string().min(1, "Surname is required"),
    studentID: z.string().min(1, "Student ID is required"),
    program: z.string().min(1, "Program is required"),
    yearLevel: z.string().min(1, "Year level is required"),
    section: z.string().min(1, "Section is required"),
})

type PreServiceStudentData = z.infer<typeof preServiceSchema>

export default function PreServiceStudentForm() {
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const { user } = useUser()

    const form = useForm<PreServiceStudentData>({
        resolver: zodResolver(preServiceSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            studentID: "",
            program: "",
            yearLevel: "",
            section: "",
        },
    })

    async function onSubmit(values: PreServiceStudentData) {
        if (!user) return

        setLoading(true)

        try {
            await createStudent({
                uid: user.uid,
                firstName: values.firstName,
                lastName: values.lastName,
                studentID: values.studentID,
                program: values.program,
                yearLevel: values.yearLevel,
                section: values.section,
            })

            window.location.reload() 
        } catch (error) {
            if (error instanceof FirebaseError) {
                const friendlyMessage =
                    firebaseFirestoreErrorMessages[error.code] ||
                    "An unexpected error occurred."
                setErrorMessage(friendlyMessage)
            } else {
                setErrorMessage("Something went wrong. Please try again later.")
            }
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

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="studentID"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Student ID</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="program"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Program</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="yearLevel"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Year Level</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select year" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">
                                                    1
                                                </SelectItem>
                                                <SelectItem value="2">
                                                    2
                                                </SelectItem>
                                                <SelectItem value="3">
                                                    3
                                                </SelectItem>
                                                <SelectItem value="4">
                                                    4
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="section"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Section</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select section" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="BSCS-A">
                                                    BSCS-A
                                                </SelectItem>
                                                <SelectItem value="BSCS-B">
                                                    BSCS-B
                                                </SelectItem>
                                                <SelectItem value="BSIT-A">
                                                    BSIT-A
                                                </SelectItem>
                                                <SelectItem value="BSIT-B">
                                                    BSIT-B
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {errorMessage && (
                        <Alert variant="destructive" className="py-6">
                            <AlertTitle>Student Form Error</AlertTitle>
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                    )}

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Creating..." : "Create Account"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
