import { Route, Routes } from "react-router-dom"

import ProtectedRoute from "./components/routes/protected-routes"
import AdminLayout from "./layouts/admin-layout"
// import Dashboard from "./features/dashboard/pages/dashboard"
import LoginPage from "./features/auth/pages/login"

export default function App() {
    return (
        <Routes>
            <Route path="/sign-up" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                    {/* <Route path="/" element={<Dashboard />} /> */}
                    <Route path="/" element={<Placeholder />} />
                </Route>
            </Route>
        </Routes>
    )
}

function Placeholder() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="bg-muted/50 aspect-video rounded-xl" />
                <div className="bg-muted/50 aspect-video rounded-xl" />
                <div className="bg-muted/50 aspect-video rounded-xl" />
            </div>
            <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
    )
}
