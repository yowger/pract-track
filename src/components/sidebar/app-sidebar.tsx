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

interface SidebarItem {
    title: string
    url: string
    icon: LucideIcon
}

type UserRole =
    | "student"
    | "practicumAdviser"
    | "agencySupervisor"
    | "programCoordinator"
    | "chairperson"

type SidebarConfig = {
    [key in UserRole]: SidebarItem[]
}

interface User {
    name: string
    email: string
    avatar: string
    role: UserRole
}

const currentUser: User = {
    name: "Yowger",
    email: "yowger@example.com",
    avatar: "/avatars/shadcn.jpg",
    role: "student",
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

    practicumAdviser: [
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

    agencySupervisor: [
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

    programCoordinator: [
        {
            title: "Assign Students to Agencies",
            url: "/coordinator/assign",
            icon: UserCheck,
        },
        {
            title: "Overall Internship Status",
            url: "/coordinator/status",
            icon: CalendarDays,
        },
    ],

    chairperson: [
        {
            title: "Chairperson Panel",
            url: "/chair/dashboard",
            icon: Settings2,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const nav: SidebarItem[] = sidebarConfig[currentUser.role] || []

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={teams} />
            </SidebarHeader>
            <SidebarContent>
                <AppNavMain items={nav} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={currentUser} />
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
