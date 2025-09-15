import { evaluationCriteria } from "@/components/student-feedback/student-feedback-data"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export type StudentEvaluationViewProps = {
    evaluation: {
        agency: { id: string; name: string; address?: string }
        evaluator: { id: string; name: string; role: string }
        student: { id: string; name: string }
        ratings: Record<string, number>
        comments?: string
        createdAt?: Date
        updatedAt?: Date
    }
}

export default function StudentEvaluationView({
    evaluation,
}: StudentEvaluationViewProps) {
    return (
        <div className="space-y-5">
            <Card>
                <CardHeader>
                    <CardTitle>Agency Info</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div>
                        <Label>Name</Label>
                        <p>{evaluation.agency.name}</p>
                    </div>
                    <div>
                        <Label>Address</Label>
                        <p>{evaluation.agency.address || "-"}</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Evaluator Info</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div>
                        <Label>Name</Label>
                        <p>{evaluation.evaluator.name}</p>
                    </div>
                    <div>
                        <Label>Role</Label>
                        <p>{evaluation.evaluator.role}</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Intern Info</CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <Label>Name</Label>
                        <p>{evaluation.student.name}</p>
                    </div>
                </CardContent>
            </Card>

            {evaluationCriteria.map((section) => (
                <Card key={section.section}>
                    <CardHeader>
                        <CardTitle>{section.section}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {section.items.map((item) => (
                            <div
                                key={item.key}
                                className="flex justify-between"
                            >
                                <span>{item.label}</span>
                                <span>
                                    {evaluation.ratings[item.key] ?? "-"}
                                </span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            ))}

            {evaluation.comments && (
                <Card>
                    <CardHeader>
                        <CardTitle>Comments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{evaluation.comments}</p>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Submitted At</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2 md:grid-cols-2">
                    <div>
                        <Label>Created</Label>
                        <p>
                            {evaluation.createdAt
                                ? evaluation.createdAt.toLocaleString()
                                : "-"}
                        </p>
                    </div>
                    <div>
                        <Label>Updated</Label>
                        <p>
                            {evaluation.updatedAt
                                ? evaluation.updatedAt.toLocaleString()
                                : "-"}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// Todo: come back to this