import JobCard from "@/components/jobs/JobCard";
import { getJobs } from "@/lib/api/jobs";
import React from "react";

const JobsPage = async () => {
    const jobs = await getJobs();

    return (
        <div>
            <div className="p-8 bg-zinc-950 min-h-screen flex items-center justify-center">
                <JobCard job={jobs[30]}></JobCard>
            </div>
        </div>
    );
};

export default JobsPage;
