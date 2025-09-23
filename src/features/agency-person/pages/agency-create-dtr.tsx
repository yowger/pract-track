import { AttendanceSessionsForm } from "../components/attendance-session-form"

export default function AgencyCreateDtr() {
    return (
        <div className="flex flex-col p-4 gap-4">
            <div className="flex flex-col md:flex-row  md:justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Create New Session
                    </h1>
                    <p className="text-muted-foreground">
                        Create a new attendance session.
                    </p>
                </div>
            </div>

            <div className="grid auto-rows-auto grid-cols-12 gap-5">
                <div className="col-span-12">
                    <AttendanceSessionsForm
                        onSubmit={(values) => {
                            console.log(
                                "🚀 ~ AgencyCreateDtr ~ values:",
                                values
                            )
                        }}
                        defaultGeo={{ lat: 14.65, lng: 121.03, radius: 15 }}
                    />
                </div>
            </div>
        </div>
    )
}
