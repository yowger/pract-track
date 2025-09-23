import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    MapContainer,
    TileLayer,
    Marker,
    Circle,
    useMapEvents,
    useMap,
} from "react-leaflet"
import L, { type LocationEvent } from "leaflet"
import "leaflet/dist/leaflet.css"
import { LocateControl } from "leaflet.locatecontrol"
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const DEFAULT_GEO = {
    lat: 7.0639,
    lng: 125.6083,
    radius: 15,
}

const singleSessionSchema = z.object({
    start: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
    end: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
    photoStart: z.boolean(),
    photoEnd: z.boolean(),
    lateThresholdMins: z.number().min(0),
    undertimeThresholdMins: z.number().min(0),
    earlyClockInMins: z.number().min(0),
})

const attendanceFormSchema = z.object({
    am: singleSessionSchema,
    pm: singleSessionSchema.optional(),
    geo: z
        .object({
            lat: z.number(),
            lng: z.number(),
            radius: z.number().min(1),
        })
        .optional(),
})

type AttendanceForm = z.infer<typeof attendanceFormSchema>

export function AttendanceSessionsForm({
    onSubmit,
    loading = false,
    defaultGeo = DEFAULT_GEO,
}: {
    onSubmit: (data: AttendanceForm) => void
    loading?: boolean
    defaultGeo?: { lat: number; lng: number; radius: number }
}) {
    const [enableGeo, setEnableGeo] = useState(!!defaultGeo)
    const [enablePm, setEnablePm] = useState(true)
    const form = useForm<AttendanceForm>({
        resolver: zodResolver(attendanceFormSchema),
        defaultValues: {
            am: {
                start: "08:00",
                end: "12:00",
                photoStart: false,
                photoEnd: false,
                lateThresholdMins: 15,
                undertimeThresholdMins: 30,
                earlyClockInMins: 5,
            },
            pm: {
                start: "13:00",
                end: "17:00",
                photoStart: false,
                photoEnd: false,
                lateThresholdMins: 15,
                undertimeThresholdMins: 30,
                earlyClockInMins: 5,
            },
            geo: defaultGeo,
        },
    })

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((data) => {
                    const payload = enablePm
                        ? data
                        : { am: data.am, geo: data.geo }
                    onSubmit(payload)
                })}
                className="space-y-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="md:col-span-2">
                        <CardHeader className="flex items-center justify-between">
                            <CardTitle>Location</CardTitle>
                            <FormField
                                control={form.control}
                                name="geo"
                                render={({ field }) => (
                                    <Switch
                                        checked={enableGeo}
                                        onCheckedChange={(val) => {
                                            setEnableGeo(val)
                                            field.onChange(
                                                val ? defaultGeo : undefined
                                            )
                                        }}
                                    />
                                )}
                            />
                        </CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="geo"
                                render={({ field }) => (
                                    <FormItem>
                                        {enableGeo && field.value && (
                                            <div className="flex flex-col md:flex-row gap-5">
                                                <div className="h-64 md:h-80 md:w-[60%] border border-2 rounded-lg overflow-hidden">
                                                    <MapSelector
                                                        value={field.value}
                                                        onChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </div>

                                                <div className="flex flex-col gap-5 md:w-[40%]">
                                                    <div>
                                                        <FormLabel className="mb-2">
                                                            Latitude
                                                        </FormLabel>
                                                        <Input
                                                            type="number"
                                                            step="0.0001"
                                                            value={
                                                                field.value.lat
                                                            }
                                                            onChange={(e) =>
                                                                field.onChange({
                                                                    ...field.value,
                                                                    lat: parseFloat(
                                                                        e.target
                                                                            .value
                                                                    ),
                                                                })
                                                            }
                                                        />
                                                    </div>

                                                    <div>
                                                        <FormLabel className="mb-2">
                                                            Longitude
                                                        </FormLabel>
                                                        <Input
                                                            type="number"
                                                            step="0.0001"
                                                            value={
                                                                field.value.lng
                                                            }
                                                            onChange={(e) =>
                                                                field.onChange({
                                                                    ...field.value,
                                                                    lng: parseFloat(
                                                                        e.target
                                                                            .value
                                                                    ),
                                                                })
                                                            }
                                                        />
                                                    </div>

                                                    <div>
                                                        <FormLabel className="mb-2">
                                                            Radius
                                                        </FormLabel>
                                                        <Input
                                                            type="number"
                                                            value={
                                                                field.value
                                                                    .radius
                                                            }
                                                            onChange={(e) =>
                                                                field.onChange({
                                                                    ...field.value,
                                                                    radius: parseInt(
                                                                        e.target
                                                                            .value,
                                                                        10
                                                                    ),
                                                                })
                                                            }
                                                        />
                                                        <FormDescription className="mt-2">
                                                            The allowed area for
                                                            attendance. Measured
                                                            in meters.
                                                        </FormDescription>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Morning Session</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <SessionFields prefix="am" form={form} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Afternoon Session</span>
                                <Switch
                                    checked={enablePm}
                                    onCheckedChange={setEnablePm}
                                />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {enablePm && (
                                <SessionFields prefix="pm" form={form} />
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Create Sessions"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

function SessionFields({
    prefix,
    form,
}: {
    prefix: "am" | "pm"
    form: ReturnType<typeof useForm<AttendanceForm>>
}) {
    return (
        <>
            <FormField
                control={form.control}
                name={`${prefix}.start`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                            <Input
                                type="time"
                                value={field.value || ""}
                                onChange={(e) => field.onChange(e.target.value)}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name={`${prefix}.end`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                            <Input
                                type="time"
                                value={field.value || ""}
                                onChange={(e) => field.onChange(e.target.value)}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name={`${prefix}.photoStart`}
                    render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-md border p-3">
                            <FormLabel>Require photo on Check-in</FormLabel>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={`${prefix}.photoEnd`}
                    render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-md border p-3">
                            <FormLabel>Require photo on Check-out</FormLabel>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                control={form.control}
                name={`${prefix}.lateThresholdMins`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Late Threshold</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                            Number of minutes allowed after start time before
                            marking as late.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name={`${prefix}.undertimeThresholdMins`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Undertime Threshold</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                            Number of minutes before scheduled end time that
                            counts as undertime.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name={`${prefix}.earlyClockInMins`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Allow Early Clock-In</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                            Maximum number of minutes before start time an
                            employee can clock in.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    )
}

const invisibleIcon = L.divIcon({ className: "hidden" })

function LocationMarker({
    value,
    onChange,
}: {
    value: { lat: number; lng: number; radius: number }
    onChange: (val: { lat: number; lng: number; radius: number }) => void
}) {
    useMapEvents({
        click(e) {
            onChange({ ...value, lat: e.latlng.lat, lng: e.latlng.lng })
        },
    })

    return <Marker position={value} icon={invisibleIcon} />
}

function LocateControlWrapper({
    value,
    onChange,
}: {
    value: { lat: number; lng: number; radius: number }
    onChange: (val: { lat: number; lng: number; radius: number }) => void
}) {
    const map = useMap()

    useEffect(() => {
        const control = new LocateControl({
            position: "topleft",
            showCompass: true,
            drawCircle: false,
            markerStyle: {
                opacity: 0,
            },
            setView: "once",
            locateOptions: {
                maxZoom: 18,
            },
        })
        control.addTo(map)

        map.on("locationfound", function (event: LocationEvent) {
            if (!event) return

            onChange({ ...value, lat: event.latlng.lat, lng: event.latlng.lng })
        })

        return () => {
            map.removeControl(control)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map])

    return null
}

export function MapSelector({
    value,
    onChange,
}: {
    value: { lat: number; lng: number; radius: number }
    onChange: (val: { lat: number; lng: number; radius: number }) => void
}) {
    if (!value) return null

    const defaultPos = value || DEFAULT_GEO

    return (
        <MapContainer center={defaultPos} zoom={18} className="h-full w-full">
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            <LocateControlWrapper value={value} onChange={onChange} />
            <LocationMarker value={value} onChange={onChange} />
            <Circle
                center={{ lat: value.lat, lng: value.lng }}
                radius={value.radius}
                pathOptions={{
                    color: "#4299e1",
                    fillOpacity: 0.3,
                    weight: 1.5,
                }}
            />
        </MapContainer>
    )
}
