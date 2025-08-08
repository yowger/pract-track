import { cn } from "@/lib/utils"
import { Suspense, lazy, useState } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

// const EmployeeForm = lazy(() => import("./forms/EmployeeForm"))
// const ManagerForm = lazy(() => import("./forms/ManagerForm"))
const PreServiceStudentForm = lazy(
    () => import("./forms/pre-service-student-form")
)

export default function RoleSwitcher({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [role, setRole] = useState<string | null>(null)

    const renderForm = () => {
        switch (role) {
            case "student":
                return <PreServiceStudentForm />
            // case "manager":
            //     return <ManagerForm />
            // case "admin":
            //     return <AdminForm />
            default:
                return null
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">
                        Continue creating your account
                    </CardTitle>
                    <CardDescription>Choose your role</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="mb-6">
                        <Label className="mb-2">Select role</Label>
                        <Select onValueChange={setRole}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="student">
                                    Pre-service Student
                                </SelectItem>
                                {/* <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem> */}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Lazy-loaded form */}
                    <Suspense fallback={<div>Loading form...</div>}>
                        {renderForm()}
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    )
}
