"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@heroui/react";
import { Pencil, TrashBin, Ellipsis, Persons, Globe, Pin, Eye } from "@gravity-ui/icons";

const ActionMenu = ({ job, onView, onUpdate, onDelete }) => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                type="button"
                aria-label="Job actions"
                onClick={() => setOpen((prev) => !prev)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            >
                <Ellipsis width={17} height={17} />
            </button>

            {open && (
                <div className="absolute right-0 z-30 mt-1.5 w-36 origin-top-right rounded-xl border border-white/10 bg-[#18181b] p-1 shadow-xl">
                    <button
                        type="button"
                        onClick={() => {
                            setOpen(false);
                            onView?.(job);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs text-gray-200 transition-colors hover:bg-white/10"
                    >
                        <Eye width={14} height={14} className="text-gray-400" />
                        View Job
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setOpen(false);
                            onUpdate?.(job);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs text-gray-200 transition-colors hover:bg-white/10"
                    >
                        <Pencil width={14} height={14} className="text-purple-400" />
                        Edit Job
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setOpen(false);
                            onDelete?.(job);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs text-red-400 transition-colors hover:bg-red-500/10"
                    >
                        <TrashBin width={14} height={14} />
                        Delete Job
                    </button>
                </div>
            )}
        </div>
    );
};

const JobsTable = ({ jobs = [], onView, onUpdate, onDelete }) => {
    const gridCols = "xl:grid-cols-[minmax(200px,2.2fr)_minmax(160px,1.7fr)_minmax(100px,1fr)_minmax(120px,1.3fr)_minmax(130px,1.2fr)_minmax(95px,1fr)_minmax(115px,1.2fr)_116px]";

    return (
        <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-[#111111]">
            {/* Desktop Header (xl and up so sidebar doesn't squish columns) */}
            <div className={`hidden border-b border-white/10 bg-[#0c0c0c] px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400 xl:grid xl:items-center xl:gap-4 ${gridCols}`}>
                <div>Job Title & Dept</div>
                <div>Company & Location</div>
                <div>Type</div>
                <div>Compensation</div>
                <div>Applicants</div>
                <div>Status</div>
                <div>Deadline</div>
                <div className="text-right">Actions</div>
            </div>

            {/* Empty State */}
            {jobs.length === 0 ? (
                <div className="flex min-h-[220px] flex-col items-center justify-center gap-1 text-sm text-gray-500">
                    <p>No jobs found</p>
                    <p className="text-xs text-gray-600">Posted roles will appear here once created.</p>
                </div>
            ) : (
                <div className="divide-y divide-white/10">
                    {jobs.map((job, index) => {
                        const isActive = job.status?.toLowerCase() === "active";
                        const isRemote = job.location?.toLowerCase().startsWith("remote");

                        return (
                            <div key={job._id || job.id || index} className="px-4 py-4 transition-colors hover:bg-white/[0.02] sm:px-5">
                                {/* Desktop Row (xl+) */}
                                <div className={`hidden xl:grid xl:items-center xl:gap-4 ${gridCols}`}>
                                    {/* Job Title & Dept */}
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                                            {job.icon ? job.icon : <span className="text-sm text-purple-400">◆</span>}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-white">{job.jobTitle || "Untitled Role"}</p>
                                            <p className="mt-0.5 truncate text-xs text-blue-400">{job.category || "General"}</p>
                                        </div>
                                    </div>

                                    {/* Company & Location */}
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-gray-200">{job.companyName || "—"}</p>
                                        <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                                            {isRemote ? <Globe width={13} height={13} className="shrink-0" /> : <Pin width={13} height={13} className="shrink-0" />}
                                            <span className="truncate">{job.location || "Not specified"}</span>
                                        </div>
                                    </div>

                                    {/* Job Type */}
                                    <div>
                                        <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs capitalize text-gray-300">{job.jobType || "N/A"}</span>
                                    </div>

                                    {/* Salary */}
                                    <div className="truncate text-sm text-gray-200">{job.maxSalary || <span className="text-xs text-gray-500">Not disclosed</span>}</div>

                                    {/* Applicants */}
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <Persons width={16} height={16} className="shrink-0 text-purple-400" />
                                        <span className="whitespace-nowrap">{job.applicants ?? 0} Candidates</span>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                                                isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-gray-500/10 text-gray-400"
                                            }`}
                                        >
                                            <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-400" : "bg-gray-500"}`} />
                                            {job.status || "Draft"}
                                        </span>
                                    </div>

                                    {/* Deadline */}
                                    <div className="min-w-0">
                                        <p className="whitespace-nowrap text-sm text-gray-300">{job.deadline || "—"}</p>
                                        {job.postedAt && <p className="mt-0.5 truncate text-[11px] text-gray-500">{job.postedAt}</p>}
                                    </div>

                                    {/* Actions (No nested buttons) */}
                                    <div className="flex shrink-0 items-center justify-end gap-1.5">
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="flat"
                                            aria-label="Edit job"
                                            className="h-8 w-8 min-w-8 rounded-lg bg-[#27234a] text-purple-300 hover:bg-[#322d5e]"
                                            onPress={() => onUpdate?.(job)}
                                        >
                                            <Pencil width={15} height={15} />
                                        </Button>

                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="flat"
                                            aria-label="Delete job"
                                            className="h-8 w-8 min-w-8 rounded-lg bg-white/5 text-gray-400 hover:bg-red-500/15 hover:text-red-400"
                                            onPress={() => onDelete?.(job)}
                                        >
                                            <TrashBin width={15} height={15} />
                                        </Button>

                                        <ActionMenu job={job} onView={onView} onUpdate={onUpdate} onDelete={onDelete} />
                                    </div>
                                </div>

                                {/* Mobile & Tablet Card Layout (< xl) */}
                                <div className="flex flex-col gap-4 xl:hidden">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                                                {job.icon ? job.icon : <span className="text-sm text-purple-400">◆</span>}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-white">{job.title || "Untitled Role"}</p>
                                                <p className="mt-0.5 truncate text-xs text-blue-400">{job.category || "General"}</p>
                                            </div>
                                        </div>

                                        <ActionMenu job={job} onView={onView} onUpdate={onUpdate} onDelete={onDelete} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 rounded-xl bg-white/[0.02] p-3 text-xs sm:grid-cols-3">
                                        <div>
                                            <p className="mb-1 text-gray-500">Company</p>
                                            <p className="truncate font-medium text-gray-200">{job.companyName || "—"}</p>
                                        </div>

                                        <div>
                                            <p className="mb-1 text-gray-500">Location</p>
                                            <p className="truncate text-gray-200">{job.location || "Not specified"}</p>
                                        </div>

                                        <div>
                                            <p className="mb-1 text-gray-500">Type</p>
                                            <p className="capitalize text-gray-200">{job.jobType || "N/A"}</p>
                                        </div>

                                        <div>
                                            <p className="mb-1 text-gray-500">Compensation</p>
                                            <p className="text-gray-200">{job.maxSalary || "Not disclosed"}</p>
                                        </div>

                                        <div>
                                            <p className="mb-1 text-gray-500">Applicants</p>
                                            <p className="text-gray-200">{job.applicants ?? 0} Candidates</p>
                                        </div>

                                        <div>
                                            <p className="mb-1 text-gray-500">Deadline</p>
                                            <p className="text-gray-200">{job.deadline || "—"}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3">
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium capitalize ${
                                                isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-gray-500/10 text-gray-400"
                                            }`}
                                        >
                                            <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-400" : "bg-gray-500"}`} />
                                            {job.status || "Draft"}
                                        </span>

                                        <div className="flex items-center gap-2">
                                            <Button size="sm" variant="flat" className="bg-[#27234a] text-purple-300" onPress={() => onUpdate?.(job)}>
                                                <Pencil width={14} height={14} />
                                                Update
                                            </Button>

                                            <Button isIconOnly size="sm" variant="flat" aria-label="Delete job" className="bg-white/5 text-gray-400 hover:text-red-400" onPress={() => onDelete?.(job)}>
                                                <TrashBin width={14} height={14} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default JobsTable;
