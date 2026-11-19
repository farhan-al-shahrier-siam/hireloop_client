import React from "react";
import { getUsersList } from "@/lib/api/users";
import UserManagementClient from "./UserManagementClient";

const AdminUsersPage = async () => {
    const usersData = await getUsersList();
    const rawUsers = Array.isArray(usersData) ? usersData : usersData?.data || [];

    const users = rawUsers.map((user, index) => ({
        ...user,
        _id: String(user._id?.$oid || user._id || user.id || user.email || index),
        createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
        status: user.status || "Active",
    }));

    return <UserManagementClient users={users} />;
};

export default AdminUsersPage;