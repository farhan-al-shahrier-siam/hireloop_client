import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { role } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_CONNECTION_URI);
const db = client.db("hireloop");

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
    },
    database: mongodbAdapter(db, {
        client,
    }),
    user: {
        additionalFields: {
            role: {
                defaultValue: "seeker",
            },
        },
    },
});
