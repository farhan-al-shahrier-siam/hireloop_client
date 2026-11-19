"use client";

import React, { useMemo, useState } from "react";
import { AlertDialog, Avatar, Button, Card, Chip, ListBox, Select, Table } from "@heroui/react";
import { Briefcase, Person, Shield } from "@gravity-ui/icons";
import { updateUsersRole } from "@/lib/actions/users";

const UserManagementClient = ({ users = [] }) => {
    const [userList, setUserList] = useState(users);
    const [prevUsers, setPrevUsers] = useState(users);
    const [roleFilter, setRoleFilter] = useState("all");
    const [oneDayAgo] = useState(() => Date.now() - 24 * 60 * 60 * 1000);

    // Confirmation Dialog State
    const [confirmAction, setConfirmAction] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (users !== prevUsers) {
        setPrevUsers(users);
        setUserList(users);
    }

    const stats = useMemo(() => {
        const totalUsers = userList.length;
        const activeUsers = userList.filter((u) => (u.status || "Active") === "Active").length;
        const recruiterCount = userList.filter((u) => u.role === "recruiter").length;
        const suspendedCount = userList.filter((u) => u.status === "Suspended").length;
        const suspendedPercent = totalUsers > 0 ? ((suspendedCount / totalUsers) * 100).toFixed(1) : "0.0";

        const recentSignups = userList.filter((u) => new Date(u.createdAt).getTime() >= oneDayAgo).length;

        return {
            activeUsers,
            recruiterCount,
            suspendedCount,
            suspendedPercent,
            recentSignups,
        };
    }, [userList, oneDayAgo]);

    // Filtered Users by Role
    const filteredUsers = useMemo(() => {
        if (roleFilter === "all") return userList;
        return userList.filter((user) => user.role === roleFilter);
    }, [userList, roleFilter]);

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

    // Open Confirmation Dialog Helpers
    const promptRoleChange = (user, nextRole) => {
        const roleLabel = nextRole.charAt(0).toUpperCase() + nextRole.slice(1);
        setConfirmAction({
            type: "role",
            user,
            nextRole,
            title: `Change Role to ${roleLabel}?`,
            description: `Are you sure you want to change ${user.name}'s role from ${user.role} to ${nextRole}?`,
            confirmText: `Make ${roleLabel}`,
            status: nextRole === "admin" ? "warning" : "accent",
            confirmVariant: "primary",
        });
    };

    const promptStatusChange = (user) => {
        const isSuspended = user.status === "Suspended";
        const nextStatus = isSuspended ? "Active" : "Suspended";
        setConfirmAction({
            type: "status",
            user,
            nextStatus,
            title: isSuspended ? "Activate User Account?" : "Suspend User Account?",
            description: isSuspended ? `Restore platform access for ${user.name} (${user.email})?` : `Suspend ${user.name} (${user.email})? They will immediately lose access to their account.`,
            confirmText: isSuspended ? "Activate" : "Suspend",
            status: isSuspended ? "success" : "danger",
            confirmVariant: isSuspended ? "primary" : "danger",
        });
    };

    const promptDeleteUser = (user) => {
        setConfirmAction({
            type: "delete",
            user,
            title: "Delete User Permanently?",
            description: `Are you sure you want to delete ${user.name} (${user.email})? This action cannot be undone.`,
            confirmText: "Delete User",
            status: "danger",
            confirmVariant: "danger",
        });
    };

    // Execute Confirmed Action
    const handleConfirmAction = async () => {
        if (!confirmAction) return;
        setIsSubmitting(true);

        try {
            const { type, user, nextRole, nextStatus } = confirmAction;

            if (type === "role") {
                await updateUsersRole(user._id, nextRole);
                setUserList((prev) => prev.map((u) => (u._id === user._id ? { ...u, role: nextRole } : u)));
            } else if (type === "status") {
                // TODO: await updateUserStatus(user._id, nextStatus);
                setUserList((prev) => prev.map((u) => (u._id === user._id ? { ...u, status: nextStatus } : u)));
            } else if (type === "delete") {
                // TODO: await deleteUser(user._id);
                setUserList((prev) => prev.filter((u) => u._id !== user._id));
            }
        } finally {
            setIsSubmitting(false);
            setConfirmAction(null);
        }
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
                    <Table.Content aria-label="Users management table" className="min-w-[920px] w-full text-left">
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
                                            <div className="inline-flex items-center justify-end gap-3.5 whitespace-nowrap text-xs font-medium">
                                                {isSuspended ? (
                                                    <>
                                                        <button type="button" onClick={() => promptStatusChange(user)} className="cursor-pointer text-success transition-opacity hover:opacity-80">
                                                            Activate
                                                        </button>
                                                        <button type="button" onClick={() => promptDeleteUser(user)} className="cursor-pointer text-default-400 transition-colors hover:text-danger">
                                                            Delete
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        {user.role !== "seeker" && (
                                                            <button
                                                                type="button"
                                                                onClick={() => promptRoleChange(user, "seeker")}
                                                                className="cursor-pointer text-default-400 transition-colors hover:text-foreground"
                                                            >
                                                                Make Seeker
                                                            </button>
                                                        )}
                                                        {user.role !== "recruiter" && (
                                                            <button
                                                                type="button"
                                                                onClick={() => promptRoleChange(user, "recruiter")}
                                                                className="cursor-pointer text-default-400 transition-colors hover:text-foreground"
                                                            >
                                                                Make Recruiter
                                                            </button>
                                                        )}
                                                        {user.role !== "admin" && (
                                                            <button
                                                                type="button"
                                                                onClick={() => promptRoleChange(user, "admin")}
                                                                className="cursor-pointer text-warning transition-opacity hover:opacity-80"
                                                            >
                                                                Make Admin
                                                            </button>
                                                        )}
                                                        <button type="button" onClick={() => promptStatusChange(user)} className="cursor-pointer text-danger transition-opacity hover:opacity-80">
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

            {/* Confirmation AlertDialog */}
            <AlertDialog isOpen={Boolean(confirmAction)} onOpenChange={(open) => !open && !isSubmitting && setConfirmAction(null)}>
                <AlertDialog.Backdrop>
                    <AlertDialog.Container>
                        <AlertDialog.Dialog className="sm:max-w-[420px]">
                            <AlertDialog.CloseTrigger isDisabled={isSubmitting} />
                            <AlertDialog.Header>
                                <AlertDialog.Icon status={confirmAction?.status || "warning"} />
                                <AlertDialog.Heading>{confirmAction?.title}</AlertDialog.Heading>
                            </AlertDialog.Header>
                            <AlertDialog.Body>
                                <p className="text-sm text-default-500">{confirmAction?.description}</p>
                            </AlertDialog.Body>
                            <AlertDialog.Footer>
                                <Button slot="close" variant="tertiary" isDisabled={isSubmitting}>
                                    Cancel
                                </Button>
                                <Button variant={confirmAction?.confirmVariant || "primary"} isDisabled={isSubmitting} onPress={handleConfirmAction}>
                                    {isSubmitting ? "Processing..." : confirmAction?.confirmText}
                                </Button>
                            </AlertDialog.Footer>
                        </AlertDialog.Dialog>
                    </AlertDialog.Container>
                </AlertDialog.Backdrop>
            </AlertDialog>
        </section>
    );
};

export default UserManagementClient;
