import { useParams } from "react-router-dom"

import StudentEvaluationForm from "@/components/student-feedback/student-feedback-form"
import { useStudent } from "@/api/hooks/use-get-student"
import { capitalize } from "@/lib/utils"
import { useUser } from "@/hooks/use-user"
import { isAgency } from "@/types/user"

export default function AgencyStudentReview() {
    const { studentId } = useParams()
    const {
        data: student,
        loading: studentLoading,
        error: studentError,
    } = useStudent({ uid: studentId })
    const { user, isLoading: userLoading } = useUser()

    if (studentLoading || userLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        )
    }

    if (studentError) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-red-500">
                    Error loading data: {studentError.message}
                </p>
            </div>
        )
    }

    if (!student || !user) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-muted-foreground">
                    This student does not exist or cannot be found.
                </p>
            </div>
        )
    }

    const studentName = `${capitalize(student.firstName)} ${capitalize(
        student.lastName
    )}`
    const userRole = user.role && user.role.replace("_", " ")
    const coordinatorName = `${capitalize(user.firstName)} ${capitalize(
        user.lastName
    )}`
    const userCompany = isAgency(user) ? user.companyData : null

    return (
        <div className="flex flex-col p-4 gap-4">
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Student Evaluation and Feedback
                    </h1>
                    <p className="text-muted-foreground">
                        Evaluate and provide feedback to your students
                    </p>
                </div>
            </div>

            <div className="grid auto-rows-auto grid-cols-12 gap-5">
                <div className="col-span-12">
                    <StudentEvaluationForm
                        internName={studentName}
                        coordinatorName={coordinatorName}
                        position={userRole ?? undefined}
                        companyName={userCompany?.name.replace("_", " ")}
                        address={userCompany?.address}
                    />
                </div>
            </div>
        </div>
    )
}
