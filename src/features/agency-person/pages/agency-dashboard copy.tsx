// import DataTable from "@/components/data-table"
// import { assignedStudentColumns } from "../components/table/assigned-student-column"
// import type { Student } from "@/types/user"

// // const dummyStudents: Partial<Student>[] = [
// //     {
// //         uid: "1",
// //         photoUrl: "J",
// //         firstName: "Juan",
// //         lastName: "Dela Cruz",
// //         program: "BSIT",
// //         yearLevel: "4",
// //         status: "Ongoing",
// //     },
// //     {
// //         uid: "2",
// //         photoUrl: "M",
// //         firstName: "Maria",
// //         lastName: "Lopez",
// //         program: "BSCS",
// //         yearLevel: "3",
// //         status: "Active",
// //     },
// // ]

import { useEffect, useState } from "react"
import DataTable from "@/components/data-table"
import { assignedStudentColumns } from "../components/table/assigned-student-column"
import type { Student } from "@/types/user"
import { getStudentsPaginated } from "@/api/students"
import { useUser } from "@/hooks/use-user"

export default function AgencyDashboardPage() {
    const { user } = useUser()
    console.log("🚀 ~ AgencyDashboardPage ~ user:", user)

    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStudents() {
            try {
                // ⚡ no filters or pagination, just fetch everything
                const data = await getStudentsPaginated({
                    numPerPage: 10,
                    filter: {
                        assignedAgencyId: user?.uid,
                    },
                })
                setStudents(data.result)
            } catch (error) {
                console.error("Failed to fetch students:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchStudents()
    }, [user?.uid])

    return (
        <div className="space-y-8 p-6">
            {/* Agency Info */}
            <section className="rounded-2xl border p-4 shadow-sm">
                <header className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                        Agency Information
                    </h2>
                    <button className="rounded-lg border px-3 py-1 text-sm hover:bg-muted">
                        Edit Details
                    </button>
                </header>
                <div className="space-y-2">
                    <p>
                        <strong>Name:</strong> {user?.displayName}
                    </p>
                    <p>
                        <strong>Address:</strong> Placeholder Address
                    </p>
                    <p>
                        <strong>Contact Person:</strong> Placeholder Contact
                    </p>
                    <p>
                        <strong>Contact Number/Email:</strong> 0999-999-9999 /
                        sample@email.com
                    </p>
                    <p>
                        <strong>Status:</strong> Active
                    </p>
                </div>
            </section>

            {/* Assigned Students */}
            <section className="rounded-2xl border p-4 shadow-sm">
                <header className="mb-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                            Assigned Students
                        </h2>

                        <button className="rounded-lg border px-3 py-1 text-sm hover:bg-muted">
                            view all
                        </button>
                    </div>
                </header>
                {loading ? (
                    <p className="text-muted-foreground">Loading students…</p>
                ) : (
                    <DataTable
                        columns={assignedStudentColumns({})}
                        data={students}
                    />
                )}
            </section>

            {/* Supervisors */}
            <section className="rounded-2xl border p-4 shadow-sm">
                <header className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Supervisors</h2>
                    <button className="rounded-lg border px-3 py-1 text-sm hover:bg-muted">
                        Assign / Change
                    </button>
                </header>
                <ul className="list-disc pl-6">
                    <li>Supervisor Name – supervisor@email.com</li>
                </ul>
            </section>

            {/* Tasks / Evaluations */}
            <section className="rounded-2xl border p-4 shadow-sm">
                <header className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                        Tasks & Evaluations
                    </h2>
                    <button className="rounded-lg border px-3 py-1 text-sm hover:bg-muted">
                        Download Reports
                    </button>
                </header>
                <div className="text-muted-foreground">
                    Placeholder for student evaluations, logs, attendance.
                </div>
            </section>

            {/* Analytics */}
            <section className="rounded-2xl border p-4 shadow-sm">
                <header className="mb-4">
                    <h2 className="text-xl font-semibold">Analytics</h2>
                </header>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-lg border p-4">
                        <p className="text-sm">Students this term</p>
                        <p className="text-2xl font-bold">25</p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <p className="text-sm">By Program</p>
                        <p className="text-2xl font-bold">
                            BSIT: 15 | BSHM: 10
                        </p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <p className="text-sm">Status Distribution</p>
                        <p className="text-2xl font-bold">
                            20 Ongoing / 5 Completed
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
