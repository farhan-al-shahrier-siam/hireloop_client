import { getUserSession } from "@/lib/core/session";
import { Bars, Bell, Bookmark, Briefcase, Envelope, Factory, FileDollar, FileText, Gear, LayoutCellsLarge, Magnifier, Person, Persons } from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
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

    const navContent = (
        <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
                <Link href={item.href} key={item.label} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default" type="Link">
                    <item.icon className="size-5 text-muted" />
                    {item.label}
                </Link>
            ))}
        </nav>
    );

    return (
        <>
            <aside className="hidden w-64 shrink-0 border rounded-2xl m-2 border-default p-4 lg:block">{navContent}</aside>
            <Drawer>
                <Button className={"lg:hidden"} variant="secondary">
                    <Bars />
                    Sidebar
                </Button>
                <Drawer.Backdrop>
                    <Drawer.Content placement="left">
                        <Drawer.Dialog>
                            <Drawer.CloseTrigger />
                            <Drawer.Header>
                                <Drawer.Heading>Navigation</Drawer.Heading>
                            </Drawer.Header>
                            <Drawer.Body>{navContent}</Drawer.Body>
                        </Drawer.Dialog>
                    </Drawer.Content>
                </Drawer.Backdrop>
            </Drawer>
        </>
    );
}
