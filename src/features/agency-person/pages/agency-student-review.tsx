import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import StudentEvaluationForm from "@/components/student-feedback/student-feedback-form"

export default function AgencyStudentReview() {
    return (
        <div className="flex flex-col p-4 gap-4">
            <div className="flex flex-col md:flex-row  md:justify-between gap-4">
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
                    <Card>
                        <CardHeader>
                            <CardTitle>Rating Scale</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                5 – Excellent &nbsp; | &nbsp; 4 – Very
                                Satisfactory &nbsp; | &nbsp; 3 – Satisfactory
                                &nbsp; | &nbsp; 2 – Unsatisfactory &nbsp; |
                                &nbsp; 1 – Poor &nbsp; | &nbsp; NA – Not
                                Applicable
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-span-12">
                    <StudentEvaluationForm />
                </div>
            </div>
        </div>
    )
}
