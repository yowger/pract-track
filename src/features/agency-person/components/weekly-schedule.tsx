import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { TimeWithPhotoToggle } from "./time-with-photo-toggle"
import type { DaySchedule, Session } from "@/types/scheduler"

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
            <div className="flex items-center text-sm text-muted-foreground pb-2 gap-4">
                <span className="w-32">Availability</span>
                <span className="flex-1">From</span>
                <span className="flex-1">To</span>
            </div>

            <div className="flex flex-col gap-4">
                {value.map((entry, dayIndex) => (
                    <div key={entry.day} className="flex gap-4">
                        <Label
                            htmlFor={`day-${dayIndex}`}
                            className="w-32 flex items-start cursor-pointer"
                        >
                            <div className="flex items-center gap-2 font-medium">
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
                                    className={`font-medium text-sm ${
                                        entry.available
                                            ? "text-gray-900 dark:text-white"
                                            : "text-gray-400 dark:text-gray-600"
                                    }`}
                                >
                                    {entry.day.charAt(0).toUpperCase() +
                                        entry.day.slice(1)}
                                </span>
                            </div>
                        </Label>

                        <div className="flex flex-col gap-2 flex-1">
                            {entry.sessions.map((session, sIdx) => (
                                <div
                                    key={sIdx}
                                    className="flex items-center gap-4"
                                >
                                    <div className="flex-1">
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
                                    </div>
                                    <div className="flex-1">
                                        <TimeWithPhotoToggle
                                            value={session.end}
                                            onChange={(val) =>
                                                handleChange(
                                                    dayIndex,
                                                    sIdx,
                                                    "end",
                                                    val
                                                )
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
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
