import { Outlet, Route, Routes } from "react-router-dom"
import { lazy, Suspense, useEffect, useState } from "react"

import ProtectedRoute from "@/components/routes/protected-routes"
import AdminLayout from "@/layouts/admin-layout"
import { LoadingFallback } from "./components/loading-fallback"
import { useUser } from "./hooks/use-user"
import { isAgency, type Role } from "./types/user"
import { fetchAgency } from "./api/agency"
import ViewSchedule from "./features/agency-person/pages/view-schedule"
// import AttendanceSeeder from "./features/dtr/pages/attendance-seeder"
import AttendanceHistory from "./features/dtr/pages/attendance-history"
// import AgencyStudentReview from "./features/agency-person/pages/agency-student-review"
// import StudentProfile from "./features/dtr/pages/student-profile"
// import StudentDashboard from "./features/student/pages/student-dashboard"
// import AgencyAssignedSchedules from "./features/agency-person/pages/agency-assigned-students"

// const AttendanceHistoryPage = lazy(
//     () => import("@/features/dtr/pages/attendance-history")
// )
// const AttendaceSeederPage = lazy(
//     () => import("@/features/dtr/pages/attendance-seeder")
// )
// const ViewScheudulePage = lazy(
//     () => import("@/features/agency-person/pages/view-schedule")
// )
const ExcusePage = lazy(() => import("@/features/dtr/pages/excuse"))
const AgencyDtrQrPage = lazy(
    () => import("@/features/agency-person/pages/agency-dtr-qr")
)
const AgencyCreateDtrPage = lazy(
    () => import("@/features/agency-person/pages/agency-create-dtr")
)
const AgencyStudentReviewPage = lazy(
    () => import("@/features/agency-person/pages/agency-student-review")
)
const AgencyAssignedStudentsPage = lazy(
    () => import("@/features/agency-person/pages/agency-assigned-students")
)
const AgencyStudentProfilePage = lazy(
    () =>
        import("@/features/agency-person/pages/agency-student-profile-wrapper")
)
const StudentProfilePage = lazy(
    () => import("@/features/dtr/pages/student-profile")
)
const StudentDashboardPage = lazy(
    () => import("@/features/dtr/pages/student-profile")
)

// const AgencyAssignSchedulesPage = lazy(
//     () => import("@/features/agency-person/pages/agency-assign-schedules")
// )
const AttendancePage = lazy(() => import("@/features/dtr/pages/attendance"))
const AgencyInternsPage = lazy(
    () => import("@/features/agency-person/pages/agency-interns")
)
// const SchedulesPage = lazy(
//     () => import("@/features/agency-person/pages/schedules")
// )
const CreateSchedulePage = lazy(
    () => import("@/features/agency-person/pages/create-schedule")
)
const SeedPage = lazy(() => import("@/seeders/page/seed"))
// const InternshipDashboardPage = lazy(
//     () => import("@/features/chair-person/pages/internship-dashboard")
// )
const StudentManagerDashboardPage = lazy(
    () => import("@/features/chair-person/pages/student-manager-dashboard")
)
const AgencyDashboardPage = lazy(
    () => import("@/features/agency-person/pages/agency-dashboard")
)
const CreateAgencyPage = lazy(
    () => import("@/features/agency-person/pages/create-agency")
)
const SignInPage = lazy(() => import("@/features/auth/pages/sign-in"))
const SignUpPage = lazy(() => import("@/features/auth/pages/sign-up"))
const RoleInitPage = lazy(() => import("@/features/auth/pages/role-init"))
// const DtrPage = lazy(() => import("@/features/dtr/pages/attendance"))
const Dashboard = lazy(() => import("@/features/dashboard/pages/dashboard"))
const NotFoundPage = lazy(() => import("@/pages/not-found"))

export default function App() {
    const { user, isLoading } = useUser()

    if (isLoading) {
        return <LoadingFallback />
    }

    const hasUser = !!user
    const role = user?.role

    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                {hasUser ? (
                    role ? (
                        <>{getRoutesForRole(role)}</>
                    ) : (
                        roleSignUpRoutes
                    )
                ) : (
                    authRoutes
                )}
                {notFoundRoute}
                <Route path="/seed" element={<SeedPage />} />
            </Routes>
        </Suspense>
    )
}

