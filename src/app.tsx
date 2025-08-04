import { Route, Routes } from "react-router-dom"

import ProtectedRoute from "./components/routes/protected-routes"
import AdminLayout from "./layouts/admin-layout"
import Dashboard from "./features/dashboard/pages/dashboard"

export default function App() {
    return (
        <Routes>
            <Route element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                    <Route path="/" element={<Dashboard />} />
                </Route>
            </Route>
        </Routes>
    )
}
