import { getApplicationByApplicantId } from "@/lib/api/applications";
import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";
import React from "react";
import ApplicationsClient from "./ApplicationsClient";

const ApplicationsPage = async () => {
    const user = await getUserSession();

    if (!user) {
        redirect("/signIn?redirect=/dashboard/applications");
    }

    const rawApplications = (await getApplicationByApplicantId(user.id)) || [];

    // Serialize MongoDB ObjectIds and Dates safely before passing to Client Component
    const serializedApplications = rawApplications.map((app) => ({
        ...app,
        _id: app._id?.toString() || "",
        appliedAt: app.appliedAt ? new Date(app.appliedAt).toISOString() : app.createdAt ? new Date(app.createdAt).toISOString() : null,
        createdAt: app.createdAt ? new Date(app.createdAt).toISOString() : null,
    }));

    return <ApplicationsClient applications={serializedApplications} />;
};

export default ApplicationsPage;
