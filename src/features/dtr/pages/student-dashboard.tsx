import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function StudentDashboard() {
    return (
        <div>
            <Button asChild>
                <Link to="/attendance">Generate DTR</Link>
            </Button>
        </div>
    )
}
