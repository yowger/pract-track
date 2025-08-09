import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Link, useNavigate } from "react-router-dom"
import {
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
} from "firebase/auth"
import { FirebaseError } from "firebase/app"

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form"
import { auth, db } from "@/service/firebase/firebase"
import { cn } from "@/lib/utils"
import { doc, getDoc, setDoc } from "firebase/firestore"

const signInSchema = z.object({
    email: z.email({ message: "Invalid email address" }),
    password: z.string().min(1, "Password is required"),
})

type SignInFormData = z.infer<typeof signInSchema>

const provider = new GoogleAuthProvider()

export default function SignInForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const navigate = useNavigate()

    const form = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
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

    async function onSubmit(values: SignInFormData) {
        setLoading(true)

        try {
            await signInWithEmailAndPassword(
                auth,
                values.email,
                values.password
            )
            navigate("/")
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
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>
                        Login with Google or your email
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
                                        Login with Google
                                    </Button>
                                </div>

                                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                                        Or continue with
                                    </span>
                                </div>

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

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center">
                                                <FormLabel>Password</FormLabel>
                                                {/* <a
                                                    href="#"
                                                    className="ml-auto text-sm underline-offset-4 hover:underline"
                                                >
                                                    Forgot your password?
                                                </a> */}
                                            </div>
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

                                {errorMessage && (
                                    <Alert
                                        variant="destructive"
                                        className="py-6"
                                    >
                                        <AlertTitle>Sign In Error</AlertTitle>
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
                                    {loading ? "Logging in..." : "Login"}
                                </Button>

                                <div className="text-center text-sm">
                                    Don&apos;t have an account?{" "}
                                    <Link
                                        to="/sign-up"
                                        className="underline underline-offset-4"
                                    >
                                        Sign up
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
    "auth/invalid-credential": "Invalid email or password.",
    "auth/invalid-email": "The email address is badly formatted.",
    "auth/user-disabled":
        "This account has been disabled. Please contact support.",
    "auth/user-not-found": "No user found with this email address.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/too-many-requests":
        "Too many failed attempts. Please try again later.",
    "auth/operation-not-allowed": "Email/password sign-in is not enabled.",
    "auth/internal-error": "An internal error occurred. Please try again.",
}
