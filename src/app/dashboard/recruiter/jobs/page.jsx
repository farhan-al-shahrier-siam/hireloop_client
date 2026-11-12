import JobsTable from "@/components/recruiter/JobsTable";
import { getCompanyJobs } from "@/lib/api/jobs";
import React from "react";

const RecruiterJobs = async () => {
    const companyId = "company_123";
    const jobs = await getCompanyJobs(companyId);
    console.log(jobs);

    return (
        <div>
            <div>
                <h2 className="m-2 text-3xl font-bold">Manage Job Posts</h2>
                <p className="text-slate-500 pb-4 pl-2">Review live listings, monitor applicants, and update job details across your organization.</p>
            </div>
            <JobsTable jobs={jobs} />
        </div>
    );
};

export default RecruiterJobs;
