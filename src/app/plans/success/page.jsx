"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, Chip } from "@heroui/react";
import {
  CircleCheck,
  ArrowRight,
  Sparkles,
  Briefcase,
  House,
  Receipt,
} from "@gravity-ui/icons";

function SuccessContent() {
  const searchParams = useSearchParams();

  // Optional dynamic context via URL params, with sensible defaults
  const type = searchParams.get("type") || "subscription"; // "subscription" | "application"
  const planName = searchParams.get("plan") || "Pro";
  const role = searchParams.get("role") || "seeker";
  const jobTitle = searchParams.get("job") || "your target role";
  const companyName = searchParams.get("company") || "the company";

  const isApplication = type === "application";

  const transactionDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="w-full max-w-xl rounded-3xl border border-white/5 bg-[#141414] p-6 sm:p-8 text-white shadow-xl">
      <Card.Content className="flex flex-col items-center gap-6 p-2 text-center">
        {/* Animated / Glowing Check Badge */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 ring-8 ring-emerald-500/5">
          <CircleCheck className="h-9 w-9" />
        </div>

        {/* Status Chip */}
        <Chip
          variant="soft"
          className="inline-flex h-auto items-center gap-1.5 rounded-full bg-[#222222] px-3.5 py-1.5"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#e5a9f7]" />
          <Chip.Label className="text-xs font-semibold text-[#e5a9f7]">
            {isApplication ? "Application Submitted" : "Payment Confirmed"}
          </Chip.Label>
        </Chip>

        {/* Heading & Description */}
        <div className="space-y-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {isApplication
              ? "You're officially in the running!"
              : `Welcome to the ${planName} Plan!`}
          </h1>
          <p className="mx-auto max-w-md text-sm sm:text-base leading-relaxed text-zinc-400">
            {isApplication ? (
              <>
                Your application for{" "}
                <span className="font-semibold text-white">{jobTitle}</span> at{" "}
                <span className="font-semibold text-white">{companyName}</span>{" "}
                has been received. We will notify you as soon as the recruiter
                reviews your profile.
              </>
            ) : (
              <>
                Your upgrade to the{" "}
                <span className="font-semibold text-white">{planName}</span>{" "}
                tier is now active. All higher limits and priority features have
                been unlocked on your account.
              </>
            )}
          </p>
        </div>

        {/* Summary Details Box */}
        <div className="w-full rounded-2xl border border-white/5 bg-[#1b1b1b] p-4 text-left space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-zinc-400">
              <Receipt className="h-4 w-4 text-[#e5a9f7]" />
              <span>Status</span>
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Completed
            </span>
          </div>

          <div className="border-t border-white/5" />

          <div className="flex items-center justify-between">
            <span className="text-zinc-400">
              {isApplication ? "Position" : "Selected Plan"}
            </span>
            <span className="font-medium text-zinc-100">
              {isApplication ? jobTitle : `${planName} (${role})`}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Date</span>
            <span className="font-medium text-zinc-100">{transactionDate}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full flex-col gap-3 pt-2 sm:flex-row">
          <Link
            href="/"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#222222] px-5 py-3 text-sm font-medium text-zinc-200 transition-colors hover:bg-[#2c2c2c]"
          >
            <House className="h-4 w-4" />
            <span>Back Home</span>
          </Link>

          <Link
            href={role === "recruiter" ? "/dashboard" : "/jobs"}
            className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#e5a9f7] px-6 py-3 text-sm font-semibold text-zinc-950 transition-all hover:bg-[#d88ef0]"
          >
            <Briefcase className="h-4 w-4" />
            <span>
              {role === "recruiter" ? "Go to Dashboard" : "Browse Jobs"}
            </span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </Card.Content>
    </Card>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-12 sm:px-6 lg:px-8 flex items-center justify-center text-white">
      <Suspense
        fallback={
          <div className="text-sm text-zinc-400">Loading confirmation...</div>
        }
      >
        <SuccessContent />
      </Suspense>
    </main>
  );
}