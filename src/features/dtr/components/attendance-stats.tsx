interface AttendanceStatsProps {
    stats: {
        present: number
        late: number
        excused: number
        absent: number
    }
}

export function AttendanceStats({ stats }: AttendanceStatsProps) {
    const items = [
        { label: "Present", value: stats.present },
        { label: "Late", value: stats.late },
        { label: "Excused", value: stats.excused },
        { label: "Absent", value: stats.absent },
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {items.map((item) => (
                <div key={item.label} className="flex flex-col">
                    <p className="text-2xl font-semibold">{item.value}</p>
                    <p className="text-sm text-muted-foreground">
                        {item.label}
                    </p>
                </div>
            ))}
        </div>
    )
}
