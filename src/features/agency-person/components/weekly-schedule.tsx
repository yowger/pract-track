import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { DaySchedule, Session } from "@/types/scheduler"
import { TimeWithPhotoToggle } from "./time-with-photo-toggle"

export function WeeklySchedule({
    value,
    onChange,
}: {
    value: DaySchedule[]
    onChange: (val: DaySchedule[]) => void
}) {
    const handleChange = (
        dayIndex: number,
        sessionIndex: number,
        field: keyof Session,
        val: string | boolean
    ) => {
        const updated = [...value]
        updated[dayIndex].sessions[sessionIndex][field] = val as never
        onChange(updated)
    }

    const handleAvailability = (dayIndex: number, checked: boolean) => {
        const updated = [...value]
        updated[dayIndex].available = checked
        onChange(updated)
    }

    return (
        <div className="flex flex-col">
            <div className="flex items-center font-semibold text-sm text-muted-foreground pb-2 gap-4">
                <span className="w-32">Availability</span>
                <span className="w-44">From</span>
                <span className="w-44">To</span>
                <span className="w-44">From</span>
                <span className="w-44">To</span>
            </div>

            <div className="flex flex-col gap-2">
                {value.map((entry, dayIndex) => (
                    <div key={entry.day} className="flex items-center gap-4">
                        <Label
                            htmlFor={`day-${dayIndex}`}
                            className="w-32 flex items-center gap-2 cursor-pointer"
                        >
                            <Checkbox
                                id={`day-${dayIndex}`}
                                checked={entry.available}
                                onCheckedChange={(checked) =>
                                    handleAvailability(
                                        dayIndex,
                                        checked as boolean
                                    )
                                }
                            />
                            <span
                                className={`font.medium text-sm ${
                                    entry.available
                                        ? "text-gray-900 dark:text-white"
                                        : "text-gray-400 dark:text-gray-600"
                                }`}
                            >
                                {entry.day}
                            </span>
                        </Label>

                        {entry.sessions.map((session, sIdx) => (
                            <div key={sIdx} className="flex items-center gap-4">
                                <TimeWithPhotoToggle
                                    value={session.start}
                                    onChange={(val) =>
                                        handleChange(
                                            dayIndex,
                                            sIdx,
                                            "start",
                                            val
                                        )
                                    }
                                    photoActive={session.photoStart}
                                    onTogglePhoto={() =>
                                        handleChange(
                                            dayIndex,
                                            sIdx,
                                            "photoStart",
                                            !session.photoStart
                                        )
                                    }
                                    disabled={!entry.available}
                                />

                                <TimeWithPhotoToggle
                                    value={session.end}
                                    onChange={(val) =>
                                        handleChange(dayIndex, sIdx, "end", val)
                                    }
                                    photoActive={session.photoEnd}
                                    onTogglePhoto={() =>
                                        handleChange(
                                            dayIndex,
                                            sIdx,
                                            "photoEnd",
                                            !session.photoEnd
                                        )
                                    }
                                    disabled={!entry.available}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}
