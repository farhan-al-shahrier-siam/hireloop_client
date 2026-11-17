import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";
import React from "react";

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

    return <div>Apply page</div>;
};

export default ApplyPage;
