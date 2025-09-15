import { useParams } from "react-router-dom"
import { toast } from "sonner"

import { useCreateEvaluation } from "@/api/hooks/use-create-evaluation"
import { useAddStudentEvaluation } from "@/api/hooks/use-update-student-eval"
import { useStudent } from "@/api/hooks/use-get-student"
import StudentEvaluationForm, {
    type EvaluationFormSchema,
} from "@/components/student-feedback/student-feedback-form"
import { useUser } from "@/hooks/use-user"
import { capitalize } from "@/lib/utils"
import { isAgency } from "@/types/user"

export default function AgencyStudentReview() {
    const { studentId } = useParams()
    const {
        data: student,
        loading: studentLoading,
        error: studentError,
    } = useStudent({ uid: studentId })
    const { user, isLoading: userLoading } = useUser()
    const { loading: evaluationLoading, mutate: createEvaluation } =
        useCreateEvaluation()
    const {
        mutate: updateStudentEvaluation,
        loading: studentUpdatingEvaluation,
    } = useAddStudentEvaluation()

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

    function handleCreateEvaluation(data: EvaluationFormSchema) {
        if (!user || !student || !studentId || !userCompany) return

        const ratings = Object.fromEntries(
            Object.entries(data.ratings).map(([key, value]) => [
                key,
                Number(value),
            ])
        )

        createEvaluation({
            student: {
                id: studentId,
                name: studentName,
            },
            agency: {
                id: user.uid,
                name: userCompany.name,
                address: userCompany?.address || "",
            },
            evaluator: {
                id: user.uid,
                name: coordinatorName,
                role: userRole ?? "",
            },
            comments: data?.comments || "",
            ratings,
        })
            .then(({ id: docId }) => {
                updateStudentEvaluation(studentId, {
                    agency: {
                        id: userCompany.id,
                        name: userCompany.name,
                    },
                    evaluator: {
                        id: user.uid,
                        name: coordinatorName,
                        docID: docId,
                    },
                })
                    .then(() => {
                        toast.success("Evaluation created successfully")
                    })
                    .catch(() => {
                        toast.error("Failed to create evaluation")
                    })
            })
            .catch((err) => {
                console.error(err)
                toast.error("Failed to create evaluation")
            })
    }

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
                        isLoading={
                            evaluationLoading || studentUpdatingEvaluation
                        }
                        onSubmit={handleCreateEvaluation}
                    />
                </div>
            </div>
        </div>
    )
}
