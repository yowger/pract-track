import Cookies from "js-cookie"
import { Outlet } from "react-router-dom"

import { AppSidebar } from "@/layouts/sidebar/app-sidebar"
import { SiteHeader } from "@/layouts/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

const sidebarState = Cookies.get("sidebar_state")
const defaultOpen = sidebarState === "true"

export default function AdminLayout() {
    return (
        <SidebarProvider
            defaultOpen={defaultOpen}
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <Outlet />
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
