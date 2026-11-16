import JobsTable from "@/components/recruiter/JobsTable";
import { getRecruiterCompany } from "@/lib/api/companies";
import { getCompanyJobs } from "@/lib/api/jobs";
import { getUserSession } from "@/lib/core/session";
import React from "react";

const RecruiterJobs = async () => {

    const user = await getUserSession();
    const company = await getRecruiterCompany(user?.id)
    const jobs = await getCompanyJobs(company._id);
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
