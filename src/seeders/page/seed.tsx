import { Button } from "@/components/ui/button"
import { seedStudents } from "../seed-students"

export default function SeedPage() {
    return (
        <div>
            SeedPage
            <Button onClick={() => seedStudents(120)}>Seed students</Button>
        </div>
    )
}
