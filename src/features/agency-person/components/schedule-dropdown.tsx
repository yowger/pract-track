import { useEffect, useState } from "react"
import { getSchedules } from "@/api/scheduler"
import { useUser } from "@/hooks/use-user"
import { isAgency } from "@/types/user"
import type { Scheduler } from "@/types/scheduler"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Camera, Loader2 } from "lucide-react"
import { TypographyH4 } from "@/components/typography"

interface ScheduleDropdownProps {
    onSelect?: (schedule: Scheduler & { id: string }) => void
}

export default function ScheduleDropdown({ onSelect }: ScheduleDropdownProps) {
    const { user } = useUser()
    const [schedules, setSchedules] = useState<(Scheduler & { id: string })[]>(
        []
    )
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedId, setSelectedId] = useState<string | null>(null)

    const selectedSchedule = schedules.find((s) => s.id === selectedId) || null

    useEffect(() => {
        if (!user) return
        if (!isAgency(user)) {
            setError("Only agency users can view schedules")
            return
        }

        const fetchSchedules = async () => {
            setLoading(true)
            setError(null)
            try {
                const data = await getSchedules({
                    companyId: user.companyData?.ownerId,
                })

                setSchedules(data)

                if (data.length > 0) {
                    const lastSchedule = data[data.length - 1]
                    setSelectedId(lastSchedule.id)
                    if (onSelect) onSelect(lastSchedule)
                }
            } catch (err) {
                console.error(err)
                setError("Failed to fetch schedules.")
            } finally {
                setLoading(false)
            }
        }

        fetchSchedules()
    }, [user, onSelect])

    const handleChange = (value: string) => {
        setSelectedId(value)
        const found = schedules.find((s) => s.id === value)
        if (found && onSelect) onSelect(found)
    }

    if (loading) return <Loader2 className="animate-spin" />
    if (error) return <p className="text-red-500">{error}</p>
    if (!schedules.length)
        return <p className="text-muted-foreground">No schedules available</p>

    return (
        <div className="space-y-4">
            <Select value={selectedId ?? ""} onValueChange={handleChange}>
                <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Select a schedule" />
                </SelectTrigger>
                <SelectContent>
                    {schedules.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                            {s.scheduleName ?? `Schedule ${s.id}`}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {selectedSchedule && (
                <div>
                    <div>
                        <TypographyH4 className="mb-2">
                            Schedule Details
                        </TypographyH4>

                        <p className="">
                            Name: {selectedSchedule.scheduleName}
                        </p>
                        <p className="">
                            Description: {selectedSchedule.description}
                        </p>
                        <p className="">
                            Duration: {selectedSchedule.startDate} –{" "}
                            {selectedSchedule.endDate}
                        </p>
                    </div>

                    {selectedSchedule.weeklySchedule && (
                        <div className="pt-3">
                            <TypographyH4 className="mb-4">
                                Weekly Schedule
                            </TypographyH4>

                            <div>
                                <div className="flex py-2 font-semibold text-sm text-muted-foreground">
                                    <span className="w-40">Day</span>
                                    <span className="w-40">From</span>
                                    <span className="w-40">To</span>
                                    <span className="w-40">From</span>
                                    <span className="w-40">To</span>
                                </div>

                                {selectedSchedule.weeklySchedule.map((day) => {
                                    const session1 = day.sessions[0]
                                    const session2 = day.sessions[1]

                                    if (
                                        day.available &&
                                        (session1 || session2)
                                    ) {
                                        return (
                                            <div
                                                key={day.day}
                                                className="flex py-2"
                                            >
                                                <span className="w-40 font-medium text-sm">
                                                    {day.day}
                                                </span>

                                                <span className="w-40">
                                                    {session1?.start ?? "-"}
                                                </span>

                                                <span className="w-40 flex gap-2 items-center">
                                                    {session1?.end ?? "-"}
                                                    {session1?.photoStart ||
                                                    session1?.photoEnd ? (
                                                        <Camera
                                                            className={`w-4 h-4 transition-colors
                                                            `}
                                                        />
                                                    ) : (
                                                        "-"
                                                    )}
                                                </span>

                                                <span className="w-40">
                                                    {session2?.start ?? "-"}
                                                </span>

                                                <span className="w-40 flex gap-2 items-center">
                                                    {session2?.end ?? "-"}
                                                    {session2?.photoStart ||
                                                    session2?.photoEnd ? (
                                                        <Camera
                                                            className={`w-4 h-4 transition-colors
                                                            `}
                                                        />
                                                    ) : (
                                                        "-"
                                                    )}
                                                </span>
                                            </div>
                                        )
                                    }

                                    return (
                                        <div
                                            key={day.day}
                                            className="flex py-2"
                                        >
                                            <span className="w-40 font-medium">
                                                {day.day}
                                            </span>
                                            <span className="w-40 text-muted-foreground">
                                                -
                                            </span>
                                            <span className="w-40 text-muted-foreground">
                                                -
                                            </span>
                                            <span className="w-40 text-muted-foreground">
                                                -
                                            </span>
                                            <span className="w-40 text-muted-foreground">
                                                -
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
