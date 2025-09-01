import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { getSchedules } from "@/api/scheduler"
import type { Scheduler } from "@/types/scheduler"
import { useUser } from "@/hooks/use-user"
import { isAgency } from "@/types/user"

export default function Schedules() {
    const { user } = useUser()
    const [schedules, setSchedules] = useState<(Scheduler & { id: string })[]>(
        []
    )
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

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
            } catch (err) {
                console.error(err)
                setError("Failed to fetch schedules.")
            } finally {
                setLoading(false)
            }
        }

        fetchSchedules()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="p-6 space-y-4">
            <div>
                <Link
                    to="/schedules/new"
                    className="text-blue-600 hover:underline"
                >
                    Create new schedule
                </Link>
            </div>

            {loading && <p>Loading schedules...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && schedules.length === 0 && !error && (
                <p>No schedules found.</p>
            )}

            <ul className="space-y-2">
                {schedules.map((sched) => (
                    <li key={sched.id} className="p-2 border rounded">
                        <div className="font-semibold">
                            {sched.scheduleName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {sched.startDate} → {sched.endDate}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
