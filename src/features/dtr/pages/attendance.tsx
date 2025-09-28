import { useEffect, useRef, useState, useCallback } from "react"
import { useGeolocated } from "react-geolocated"
import { toast } from "sonner"
import BarcodeScannerComponent from "react-qr-barcode-scanner"
import Webcam from "react-webcam"

import { useGetRealAttendances } from "@/api/hooks/use-get-real-attendances"
import { useServerTime } from "@/api/hooks/use-get-server-time"
import { useCreateAttendance } from "@/api/hooks/use-create-attendance"
import { useUser } from "@/hooks/use-user"
import { useCloudinaryUpload } from "@/api/hooks/use-upload-files"
import TimeTrackingCardQr from "../components/time-tracking-card-qr"
import { AttendanceList } from "../components/attendance-list"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { DialogTitle } from "@radix-ui/react-dialog"
import { Button } from "@/components/ui/button"
import { getCurrentSession, reverseGeocode } from "@/service/attendance-service"

const today = new Date()

export default function Attendance() {
    const { user } = useUser()
    const { serverTime } = useServerTime()

    const [currentTime, setCurrentTime] = useState<Date | null>(
        serverTime || null
    )
    const [showScanner, setShowScanner] = useState(false)
    const [showCamera, setShowCamera] = useState(false)
    const [capturedImage, setCapturedImage] = useState<string | null>(null)

    const webcamRef = useRef<Webcam>(null)
    const scanningRef = useRef(false)

    const { coords } = useGeolocated({
        positionOptions: { enableHighAccuracy: false },
        userDecisionTimeout: 5000,
    })

    const { data: attendances, loading: loadingAttendances } =
        useGetRealAttendances({ userId: user?.uid || "", date: today })

    const firstAttendance = attendances?.[0]

    const {
        loading: loadingCreateAttendance,
        error: errorCreateAttendance,
        handleToggleClock,
    } = useCreateAttendance()

    const { upload } = useCloudinaryUpload()

    useEffect(() => {
        if (errorCreateAttendance)
            toast.error(errorCreateAttendance, { duration: 5000 })
    }, [errorCreateAttendance])

    useEffect(() => {
        if (!serverTime) return
        const offset = serverTime.getTime() - Date.now()
        const timer = setInterval(
            () => setCurrentTime(new Date(Date.now() + offset)),
            1000
        )
        return () => clearInterval(timer)
    }, [serverTime])

    const handleClocker = useCallback(() => {
        if (!attendances) {
            toast.error("No schedule found for today.", { duration: 5000 })
            return
        }
        setShowScanner(true)
    }, [attendances])

    const handleClockToggle = useCallback(
        async (attendanceId?: string) => {
            if (scanningRef.current) return
            scanningRef.current = true

            try {
                if (!user || !currentTime || !coords || !attendanceId) {
                    throw new Error(
                        "Unable to process attendance. Please try again."
                    )
                }

                const matchedAttendance =
                    firstAttendance?.schedule.id === attendanceId

                if (!matchedAttendance) {
                    throw new Error("Scanned QR does not match your schedule")
                }

                const {
                    session: currentSession,
                    reason,
                    sessionIndex,
                    isClockIn,
                    isClockOut,
                } = getCurrentSession({
                    attendance: firstAttendance,
                    date: serverTime || new Date(),
                })

                if (!currentSession || sessionIndex === undefined) {
                    throw new Error(reason || "No active session available")
                }

                const scheduleCoords =
                    firstAttendance.sessions[sessionIndex].schedule.geoLocation
                const scheduleRadius =
                    firstAttendance.sessions[sessionIndex].schedule.geoRadius

                if (!scheduleCoords || !scheduleRadius) {
                    throw new Error("Schedule does not have geolocation data")
                }

                const distance = getDistanceMeters(
                    coords.latitude,
                    coords.longitude,
                    scheduleCoords.lat,
                    scheduleCoords.lng
                )

                const isInside = distance <= scheduleRadius

                if (!isInside) {
                    throw new Error("You are outside the allowed range")
                }

                const needsPhoto =
                    (isClockIn &&
                        firstAttendance.sessions[sessionIndex].schedule
                            .photoStart) ||
                    (isClockOut &&
                        firstAttendance.sessions[sessionIndex].schedule
                            .photoEnd)

                if (needsPhoto) {
                    setShowCamera(true)
                    return
                }

                const address = await reverseGeocode({
                    lat: coords.latitude,
                    lng: coords.longitude,
                })

                await handleToggleClock({
                    attendance: firstAttendance,
                    currentSession,
                    date: serverTime || new Date(),
                    geo: { lat: coords.latitude, lng: coords.longitude },
                    address,
                    ...(isClockIn ? { isClockIn: true } : { isClockOut: true }),
                })

                toast.success("Attendance updated successfully")
                setShowScanner(false)
            } catch (err) {
                const message =
                    err instanceof Error
                        ? err.message
                        : "Failed to process attendance"
                toast.error(message)
            } finally {
                setTimeout(() => (scanningRef.current = false), 2000)
            }
        },
        [
            user,
            currentTime,
            coords,
            firstAttendance,
            serverTime,
            handleToggleClock,
        ]
    )

    const capturePhoto = () => {
        const imageSrc = webcamRef.current?.getScreenshot()
        if (imageSrc) setCapturedImage(imageSrc)
    }

    const confirmPhoto = useCallback(async () => {
        const { session: currentSession, isClockIn } = getCurrentSession({
            attendance: firstAttendance,
            date: serverTime || new Date(),
        })

        if (!capturedImage || !currentSession || !coords) {
            toast.error("No active session available or no photo captured")
            return
        }

        try {
            const blob = await (await fetch(capturedImage)).blob()
            const file = new File([blob], "attendance.jpg", {
                type: "image/jpeg",
            })
            const uploaded = await upload(file)

            const address = await reverseGeocode({
                lat: coords.latitude,
                lng: coords.longitude,
            })

            await handleToggleClock({
                attendance: firstAttendance,
                currentSession,
                date: serverTime || new Date(),
                geo: { lat: coords.latitude, lng: coords.longitude },
                photoUrl: uploaded.secure_url,
                address,
                ...(isClockIn ? { isClockIn: true } : { isClockOut: true }),
            })

            toast.success("Attendance updated with photo")
            setShowCamera(false)
            setCapturedImage(null)
        } catch (err) {
            console.error(err)
            toast.error("Failed to upload photo")
        }
    }, [
        capturedImage,
        coords,
        upload,
        firstAttendance,
        serverTime,
        handleToggleClock,
    ])

    return (
        <>
            <div className="flex flex-col p-4 gap-4">
                <div className="flex flex-col items-start justify-between space-y-2 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Clock-in & Out
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your work sessions and track your daily
                            schedule.
                        </p>
                    </div>
                </div>

                <div className="grid auto-rows-auto grid-cols-12 gap-5">
                    <TimeTrackingCardQr
                        attendance={firstAttendance}
                        time={currentTime || new Date()}
                        isClockedIn={false}
                        isInRange={true}
                        onClockToggle={handleClocker}
                        isDisabled={
                            !coords ||
                            loadingCreateAttendance ||
                            loadingAttendances
                        }
                    />

                    <AttendanceList
                        attendances={firstAttendance}
                        loading={loadingAttendances}
                    />
                </div>
            </div>

            {showScanner && (
                <Dialog open={showScanner} onOpenChange={setShowScanner}>
                    <DialogContent>
                        <DialogTitle className="text-center">
                            Scan QR Code
                        </DialogTitle>
                        <div className="flex items-center justify-center rounded-md overflow-hidden">
                            <BarcodeScannerComponent
                                delay={300}
                                onUpdate={(_err, result) => {
                                    if (result) {
                                        handleClockToggle(result.getText())
                                        setShowScanner(false)
                                    }
                                }}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {showCamera && (
                <Dialog
                    open={showCamera}
                    onOpenChange={(open) => {
                        setShowCamera(open)
                        if (!open) setCapturedImage(null)
                    }}
                >
                    <DialogContent>
                        <DialogTitle className="text-center">
                            Take a Photo
                        </DialogTitle>
                        <div className="flex flex-col items-center gap-4">
                            {capturedImage ? (
                                <img
                                    src={capturedImage}
                                    alt="Captured"
                                    className="rounded-md"
                                />
                            ) : (
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    className="rounded-md"
                                />
                            )}

                            <div className="flex gap-3">
                                {!capturedImage ? (
                                    <Button onClick={capturePhoto}>
                                        Capture
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                setCapturedImage(null)
                                            }
                                        >
                                            Retake
                                        </Button>
                                        <Button onClick={confirmPhoto}>
                                            Confirm
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}

function getDistanceMeters(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371e3
    const toRad = (deg: number) => (deg * Math.PI) / 180

    const φ1 = toRad(lat1)
    const φ2 = toRad(lat2)
    const Δφ = toRad(lat2 - lat1)
    const Δλ = toRad(lon2 - lon1)

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
}