function getRoutesForRole(role: Role | undefined) {
    switch (role) {
        case "student":
            return studentRoutes
        case "practicum_adviser":
            return adviserRoutes
        case "chair_person":
            return chairPersonRoutes
        case "agency_supervisor":
            return agencySupervisorRoutes
        default:
            return <div>Role undefined. please contact support</div>
    }
}

const roleSignUpRoutes = (
    <>
        <Route path="/role-sign-up" element={<RoleInitPage />} />
        <Route path="*" element={<RoleInitPage />} />
    </>
)

const authRoutes = (
    <>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="*" element={<SignInPage />} />
    </>
)

const chairPersonRoutes = (
    <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
            {/* <Route path="/" element={<InternshipDashboardPage />} /> */}
            <Route path="/" element={<StudentManagerDashboardPage />} />
            <Route path="/students" element={<StudentManagerDashboardPage />} />
            <Route
                path="/agencies/:agencyId"
                element={<AgencyDashboardPage />}
            />
        </Route>
    </Route>
)

const agencySupervisorRoutes = (
    <>
        <Route element={<AgencyGuard />}>
            <Route element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                    <Route path="/" element={<AgencyDashboardPage />} />
                    <Route
                        path="/students"
                        element={<AgencyAssignedStudentsPage />}
                    />
                    <Route
                        path="/students/:studentId/review"
                        element={<AgencyStudentReviewPage />}
                    />
                    <Route
                        path="/students/:studentId"
                        element={<AgencyStudentProfilePage />}
                    />
                    {/* <Route path="/schedules" element={<SchedulesPage />} /> */}
                    <Route
                        path="/schedules/new"
                        element={<CreateSchedulePage />}
                    />
                    <Route path="/dtr" element={<AgencyCreateDtrPage />} />
                    <Route path="/dtr/qr" element={<AgencyDtrQrPage />} />
                    <Route
                        path="/schedules/:scheduleId"
                        element={<ViewSchedule />}
                    />
                    <Route path="/interns" element={<AgencyInternsPage />} />
                </Route>
            </Route>
        </Route>
    </>
)

const studentRoutes = (
    <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
            {/* <Route path="/" element={<StudentDashboard />} /> */}
            {/* <Route path="/" element={<Dashboard />} /> */}
            <Route path="/" element={<AttendancePage />} />
            <Route path="/attendance" element={<AttendanceHistory />} />
            <Route path="/dashboard" element={<StudentDashboardPage />} />
            <Route path="/excuse" element={<ExcusePage />} />
            <Route path="/profile" element={<StudentProfilePage />} />
            {/* <Route path="/excuse" element={<ExcusePage />} /> */}
            {/* <Route path="/seeder" element={<AttendanceSeeder />} /> */}
            {/* <Route path="/dtr" element={<DtrPage />} /> */}
            {/* <Route path="/dtrCopy" element={<DtrCopyPage />} /> */}
        </Route>
    </Route>
)

const adviserRoutes = (
    <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
            <Route path="/" element={<Dashboard />} />
        </Route>
    </Route>
)

const notFoundRoute = <Route path="*" element={<NotFoundPage />} />

function AgencyGuard() {
    const { user, setUser, isLoading } = useUser()
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        async function fetchAgencyFunction() {
            if (!user || !isAgency(user)) {
                setChecking(false)
                return
            }

            if (user.companyData) {
                setChecking(false)

                return
            }

            const agency = await fetchAgency(user.uid)

            if (agency) {
                setUser({
                    ...user,
                    companyData: agency,
                })
            }

            setChecking(false)
        }

        fetchAgencyFunction()
    }, [user, setUser])

    if (isLoading || checking) return <LoadingFallback />

    if (!user || !isAgency(user)) {
        return <div>Access Denied</div>
    }

    if (!user.companyData) return <CreateAgencyPage />

    return <Outlet />
}
