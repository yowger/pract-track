import { Route, Routes } from "react-router-dom"
import { lazy, Suspense } from "react"

import ProtectedRoute from "@/components/routes/protected-routes"
import AdminLayout from "@/layouts/admin-layout"
import { LoadingFallback } from "./components/loading-fallback"
import { useUser } from "./hooks/use-user"

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
    const hasRole = !!user?.profile?.role

    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                {hasUser ? (
                    hasRole ? (
                        <>
                            {adminRoutes}
                            {notFoundRoute}
                        </>
                    ) : (
                        roleInitRoutes
                    )
                ) : (
                    authRoutes
                )}
            </Routes>
        </Suspense>
    )
}

const adminRoutes = (
    <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dtr" element={<DtrPage />} />
        </Route>
    </Route>
)

const roleInitRoutes = (
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

const notFoundRoute = <Route path="*" element={<NotFoundPage />} />
