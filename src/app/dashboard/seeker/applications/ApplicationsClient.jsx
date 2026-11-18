"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDownToLine, ChevronLeft, ChevronRight, Briefcase, FileText, Link as LinkIcon, Xmark, MapPin, Clock } from "@gravity-ui/icons";

const ITEMS_PER_PAGE = 5;

const STATUS_STYLES = {
    pending: {
        label: "Applied",
        classes: "bg-[#222222] text-zinc-300 border-white/10",
    },
    applied: {
        label: "Applied",
        classes: "bg-[#222222] text-zinc-300 border-white/10",
    },
    review: {
        label: "Review",
        classes: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    shortlisted: {
        label: "Shortlisted",
        classes: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    interview: {
        label: "Interview",
        classes: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    rejected: {
        label: "Rejected",
        classes: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    },
    offered: {
        label: "Offered",
        classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
};

const formatJobType = (type = "") => {
    if (!type) return "Full-time";
    return type
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("-");
};

const formatRelativeTime = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const diffSeconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (diffSeconds < 60) return "Just now";
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"} ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks < 5) return `${diffWeeks} ${diffWeeks === 1 ? "week" : "weeks"} ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const ApplicationsClient = ({ applications = [] }) => {
    const [activeTab, setActiveTab] = useState("active"); // "active" | "archived"
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedApp, setSelectedApp] = useState(null);

    // 1. Dynamic Stats Calculation
    const stats = useMemo(() => {
        const total = applications.length;
        const shortlisted = applications.filter((a) => ["shortlisted", "interview", "offered"].includes(a.status?.toLowerCase())).length;
        const interviews = applications.filter((a) => a.status?.toLowerCase() === "interview").length;
        const positiveOutcomes = applications.filter((a) => ["shortlisted", "interview", "offered"].includes(a.status?.toLowerCase())).length;
        const successRate = total > 0 ? Math.round((positiveOutcomes / total) * 100) : 0;

        return { total, shortlisted, interviews, successRate };
    }, [applications]);

    // 2. Filter Active vs Archived (Rejected / Withdrawn go to Archived)
    const filteredApplications = useMemo(() => {
        return applications.filter((app) => {
            const status = app.status?.toLowerCase() || "pending";
            const isArchived = status === "rejected" || status === "archived";
            return activeTab === "archived" ? isArchived : !isArchived;
        });
    }, [applications, activeTab]);

    // 3. Pagination Logic
    const totalPages = Math.max(1, Math.ceil(filteredApplications.length / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
    const paginatedApplications = filteredApplications.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const handleExportCSV = () => {
        const headers = ["Job Title", "Company", "Job Type", "Location", "Status", "Applied Date"];
        const rows = filteredApplications.map((app) => [
            `"${app.jobTitle || ""}"`,
            `"${app.companyName || ""}"`,
            `"${formatJobType(app.jobType)}"`,
            `"${app.location || ""}"`,
            `"${app.status || "pending"}"`,
            `"${app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : ""}"`,
        ]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `my-applications-${activeTab}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="w-full space-y-6 text-white">
            {/* Page Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">My Applications</h1>
                    <p className="mt-1 text-sm text-zinc-400">Track your job applications and interview progress in real-time.</p>
                </div>

                {/* Right Controls: Active/Archived Toggle + Export */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex rounded-xl border border-white/10 bg-[#141414] p-1">
                        <button
                            type="button"
                            onClick={() => handleTabChange("active")}
                            className={`rounded-lg px-4 py-1.5 text-xs font-medium transition-colors ${
                                activeTab === "active" ? "bg-[#242424] text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
                            }`}
                        >
                            Active
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTabChange("archived")}
                            className={`rounded-lg px-4 py-1.5 text-xs font-medium transition-colors ${
                                activeTab === "archived" ? "bg-[#242424] text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
                            }`}
                        >
                            Archived
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={handleExportCSV}
                        className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-zinc-950 transition-colors hover:bg-zinc-200"
                    >
                        <ArrowDownToLine className="h-4 w-4" />
                        <span>Export Report</span>
                    </button>
                </div>
            </div>

            {/* 4 Summary Stat Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-white/5 bg-[#141414] p-5">
                    <p className="text-xs font-medium text-zinc-400">Total Applied</p>
                    <p className="mt-2 text-3xl font-bold text-white">{stats.total}</p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-[#141414] p-5">
                    <p className="text-xs font-medium text-zinc-400">Shortlisted</p>
                    <p className="mt-2 text-3xl font-bold text-white">{stats.shortlisted}</p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-[#141414] p-5">
                    <p className="text-xs font-medium text-zinc-400">Interviews</p>
                    <p className="mt-2 text-3xl font-bold text-amber-400">{stats.interviews}</p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-[#141414] p-5">
                    <p className="text-xs font-medium text-zinc-400">Success Rate</p>
                    <p className="mt-2 text-3xl font-bold text-emerald-400">{stats.successRate}%</p>
                </div>
            </div>

            {/* Applications Table Card */}
            <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#141414]">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-white/5 text-xs font-medium text-zinc-400">
                                <th className="px-6 py-4">Job Title</th>
                                <th className="px-6 py-4">Company</th>
                                <th className="px-6 py-4">Applied</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-white/5 text-sm">
                            {paginatedApplications.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-14 text-center">
                                        <p className="text-sm font-medium text-zinc-300">No {activeTab} applications found</p>
                                        <p className="mt-1 text-xs text-zinc-500">
                                            {activeTab === "active" ? "Start applying to open roles to track your progress here." : "Rejected or archived applications will appear here."}
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedApplications.map((app) => {
                                    const statusKey = app.status?.toLowerCase() || "pending";
                                    const statusConfig = STATUS_STYLES[statusKey] || STATUS_STYLES.pending;

                                    return (
                                        <tr key={app._id} className="transition-colors hover:bg-white/[0.02]">
                                            {/* Job Title + Company Logo + Meta */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3.5">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#222222]">
                                                        {app.companyLogo ? (
                                                            <img src={app.companyLogo} alt={app.companyName} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <Briefcase className="h-4 w-4 text-zinc-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <Link href={`/jobs/${app.jobId}`} className="font-semibold text-white transition-colors hover:text-[#e5a9f7]">
                                                            {app.jobTitle}
                                                        </Link>
                                                        <p className="mt-0.5 text-xs text-zinc-400">
                                                            {formatJobType(app.jobType)} • {app.location || "Remote"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Company */}
                                            <td className="px-6 py-4 font-medium text-zinc-200">{app.companyName}</td>

                                            {/* Applied Date */}
                                            <td className="px-6 py-4 text-zinc-400">{formatRelativeTime(app.appliedAt)}</td>

                                            {/* Status Pill */}
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${statusConfig.classes}`}>{statusConfig.label}</span>
                                            </td>

                                            {/* Action */}
                                            <td className="px-6 py-4 text-right">
                                                <button type="button" onClick={() => setSelectedApp(app)} className="text-xs font-medium text-zinc-200 transition-colors hover:text-[#e5a9f7]">
                                                    Details
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer & Pagination */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 px-6 py-4 sm:flex-row">
                    <p className="text-xs text-zinc-400">
                        {filteredApplications.length === 0 ? (
                            "Showing 0 applications"
                        ) : (
                            <>
                                Showing <span className="font-medium text-zinc-200">{startIndex + 1}</span>–
                                <span className="font-medium text-zinc-200">{Math.min(startIndex + ITEMS_PER_PAGE, filteredApplications.length)}</span> of{" "}
                                <span className="font-medium text-zinc-200">{filteredApplications.length}</span> applications
                            </>
                        )}
                    </p>

                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            disabled={safePage === 1}
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-[#1c1c1c] text-zinc-400 transition-colors hover:bg-[#262626] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Previous page"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                type="button"
                                onClick={() => setCurrentPage(page)}
                                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                                    safePage === page ? "bg-white text-zinc-950" : "border border-white/10 bg-[#1c1c1c] text-zinc-400 hover:bg-[#262626] hover:text-white"
                                }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            type="button"
                            disabled={safePage === totalPages}
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-[#1c1c1c] text-zinc-400 transition-colors hover:bg-[#262626] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Next page"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Application Details Modal */}
            {selectedApp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" onClick={() => setSelectedApp(null)}>
                    <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#141414] p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                            <div className="flex items-center gap-3.5">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#222222]">
                                    {selectedApp.companyLogo ? (
                                        <img src={selectedApp.companyLogo} alt={selectedApp.companyName} className="h-full w-full object-cover" />
                                    ) : (
                                        <Briefcase className="h-5 w-5 text-zinc-400" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{selectedApp.jobTitle}</h3>
                                    <p className="text-sm text-zinc-400">{selectedApp.companyName}</p>
                                </div>
                            </div>

                            <button type="button" onClick={() => setSelectedApp(null)} className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white">
                                <Xmark className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="mt-5 space-y-4 text-sm">
                            <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
                                <span className="inline-flex items-center gap-1.5">
                                    <MapPin className="h-4 w-4 text-zinc-500" />
                                    {selectedApp.location || "Remote"}
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Clock className="h-4 w-4 text-zinc-500" />
                                    Applied {formatRelativeTime(selectedApp.appliedAt)}
                                </span>
                            </div>

                            {/* Submitted Contact Info */}
                            <div className="grid grid-cols-1 gap-3 rounded-2xl border border-white/5 bg-[#1a1a1a] p-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs text-zinc-500">Applicant Name</p>
                                    <p className="mt-0.5 font-medium text-zinc-200">{selectedApp.applicantName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500">Phone</p>
                                    <p className="mt-0.5 font-medium text-zinc-200">{selectedApp.phone || "N/A"}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-xs text-zinc-500">Email</p>
                                    <p className="mt-0.5 font-medium text-zinc-200">{selectedApp.applicantEmail}</p>
                                </div>
                            </div>

                            {/* Cover Note */}
                            {selectedApp.coverNote && (
                                <div>
                                    <p className="mb-1.5 text-xs font-medium text-zinc-400">Cover Note</p>
                                    <div className="rounded-2xl border border-white/5 bg-[#1a1a1a] p-3.5 text-xs leading-relaxed text-zinc-300">{selectedApp.coverNote}</div>
                                </div>
                            )}

                            {/* Resume & Portfolio Links */}
                            <div className="flex flex-wrap gap-3 pt-1">
                                {selectedApp.resumeUrl && (
                                    <a
                                        href={selectedApp.resumeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#222222] px-4 py-2 text-xs font-medium text-zinc-200 transition-colors hover:border-[#e5a9f7]/50 hover:text-[#e5a9f7]"
                                    >
                                        <FileText className="h-4 w-4" />
                                        <span>View Resume</span>
                                    </a>
                                )}
                                {selectedApp.portfolioUrl && (
                                    <a
                                        href={selectedApp.portfolioUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#222222] px-4 py-2 text-xs font-medium text-zinc-200 transition-colors hover:border-[#e5a9f7]/50 hover:text-[#e5a9f7]"
                                    >
                                        <LinkIcon className="h-4 w-4" />
                                        <span>Portfolio</span>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/10 pt-4">
                            <Link href={`/jobs/${selectedApp.jobId}`} className="rounded-xl bg-[#222222] px-4 py-2 text-xs font-medium text-zinc-200 transition-colors hover:bg-[#2c2c2c]">
                                View Job Post
                            </Link>
                            <button
                                type="button"
                                onClick={() => setSelectedApp(null)}
                                className="rounded-xl bg-[#e5a9f7] px-4 py-2 text-xs font-semibold text-zinc-950 transition-colors hover:bg-[#d88ef0]"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicationsClient;
