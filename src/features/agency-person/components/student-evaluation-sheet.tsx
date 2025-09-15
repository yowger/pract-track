import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import StudentEvaluationView, {
    type StudentEvaluationViewProps,
} from "./student-evaluation-view"

type StudentEvaluationSheetProps = {
    evaluation: StudentEvaluationViewProps["evaluation"] | null
    open: boolean
    onClose: () => void
}

export default function StudentEvaluationSheet({
    evaluation,
    open,
    onClose,
}: StudentEvaluationSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent side="right" className="flex flex-col">
                <SheetHeader>
                    <SheetTitle>Student Evaluation</SheetTitle>
                </SheetHeader>

                <div className="grid flex-1 auto-rows-min gap-4 px-4 overflow-y-auto overflow-x-hidden">
                    {evaluation ? (
                        <div className="">
                            <StudentEvaluationView evaluation={evaluation} />
                        </div>
                    ) : (
                        <p className="text-muted-foreground">
                            No student selected
                        </p>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}
