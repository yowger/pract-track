import { Outlet, Route, Routes } from "react-router-dom"
import { lazy, Suspense, useEffect, useState } from "react"

import ProtectedRoute from "@/components/routes/protected-routes"
import AdminLayout from "@/layouts/admin-layout"
import { LoadingFallback } from "./components/loading-fallback"
import { useUser } from "./hooks/use-user"
import DtrCopyPage from "./features/dtr/pages/dtr copy"
import { isAgency, type Role } from "./types/user"
import { fetchAgency } from "./api/agency"

const AgencyInternsPage = lazy(
    () => import("@/features/agency-person/pages/agency-interns")
)
const SchedulesPage = lazy(
    () => import("@/features/agency-person/pages/schedules")
)
const CreateSchedulePage = lazy(
    () => import("@/features/agency-person/pages/create-schedule")
)
const SeedPage = lazy(() => import("@/seeders/page/seed"))
const InternshipDashboardPage = lazy(
    () => import("@/features/chair-person/pages/internship-dashboard")
)
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
const DtrPage = lazy(() => import("@/features/dtr/pages/dtr"))
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
            <Route path="/" element={<InternshipDashboardPage />} />
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
                        element={<StudentManagerDashboardPage />}
                    />
                    <Route path="/schedules" element={<SchedulesPage />} />
                    <Route
                        path="/schedules/new"
                        element={<CreateSchedulePage />}
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
            <Route path="/" element={<Dashboard />} />
            <Route path="/dtr" element={<DtrPage />} />
            <Route path="/dtrCopy" element={<DtrCopyPage />} />
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
