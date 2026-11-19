import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import React from "react";

const DashboardLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen flex-col xl:flex-row">
            <DashboardSidebar></DashboardSidebar>
            <div className="min-w-0 flex-1">{children}</div>
        </div>
    );
};

export default DashboardLayout;