"use client";

import React, { useMemo, useState } from "react";
import { Avatar, Button, Card, Chip, ListBox, Select, Table } from "@heroui/react";
import { Briefcase, Person, Shield } from "@gravity-ui/icons";

const UserManagementClient = ({ initialUsers = [] }) => {
    const [users, setUsers] = useState(initialUsers);
    const [roleFilter, setRoleFilter] = useState("all");
    // 1. Add this state near the top of UserManagementClient
    const [oneDayAgo] = useState(() => Date.now() - 24 * 60 * 60 * 1000);

    // 2. Inside useMemo, remove `const oneDayAgo = ...` and add `oneDayAgo` to the dependency array:
    const stats = useMemo(() => {
        const totalUsers = users.length;
        const activeUsers = users.filter((u) => (u.status || "Active") === "Active").length;
        const recruiterCount = users.filter((u) => u.role === "recruiter").length;
        const suspendedCount = users.filter((u) => u.status === "Suspended").length;
        const suspendedPercent = totalUsers > 0 ? ((suspendedCount / totalUsers) * 100).toFixed(1) : "0.0";

        const recentSignups = users.filter((u) => new Date(u.createdAt).getTime() >= oneDayAgo).length;

        return {
            activeUsers,
            recruiterCount,
            suspendedCount,
            suspendedPercent,
            recentSignups,
        };
    }, [users, oneDayAgo]);

    // Filtered Users by Role
    const filteredUsers = useMemo(() => {
        if (roleFilter === "all") return users;
        return users.filter((user) => user.role === roleFilter);
    }, [users, roleFilter]);

    // Format ISO Date -> "Oct 12, 2023"
    const formatJoinDate = (isoString) => {
        if (!isoString) return "N/A";
        return new Date(isoString).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        });
    };

    // Export CSV
    const handleExportList = () => {
        const headers = ["ID", "Name", "Email", "Role", "Join Date", "Status"];
        const rows = filteredUsers.map((u) => [u._id, `"${(u.name || "").replace(/"/g, '""')}"`, u.email, u.role, `"${formatJoinDate(u.createdAt)}"`, u.status || "Active"]);

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `users_export_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Action Handlers
    const handleToggleRole = async (userId, currentRole) => {
        const nextRole = currentRole === "recruiter" ? "seeker" : "recruiter";
        setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: nextRole } : u)));
        // TODO: await updateUserRole(userId, nextRole);
    };

    const handleToggleSuspend = async (userId, currentStatus) => {
        const nextStatus = currentStatus === "Suspended" ? "Active" : "Suspended";
        setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, status: nextStatus } : u)));
        // TODO: await updateUserStatus(userId, nextStatus);
    };

    const handleDeleteUser = async (userId) => {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        // TODO: await deleteUser(userId);
    };

    const getInitials = (name = "") =>
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

    return (
        <section className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">User Management</h1>
                    <p className="mt-1 text-sm text-default-500">Review, filter, and manage platform access for all users.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Select aria-label="Filter by role" className="w-40" value={roleFilter} onChange={(key) => setRoleFilter(String(key))}>
                        <Select.Trigger className="rounded-xl border border-default-200 bg-content1 px-3.5 py-2 text-sm">
                            <Select.Value />
                            <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox>
                                <ListBox.Item id="all" textValue="All Roles">
                                    All Roles
                                    <ListBox.ItemIndicator />
                                </ListBox.Item>
                                <ListBox.Item id="seeker" textValue="Seeker">
                                    Seeker
                                    <ListBox.ItemIndicator />
                                </ListBox.Item>
                                <ListBox.Item id="recruiter" textValue="Recruiter">
                                    Recruiter
                                    <ListBox.ItemIndicator />
                                </ListBox.Item>
                                <ListBox.Item id="admin" textValue="Admin">
                                    Admin
                                    <ListBox.ItemIndicator />
                                </ListBox.Item>
                            </ListBox>
                        </Select.Popover>
                    </Select>

                    <Button onPress={handleExportList} className="rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90">
                        Export List
                    </Button>
                </div>
            </div>

            {/* 4 KPI Stat Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Card className="rounded-2xl border border-default-200 bg-content1 p-5 shadow-none">
                    <Card.Content className="space-y-2 p-0">
                        <p className="text-sm text-default-500">Total Active Users</p>
                        <p className="text-3xl font-bold tracking-tight text-foreground">{stats.activeUsers.toLocaleString()}</p>
                        <p className="text-xs font-medium text-success">+12% vs last month</p>
                    </Card.Content>
                </Card>

                <Card className="rounded-2xl border border-default-200 bg-content1 p-5 shadow-none">
                    <Card.Content className="space-y-2 p-0">
                        <p className="text-sm text-default-500">Recruiter Growth</p>
                        <p className="text-3xl font-bold tracking-tight text-foreground">{stats.recruiterCount.toLocaleString()}</p>
                        <p className="text-xs font-medium text-success">High demand</p>
                    </Card.Content>
                </Card>

                <Card className="rounded-2xl border border-default-200 bg-content1 p-5 shadow-none">
                    <Card.Content className="space-y-2 p-0">
                        <p className="text-sm text-default-500">Suspended Accounts</p>
                        <p className="text-3xl font-bold tracking-tight text-foreground">{stats.suspendedCount.toLocaleString()}</p>
                        <p className="text-xs text-default-500">{stats.suspendedPercent}% of total</p>
                    </Card.Content>
                </Card>

                <Card className="rounded-2xl border border-default-200 bg-content1 p-5 shadow-none">
                    <Card.Content className="space-y-2 p-0">
                        <p className="text-sm text-default-500">New Signups (24h)</p>
                        <p className="text-3xl font-bold tracking-tight text-foreground">{stats.recentSignups.toLocaleString()}</p>
                        <p className="text-xs font-medium text-warning">Steady activity</p>
                    </Card.Content>
                </Card>
            </div>

            {/* Users Table */}
            <Table className="rounded-2xl border border-default-200 bg-content1">
                <Table.ScrollContainer>
                    <Table.Content aria-label="Users management table" className="min-w-[820px] w-full text-left">
                        <Table.Header className="border-b border-default-200 bg-default-50/50 text-xs font-semibold uppercase tracking-wider text-default-500">
                            <Table.Column id="name" isRowHeader className="px-6 py-4">
                                USER NAME
                            </Table.Column>
                            <Table.Column id="email" className="px-6 py-4">
                                EMAIL ADDRESS
                            </Table.Column>
                            <Table.Column id="role" className="px-6 py-4">
                                ROLE
                            </Table.Column>
                            <Table.Column id="joinDate" className="px-6 py-4">
                                JOIN DATE
                            </Table.Column>
                            <Table.Column id="status" className="px-6 py-4">
                                STATUS
                            </Table.Column>
                            <Table.Column id="actions" className="px-6 py-4 text-right">
                                ACTIONS
                            </Table.Column>
                        </Table.Header>

                        <Table.Body renderEmptyState={() => <div className="px-6 py-10 text-center text-sm text-default-500">No users found for the selected role.</div>}>
                            {filteredUsers.map((user) => {
                                const isSuspended = user.status === "Suspended";
                                const isRecruiter = user.role === "recruiter";
                                const isAdmin = user.role === "admin";

                                return (
                                    <Table.Row id={user._id} key={user._id} className="border-b border-default-200/70 transition-colors last:border-none hover:bg-default-100/40">
                                        {/* User Name + Avatar */}
                                        <Table.Cell className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar size="sm" className="shrink-0">
                                                    {user.image && <Avatar.Image src={user.image} alt={user.name} />}
                                                    <Avatar.Fallback>{getInitials(user.name)}</Avatar.Fallback>
                                                </Avatar>
                                                <span className="font-medium text-foreground">{user.name}</span>
                                            </div>
                                        </Table.Cell>

                                        {/* Email Address */}
                                        <Table.Cell className="px-6 py-4 text-sm text-default-500">{user.email}</Table.Cell>

                                        {/* Role Chip */}
                                        <Table.Cell className="px-6 py-4">
                                            {isAdmin ? (
                                                <Chip size="sm" variant="soft" color="warning" className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium capitalize">
                                                    <Shield className="size-3.5" />
                                                    Admin
                                                </Chip>
                                            ) : isRecruiter ? (
                                                <Chip size="sm" variant="soft" color="accent" className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium capitalize">
                                                    <Briefcase className="size-3.5" />
                                                    Recruiter
                                                </Chip>
                                            ) : (
                                                <Chip size="sm" variant="soft" color="default" className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium capitalize">
                                                    <Person className="size-3.5" />
                                                    Seeker
                                                </Chip>
                                            )}
                                        </Table.Cell>

                                        {/* Join Date */}
                                        <Table.Cell className="px-6 py-4 text-sm text-default-400">{formatJoinDate(user.createdAt)}</Table.Cell>

                                        {/* Status Badge */}
                                        <Table.Cell className="px-6 py-4">
                                            <Chip
                                                size="sm"
                                                variant="soft"
                                                color={isSuspended ? "danger" : "success"}
                                                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                                            >
                                                <span className={`size-1.5 rounded-full ${isSuspended ? "bg-danger" : "bg-success"}`} />
                                                {isSuspended ? "Suspended" : "Active"}
                                            </Chip>
                                        </Table.Cell>

                                        {/* Actions */}
                                        <Table.Cell className="px-6 py-4 text-right">
                                            <div className="inline-flex items-center justify-end gap-4 text-xs font-medium">
                                                {isSuspended ? (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleToggleSuspend(user._id, user.status)}
                                                            className="cursor-pointer text-success transition-opacity hover:opacity-80"
                                                        >
                                                            Activate
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteUser(user._id)}
                                                            className="cursor-pointer text-default-400 transition-colors hover:text-danger"
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        {!isAdmin && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleToggleRole(user._id, user.role)}
                                                                className="cursor-pointer text-default-400 transition-colors hover:text-foreground"
                                                            >
                                                                {isRecruiter ? "Make Seeker" : "Make Recruiter"}
                                                            </button>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleToggleSuspend(user._id, user.status)}
                                                            className="cursor-pointer text-danger transition-opacity hover:opacity-80"
                                                        >
                                                            Suspend
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            })}
                        </Table.Body>
                    </Table.Content>
                </Table.ScrollContainer>
            </Table>
        </section>
    );
};

export default UserManagementClient;
