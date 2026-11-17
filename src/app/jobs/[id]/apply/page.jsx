import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";
import React from "react";
import Link from "next/link";
import JobApplyForm from "./JobApplyForm";
import { getJobById } from "@/lib/api/jobs";
import { getApplicationByApplicantId } from "@/lib/api/applications";
import { Card } from "@heroui/react";
import { ShieldExclamation, CircleCheck, TriangleExclamation, ArrowLeft } from "@gravity-ui/icons";

const ApplyPage = async ({ params }) => {
    const { id } = await params;

    const user = await getUserSession();
    if (!user) {
        redirect(`/signIn?redirect=/jobs/${id}/apply`);
    }

    if (user.role !== "seeker") {
        return (
            <main className="min-h-screen bg-zinc-950 px-4 py-12 flex items-center justify-center text-white">
                <Card className="w-full max-w-md rounded-3xl border border-white/5 bg-[#141414] p-6 sm:p-8 shadow-xl">
                    <Card.Content className="flex flex-col items-center gap-4 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
                            <ShieldExclamation className="h-6 w-6" />
                        </div>
                        <h1 className="text-xl font-bold text-white">Job Seeker Account Required</h1>
                        <p className="text-sm leading-relaxed text-zinc-400">Only job seekers can apply for positions. Please sign in with a job seeker account to continue.</p>
                        <Link
                            href={`/jobs/${id}`}
                            className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#222222] px-5 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-[#2c2c2c] hover:text-[#e5a9f7]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Back to Job Details</span>
                        </Link>
                    </Card.Content>
                </Card>
            </main>
        );
    }

    const applications = await getApplicationByApplicantId(user.id);
    const plan = {
        name: "Free",
        maxApplicationPerMonth: 3,
    };

    const job = await getJobById(id);

    const usedCount = applications.length;
    const maxCount = plan.maxApplicationPerMonth;
    const remainingCount = Math.max(0, maxCount - usedCount);
    const canApply = usedCount < maxCount;
    const progressPercent = Math.min(100, Math.round((usedCount / maxCount) * 100));

    return (
        <main className="min-h-screen bg-zinc-950 px-4 py-8 sm:px-6 lg:px-8 text-white">
            <div className="mx-auto max-w-2xl space-y-6">
                {/* Monthly Quota Status Banner */}
                <Card className="rounded-3xl border border-white/5 bg-[#141414] p-4 sm:p-5 shadow-xl">
                    <Card.Content className="space-y-3 p-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <span className="rounded-full bg-[#222222] px-3 py-1 text-xs font-semibold text-[#e5a9f7]">{plan.name} Plan</span>
                                <h2 className="text-sm font-medium text-zinc-200">
                                    You have applied: <span className="font-bold text-white">{usedCount}</span> of <span className="font-bold text-white">{maxCount}</span> so far
                                </h2>
                            </div>

                            <span className="text-xs text-zinc-400">{canApply ? `${remainingCount} ${remainingCount === 1 ? "application" : "applications"} remaining` : "Monthly limit reached"}</span>
                        </div>

                        {/* Visual Quota Progress Bar */}
                        <div className="h-2 w-full overflow-hidden rounded-full bg-[#222222]">
                            <div className={`h-full rounded-full transition-all duration-300 ${canApply ? "bg-[#e5a9f7]" : "bg-amber-400"}`} style={{ width: `${progressPercent}%` }} />
                        </div>
                    </Card.Content>
                </Card>

                {/* Application Form or Limit Reached State */}
                {canApply ? (
                    <JobApplyForm applicant={user} job={job} />
                ) : (
                    <Card className="rounded-3xl border border-white/5 bg-[#141414] p-6 sm:p-8 shadow-xl">
                        <Card.Content className="flex flex-col items-center gap-4 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
                                <TriangleExclamation className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Monthly Application Limit Reached</h3>
                            <p className="max-w-md text-sm leading-relaxed text-zinc-400">
                                You have used all <span className="font-semibold text-white">{plan.maxApplicationPerMonth}</span> applications included in your{" "}
                                <span className="font-semibold text-[#e5a9f7]">{plan.name}</span> plan this month.
                            </p>
                            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                                <Link href={`/jobs/${id}`} className="rounded-full bg-[#222222] px-5 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-[#2c2c2c]">
                                    Back to Job Details
                                </Link>
                                <Link href="/plans" className="rounded-full bg-[#e5a9f7] px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-[#d88ef0]">
                                    View Plans
                                </Link>
                            </div>
                        </Card.Content>
                    </Card>
                )}
            </div>
        </main>
    );
};

export default ApplyPage;
