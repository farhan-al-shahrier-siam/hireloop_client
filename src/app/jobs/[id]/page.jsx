import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobById } from "@/lib/api/jobs";
import { Card, Chip, Avatar } from "@heroui/react";
import { ArrowLeft, ArrowRight, MapPin, Briefcase, CircleDollar, Clock, Layers, Calendar, CircleCheck, Globe } from "@gravity-ui/icons";

const JobDetailsPage = async ({ params }) => {
    const { id } = await params;
    const job = await getJobById(id);

    if (!job) {
        notFound();
    }

    const { _id, jobTitle, companyName, companyLogo, category, jobType, isRemote, location, deadline, minSalary, maxSalary, frequency, responsibilities, qualifications, status, createdAt } = job;

    // Format salary cleanly for both monthly (e.g., $4,500–$6,500/month) and yearly ($90k–$140k/year)
    const formatAmount = (num) => {
        if (num >= 10000) return `$${Math.round(num / 1000)}k`;
        return `$${Number(num).toLocaleString("en-US")}`;
    };

    const formattedFrequency = frequency?.replace("per ", "") || "month";
    const salaryText = `${formatAmount(minSalary)}–${formatAmount(maxSalary)}/${formattedFrequency}`;

    // Capitalize jobType (e.g., "contract" -> "Contract", "full-time" -> "Full-Time")
    const formattedJobType = jobType
        ?.split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("-");

    // Format dates
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    // Split descriptive paragraphs into crisp bullet points
    const toBulletItems = (text) => {
        if (!text) return [];
        return text
            .split(/\. (?=[A-Z])|, (?=[a-z]+ [a-z]+)| and (?=[a-z]+ )/)
            .map((item) => item.replace(/\.$/, "").trim())
            .filter(Boolean)
            .map((item) => item.charAt(0).toUpperCase() + item.slice(1));
    };

    const responsibilityList = toBulletItems(responsibilities);
    const qualificationList = toBulletItems(qualifications);

    return (
        <main className="min-h-screen bg-zinc-950 px-4 py-8 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl space-y-6">
                {/* Back Navigation */}
                <div>
                    <Link href="/jobs" className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-[#e5a9f7]">
                        <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                        <span>Back to all jobs</span>
                    </Link>
                </div>

                {/* Hero Header Card */}
                <Card className="rounded-3xl border border-white/5 bg-[#141414] p-4 sm:p-6 shadow-xl">
                    <Card.Content className="flex flex-col gap-6 p-2">
                        {/* Top Bar: Company & Status */}
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3.5">
                                <Avatar size="md" className="bg-white/10 p-1.5">
                                    <Avatar.Image src={companyLogo} alt={companyName} />
                                    <Avatar.Fallback>{companyName?.[0]}</Avatar.Fallback>
                                </Avatar>
                                <div>
                                    <p className="text-base font-semibold text-white">{companyName}</p>
                                    <p className="text-xs text-zinc-400">{category}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5">
                                {status === "active" && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                        Actively Hiring
                                    </span>
                                )}
                                <span className="text-xs text-zinc-500">Posted {formatDate(createdAt)}</span>
                            </div>
                        </div>

                        {/* Job Title */}
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{jobTitle}</h1>
                        </div>

                        {/* Pill Badges & Primary CTA */}
                        <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <Chip variant="soft" className="inline-flex h-auto items-center gap-1.5 rounded-full bg-[#222222] px-3.5 py-2">
                                    <MapPin className="h-4 w-4 shrink-0 text-[#e5a9f7]" />
                                    <Chip.Label className="text-sm font-medium text-zinc-100">{location}</Chip.Label>
                                </Chip>

                                <Chip variant="soft" className="inline-flex h-auto items-center gap-1.5 rounded-full bg-[#222222] px-3.5 py-2">
                                    <Briefcase className="h-4 w-4 shrink-0 text-[#e5a9f7]" />
                                    <Chip.Label className="text-sm font-medium text-zinc-100">{isRemote ? `Remote • ${formattedJobType}` : formattedJobType}</Chip.Label>
                                </Chip>

                                <Chip variant="soft" className="inline-flex h-auto items-center gap-1.5 rounded-full bg-[#222222] px-3.5 py-2">
                                    <CircleDollar className="h-4 w-4 shrink-0 text-[#e5a9f7]" />
                                    <Chip.Label className="text-sm font-medium text-zinc-100">{salaryText}</Chip.Label>
                                </Chip>
                            </div>

                            <Link
                                href={`/jobs/${_id}/apply`}
                                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#e5a9f7] px-6 py-3 text-sm font-semibold text-zinc-950 transition-all hover:bg-[#d88ef0]"
                            >
                                <span>Apply Now</span>
                                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </Card.Content>
                </Card>

                {/* Main Content + Sidebar Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left 2 Columns: Responsibilities & Qualifications */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Responsibilities */}
                        <Card className="rounded-3xl border border-white/5 bg-[#141414] p-4 sm:p-6 shadow-xl">
                            <Card.Content className="space-y-4 p-2">
                                <h2 className="text-xl font-semibold text-white">Key Responsibilities</h2>
                                <ul className="space-y-3">
                                    {responsibilityList.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm sm:text-base leading-relaxed text-zinc-300">
                                            <CircleCheck className="mt-1 h-4 w-4 shrink-0 text-[#e5a9f7]" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card.Content>
                        </Card>

                        {/* Qualifications */}
                        <Card className="rounded-3xl border border-white/5 bg-[#141414] p-4 sm:p-6 shadow-xl">
                            <Card.Content className="space-y-4 p-2">
                                <h2 className="text-xl font-semibold text-white">Qualifications & Skills</h2>
                                <ul className="space-y-3">
                                    {qualificationList.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm sm:text-base leading-relaxed text-zinc-300">
                                            <CircleCheck className="mt-1 h-4 w-4 shrink-0 text-[#e5a9f7]" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card.Content>
                        </Card>
                    </div>

                    {/* Right Column: Job Overview Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="rounded-3xl border border-white/5 bg-[#141414] p-4 sm:p-6 shadow-xl">
                            <Card.Content className="space-y-5 p-2">
                                <h2 className="text-lg font-semibold text-white">Job Overview</h2>

                                <div className="space-y-4 text-sm">
                                    <div className="flex items-start gap-3">
                                        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#e5a9f7]" />
                                        <div>
                                            <p className="text-xs text-zinc-500">Application Deadline</p>
                                            <p className="font-medium text-zinc-200">{formatDate(deadline)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Layers className="mt-0.5 h-4 w-4 shrink-0 text-[#e5a9f7]" />
                                        <div>
                                            <p className="text-xs text-zinc-500">Department</p>
                                            <p className="font-medium text-zinc-200">{category}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Globe className="mt-0.5 h-4 w-4 shrink-0 text-[#e5a9f7]" />
                                        <div>
                                            <p className="text-xs text-zinc-500">Work Arrangement</p>
                                            <p className="font-medium text-zinc-200">
                                                {isRemote ? "Remote Allowed" : "On-Site"} ({location})
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <CircleDollar className="mt-0.5 h-4 w-4 shrink-0 text-[#e5a9f7]" />
                                        <div>
                                            <p className="text-xs text-zinc-500">Compensation</p>
                                            <p className="font-medium text-zinc-200">{salaryText}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-[#e5a9f7]" />
                                        <div>
                                            <p className="text-xs text-zinc-500">Date Posted</p>
                                            <p className="font-medium text-zinc-200">{formatDate(createdAt)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Link
                                        href={`/jobs/${_id}/apply`}
                                        className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#222222] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#2c2c2c] hover:text-[#e5a9f7]"
                                    >
                                        <span>Submit Application</span>
                                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </Card.Content>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default JobDetailsPage;
