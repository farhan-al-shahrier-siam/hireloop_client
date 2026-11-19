import React from "react";
import { getCompanies } from "@/lib/api/companies";
import CompanyManagementTable from "./CompanyManagementTable";

const AdminCompaniesPage = async () => {
    const companiesData = await getCompanies();
    const companies = Array.isArray(companiesData) ? companiesData : companiesData?.data || [];

    const pendingCount = companies.filter((c) => c.status === "Pending").length;

    return (
        <section className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Company Reviews</h1>
                    <p className="mt-1 text-sm text-default-500">Verify recruiter company profiles before they can publish job listings.</p>
                </div>

                <div className="inline-flex items-center gap-2 self-start rounded-xl border border-default-200 bg-default-50 px-3.5 py-2 text-sm sm:self-auto">
                    <span className="size-2 rounded-full bg-warning" />
                    <span className="font-medium text-foreground">{pendingCount}</span>
                    <span className="text-default-500">pending review</span>
                </div>
            </div>

            {/* Interactive Management Table */}
            <CompanyManagementTable initialCompanies={companies} />
        </section>
    );
};

export default AdminCompaniesPage;
