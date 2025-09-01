import { Calendar } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { TimeWithPhotoToggle } from "./time-with-photo-toggle"

type Session = {
    start: string
    end: string
    photoStart: boolean
    photoEnd: boolean
}

type OverrideEntry = {
    date: string
    available: boolean
    sessions: Session[]
}

export default function OverrideSchedule() {
    const [overrides, setOverrides] = useState<OverrideEntry[]>([])

    const addOverride = () => {
        setOverrides((prev) => [
            ...prev,
            {
                date: "",
                available: true,
                sessions: [
                    {
                        start: "08:00",
                        end: "12:00",
                        photoStart: false,
                        photoEnd: false,
                    },
                    {
                        start: "13:00",
                        end: "17:00",
                        photoStart: false,
                        photoEnd: false,
                    },
                ],
            },
        ])
    }

    const handleChange = (
        idx: number,
        sessionIdx: number,
        field: keyof Session,
        value: string | boolean
    ) => {
        const updated = [...overrides]
        updated[idx].sessions[sessionIdx][field] = value as never
        setOverrides(updated)
    }

    const handleDateChange = (idx: number, value: string) => {
        const updated = [...overrides]
        updated[idx].date = value
        setOverrides(updated)
    }

    const handleAvailability = (idx: number, checked: boolean) => {
        const updated = [...overrides]
        updated[idx].available = checked
        setOverrides(updated)
    }

    const handleRemove = (idx: number) => {
        setOverrides((prev) => prev.filter((_, i) => i !== idx))
    }

    const handleSubmit = () => {
        console.log("Override schedule:", overrides)
    }

    return (
        <div className="flex flex-col space-y-6">
            {overrides.map((entry, idx) => (
                <div key={idx} className="border rounded-lg p-3 space-y-3">
                    {/* Date + Availability Row */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-500" />
                            <Input
                                type="date"
                                value={entry.date}
                                onChange={(e) =>
                                    handleDateChange(idx, e.target.value)
                                }
                            />
                        </div>

                        <Label
                            htmlFor={`override-${idx}`}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <Checkbox
                                id={`override-${idx}`}
                                checked={entry.available}
                                onCheckedChange={(checked) =>
                                    handleAvailability(idx, checked as boolean)
                                }
                            />
                            <span className="text-sm">
                                {entry.available ? "Available" : "Unavailable"}
                            </span>
                        </Label>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="ml-auto text-red-500 hover:text-red-600"
                            onClick={() => handleRemove(idx)}
                        >
                            Remove
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <div className="grid grid-cols-2 text-xs font-medium text-slate-500 px-1">
                            <span>From</span>
                            <span>To</span>
                        </div>

                        {entry.sessions.map((session, sIdx) => (
                            <div
                                key={sIdx}
                                className="grid grid-cols-2 gap-4 items-center"
                            >
                                <TimeWithPhotoToggle
                                    value={session.start}
                                    onChange={(val) =>
                                        handleChange(idx, sIdx, "start", val)
                                    }
                                    photoActive={session.photoStart}
                                    onTogglePhoto={() =>
                                        handleChange(
                                            idx,
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
                                        handleChange(idx, sIdx, "end", val)
                                    }
                                    photoActive={session.photoEnd}
                                    onTogglePhoto={() =>
                                        handleChange(
                                            idx,
                                            sIdx,
                                            "photoEnd",
                                            !session.photoEnd
                                        )
                                    }
                                    disabled={!entry.available}
                                />
                            </div>
                        ))}

                        <div>
                            <span className="grid grid-cols-2 text-xs font-medium text-slate-500 mb-2">
                                Note
                            </span>

                            <Input />
                        </div>
                    </div>
                </div>
            ))}

            {/* Footer Actions */}
            <div className="flex justify-between items-center">
                <Button variant="outline" onClick={addOverride}>
                    Add New Entry
                </Button>
                <Button onClick={handleSubmit}>Save Overrides</Button>
            </div>
        </div>
    )
}
