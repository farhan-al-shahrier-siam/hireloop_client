import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";
import React from "react";
import JobApplyForm from "./JobApplyForm";
import { getJobById } from "@/lib/api/jobs";

const ApplyPage = async ({ params }) => {
    const { id } = await params;

    const user = await getUserSession();
    if (!user) {
        redirect(`/signIn?redirect=/jobs/${id}/apply`);
    }

    if(user.role !== "seeker"){
        return <div className="w-full min-h-screen flex flex-col items-center justify-center text-white">
            <p className="text-zinc-400 text-lg text-center p-4">Only job seekers can apply for positions. Please sign in with a job seeker account.</p>
        </div>
    }

    const job = await getJobById(id)

    return <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <JobApplyForm applicant={user} job={job}></JobApplyForm>
    </div>;
};

export default ApplyPage;
