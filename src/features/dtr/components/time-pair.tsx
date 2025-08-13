import { format } from "date-fns"

interface TimePairProps {
    labelIn: string
    timeIn: Date
    labelOut: string
    timeOut: Date
}

export function TimePair({
    labelIn,
    timeIn,
    labelOut,
    timeOut,
}: TimePairProps) {
    return (
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <div className="flex gap-8">
                <div className="flex gap-2">
                    <span className="font-medium w-24 block">{labelIn}:</span>
                    <span>{format(timeIn, "hh:mm a")}</span>
                </div>
                <div className="flex gap-2">
                    <span className="font-medium w-24 block">{labelOut}:</span>
                    <span>{format(timeOut, "hh:mm a")}</span>
                </div>
            </div>
        </div>
    )
}
