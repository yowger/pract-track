import { IconInfoCircle } from "@tabler/icons-react"

type Status = "timedIn" | "timedOut"

interface StatusIndicatorProps {
    status: Status
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
    const isTimedIn = status === "timedIn"

    const baseClasses =
        "inline-flex gap-2 items-center px-3 py-2 rounded-md bg-gradient-to-r to-transparent select-none text-sm"

    const timedInClasses = "from-emerald-500/50 dark:from-emerald-800/50"

    const timedOutClasses =
        "from-red-500/50 dark:from-red-800/50"

    const classes = `${baseClasses} ${
        isTimedIn ? timedInClasses : timedOutClasses
    }`

    return (
        <div className={classes}>
            <IconInfoCircle className="h-5 w-5" />
            <span>
                You are currently {isTimedIn ? "Timed In" : "Timed Out"}
            </span>
        </div>
    )
}
