import {
    AudioWaveform,
    Bot,
    Command,
    GalleryVerticalEnd,
    Settings2,
    FileUp,
    History,
    UserCheck,
    CalendarDays,
    Map,
    BookOpen,
    QrCode,
    Users,
    type LucideIcon,
} from "lucide-react"

import { AppNavMain } from "./app-nav-main"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import { useUser } from "@/hooks/use-user"
import type { Role } from "@/types/user"

interface SidebarItem {
    title: string
    url: string
    icon: LucideIcon
}

type SidebarConfig = {
    [key in Role]: SidebarItem[]
}

const teams = [
    {
        name: "Acme Inc",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
    },
    {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
    },
    {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
    },
]

const sidebarConfig: SidebarConfig = {
    student: [
        {
            title: "Files & Reports",
            url: "/files",
            icon: FileUp,
        },
        {
            title: "Evaluation History",
            url: "/evaluation/history",
            icon: History,
        },
        {
            title: "Daily Time Record",
            url: "/dtr",
            icon: CalendarDays,
        },
        {
            title: "Attendance",
            url: "/attendance",
            icon: UserCheck,
        },
    ],

    practicum_adviser: [
        {
            title: "Provide Feedback & Grades",
            url: "/adviser/feedback",
            icon: Bot,
        },
        {
            title: "Track Student Deployment",
            url: "/adviser/deployment",
            icon: Map,
        },
        {
            title: "View Submitted Documents",
            url: "/adviser/documents",
            icon: FileUp,
        },
        {
            title: "Monitor All Students’ Records",
            url: "/adviser/records",
            icon: BookOpen,
        },
    ],

    agency_supervisor: [
        {
            title: "Generate Attendance QR Code",
            url: "/supervisor/qr",
            icon: QrCode,
        },
        {
            title: "View Assigned Students",
            url: "/supervisor/students",
            icon: Users,
        },
        {
            title: "Provide Feedback & Grades",
            url: "/supervisor/feedback",
            icon: Bot,
        },
    ],

    // programCoordinator: [
    //     {
    //         title: "Assign Students to Agencies",
    //         url: "/coordinator/assign",
    //         icon: UserCheck,
    //     },
    //     {
    //         title: "Overall Internship Status",
    //         url: "/coordinator/status",
    //         icon: CalendarDays,
    //     },
    // ],

    chair_person: [
        {
            title: "Chairperson Panel",
            url: "/chair/dashboard",
            icon: Settings2,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user } = useUser()

    if (!user) return null

    const nav: SidebarItem[] = sidebarConfig[user?.profile.role] || []

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={teams} />
            </SidebarHeader>
            <SidebarContent>
                <AppNavMain items={nav} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser
                    user={{
                        firstName: user.profile.firstName,
                        lastName: user.profile.lastName,
                        role: user.profile.role,
                        avatar: user?.photoUrl || "",
                    }}
                />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

/*
const projects = [
    {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
    },
    {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
    },
    {
        name: "Travel",
        url: "#",
        icon: Map,
    },
]

   <AppNavMain items={nav} />
    <NavProjects projects={projects} />
*/
