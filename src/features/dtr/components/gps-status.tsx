import { MapPinXIcon } from "lucide-react"

export function GpsStatus({ onEnable }: { onEnable?: () => void }) {
    return (
        <div className="flex justify-between items-center">
            <div className="flex gap-2 text-sm text-yellow-600 items-center">
                <MapPinXIcon className="h-5 w-5" />
                <span>GPS is off — please </span>
                <button
                    onClick={onEnable}
                    className="underline text-yellow-700 hover:text-yellow-800 focus:outline-none focus:ring-1 focus:ring-yellow-700 cursor-pointer"
                    type="button"
                >
                    click here to enable
                </button>
                <span> location access.</span>
            </div>
        </div>
    )
}
