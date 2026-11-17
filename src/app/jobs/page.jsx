import JobBoard from "@/components/jobs/JobBoard";
import { getJobs } from "@/lib/api/jobs";
import React from "react";

const JobsPage = async () => {
  const jobs = await getJobs();

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <JobBoard jobs={jobs} />
      </div>
    </main>
  );
};

export default JobsPage;