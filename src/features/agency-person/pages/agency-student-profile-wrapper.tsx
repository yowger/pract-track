import { useParams } from "react-router-dom"
import StudentProfile from "../../dtr/components/student-profile"

export default function StudentProfileWrapper() {
    const { studentId } = useParams()

    if (!studentId) {
        return <div>No student id</div>
    }

    return <StudentProfile studentId={studentId} />
}
