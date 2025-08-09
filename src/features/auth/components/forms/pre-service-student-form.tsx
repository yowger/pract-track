import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { FirebaseError } from "firebase/app"
import { doc, setDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import { z } from "zod"

import { db } from "@/service/firebase/firebase"
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

const preServiceSchema = z.object({
    username: z.string().min(1, "Username is required"),
    firstName: z.string().min(1, "Given name is required"),
    middleName: z.string().optional(),
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

    const navigate = useNavigate()
    const { user } = useUser()

    const form = useForm<PreServiceStudentData>({
        resolver: zodResolver(preServiceSchema),
        defaultValues: {
            username: "",
            firstName: "",
            middleName: "",
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
            await setDoc(
                doc(db, "users", user.uid),
                {
                    username: values.username,
                    firstName: values.firstName,
                    middleName: values.middleName || "",
                    lastName: values.lastName,
                    role: "student",
                    updatedAt: new Date(),
                },
                { merge: true }
            )

            await setDoc(doc(db, "students", user.uid), {
                studentID: values.studentID,
                program: values.program,
                yearLevel: values.yearLevel,
                section: values.section,
                status: "",
                assignAgencyID: "",
            })

            navigate("/")
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
