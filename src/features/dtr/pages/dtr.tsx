import { useState } from "react"
import { useGeolocated } from "react-geolocated"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { GeoFenceMap } from "./map"
import AttendanceHistory from "../components/attendance-history"
import GeoPermissionHandler from "../components/geo-permission-handler"

const agencyLocation = {
    lat: 6.748454,
    lng: 125.35038,
}
const allowedRadius = 75

type LatLng = { lat: number; lng: number }

export default function DtrPage() {
    const [status, setStatus] = useState<
        "not_logged_in" | "checked_in" | "checked_out"
    >("not_logged_in")

    const [attendanceHistory, setAttendanceHistory] = useState([
        {
            date: "2025-08-05",
            checkIn: "08:01 AM",
            checkOut: "05:00 PM",
            status: "Present",
        },
        {
            date: "2025-08-04",
            checkIn: "08:10 AM",
            checkOut: "05:00 PM",
            status: "Late",
        },
        {
            date: "2025-08-03",
            checkIn: null,
            checkOut: null,
            status: "Absent",
        },
    ])

    const { coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: false,
            },
            userDecisionTimeout: 5000,
        })

    const userPosition: LatLng | null =
        coords?.latitude !== undefined && coords?.longitude !== undefined
            ? { lat: coords.latitude, lng: coords.longitude }
            : null

    const isInside = userPosition
        ? isWithinBounds(userPosition, agencyLocation, allowedRadius)
        : false

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-8 relative">
            <div>
                <h1 className="text-xl font-medium">Debug</h1>

                {!isGeolocationAvailable ? (
                    <div>Your browser does not support Geolocation</div>
                ) : !isGeolocationEnabled ? (
                    <div>Geolocation is not enabled</div>
                ) : coords ? (
                    <GeoLocationInfo coords={coords} />
                ) : (
                    <div>Getting the location data&hellip;</div>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Daily Time Record</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Manage your attendance for today
                    </p>
                </CardHeader>
                <CardContent className="space-y-6 relative">
                    <GeoPermissionHandler
                        onPermissionGranted={() =>
                            console.log("Permission granted")
                        }
                        onPermissionDenied={() =>
                            console.log("Permission denied")
                        }
                        onPermissionPrompt={() =>
                            console.log("Permission prompt")
                        }
                    />

                    <div>
                        <Label>Status:</Label>
                        <p className="text-lg font-semibold mt-1">
                            {status === "not_logged_in"
                                ? "Not Logged In"
                                : status === "checked_in"
                                ? "Checked In"
                                : "Checked Out"}
                        </p>
                    </div>

                    <div className="h-64 mb-4 rounded-md relative">
                        <GeoFenceMap
                            agencyLocation={agencyLocation}
                            allowedRadius={allowedRadius}
                            yourLocation={userPosition}
                        />
                    </div>

                    <div>
                        <Label>Geolocation</Label>
                        <p
                            className={`mt-1 text-sm font-semibold ${
                                isInside ? "text-green-600" : "text-red-600"
                            }`}
                        >
                            {coords?.latitude?.toFixed(4) ?? "-"},{" "}
                            {coords?.longitude?.toFixed(4) ?? "-"} —{" "}
                            {isInside
                                ? "Inside attendance zone"
                                : "Outside attendance zone"}
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            disabled={status !== "not_logged_in" || !isInside}
                            variant="outline"
                            className="flex-1"
                        >
                            Log Check-in
                        </Button>
                        <Button
                            disabled={status !== "checked_in"}
                            variant="outline"
                            className="flex-1"
                        >
                            Log Check-out
                        </Button>
                    </div>

                    <div className="flex gap-4">
                        <Button variant="ghost" disabled>
                            Scan QR Code (coming soon)
                        </Button>
                        <Button variant="ghost" disabled>
                            Capture Photo (coming soon)
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <AttendanceHistory history={attendanceHistory} />
        </div>
    )
}

function isWithinBounds(
    point: LatLng,
    center: LatLng,
    radiusMeters: number
): boolean {
    function toRad(deg: number) {
        return (deg * Math.PI) / 180
    }

    const earthRadiusInMeters = 6371000
    const dLat = toRad(center.lat - point.lat)
    const dLng = toRad(center.lng - point.lng)

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(point.lat)) *
            Math.cos(toRad(center.lat)) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = earthRadiusInMeters * c

    return distance <= radiusMeters
}

type GeoCoords = {
    latitude: number
    longitude: number
    altitude?: number | null
    heading?: number | null
    speed?: number | null
}

export function GeoLocationInfo({ coords }: { coords: GeoCoords | null }) {
    if (!coords) {
        return <div>No geolocation data available</div>
    }

    return (
        <table>
            <tbody>
                <tr>
                    <td>Latitude</td>
                    <td>{coords.latitude}</td>
                </tr>
                <tr>
                    <td>Longitude</td>
                    <td>{coords.longitude}</td>
                </tr>
                <tr>
                    <td>Altitude</td>
                    <td>{coords.altitude ?? "-"}</td>
                </tr>
                <tr>
                    <td>Heading</td>
                    <td>{coords.heading ?? "-"}</td>
                </tr>
                <tr>
                    <td>Speed</td>
                    <td>{coords.speed ?? "-"}</td>
                </tr>
            </tbody>
        </table>
    )
}
