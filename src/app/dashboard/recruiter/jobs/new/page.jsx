import React from "react";
import PostJobForm from "./PostJobForm";
import { getUserSession } from "@/lib/core/session";
import { getRecruiterCompany } from "@/lib/api/companies";

const PostJobPage = async () => {
    const user = await getUserSession();
    const company = await getRecruiterCompany(user?.id);

    return (
        <div>
            <PostJobForm company={company}></PostJobForm>
        </div>
    );
};

export default PostJobPage;
