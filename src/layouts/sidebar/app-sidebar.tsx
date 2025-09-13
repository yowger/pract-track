import {
    AudioWaveform,
    Bot,
    Command,
    GalleryVerticalEnd,
    Settings2,
    FileUp,
    // History,
    UserCheck,
    // CalendarDays,
    Map,
    BookOpen,
    // QrCode,
    // Users,
    // type LucideIcon,
    User,
    Users2Icon,
    Briefcase,
    LayoutDashboard,
    Timer,
    Newspaper,
} from "lucide-react"

import { AppNavMain, type NavItem } from "./app-nav-main"
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

type NonNullRole = Exclude<Role, null>

type SidebarConfig = {
    [key in NonNullRole]: NavItem[]
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
    chair_person: [
        {
            title: "Internship",
            url: "/",
            icon: Briefcase,
        },
        {
            title: "Students",
            url: "/students",
            icon: Users2Icon,
        },
    ],

    student: [
        // {
        //     title: "Dashboard",
        //     url: "/student/dashboard",
        //     icon: Settings2,
        // },
        // {
        //     title: "Files & Reports",
        //     url: "/files",
        //     icon: FileUp,
        // },
        // {
        //     title: "Evaluation History",
        //     url: "/evaluation/history",
        //     icon: History,
        // },
        // {
        //     title: "Daily Time Record",
        //     url: "/dtr",
        //     icon: CalendarDays,
        // },
        // {
        //     title: "Attendance",
        //     url: "/attendance",
        //     icon: UserCheck,
        // },
        {
            title: "Clock In & Out",
            url: "/",
            icon: Timer,
        },
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: Settings2,
        },
        {
            title: "Attendance",
            url: "/attendance",
            icon: UserCheck,
        },
        // {
        //     title: "Schedule",
        //     url: "/schedule",
        //     icon: Newspaper,
        // },
        {
            title: "Profile",
            url: "/profile",
            icon: User,
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
            title: "Dashboard",
            url: "/",
            icon: LayoutDashboard,
        },
        // {
        //     title: "Interns",
        //     url: "/interns",
        //     icon: User,
        // },
        {
            title: "Assigned Students",
            url: "/students/assigned",
            icon: Users2Icon,
        },
        {
            title: "Schedules",
            icon: Timer,
            items: [
                {
                    title: "View Schedules",
                    url: "/schedules",
                },
                // {
                //     title: "Assign Schedule",
                //     url: "/schedules/assign",
                // },
                {
                    title: "Create New Schedule",
                    url: "/schedules/new",
                },
            ],
        },
        // {
        //     title: "Generate Attendance QR Code",
        //     url: "/supervisor/qr",
        //     icon: QrCode,
        // },
        // {
        //     title: "View Assigned Students",
        //     url: "/supervisor/students",
        //     icon: Users,
        // },
        // {
        //     title: "Provide Feedback & Grades",
        //     url: "/supervisor/feedback",
        //     icon: Bot,
        // },
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
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user } = useUser()
    if (!user) return null

    let nav: NavItem[] = []

    if (user.role) {
        nav = sidebarConfig[user.role] || []
    }

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
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role || "",
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
