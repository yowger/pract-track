import { useUser } from "@/hooks/use-user"
import StudentProfile from "../components/student-profile"

export default function StudentProfilePage() {
    const { user } = useUser()

    if (!user) {
        return <div>You are not logged in</div>
    }

    return <StudentProfile studentId={user.uid} />
}
