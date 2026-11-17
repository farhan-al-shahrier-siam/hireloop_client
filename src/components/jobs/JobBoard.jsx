"use client";

import React, { useState, useMemo } from "react";
import JobCard from "@/components/jobs/JobCard";
import {
  Magnifier,
  Xmark,
  Sliders,
  Briefcase,
  CircleDollar,
  Globe,
  Layers,
} from "@gravity-ui/icons";

export default function JobBoard({ jobs = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedJobType, setSelectedJobType] = useState("all");
  const [workMode, setWorkMode] = useState("all"); // "all" | "remote" | "onsite"
  const [minSalaryFilter, setMinSalaryFilter] = useState(0);

  // Dynamically extract unique categories & job types from your dataset
  const categories = useMemo(() => {
    const unique = new Set(jobs.map((job) => job.category).filter(Boolean));
    return Array.from(unique);
  }, [jobs]);

  const jobTypes = useMemo(() => {
    const unique = new Set(jobs.map((job) => job.jobType).filter(Boolean));
    return Array.from(unique);
  }, [jobs]);

  // Filter jobs based on all active criteria
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // 1. Keyword Search (Title, Company, Location, Qualifications)
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        job.jobTitle?.toLowerCase().includes(q) ||
        job.companyName?.toLowerCase().includes(q) ||
        job.location?.toLowerCase().includes(q) ||
        job.qualifications?.toLowerCase().includes(q);

      // 2. Category
      const matchesCategory =
        selectedCategory === "all" || job.category === selectedCategory;

      // 3. Job Type
      const matchesJobType =
        selectedJobType === "all" || job.jobType === selectedJobType;

      // 4. Remote / On-site
      const matchesWorkMode =
        workMode === "all" ||
        (workMode === "remote" && job.isRemote === true) ||
        (workMode === "onsite" && job.isRemote === false);

      // 5. Minimum Salary
      const matchesSalary =
        minSalaryFilter === 0 || (job.maxSalary || 0) >= minSalaryFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesJobType &&
        matchesWorkMode &&
        matchesSalary
      );
    });
  }, [
    jobs,
    searchQuery,
    selectedCategory,
    selectedJobType,
    workMode,
    minSalaryFilter,
  ]);

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCategory !== "all" ||
    selectedJobType !== "all" ||
    workMode !== "all" ||
    minSalaryFilter !== 0;

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedJobType("all");
    setWorkMode("all");
    setMinSalaryFilter(0);
  };

  const formatLabel = (str) =>
    str
      ?.split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("-");

  return (
    <div className="space-y-8">
      {/* Header & Count */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Open Positions
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Showing{" "}
            <span className="font-semibold text-white">
              {filteredJobs.length}
            </span>{" "}
            of {jobs.length} available roles
          </p>
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-[#222222] px-4 py-2 text-xs font-medium text-[#e5a9f7] transition-colors hover:bg-[#2c2c2c]"
          >
            <Xmark className="h-3.5 w-3.5" />
            Reset Filters
          </button>
        )}
      </div>

      {/* Search & Filter Control Panel */}
      <div className="rounded-3xl border border-white/5 bg-[#141414] p-4 sm:p-5 shadow-xl space-y-4">
        {/* Search Input Bar */}
        <div className="relative flex items-center">
          <Magnifier className="pointer-events-none absolute left-4 h-4 w-4 text-[#e5a9f7]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by job title, company, skill, or location..."
            className="w-full rounded-2xl border border-white/5 bg-[#222222] py-3 pl-11 pr-10 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-[#e5a9f7]/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-3.5 rounded-full p-1 text-zinc-400 hover:bg-white/10 hover:text-white"
            >
              <Xmark className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Category Filter */}
          <div className="relative flex items-center">
            <Layers className="pointer-events-none absolute left-3.5 h-4 w-4 text-[#e5a9f7]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-white/5 bg-[#222222] py-2.5 pl-10 pr-8 text-sm text-zinc-100 outline-none transition-colors focus:border-[#e5a9f7]/50"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Job Type Filter */}
          <div className="relative flex items-center">
            <Briefcase className="pointer-events-none absolute left-3.5 h-4 w-4 text-[#e5a9f7]" />
            <select
              value={selectedJobType}
              onChange={(e) => setSelectedJobType(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-white/5 bg-[#222222] py-2.5 pl-10 pr-8 text-sm text-zinc-100 outline-none transition-colors focus:border-[#e5a9f7]/50"
            >
              <option value="all">All Job Types</option>
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {formatLabel(type)}
                </option>
              ))}
            </select>
          </div>

          {/* Remote / Work Mode Filter */}
          <div className="relative flex items-center">
            <Globe className="pointer-events-none absolute left-3.5 h-4 w-4 text-[#e5a9f7]" />
            <select
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-white/5 bg-[#222222] py-2.5 pl-10 pr-8 text-sm text-zinc-100 outline-none transition-colors focus:border-[#e5a9f7]/50"
            >
              <option value="all">All Work Modes</option>
              <option value="remote">Remote Only</option>
              <option value="onsite">On-Site Only</option>
            </select>
          </div>

          {/* Minimum Salary Filter */}
          <div className="relative flex items-center">
            <CircleDollar className="pointer-events-none absolute left-3.5 h-4 w-4 text-[#e5a9f7]" />
            <select
              value={minSalaryFilter}
              onChange={(e) => setMinSalaryFilter(Number(e.target.value))}
              className="w-full appearance-none rounded-2xl border border-white/5 bg-[#222222] py-2.5 pl-10 pr-8 text-sm text-zinc-100 outline-none transition-colors focus:border-[#e5a9f7]/50"
            >
              <option value={0}>Any Salary</option>
              <option value={50000}>$50k+ / year</option>
              <option value={80000}>$80k+ / year</option>
              <option value={100000}>$100k+ / year</option>
              <option value={130000}>$130k+ / year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Responsive Job Cards Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <JobCard key={job._id.toString()} job={job} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[35vh] flex-col items-center justify-center gap-3 rounded-3xl border border-white/5 bg-[#141414] p-8 text-center">
          <Sliders className="h-8 w-8 text-zinc-500" />
          <h3 className="text-lg font-medium text-white">No matching jobs</h3>
          <p className="max-w-md text-sm text-zinc-400">
            Try adjusting your search keywords or clearing active filters to see
            more roles.
          </p>
          <button
            onClick={resetFilters}
            className="mt-2 rounded-full bg-[#222222] px-5 py-2.5 text-sm font-medium text-[#e5a9f7] transition-colors hover:bg-[#2c2c2c]"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}