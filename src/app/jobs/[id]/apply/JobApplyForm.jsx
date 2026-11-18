"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, Avatar } from "@heroui/react";
import { ArrowLeft, PaperPlane, FileText, Link as LinkIcon, Person, Envelope, CircleCheck } from "@gravity-ui/icons";
import { submitApplication } from "@/lib/actions/applications";

const JobApplyForm = ({ job, applicant }) => {
    // console.log(applicant);
    const [formData, setFormData] = useState({
        phone: "",
        resumeUrl: "",
        portfolioUrl: "",
        coverNote: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const applicationPayload = {
            // From Job
            jobId: job?._id,
            jobTitle: job?.jobTitle,
            companyId: job?.companyId,
            companyName: job?.companyName,
            companyLogo: job?.companyLogo,
            category: job?.category,
            jobType: job?.jobType,
            location: job?.location,

            // From Applicant
            applicantId: applicant?.id,
            applicantName: applicant?.name,
            applicantEmail: applicant?.email,

            // From User Input
            phone: formData.phone.trim(),
            resumeUrl: formData.resumeUrl.trim(),
            portfolioUrl: formData.portfolioUrl.trim(),
            coverNote: formData.coverNote.trim(),

            // Metadata
            status: "pending",
            appliedAt: new Date().toISOString(),
        };

        // console.log("Application Object:", applicationPayload);

        const res = await submitApplication(applicationPayload);
        // console.log(res);
        if (res.insertedId) {
            alert("Application Submitted Successfully...");
            setIsSubmitted(true);
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="mx-auto max-w-xl">
                <Card className="rounded-3xl border border-white/5 bg-[#141414] p-6 sm:p-8 text-white shadow-xl">
                    <Card.Content className="flex flex-col items-center gap-4 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                            <CircleCheck className="h-7 w-7" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Application Ready</h2>
                        <p className="text-sm text-zinc-400">
                            Applied for <span className="font-semibold text-white">{job?.jobTitle}</span> at <span className="font-semibold text-white">{job?.companyName}</span>. Check console for the
                            generated payload.
                        </p>
                        <Link href="/jobs" className="mt-2 rounded-full bg-[#e5a9f7] px-6 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-[#d88ef0]">
                            Back to Jobs
                        </Link>
                    </Card.Content>
                </Card>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl space-y-5">
            {/* Back Navigation */}
            <Link href={`/jobs/${job?._id}`} className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-[#e5a9f7]">
                <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                <span>Back to job</span>
            </Link>

            {/* Main Card */}
            <Card className="rounded-3xl border border-white/5 bg-[#141414] p-4 sm:p-6 text-white shadow-xl">
                <Card.Content className="space-y-6 p-2">
                    {/* Job Header */}
                    <div className="flex items-center gap-3.5 border-b border-white/5 pb-5">
                        <Avatar size="md" className="bg-white/10 p-1.5">
                            <Avatar.Image src={job?.companyLogo} alt={job?.companyName} />
                            <Avatar.Fallback>{job?.companyName?.[0]}</Avatar.Fallback>
                        </Avatar>
                        <div>
                            <h1 className="text-xl font-bold text-white sm:text-2xl">{job?.jobTitle}</h1>
                            <p className="text-sm text-zinc-400">
                                {job?.companyName} • {job?.location}
                            </p>
                        </div>
                    </div>

                    {/* Pre-filled Applicant Info */}
                    <div className="grid grid-cols-1 gap-3 rounded-2xl border border-white/5 bg-[#1b1b1b] p-4 sm:grid-cols-2">
                        <div className="flex items-center gap-2.5 text-sm">
                            <Person className="h-4 w-4 shrink-0 text-[#e5a9f7]" />
                            <div className="truncate">
                                <p className="text-xs text-zinc-500">Applicant</p>
                                <p className="truncate font-medium text-zinc-200">{applicant?.name}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 text-sm">
                            <Envelope className="h-4 w-4 shrink-0 text-[#e5a9f7]" />
                            <div className="truncate">
                                <p className="text-xs text-zinc-500">Email</p>
                                <p className="truncate font-medium text-zinc-200">{applicant?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Minimal Input Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-zinc-300">
                                    Phone Number <span className="text-[#e5a9f7]">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+880 1XXX-XXXXXX"
                                    className="w-full rounded-2xl border border-white/5 bg-[#222222] px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-[#e5a9f7]/50"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-zinc-300">
                                    Resume Link <span className="text-[#e5a9f7]">*</span>
                                </label>
                                <div className="relative flex items-center">
                                    <FileText className="pointer-events-none absolute left-3.5 h-4 w-4 text-[#e5a9f7]" />
                                    <input
                                        type="url"
                                        name="resumeUrl"
                                        required
                                        value={formData.resumeUrl}
                                        onChange={handleChange}
                                        placeholder="https://drive.google.com/..."
                                        className="w-full rounded-2xl border border-white/5 bg-[#222222] py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-[#e5a9f7]/50"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-300">
                                Portfolio / GitHub URL <span className="text-zinc-500">(Optional)</span>
                            </label>
                            <div className="relative flex items-center">
                                <LinkIcon className="pointer-events-none absolute left-3.5 h-4 w-4 text-[#e5a9f7]" />
                                <input
                                    type="url"
                                    name="portfolioUrl"
                                    value={formData.portfolioUrl}
                                    onChange={handleChange}
                                    placeholder="https://github.com/..."
                                    className="w-full rounded-2xl border border-white/5 bg-[#222222] py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-[#e5a9f7]/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-300">
                                Short Note <span className="text-zinc-500">(Optional)</span>
                            </label>
                            <textarea
                                name="coverNote"
                                rows={3}
                                value={formData.coverNote}
                                onChange={handleChange}
                                placeholder="Write a brief note to the recruiter..."
                                className="w-full rounded-2xl border border-white/5 bg-[#222222] p-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-[#e5a9f7]/50"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <Link href={`/jobs/${job?._id}`} className="rounded-full bg-[#222222] px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-[#2c2c2c]">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center gap-2 rounded-full bg-[#e5a9f7] px-6 py-2.5 text-sm font-semibold text-zinc-950 transition-all hover:bg-[#d88ef0] disabled:opacity-60"
                            >
                                <PaperPlane className="h-4 w-4" />
                                <span>{isSubmitting ? "Submitting..." : "Confirm Apply"}</span>
                            </button>
                        </div>
                    </form>
                </Card.Content>
            </Card>
        </div>
    );
};

export default JobApplyForm;
