import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth"
import { FirebaseError } from "firebase/app"
import { setDoc, doc, getDoc } from "firebase/firestore"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { z } from "zod"

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { auth, db } from "@/service/firebase/firebase"

const signUpSchema = z
    .object({
        email: z.email({ message: "Invalid email address" }),
        password: z
            .string()
            .min(6, { message: "Password must be at least 6 characters" }),
        confirmPassword: z
            .string()
            .min(6, { message: "Please confirm your password" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })

const provider = new GoogleAuthProvider()

type SignUpFormData = z.infer<typeof signUpSchema>

export default function SignUpForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const form = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    async function handleGoogleSignUp() {
        setLoading(true)
        setErrorMessage(null)

        try {
            const result = await signInWithPopup(auth, provider)
            const user = result.user

            const userRef = doc(db, "users", user.uid)
            const docSnap = await getDoc(userRef)

            if (!docSnap.exists()) {
                await setDoc(userRef, {
                    email: user.email,
                    role: "",
                    createdAt: new Date(),
                })
            }

            navigate("/role-sign-up")
        } catch (error) {
            if (error instanceof FirebaseError) {
                const friendlyMessage =
                    firebaseErrorMessages[error.code] ||
                    "An unexpected error occurred."

                setErrorMessage(friendlyMessage)
            } else {
                setErrorMessage("Something went wrong. Please try again later.")
            }
        } finally {
            setLoading(false)
        }
    }

    async function onSubmit(values: z.infer<typeof signUpSchema>) {
        setLoading(true)
        setErrorMessage(null)

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                values.email,
                values.password
            )
            const user = userCredential.user

            await setDoc(doc(db, "users", user.uid), {
                email: values.email,
                role: "",
                createdAt: new Date(),
            })

            navigate("/role-sign-up")
        } catch (error) {
            if (error instanceof FirebaseError) {
                const friendlyMessage =
                    firebaseErrorMessages[error.code] ||
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
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Create an account</CardTitle>
                    <CardDescription>
                        Sign up with Google or your email
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <div className="grid gap-6">
                                <div className="flex flex-col gap-4">
                                    <Button
                                        onClick={handleGoogleSignUp}
                                        disabled={loading}
                                        variant="outline"
                                        type="button"
                                        className="w-full"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            className="mr-2 h-5 w-5"
                                        >
                                            <path
                                                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                        Sign up with Google
                                    </Button>
                                </div>

                                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                                        Or continue with
                                    </span>
                                </div>

                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        autoComplete="new-password"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Confirm Password
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        autoComplete="new-password"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {errorMessage && (
                                    <Alert
                                        variant="destructive"
                                        className="py-6"
                                    >
                                        <AlertTitle>
                                            Registration Error
                                        </AlertTitle>
                                        <AlertDescription>
                                            {errorMessage}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full"
                                >
                                    {loading ? "Registering..." : "Register"}
                                </Button>

                                <div className="text-center text-sm">
                                    Already have an account?{" "}
                                    <Link
                                        to="/sign-in"
                                        className="underline underline-offset-4"
                                    >
                                        Sign in
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

const firebaseErrorMessages: Record<string, string> = {
    "auth/email-already-in-use": "This email address is already registered.",
    "auth/invalid-email": "The email address is badly formatted.",
    "auth/operation-not-allowed": "Email/password sign-up is not enabled.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/too-many-requests":
        "Too many sign-up attempts. Please try again later.",
    "auth/internal-error": "An internal error occurred. Please try again.",
}
