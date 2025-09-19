// GeoFenceMap.tsx
import { useState } from "react"
import {
    MapContainer,
    TileLayer,
    Marker,
    Circle,
    Popup,
    useMap,
    useMapEvents,
} from "react-leaflet"
import L, { LatLng } from "leaflet"
import "leaflet/dist/leaflet.css"
import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"

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

export function CurrenTLocationMarker() {
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

function ZoomControls() {
    const map = useMap()

    return (
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-50">
            <Button size="icon" onClick={() => map.zoomIn()}>
                <Plus className="h-4 w-4" />
            </Button>

            <Button size="icon" onClick={() => map.zoomOut()}>
                <Minus className="h-4 w-4" />
            </Button>
        </div>
    )
}

export function GeoFenceMap({
    agencyLocation,
    yourLocation,
    allowedRadius,
}: // position,
// onPositionChange,
GeoFenceMapProps) {
    const isInside = yourLocation
        ? L.latLng(yourLocation.lat, yourLocation.lng).distanceTo(
              L.latLng(agencyLocation.lat, agencyLocation.lng)
          ) <= allowedRadius
        : false

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
        <>
            {/* <Button
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
                className="absolute top-14 right-4 z-20 bg-red-500"
                // onClick={recenterUserLocation}
            >
                center to agency
            </Button> */}

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
                zoomControl={false}
            >
                <TileLayer
                    // url="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=np35uMPAnOOrTel4s6Dq"
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    // url="https://tiles.openfreemap.org/styles/liberty"
                    // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    // url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                    // attribution="Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"

                    // url="https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png"
                    // attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
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
                        fillColor: isInside ? "#22c55e" : "#dc2626", // green if inside, red if outside
                        fillOpacity: 0.1,
                        color: isInside ? "#16a34a" : "#b91c1c",
                        weight: 0.5,
                    }}
                />
                <ZoomControls />
                {/* <LocationMarker position={position} /> */}
                {/* <CurrenTLocationMarker /> */}
            </MapContainer>
        </>
    )
}
