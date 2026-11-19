import { getUserSession } from "@/lib/core/session";
import { Bell, Bookmark, Briefcase, Envelope, Factory, FileDollar, FileText, Gear, LayoutCellsLarge, Magnifier, Person, Persons } from "@gravity-ui/icons";
import Link from "next/link";

export async function DashboardSidebar() {
    const user = await getUserSession();

    const seekerNavItems = [
        { icon: LayoutCellsLarge, href: "/dashboard/seeker", label: "Dashboard" },
        { icon: Briefcase, href: "/dashboard/seeker/jobs", label: "Jobs" },
        { icon: Bookmark, href: "/dashboard/seeker/saved-jobs", label: "Saved Jobs" },
        { icon: FileText, href: "/dashboard/seeker/applications", label: "Applications" },
        { icon: FileDollar, href: "/dashboard/seeker/billing", label: "Billing" },
        { icon: Gear, href: "/settings", label: "Settings" },
    ];

    const reecruiterNavItems = [
        { icon: LayoutCellsLarge, href: "/dashboard/recruiter", label: "Home" },
        { icon: Magnifier, href: "/dashboard/recruiter/jobs", label: "Jobs" },
        { icon: Bell, href: "/dashboard/recruiter/jobs/new", label: "Publish a Job" },
        { icon: Briefcase, href: "/dashboard/recruiter/company", label: "Company Profile" },
        { icon: Envelope, href: "/Messages", label: "Messages" },
        { icon: Person, href: "/profile", label: "Profile" },
        { icon: Gear, href: "/settings", label: "Settings" },
    ];

    const adminNavItems = [
        { icon: LayoutCellsLarge, href: "/dashboard/admin", label: "Dashboard" },
        { icon: Persons, href: "/dashboard/admin/users", label: "Users" },
        { icon: Factory, href: "/dashboard/admin/companies", label: "Companies" },
        { icon: Briefcase, href: "/dashboard/admin/jobs", label: "Jobs" },
        { icon: FileDollar, href: "/dashboard/admin/payments", label: "Payments" },
        { icon: Gear, href: "/settings", label: "Settings" },
    ];

    const navLinksMap = {
        seeker: seekerNavItems,
        recruiter: reecruiterNavItems,
        admin: adminNavItems,
    };

    const navItems = navLinksMap[user?.role || "seeker"];

    return (
        <aside className="m-2 shrink-0 rounded-2xl border border-default p-2 xl:w-64 xl:p-4">
            <nav className="flex flex-row items-center gap-1 overflow-x-auto xl:flex-col xl:items-stretch">
                {navItems.map((item) => (
                    <Link
                        href={item.href}
                        key={item.label}
                        className="flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-sm whitespace-nowrap text-foreground transition-colors hover:bg-default xl:gap-3 xl:py-2.5"
                        type="Link"
                    >
                        <item.icon className="size-5 text-muted" />
                        {item.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
