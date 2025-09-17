import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/hooks/use-user"
import { isStudent } from "@/types/user"

// const user = {
//     name: "Juan Dela Cruz",
//     email: "juan@example.com",
//     role: "Student",
//     phone: "+63 912 345 6789",
//     assignedAgency: "Department of Agriculture",
// }

export default function StudentProfile() {
    const { user } = useUser()
    console.log("🚀 ~ StudentProfile ~ user:", user)

    if (user === null || isStudent(user) === false)
        return (
            <div>
                <p>You are not a student</p>
            </div>
        )

    return (
        <div className="flex flex-col p-4 gap-4">
            <div className="flex flex-col md:flex-row  md:justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Profile
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-5 items-stretch">
                <div className="col-span-12 lg:col-span-6 flex">
                    <Card className="flex flex-col flex-1">
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 flex-1">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Full Name
                                    </p>
                                    <p className="font-medium ">
                                        {user.displayName}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Student number
                                    </p>
                                    <p className="font-medium">
                                        {user.studentData.studentID}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium break-words">
                                        Email
                                    </p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Program
                                    </p>
                                    <p className="font-medium">
                                        {user.studentData.program.toUpperCase()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-span-12 lg:col-span-6 flex">
                    <Card className="flex flex-col flex-1">
                        <CardHeader>
                            <CardTitle>Assigned Agency</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="font-medium">
                                {user.studentData.assignedAgencyName ||
                                    "No agency assigned"}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
