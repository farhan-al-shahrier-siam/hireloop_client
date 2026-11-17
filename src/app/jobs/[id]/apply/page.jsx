import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";
import React from "react";
import JobApplyForm from "./JobApplyForm";
import { getJobById } from "@/lib/api/jobs";
import { getApplicationByApplicantId } from "@/lib/api/applications";

const ApplyPage = async ({ params }) => {
    const { id } = await params;

    const user = await getUserSession();
    if (!user) {
        redirect(`/signIn?redirect=/jobs/${id}/apply`);
    }

    if (user.role !== "seeker") {
        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center text-white">
                <p className="text-zinc-400 text-lg text-center p-4">Only job seekers can apply for positions. Please sign in with a job seeker account.</p>
            </div>
        );
    }

    const applications = await getApplicationByApplicantId(user.id);
    const plan = {
        name: "Free",
        maxApplicationPerMonth: 3,
    };

    const job = await getJobById(id);

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center">
            <h2>
                You have applied: {applications.length} of {plan.maxApplicationPerMonth} so far
            </h2>
            {applications.length < plan.maxApplicationPerMonth && <JobApplyForm applicant={user} job={job}></JobApplyForm>}
        </div>
    );
};

export default ApplyPage;
