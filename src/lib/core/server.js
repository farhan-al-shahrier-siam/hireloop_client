"use server";

import { getToken } from "./session";

export const authHeader = async () => {
    const token = await getToken();
    const header = token
        ? {
              authorization: `Bearer ${token}`,
          }
        : {};
    return header;
};

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export const serverFetch = async (path) => {
    const res = await fetch(`${baseUrl}${path}`);
    return res.json();
};

export const serverMutation = async (path, data, method = "POST") => {
    const res = await fetch(`${baseUrl}${path}`, {
        method: method,
        headers: {
            "content-type": "application/json",
            ... await authHeader()
        },
        body: JSON.stringify(data),
    });
    return res.json();
};
