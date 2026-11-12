"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button, Switch, toast } from "@heroui/react";
import { ArrowRight, Factory, Globe, MapPin, Calendar, ChevronRight, ChevronDown } from "@gravity-ui/icons";
import { createJob } from "@/lib/actions/jobs";
import { redirect } from "next/navigation";

export default function PostJobPage() {
    // Central form state holding all input values
    const [formData, setFormData] = useState({
        jobTitle: "",
        companyName: "",
        category: "",
        jobType: "",
        isRemote: true,
        location: "",
        deadline: "",
        minSalary: "",
        maxSalary: "",
        frequency: "",
        responsibilities: "",
        qualifications: "",
    });

    // Dropdown open/close toggles
    const [openCategory, setOpenCategory] = useState(false);
    const [openFrequency, setOpenFrequency] = useState(false);

    // Generic handler for standard text inputs and textareas
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Helper for custom selectors and buttons
    const handleFieldChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Submission function gathering all collected data
    const handleSubmit = async (e) => {
        e?.preventDefault();

        const payload = {
            ...formData,
            minSalary: Number(formData.minSalary) || 0,
            maxSalary: Number(formData.maxSalary) || 0,
            companyId: "company_123",
            status: "active",
            isPubliclyVisible: true,
            submittedAt: new Date().toISOString(),
        };


        const res = await createJob(payload)
        if(res.insertedId){
            toast.success("Job posted Successfully!")
            e.target.reset()
            redirect("/dashboard/recruiter/jobs")
        }
    };

    const jobTypes = [
        { key: "full-time", label: "Full-time" },
        { key: "part-time", label: "Part-time" },
        { key: "contract", label: "Contract" },
        { key: "internship", label: "Internship" },
    ];

    const categories = ["Engineering & Tech", "Product & Design", "Marketing & Sales"];

    const frequencies = ["per hour", "per month", "per year"];

    return (
        <form onSubmit={handleSubmit} className="min-h-screen bg-[#0d0e12] text-zinc-100 py-10 px-4 rounded-2xl lg:m-2 sm:px-8">
            <div className="max-w-4xl mx-auto space-y-10">
                {/* Top Header & Breadcrumbs */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs">
                            <Link href="/dashboard/recruiter/jobs" className="text-zinc-400 hover:text-zinc-200 transition-colors">
                                Manage Jobs
                            </Link>
                            <ChevronRight className="w-3 h-3 text-zinc-600" />
                            <span className="text-indigo-400 font-medium">Create New Listing</span>
                        </nav>

                        <h1 className="text-3xl font-bold tracking-tight text-white">Post a New Job</h1>
                        <p className="text-sm text-zinc-400">Fill in the position specifications to attract qualified talent across our network.</p>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/25 flex items-center gap-2"
                            endContent={<ArrowRight className="w-4 h-4" />}
                        >
                            Publish Job
                        </Button>
                    </div>
                </div>

                {/* Section 1: Basic Information */}
                <section className="space-y-5">
                    <div className="flex items-center gap-2 text-base font-semibold text-white">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                        <h2>1. Basic Information</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                                Job Title <span className="text-indigo-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="jobTitle"
                                value={formData.jobTitle}
                                onChange={handleChange}
                                placeholder="e.g. Senior Frontend Engineer"
                                required
                                className="w-full h-12 px-3.5 bg-[#15171e] border border-zinc-800/80 hover:border-zinc-700 focus:border-indigo-500 focus:outline-none rounded-xl text-zinc-200 text-sm transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                                    Company Name <span className="text-indigo-400">*</span>
                                </label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3 text-zinc-500 pointer-events-none">
                                        <Factory className="w-4 h-4" />
                                    </span>
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        required
                                        className="w-full h-12 pl-10 pr-3.5 bg-[#15171e] border border-zinc-800/80 hover:border-zinc-700 focus:border-indigo-500 focus:outline-none rounded-xl text-zinc-200 text-sm transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Job Category Dropdown */}
                            <div className="relative">
                                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                                    Job Category <span className="text-indigo-400">*</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setOpenCategory(!openCategory);
                                        setOpenFrequency(false);
                                    }}
                                    className="w-full h-12 px-3.5 bg-[#15171e] border border-zinc-800/80 hover:border-zinc-700 focus:border-indigo-500 focus:outline-none rounded-xl flex items-center justify-between text-sm text-zinc-200 transition-colors"
                                >
                                    <span>{formData.category}</span>
                                    <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${openCategory ? "rotate-180" : ""}`} />
                                </button>

                                {openCategory && (
                                    <div className="absolute z-20 w-full mt-1.5 bg-[#181a22] border border-zinc-800 rounded-xl shadow-xl overflow-hidden py-1">
                                        {categories.map((cat) => (
                                            <div
                                                key={cat}
                                                onClick={() => {
                                                    handleFieldChange("category", cat);
                                                    setOpenCategory(false);
                                                }}
                                                className={`px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                                                    formData.category === cat ? "bg-indigo-600/20 text-indigo-400 font-medium" : "text-zinc-300 hover:bg-zinc-800/60"
                                                }`}
                                            >
                                                {cat}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                                Job Type <span className="text-indigo-400">*</span>
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                {jobTypes.map((type) => {
                                    const active = formData.jobType === type.key;
                                    return (
                                        <button
                                            key={type.key}
                                            type="button"
                                            onClick={() => handleFieldChange("jobType", type.key)}
                                            className={`h-11 rounded-xl text-sm font-medium transition-colors border ${
                                                active
                                                    ? "bg-[#161826] border-indigo-500/80 text-white shadow-sm"
                                                    : "bg-[#15171e] border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                                            }`}
                                        >
                                            {type.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 2: Location, Compensation & Timeline */}
                <section className="space-y-5">
                    <div className="flex items-center gap-2 text-base font-semibold text-white">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                        <h2>2. Location, Compensation &amp; Timeline</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-[#15171e] border border-zinc-800/80">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-zinc-800/50 text-zinc-400">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-zinc-100">Remote Work Allowed (isRemote)</h3>
                                    <p className="text-xs text-zinc-400">Enable worldwide or distributed candidate applications</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                role="switch"
                                aria-checked={formData.isRemote}
                                onClick={() => handleFieldChange("isRemote", !formData.isRemote)}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                    formData.isRemote ? "bg-indigo-600" : "bg-zinc-700"
                                }`}
                            >
                                <span
                                    aria-hidden="true"
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                        formData.isRemote ? "translate-x-5" : "translate-x-0"
                                    }`}
                                />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-xs font-medium text-zinc-300">Job Location (location)</label>
                                    <span className="text-[11px] text-zinc-500">Required</span>
                                </div>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3 text-zinc-500 pointer-events-none">
                                        <MapPin className="w-4 h-4" />
                                    </span>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        required
                                        className="w-full h-12 pl-10 pr-3.5 bg-[#15171e] border border-zinc-800/80 hover:border-zinc-700 focus:border-indigo-500 focus:outline-none rounded-xl text-zinc-200 text-sm transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Application Deadline (deadline)</label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3 text-zinc-500 pointer-events-none">
                                        <Calendar className="w-4 h-4" />
                                    </span>
                                    <input
                                        type="text"
                                        name="deadline"
                                        value={formData.deadline}
                                        onChange={handleChange}
                                        placeholder="YYYY-MM-DD"
                                        className="w-full h-12 pl-10 pr-3.5 bg-[#15171e] border border-zinc-800/80 hover:border-zinc-700 focus:border-indigo-500 focus:outline-none rounded-xl text-zinc-200 text-sm transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Min Salary / Rate</label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3.5 text-zinc-500 text-sm pointer-events-none">৳</span>
                                    <input
                                        type="number"
                                        name="minSalary"
                                        value={formData.minSalary}
                                        onChange={handleChange}
                                        className="w-full h-12 pl-9 pr-3.5 bg-[#15171e] border border-zinc-800/80 hover:border-zinc-700 focus:border-indigo-500 focus:outline-none rounded-xl text-zinc-200 text-sm transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Max Salary / Rate</label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3.5 text-zinc-500 text-sm pointer-events-none">৳</span>
                                    <input
                                        type="number"
                                        name="maxSalary"
                                        value={formData.maxSalary}
                                        onChange={handleChange}
                                        className="w-full h-12 pl-9 pr-3.5 bg-[#15171e] border border-zinc-800/80 hover:border-zinc-700 focus:border-indigo-500 focus:outline-none rounded-xl text-zinc-200 text-sm transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Frequency Dropdown */}
                            <div className="relative">
                                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Frequency</label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setOpenFrequency(!openFrequency);
                                        setOpenCategory(false);
                                    }}
                                    className="w-full h-12 px-3.5 bg-[#15171e] border border-zinc-800/80 hover:border-zinc-700 focus:border-indigo-500 focus:outline-none rounded-xl flex items-center justify-between text-sm text-zinc-200 transition-colors"
                                >
                                    <span>{formData.frequency}</span>
                                    <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${openFrequency ? "rotate-180" : ""}`} />
                                </button>

                                {openFrequency && (
                                    <div className="absolute z-20 w-full mt-1.5 bg-[#181a22] border border-zinc-800 rounded-xl shadow-xl overflow-hidden py-1">
                                        {frequencies.map((freq) => (
                                            <div
                                                key={freq}
                                                onClick={() => {
                                                    handleFieldChange("frequency", freq);
                                                    setOpenFrequency(false);
                                                }}
                                                className={`px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                                                    formData.frequency === freq ? "bg-indigo-600/20 text-indigo-400 font-medium" : "text-zinc-300 hover:bg-zinc-800/60"
                                                }`}
                                            >
                                                {freq}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: Responsibilities & Requirements */}
                <section className="space-y-5">
                    <div className="flex items-center gap-2 text-base font-semibold text-white">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                        <h2>3. Responsibilities &amp; Requirements</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                                Key Responsibilities <span className="text-indigo-400">*</span>
                            </label>
                            <textarea
                                rows={3}
                                name="responsibilities"
                                value={formData.responsibilities}
                                onChange={handleChange}
                                required
                                className="w-full p-3 bg-[#15171e] border border-zinc-800/80 hover:border-zinc-700 focus:border-indigo-500 focus:outline-none rounded-xl text-zinc-200 text-sm leading-relaxed transition-colors resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                                Qualifications &amp; Requirements <span className="text-indigo-400">*</span>
                            </label>
                            <textarea
                                rows={4}
                                name="qualifications"
                                value={formData.qualifications}
                                onChange={handleChange}
                                required
                                className="w-full p-3 bg-[#15171e] border border-zinc-800/80 hover:border-zinc-700 focus:border-indigo-500 focus:outline-none rounded-xl text-zinc-200 text-sm leading-relaxed transition-colors resize-none whitespace-pre-line"
                            />
                        </div>
                    </div>
                </section>
            </div>
        </form>
    );
}
