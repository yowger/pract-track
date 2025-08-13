import { useState, useEffect } from "react"
import { getServerTimeOffset } from "@/api/get-server-time"

interface LiveClockProps {
    className?: string
}

export default function LiveClock({ className }: LiveClockProps) {
    const [time, setTime] = useState(new Date())
    const [offset, setOffset] = useState(0)

    useEffect(() => {
        async function fetchServerTime() {
            try {
                const serverTime = await getServerTimeOffset()

                setOffset(serverTime)
            } catch (e) {
                console.error(e)
            }
        }

        fetchServerTime()

        const timer = setInterval(() => {
            setTime(new Date(Date.now() + offset))
        }, 1000)

        return () => clearInterval(timer)
    }, [offset])

    return <span className={className}>{time.toLocaleTimeString()}</span>
}
