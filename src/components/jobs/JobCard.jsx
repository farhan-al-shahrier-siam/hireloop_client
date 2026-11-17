"use client";

import React from "react";
import Link from "next/link";
import { Card, Chip, Avatar } from "@heroui/react";
import {
  MapPin,
  Briefcase,
  CircleDollar,
  ArrowRight,
  Clock,
} from "@gravity-ui/icons";

export default function JobCard({ job }) {
  const {
    _id,
    jobTitle,
    companyName,
    companyLogo,
    location,
    jobType,
    isRemote,
    minSalary,
    maxSalary,
    frequency,
    responsibilities,
    deadline,
  } = job;

  const formatAmount = (num) =>
    num >= 1000 ? `$${Math.round(num / 1000)}k` : `$${num}`;

  const formattedFrequency = frequency?.replace("per ", "") || "year";
  const salaryText = `${formatAmount(minSalary)}–${formatAmount(
    maxSalary
  )}/${formattedFrequency}`;

  const formattedJobType = jobType
    ?.split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("-");

  const formattedDeadline = deadline
    ? new Date(deadline).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <Card className="w-full max-w-md rounded-3xl bg-[#141414] border border-white/5 p-3 text-white shadow-xl transition-transform duration-200 hover:-translate-y-1">
      <Card.Content className="flex flex-col gap-5 p-4">
        {/* Top Row: Company Info & Deadline */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Avatar size="sm" className="bg-white/10 p-1">
              <Avatar.Image src={companyLogo} alt={companyName} />
              <Avatar.Fallback>{companyName?.[0]}</Avatar.Fallback>
            </Avatar>
            <span className="text-sm font-medium text-zinc-300">
              {companyName}
            </span>
          </div>

          {formattedDeadline && (
            <span className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Clock className="h-3.5 w-3.5 text-zinc-500" />
              Due {formattedDeadline}
            </span>
          )}
        </div>

        {/* Title & Short Description */}
        <div className="space-y-2.5">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            {jobTitle}
          </h2>
          <p className="line-clamp-2 text-sm sm:text-base leading-relaxed text-zinc-400">
            {responsibilities}
          </p>
        </div>

        {/* Pill Badges */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <Chip
            variant="soft"
            className="bg-[#222222] px-3.5 py-2 h-auto rounded-full inline-flex items-center gap-1.5"
          >
            <MapPin className="h-4 w-4 text-[#e5a9f7] shrink-0" />
            <Chip.Label className="text-sm font-medium text-zinc-100">
              {location}
            </Chip.Label>
          </Chip>

          <Chip
            variant="soft"
            className="bg-[#222222] px-3.5 py-2 h-auto rounded-full inline-flex items-center gap-1.5"
          >
            <Briefcase className="h-4 w-4 text-[#e5a9f7] shrink-0" />
            <Chip.Label className="text-sm font-medium text-zinc-100">
              {isRemote ? `Remote • ${formattedJobType}` : formattedJobType}
            </Chip.Label>
          </Chip>

          <Chip
            variant="soft"
            className="bg-[#222222] px-3.5 py-2 h-auto rounded-full inline-flex items-center gap-1.5"
          >
            <CircleDollar className="h-4 w-4 text-[#e5a9f7] shrink-0" />
            <Chip.Label className="text-sm font-medium text-zinc-100">
              {salaryText}
            </Chip.Label>
          </Chip>
        </div>

        {/* Apply Now Link */}
        <div className="pt-3">
          <Link
            href={`/jobs/${_id}`}
            className="group inline-flex items-center gap-2.5 text-base font-medium text-white transition-colors hover:text-[#e5a9f7]"
          >
            <span>Apply Now</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </Card.Content>
    </Card>
  );
}