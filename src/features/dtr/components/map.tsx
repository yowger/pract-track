// GeoFenceMap.tsx
import { useState } from "react"
import {
    MapContainer,
    TileLayer,
    Marker,
    Circle,
    Popup,
    // useMap,
    useMapEvents,
} from "react-leaflet"
import { LatLng } from "leaflet"
import "leaflet/dist/leaflet.css"
import { Button } from "@/components/ui/button"

type GeoFenceMapProps = {
    agencyLocation: { lat: number; lng: number }
    allowedRadius: number
    yourLocation?: { lat: number; lng: number } | null
    // position: { lat: number; lng: number } | null
    // onPositionChange: (pos: { lat: number; lng: number } | null) => void
}

// function LocationMarker({
//     position,
// }: {
//     position: { lat: number; lng: number } | null
// }) {
//     const map = useMap()
//     useEffect(() => {
//         if (position) {
//             map.setView(L.latLng(position.lat, position.lng), 16)
//         }
//     }, [position, map])

//     return position ? (
//         <Marker position={[position.lat, position.lng]}>
//             <Popup>Your Location</Popup>
//         </Marker>
//     ) : null
// }

function CurrenTLocationMarker() {
    const [position, setPosition] = useState<LatLng | null>(null)

    const map = useMapEvents({
        click() {
            map.locate()
        },

        locationfound(e) {
            setPosition(e.latlng)
            map.flyTo(e.latlng, map.getZoom())
        },
    })

    return position === null ? null : (
        <Marker position={position}>
            <Popup>You are here</Popup>
        </Marker>
    )
}

export function DTRMap({
    agencyLocation,
    yourLocation,
    allowedRadius,
}: // position,
// onPositionChange,
GeoFenceMapProps) {
    // const map = useMap()

    // function recenterUserLocation() {
    //     if (!navigator.geolocation) return
    //     navigator.geolocation.getCurrentPosition(
    //         (pos) => {
    //             const lat = pos.coords.latitude
    //             const lng = pos.coords.longitude
    //             onPositionChange({ lat, lng })
    //             map.setView(L.latLng(lat, lng), 16)
    //         },
    //         () => {
    //             // handle error if needed
    //         },
    //         { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    //     )
    // }

    return (
        <div className="relative">
            <Button
                size="sm"
                variant="outline"
                className="absolute top-4 right-4 z-20"
                // onClick={recenterUserLocation}
            >
                Center to user
            </Button>
            <Button
                size="sm"
                variant="outline"
                className="absolute top-14 right-4 z-20"
                // onClick={recenterUserLocation}
            >
                center to agency
            </Button>
            <MapContainer
                center={[agencyLocation.lat, agencyLocation.lng]}
                zoom={16}
                scrollWheelZoom={true}
                style={{
                    height: "100%",
                    width: "100%",
                    position: "relative",
                    zIndex: 0,
                }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* <Marker position={[agencyLocation.lat, agencyLocation.lng]}>
                    <Popup>Agency Location</Popup>
                </Marker> */}
                {yourLocation && (
                    <Marker position={[yourLocation.lat, yourLocation.lng]} />
                )}
                <Circle
                    center={[agencyLocation.lat, agencyLocation.lng]}
                    radius={allowedRadius}
                    pathOptions={{
                        fillColor: "blue",
                        fillOpacity: 0.2,
                        color: "blue",
                    }}
                />
                {/* <LocationMarker position={position} /> */}
                <CurrenTLocationMarker />
            </MapContainer>
        </div>
    )
}
