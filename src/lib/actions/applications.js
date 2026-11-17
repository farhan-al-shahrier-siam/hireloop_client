"use server";

import { serverMutation } from "../core/server";

export const submitApplication = async (applicationPayload) => {
    return serverMutation("/api/applications", applicationPayload);
};
