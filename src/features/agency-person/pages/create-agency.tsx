import { Timer } from "lucide-react"
import CreateAgencyForm from "../components/create-agency-form"

export default function CreateAgencyPage() {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm md:max-w-lg lg:max-w-xl flex-col gap-6">
                <a
                    href="#"
                    className="flex items-center gap-2 self-center font-medium"
                >
                    <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                        <Timer className="size-4" />
                    </div>
                    Prac track
                </a>

                <div className="text-center mb-2">
                    <h1 className="text-xl font-medium tracking-tight">
                        Create Your Agency
                    </h1>
                    <p className="text-muted-foreground">
                        Set up your agency profile so you can start managing
                        your clients.
                    </p>
                </div>

                <CreateAgencyForm />
            </div>
        </div>
    )
}
