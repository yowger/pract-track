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
import PreServiceStudentForm from "./forms/pre-service-student-form"
import { Skeleton } from "@/components/ui/skeleton"

const PracticumAdviserForm = lazy(
    () => import("./forms/practical-adviser-form")
)
const ChairpersonForm = lazy(() => import("./forms/chair-person-form"))
const AgencySupervisorForm = lazy(
    () => import("./forms/agency-supervisor-form")
)

export default function RoleSwitcher({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [role, setRole] = useState<string>("student")

    const renderForm = () => {
        switch (role) {
            case "agency_supervisor":
                return <AgencySupervisorForm />
            case "chair_person":
                return <ChairpersonForm />
            case "adviser":
                return <PracticumAdviserForm />
            default:
            case "student":
                return <PreServiceStudentForm />
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
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="student">Student</SelectItem>
                                <SelectItem value="adviser">
                                    Advisers
                                </SelectItem>
                                <SelectItem value="chair_person">
                                    Chair person
                                </SelectItem>
                                <SelectItem value="agency_supervisor">
                                    Agency
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Suspense fallback={<Fallback />}>{renderForm()}</Suspense>
                </CardContent>
            </Card>
        </div>
    )
}

function Fallback() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-24" />
        </div>
    )
}
