interface AttendanceStatsProps {
    stats: {
        present: number
        late: number
        excused: number
        absent: number
    }
}

export function AttendanceStats({ stats }: AttendanceStatsProps) {
    const total = stats.present + stats.late + stats.excused + stats.absent || 1 // prevent divide by 0

    const items = [
        { label: "Present", value: stats.present },
        { label: "Late", value: stats.late },
        { label: "Excused", value: stats.excused },
        { label: "Absent", value: stats.absent },
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {items.map((item) => {
                const percentage = ((item.value / total) * 100).toFixed(1)
                return (
                    <div key={item.label} className="flex flex-col">
                        <p className="text-sm text-muted-foreground mb-2">
                            {item.label}
                        </p>

                        <div className="space-y-1">
                            <p className="text-2xl font-semibold">
                                {item.value}
                            </p>
                            <p className="text-xs text-gray-500">
                                {percentage}% of total
                            </p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
