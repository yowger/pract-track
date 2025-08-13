import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface Evaluation {
    score: number
    comments: string
}

interface Task {
    id: string
    title: string
    dueDate: string
}

interface Notification {
    id: string
    message: string
}

interface StudentData {
    status: string
    assignedAgencyName?: string
    assignedSupervisorName?: string
    attendanceCount: number
    attendancePercent: number
    latestEvaluation?: Evaluation
    pendingTasks: Task[]
    notifications: Notification[]
}

const dummyUser = {
    firstName: "Juan",
    lastName: "Dela Cruz",
}

const dummyStudentData: StudentData = {
    status: "In Progress",
    assignedAgencyName: "Barangay Health Center",
    assignedSupervisorName: "Dr. Reyes",
    attendanceCount: 24,
    attendancePercent: 96,
    latestEvaluation: {
        score: 92,
        comments: "Excellent work ethic and punctuality.",
    },
    pendingTasks: [
        { id: "1", title: "Submit weekly report", dueDate: "2025-08-15" },
        { id: "2", title: "Attend feedback session", dueDate: "2025-08-20" },
    ],
    notifications: [
        { id: "1", message: "New practicum guidelines released." },
        { id: "2", message: "Submit your updated ID photo." },
    ],
}

export default function StudentDashboard() {
    const user = dummyUser
    const studentData = dummyStudentData

    return (
        <div className="p-6 space-y-8 max-w-4xl mx-auto">
            <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
                Welcome, {user.firstName} {user.lastName}!
            </h1>

            <Card>
                <CardHeader>
                    <CardTitle>Your Practicum Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                    <p>
                        Status: <strong>{studentData.status}</strong>
                    </p>
                    <p>
                        Assigned Agency:{" "}
                        <strong>
                            {studentData.assignedAgencyName ??
                                "Not assigned yet"}
                        </strong>
                    </p>
                    <p>
                        Supervisor:{" "}
                        <strong>
                            {studentData.assignedSupervisorName ?? "N/A"}
                        </strong>
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Attendance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                    <p>
                        Total Days Attended:{" "}
                        <strong>{studentData.attendanceCount}</strong>
                    </p>
                    <p>
                        Attendance Percentage:{" "}
                        <strong>{studentData.attendancePercent}%</strong>
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Latest Evaluation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {studentData.latestEvaluation ? (
                        <>
                            <p>
                                Score:{" "}
                                <strong>
                                    {studentData.latestEvaluation.score}
                                </strong>
                            </p>
                            <p>
                                Comments:{" "}
                                {studentData.latestEvaluation.comments}
                            </p>
                            <a
                                href="/evaluations"
                                className="text-primary hover:underline"
                            >
                                View All Evaluations
                            </a>
                        </>
                    ) : (
                        <p>No evaluations yet.</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Pending Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                    {studentData.pendingTasks.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1">
                            {studentData.pendingTasks.map((task) => (
                                <li key={task.id}>
                                    {task.title} - Due {task.dueDate}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>You have no pending tasks. Good job!</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Announcements</CardTitle>
                </CardHeader>
                <CardContent>
                    {studentData.notifications.length > 0 ? (
                        <ul className="space-y-2">
                            {studentData.notifications.map((note) => (
                                <li
                                    key={note.id}
                                    className="border-b border-muted pb-1"
                                >
                                    {note.message}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No new announcements.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

/*
{
  "userId": "EMP001",
    "departmentId": "HR01",F
  "schedule": {
    "monday": {
      "workStart": {
        "time": "08:00",
        "requireSelfie": true
      },
      "lunchStart": {
        "time": "12:00",
        "requireSelfie": false
      },
      "lunchEnd": {
        "time": "13:00",
        "requireSelfie": true
      },
      "workEnd": {
        "time": "17:00",
        "requireSelfie": false
      },
      "location": {
        "lat": 14.5995,
        "lng": 120.9842,
        "radiusMeters": 100
      }
    },
    "tuesday": {
     "departmentId": "HR01",
      "workStart": {
        "time": "08:00",
        "requireSelfie": true
      },
      "lunchStart": {
        "time": "12:00",
        "requireSelfie": false
      },
      "lunchEnd": {
        "time": "13:00",
        "requireSelfie": false
      },
      "workEnd": {
        "time": "17:00",
        "requireSelfie": false
      },
      "location": {
        "lat": 14.5995,
        "lng": 120.9842,
        "radiusMeters": 100
      }
    }
  }
}

{
  "userId": "EMP001",
  "date": "2025-08-12",
  "punches": [
    { "type": "workStart", "time": "07:50", "location": {...}, "selfie": "url1" },
    { "type": "lunchStart", "time": "12:03", "location": {...}, "selfie": null },
    { "type": "lunchEnd", "time": "12:55", "location": {...}, "selfie": "url2" },
    { "type": "workEnd", "time": "17:02", "location": {...}, "selfie": null }
  ]
}


{
  "userId": "EMP001",
  "departmentId": "HR01",
  
  "weeklySchedule": {
    "monday": {
      "workStart": { "time": "08:00", "requireSelfie": true },
      "lunchStart": { "time": "12:00", "requireSelfie": false },
      "lunchEnd":   { "time": "13:00", "requireSelfie": true },
      "workEnd":    { "time": "17:00", "requireSelfie": false },
      "location": { "lat": 14.5995, "lng": 120.9842, "radiusMeters": 100 }
    },
    "tuesday": {
      "workStart": { "time": "08:00", "requireSelfie": true },
      "lunchStart": { "time": "12:00", "requireSelfie": false },
      "lunchEnd":   { "time": "13:00", "requireSelfie": false },
      "workEnd":    { "time": "17:00", "requireSelfie": false },
      "location": { "lat": 14.5995, "lng": 120.9842, "radiusMeters": 100 }
    }
    // ... rest of the week
  },

  "overrides": {
    "2025-08-14": {
      "note": "Company Holiday - No work",
      "holiday": true
    },
    "2025-08-15": {
      "workStart": { "time": "09:30", "requireSelfie": true },
      "lunchStart": { "time": "13:00", "requireSelfie": false },
      "lunchEnd":   { "time": "14:00", "requireSelfie": false },
      "workEnd":    { "time": "18:30", "requireSelfie": true },
      "location": { "lat": 14.6000, "lng": 120.9850, "radiusMeters": 80 }
    }
  }

  ---

  {
  "userId": "EMP001",

  "weeklySchedule": {
    "monday": {
      "departmentId": "HR01",
      "workStart": { "time": "08:00", "requireSelfie": true },
      "lunchStart": { "time": "12:00", "requireSelfie": false },
      "lunchEnd":   { "time": "13:00", "requireSelfie": true },
      "workEnd":    { "time": "17:00", "requireSelfie": false },
      "location": { "lat": 14.5995, "lng": 120.9842, "radiusMeters": 100 }
    },
    "tuesday": {
      "departmentId": "HR01",
      "workStart": { "time": "08:00", "requireSelfie": true },
      "lunchStart": { "time": "12:00", "requireSelfie": false },
      "lunchEnd":   { "time": "13:00", "requireSelfie": false },
      "workEnd":    { "time": "17:00", "requireSelfie": false },
      "location": { "lat": 14.5995, "lng": 120.9842, "radiusMeters": 100 }
    }
    // ... rest of the week
  },

  "overrides": {
    "2025-08-14": {
      "note": "Company Holiday - No work",
      "holiday": true,
      "departmentId": "HR01"
    },
    "2025-08-15": {
      "departmentId": "HR01",
      "workStart": { "time": "09:30", "requireSelfie": true },
      "lunchStart": { "time": "13:00", "requireSelfie": false },
      "lunchEnd":   { "time": "14:00", "requireSelfie": false },
      "workEnd":    { "time": "18:30", "requireSelfie": true },
      "location": { "lat": 14.6000, "lng": 120.9850, "radiusMeters": 80 }
    }
  }
}
}


*/
