import { ChartAreaInteractive } from "../components/charts/chart-area-interactive"
import { SectionCards } from "@/features/dashboard/components/section-cards"

// import data from "@/mock-data/mock-data.json"

export default function Dashboard() {
    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
            </div>
            {/* <DataTable data={data} /> */}
        </div>
    )
}
