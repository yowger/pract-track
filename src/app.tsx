import { Route, Routes } from "react-router-dom"
import { lazy, Suspense } from "react"

import ProtectedRoute from "@/components/routes/protected-routes"
import AdminLayout from "@/layouts/admin-layout"
import { LoadingFallback } from "./components/loading-fallback"

const SignInPage = lazy(() => import("@/features/auth/pages/sign-in"))
const SignUpPage = lazy(() => import("@/features/auth/pages/sign-up"))
const RoleInitPage = lazy(() => import("@/features/auth/pages/role-init"))
const DtrPage = lazy(() => import("@/features/dtr/pages/dtr"))
const Dashboard = lazy(() => import("@/features/dashboard/pages/dashboard"))
const NotFoundPage = lazy(() => import("@/pages/not-found"))

export default function App() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                <Route path="/dtr" element={<DtrPage />} />
                <Route path="/sign-in" element={<SignInPage />} />
                <Route path="/sign-up" element={<SignUpPage />} />
                <Route path="/role-sign-up" element={<RoleInitPage />} />

                <Route element={<ProtectedRoute />}>
                    <Route element={<AdminLayout />}>
                        <Route path="/" element={<Dashboard />} />
                    </Route>
                </Route>

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    )
}
