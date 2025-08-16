import { Route, Routes } from "react-router-dom"
import { lazy, Suspense } from "react"

import ProtectedRoute from "@/components/routes/protected-routes"
import AdminLayout from "@/layouts/admin-layout"
import { LoadingFallback } from "./components/loading-fallback"
import { useUser } from "./hooks/use-user"
import DtrCopyPage from "./features/dtr/pages/dtr copy"
import type { Role } from "./types/user"
// import StudentDashboard from "./features/student/pages/student-dashboard"

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

const chairPersonRoutes = (
    <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
            <Route path="/" element={<Dashboard />} />
            {/* <Route path="/chair/reports" element={<ChairReportsPage />} /> */}
        </Route>
    </Route>
)

const agencySupervisorRoutes = (
    <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route
                path="/agency/supervisor/dashboard"
                // element={<AgencyDashboardPage />}
            />
        </Route>
    </Route>
)

const authRoutes = (
    <>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="*" element={<SignInPage />} />
    </>
)

const notFoundRoute = <Route path="*" element={<NotFoundPage />} />
