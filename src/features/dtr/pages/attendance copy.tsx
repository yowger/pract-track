import React, { useState, useEffect } from "react"
import { MapPin, Clock as ClockIcon, Calendar, Maximize2 } from "lucide-react"

const ClockInOutPage = () => {
    const [currentTime, setCurrentTime] = useState(new Date())
    const [isClockedIn, setIsClockedIn] = useState(false)
    const [clockInTime, setClockInTime] = useState(null)
    const [totalWorkedMinutes, setTotalWorkedMinutes] = useState(0)
    const [isLocationValid, setIsLocationValid] = useState(true)
    const [showFullMap, setShowFullMap] = useState(false)
    const [lastClockAction, setLastClockAction] = useState({
        type: "out",
        time: "5:00 PM",
    })

    // Update current time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    // Format time for display
    const formatTime = (date) => {
        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        })
    }

    // Format date for display
    const formatDate = (date) => {
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    // Format worked time
    const formatWorkedTime = (minutes) => {
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return `${hours}:${mins.toString().padStart(2, "0")}`
    }

    // Calculate remaining time
    const calculateRemainingTime = () => {
        const totalScheduledMinutes = 8 * 60 // 8 hours
        const remainingMinutes = Math.max(
            0,
            totalScheduledMinutes - totalWorkedMinutes
        )
        return formatWorkedTime(remainingMinutes)
    }

    // Handle clock in/out toggle
    const handleClockToggle = () => {
        const now = new Date()
        const timeString = formatTime(now)

        if (!isClockedIn) {
            // Clock In
            setIsClockedIn(true)
            setClockInTime(now)
            setLastClockAction({
                type: "in",
                time: timeString,
            })
        } else {
            // Clock Out
            setIsClockedIn(false)

            if (clockInTime) {
                const workedMinutes = Math.floor(
                    (now - clockInTime) / (1000 * 60)
                )
                setTotalWorkedMinutes((prev) => prev + workedMinutes)
            }

            setLastClockAction({
                type: "out",
                time: timeString,
            })
            setClockInTime(null)
        }
    }

    // Simple map component (placeholder)
    const MapComponent = ({ isFullScreen = false }) => {
        const mapHeight = isFullScreen ? "h-96" : "h-48"

        return (
            <div
                className={`${mapHeight} bg-gradient-to-br from-green-100 to-blue-100 rounded-xl border-2 border-gray-200 relative overflow-hidden`}
            >
                {/* Map placeholder with visual elements */}
                <div className="absolute inset-0 bg-green-50">
                    {/* Work location marker */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                            <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs font-medium shadow">
                            Work Location
                        </div>
                    </div>

                    {/* Geofence circle */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-green-400 border-opacity-50 rounded-full bg-green-200 bg-opacity-20"></div>

                    {/* User location marker */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 translate-x-6 translate-y-4">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg pulse">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs font-medium shadow">
                            You
                        </div>
                    </div>

                    {/* Grid pattern for map feel */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="grid grid-cols-8 grid-rows-6 h-full">
                            {Array.from({ length: 48 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="border border-gray-400"
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Map controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button className="w-8 h-8 bg-white rounded shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50">
                        +
                    </button>
                    <button className="w-8 h-8 bg-white rounded shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50">
                        -
                    </button>
                </div>
            </div>
        )
    }

    // Schedule blocks
    const scheduleBlocks = [
        { time: "8:00 AM - 12:00 PM", label: "Morning Shift" },
        { time: "1:00 PM - 5:00 PM", label: "Afternoon Shift" },
    ]

    const [value, setValue] = useState(new Date())

    useEffect(() => {
        const interval = setInterval(() => setValue(new Date()), 1000)

        return () => {
            clearInterval(interval)
        }
    }, [])

    return (
        <div className="min-h-screen p-4">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className=" bg-gray-800 text-white rounded-t-3xl p-6 text-center">
                    <div className="text-4xl font-light mb-2 font-mono">
                        {formatTime(currentTime)}
                    </div>
                    <div className="text-sm opacity-80">
                        {formatDate(currentTime)}
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-b-3xl shadow-2xl p-6 space-y-6">
                    {/* Status Card */}
                    <div
                        className={`rounded-2xl p-5 border-l-4 ${
                            isClockedIn
                                ? "bg-green-50 border-green-500"
                                : "bg-red-50 border-red-500"
                        }`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <ClockIcon
                                className={`w-5 h-5 ${
                                    isClockedIn
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            />
                            <span className="text-lg font-semibold">
                                {isClockedIn ? "Clocked In" : "Clocked Out"}
                            </span>
                        </div>
                        <div className="text-gray-600 text-sm">
                            Last clocked {lastClockAction.type} at{" "}
                            {lastClockAction.time}
                        </div>
                    </div>

                    {/* Schedule Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar className="w-5 h-5 text-gray-700" />
                            <h3 className="text-lg font-semibold text-gray-800">
                                Today's Schedule
                            </h3>
                        </div>
                        <div className="space-y-3">
                            {scheduleBlocks.map((block, index) => (
                                <div
                                    key={index}
                                    className="bg-blue-50 rounded-xl p-4 flex justify-between items-center"
                                >
                                    <span className="font-semibold text-blue-700">
                                        {block.time}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        {block.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Location Section */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-gray-700" />
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Location Verification
                                </h3>
                            </div>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    isLocationValid
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                }`}
                            >
                                {isLocationValid
                                    ? "✓ In Range"
                                    : "✗ Out of Range"}
                            </span>
                        </div>

                        <MapComponent />

                        <button
                            onClick={() => setShowFullMap(true)}
                            className="w-full mt-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg py-2 px-3 text-sm text-gray-700 flex items-center justify-center gap-2 transition-colors"
                        >
                            <Maximize2 className="w-4 h-4" />
                            View Full Map
                        </button>
                    </div>

                    {/* Clock Button */}
                    <button
                        onClick={handleClockToggle}
                        disabled={!isLocationValid}
                        className={`w-full py-4 px-6 rounded-2xl text-lg font-semibold transition-all transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                            isClockedIn
                                ? "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-red-200"
                                : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-green-200"
                        }`}
                    >
                        {isClockedIn ? "Clock Out" : "Clock In"}
                    </button>

                    {/* Summary */}
                    <div className="bg-gray-50 rounded-2xl p-4 grid grid-cols-2 gap-4 text-center">
                        <div>
                            <h4 className="text-xs text-gray-600 uppercase tracking-wide mb-1">
                                Hours Worked
                            </h4>
                            <span className="text-xl font-semibold text-gray-800">
                                {formatWorkedTime(totalWorkedMinutes)}
                            </span>
                        </div>
                        <div>
                            <h4 className="text-xs text-gray-600 uppercase tracking-wide mb-1">
                                Time Remaining
                            </h4>
                            <span className="text-xl font-semibold text-gray-800">
                                {calculateRemainingTime()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Full Map Modal */}
            {showFullMap && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-semibold">
                                Location Map
                            </h3>
                            <button
                                onClick={() => setShowFullMap(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-4">
                            <MapComponent isFullScreen={true} />
                        </div>
                    </div>
                </div>
            )}

            {/* CSS for pulse animation */}
            <style>{`
                .pulse {
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.1);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
            `}</style>
        </div>
    )
}

export default ClockInOutPage
