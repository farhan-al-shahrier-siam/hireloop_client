"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import {
    ChevronRight,
    ChevronDown,
    ArrowRight,
    MapPin,
    ArrowUpFromLine,
    Pencil,
    Globe,
    Persons,
    Factory,
    Clock,
    CircleCheck,
    CircleXmark, // <-- Changed from CircleX
    Plus,
    Xmark, // <-- Note: Gravity UI uses Xmark instead of X
} from "@gravity-ui/icons";
import { authClient } from "@/lib/auth-client"; // Adjust path to your Better Auth client
import { createCompany } from "@/lib/actions/companies";

const INDUSTRIES = ["Technology", "Finance & Fintech", "Healthcare", "E-Commerce & Retail", "Education", "Manufacturing", "Media & Entertainment", "Consulting & Services"];

const EMPLOYEE_RANGES = ["1-10 employees", "11-50 employees", "51-200 employees", "201-500 employees", "501-1000 employees", "1000+ employees"];

const STATUS_CONFIG = {
    Pending: {
        label: "Pending Review",
        icon: Clock,
        classes: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    },
    Approved: {
        label: "Approved",
        icon: CircleCheck,
        classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    },
    Rejected: {
        label: "Rejected",
        icon: CircleXmark, // <-- Updated here too
        classes: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    },
};

export default function CompanyProfileManager({ initialCompany, recruiter }) {
    const fileInputRef = useRef(null);

    // Company record from DB (null if not registered yet)
    const [company, setCompany] = useState(initialCompany);
    // Toggle between View mode and Create/Edit Form mode
    const [isEditing, setIsEditing] = useState(false);

    // Dropdown open states
    const [openIndustry, setOpenIndustry] = useState(false);
    const [openEmployees, setOpenEmployees] = useState(false);

    // Upload & submit states
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: initialCompany?.name || "",
        industry: initialCompany?.industry || "Technology",
        websiteUrl: initialCompany?.websiteUrl ? initialCompany.websiteUrl.replace(/^https?:\/\//, "") : "",
        location: initialCompany?.location || "",
        employeeCount: initialCompany?.employeeCount || "1-10 employees",
        logo: initialCompany?.logo || "",
        description: initialCompany?.description || "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFieldChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Open form for either initial registration or editing existing company
    const openFormMode = () => {
        setError("");
        if (company) {
            setFormData({
                name: company.name || "",
                industry: company.industry || "Technology",
                websiteUrl: (company.websiteUrl || "").replace(/^https?:\/\//, ""),
                location: company.location || "",
                employeeCount: company.employeeCount || "1-10 employees",
                logo: company.logo || "",
                description: company.description || "",
            });
        }
        setIsEditing(true);
    };

    // Upload logo to ImgBB and store returned URL in formData.logo
    const handleLogoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type & 5MB size limit (matches screenshot hint)
        if (!["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file.type)) {
            setError("Please upload a PNG or JPG image.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("Image size must be under 5MB.");
            return;
        }

        setError("");
        setUploadingLogo(true);

        try {
            const body = new FormData();
            body.append("image", file);

            const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
                method: "POST",
                body,
            });
            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error?.message || "ImgBB upload failed");
            }

            // Save direct image URL
            handleFieldChange("logo", data.data.display_url);
        } catch (err) {
            setError(err.message || "Failed to upload logo.");
        } finally {
            setUploadingLogo(false);
        }
    };

    // Submit form to your Next.js API route
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSaving(true);

        const cleanDomain = formData.websiteUrl.trim().replace(/^https?:\/\//, "");
        const payload = {
            ...formData,
            websiteUrl: cleanDomain ? `https://${cleanDomain}` : "",
            status: initialCompany && initialCompany.status ? initialCompany.status : "Pending",
            recruiterId: recruiter.id,
        };
        console.log(payload);

        try {
            const res = await createCompany(payload);
            setCompany(payload);
            setIsEditing(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    // =========================================================================
    // STATE 1: NO COMPANY REGISTERED (Empty State Prompt)
    // =========================================================================
    if (!company && !isEditing) {
        return (
            <div className="min-h-screen bg-[#0d0e12] text-zinc-100 py-10 px-4 rounded-2xl lg:m-2 sm:px-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="space-y-1.5">
                        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs">
                            <Link href="/dashboard/recruiter" className="text-zinc-400 hover:text-zinc-200 transition-colors">
                                Dashboard
                            </Link>
                            <ChevronRight className="w-3 h-3 text-zinc-600" />
                            <span className="text-indigo-400 font-medium">Company Profile</span>
                        </nav>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Company Profile</h1>
                        <p className="text-sm text-zinc-400">Set up your organization profile before publishing job listings.</p>
                    </div>

                    <div className="rounded-2xl bg-[#15171e] border border-dashed border-zinc-800 p-10 sm:p-14 text-center flex flex-col items-center justify-center space-y-5">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                            <Factory className="w-7 h-7" />
                        </div>

                        <div className="max-w-md space-y-2">
                            <h2 className="text-xl font-semibold text-white">No Company Registered Yet</h2>
                            <p className="text-sm text-zinc-400 leading-relaxed">Register your company details to verify your employer account and start attracting candidates.</p>
                        </div>

                        <Button
                            type="button"
                            onPress={openFormMode}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-600/25 flex items-center gap-2"
                            startContent={<Plus className="w-4 h-4" />}
                        >
                            Register Company
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // =========================================================================
    // STATE 2: COMPANY REGISTERED (Read-Only Details + Status Badge + Edit Btn)
    // =========================================================================
    if (company && !isEditing) {
        const statusKey = company.status || "Pending";
        const statusInfo = STATUS_CONFIG[statusKey] || STATUS_CONFIG.Pending;
        const StatusIcon = statusInfo.icon;

        return (
            <div className="min-h-screen bg-[#0d0e12] text-zinc-100 py-10 px-4 rounded-2xl lg:m-2 sm:px-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Top Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs">
                                <Link href="/dashboard/recruiter" className="text-zinc-400 hover:text-zinc-200 transition-colors">
                                    Dashboard
                                </Link>
                                <ChevronRight className="w-3 h-3 text-zinc-600" />
                                <span className="text-indigo-400 font-medium">Company Profile</span>
                            </nav>

                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-3xl font-bold tracking-tight text-white">{company.name}</h1>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.classes}`}>
                                    <StatusIcon className="w-3.5 h-3.5" />
                                    {statusInfo.label}
                                </span>
                            </div>
                            <p className="text-sm text-zinc-400">Manage your organization identity and verification details.</p>
                        </div>

                        <div>
                            <Button
                                type="button"
                                onPress={openFormMode}
                                className="bg-[#15171e] hover:bg-zinc-800/80 border border-zinc-800 text-zinc-100 font-medium px-5 py-2.5 rounded-xl flex items-center gap-2"
                                startContent={<Pencil className="w-4 h-4 text-indigo-400" />}
                            >
                                Edit Company
                            </Button>
                        </div>
                    </div>

                    {/* Company Details Card */}
                    <div className="rounded-2xl bg-[#15171e] border border-zinc-800/80 p-6 sm:p-8 space-y-8">
                        {/* Logo & Primary Identity */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-zinc-800/80">
                            <div className="w-20 h-20 rounded-2xl bg-[#0d0e12] border border-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                                {company.logo ? <img src={company.logo} alt={`${company.name} logo`} className="w-full h-full object-cover" /> : <Factory className="w-8 h-8 text-zinc-600" />}
                            </div>

                            <div className="space-y-1.5">
                                <div className="text-xs font-medium text-indigo-400 uppercase tracking-wider">{company.industry}</div>
                                <h2 className="text-xl font-semibold text-white">{company.name}</h2>
                                {company.websiteUrl && (
                                    <a
                                        href={company.websiteUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-indigo-400 transition-colors"
                                    >
                                        <Globe className="w-4 h-4" />
                                        <span>{company.websiteUrl}</span>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-4 rounded-xl bg-[#0d0e12] border border-zinc-800/80 space-y-1">
                                <span className="text-xs text-zinc-500 flex items-center gap-1.5">
                                    <Factory className="w-3.5 h-3.5 text-zinc-400" />
                                    Industry / Category
                                </span>
                                <p className="text-sm font-medium text-zinc-200">{company.industry}</p>
                            </div>

                            <div className="p-4 rounded-xl bg-[#0d0e12] border border-zinc-800/80 space-y-1">
                                <span className="text-xs text-zinc-500 flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                                    Location
                                </span>
                                <p className="text-sm font-medium text-zinc-200">{company.location}</p>
                            </div>

                            <div className="p-4 rounded-xl bg-[#0d0e12] border border-zinc-800/80 space-y-1">
                                <span className="text-xs text-zinc-500 flex items-center gap-1.5">
                                    <Persons className="w-3.5 h-3.5 text-zinc-400" />
                                    Employee Count
                                </span>
                                <p className="text-sm font-medium text-zinc-200">{company.employeeCount}</p>
                            </div>
                        </div>

                        {/* Brief Description */}
                        <div className="space-y-2">
                            <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Brief Description</h3>
                            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">{company.description || "No company description provided."}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // =========================================================================
    // STATE 3: CREATE / EDIT FORM (Matches Screenshot Layout & Reference Style)
    // =========================================================================
    return (
        <form onSubmit={handleSubmit} className="min-h-screen bg-[#0d0e12] text-zinc-100 py-10 px-4 rounded-2xl lg:m-2 sm:px-8">
            <div className="max-w-4xl mx-auto space-y-10">
                {/* Top Header & Breadcrumbs */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs">
                            <Link href="/dashboard/recruiter" className="text-zinc-400 hover:text-zinc-200 transition-colors">
                                Dashboard
                            </Link>
                            <ChevronRight className="w-3 h-3 text-zinc-600" />
                            <span className="text-indigo-400 font-medium">{company ? "Edit Company" : "Register Company"}</span>
                        </nav>

                        <h1 className="text-3xl font-bold tracking-tight text-white">{company ? "Update Company Profile" : "Register Your Company"}</h1>
                        <p className="text-sm text-zinc-400">Provide accurate organization details for admin verification and candidate visibility.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            onPress={() => setIsEditing(false)}
                            className="bg-[#15171e] hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-medium px-4 py-2.5 rounded-xl flex items-center gap-1.5"
                            startContent={<Xmark className="w-4 h-4" />}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            isDisabled={saving || uploadingLogo}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/25 flex items-center gap-2"
                            endContent={<ArrowRight className="w-4 h-4" />}
                        >
                            {saving ? "Saving..." : company ? "Save Changes" : "Register Company"}
                        </Button>
                    </div>
                </div>

                {error && <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">{error}</div>}

                {/* Section 1: Organization Details (2-Column Grid matching Screenshot) */}
                <section className="space-y-5">
                    <div className="flex items-center gap-2 text-base font-semibold text-white">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                        <h2>1. Organization Details</h2>
                    </div>

                    {/* Dashed-border container matching screenshot */}
                    <div className="p-6 rounded-2xl border border-dashed border-zinc-800/90 bg-[#101217]/60 space-y-5">
                        {/* Row 1: Company Name & Industry / Category */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                                    Company Name <span className="text-indigo-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Acme Corp"
                                    required
                                    className="w-full h-12 px-3.5 bg-[#15171e] border border-zinc-800/80 hover:border-zinc-700 focus:border-indigo-500 focus:outline-none rounded-xl text-zinc-200 text-sm transition-colors"
                                />
                            </div>

                            {/* Industry / Category Dropdown */}
                            <div className="relative">
                                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                                    Industry / Category <span className="text-indigo-400">*</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setOpenIndustry(!openIndustry);
                                        setOpenEmployees(false);
                                    }}
                                    className="w-full h-12 px-3.5 bg-[#15171e] border border-zinc-800/80 hover:border-zinc-700 focus:border-indigo-500 focus:outline-none rounded-xl flex items-center justify-between text-sm text-zinc-200 transition-colors"
                                >
                                    <span>{formData.industry}</span>
                                    <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${openIndustry ? "rotate-180" : ""}`} />
                                </button>

                                {openIndustry && (
                                    <div className="absolute z-20 w-full mt-1.5 bg-[#181a22] border border-zinc-800 rounded-xl shadow-xl overflow-hidden py-1">
                                        {INDUSTRIES.map((ind) => (
                                            <div
                                                key={ind}
                                                onClick={() => {
                                                    handleFieldChange("industry", ind);
                                                    setOpenIndustry(false);
                                                }}
                                                className={`px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                                                    formData.industry === ind ? "bg-indigo-600/20 text-indigo-400 font-medium" : "text-zinc-300 hover:bg-zinc-800/60"
                                                }`}
                                            >
                                                {ind}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Row 2: Website URL (with https:// prefix box) & Location */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                                    Website URL <span className="text-indigo-400">*</span>
                                </label>
                                <div className="flex items-center h-12 bg-[#15171e] border border-zinc-800/80 hover:border-zinc-700 focus-within:border-indigo-500 rounded-xl overflow-hidden transition-colors">
                                    <span className="h-full px-3.5 flex items-center bg-[#1c1f29] border-r border-zinc-800/80 text-zinc-400 text-sm select-none">https://</span>
                                    <input
                                        type="text"
                                        name="websiteUrl"
                                        value={formData.websiteUrl}
                                        onChange={handleChange}
                                        placeholder="www.company.com"
                                        required
                                        className="w-full h-full px-3.5 bg-transparent text-zinc-200 text-sm focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                                    Location <span className="text-indigo-400">*</span>
                                </label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3.5 text-zinc-400 pointer-events-none">
                                        <MapPin className="w-4 h-4" />
                                    </span>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="City, Country"
                                        required
                                        className="w-full h-12 pl-10 pr-3.5 bg-[#15171e] border border-zinc-800/80 hover:border-zinc-700 focus:border-indigo-500 focus:outline-none rounded-xl text-zinc-200 text-sm transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Row 3: Employee Count Range & Company Logo Upload */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Employee Count Dropdown */}
                            <div className="relative">
                                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                                    Employee Count Range <span className="text-indigo-400">*</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setOpenEmployees(!openEmployees);
                                        setOpenIndustry(false);
                                    }}
                                    className="w-full h-12 px-3.5 bg-[#15171e] border border-zinc-800/80 hover:border-zinc-700 focus:border-indigo-500 focus:outline-none rounded-xl flex items-center justify-between text-sm text-zinc-200 transition-colors"
                                >
                                    <span>{formData.employeeCount}</span>
                                    <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${openEmployees ? "rotate-180" : ""}`} />
                                </button>

                                {openEmployees && (
                                    <div className="absolute z-20 w-full mt-1.5 bg-[#181a22] border border-zinc-800 rounded-xl shadow-xl overflow-hidden py-1">
                                        {EMPLOYEE_RANGES.map((range) => (
                                            <div
                                                key={range}
                                                onClick={() => {
                                                    handleFieldChange("employeeCount", range);
                                                    setOpenEmployees(false);
                                                }}
                                                className={`px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                                                    formData.employeeCount === range ? "bg-indigo-600/20 text-indigo-400 font-medium" : "text-zinc-300 hover:bg-zinc-800/60"
                                                }`}
                                            >
                                                {range}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Company Logo Upload (ImgBB) */}
                            <div>
                                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Company Logo</label>
                                <div className="flex items-center gap-3.5">
                                    <input ref={fileInputRef} type="file" accept="image/png, image/jpeg, image/jpg" onChange={handleLogoUpload} className="hidden" />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploadingLogo}
                                        className="w-12 h-12 rounded-xl bg-[#15171e] border border-dashed border-zinc-700 hover:border-indigo-500 flex items-center justify-center text-zinc-300 transition-colors overflow-hidden shrink-0"
                                    >
                                        {formData.logo ? <img src={formData.logo} alt="Logo preview" className="w-full h-full object-cover" /> : <ArrowUpFromLine className="w-4 h-4 text-zinc-400" />}
                                    </button>

                                    <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer select-none">
                                        <p className="text-sm font-medium text-zinc-200 hover:text-indigo-400 transition-colors">{uploadingLogo ? "Uploading to ImgBB..." : "Upload image"}</p>
                                        <p className="text-xs text-zinc-500">PNG, JPG up to 5MB</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Row 4: Brief Description */}
                        <div>
                            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                                Brief Description <span className="text-indigo-400">*</span>
                            </label>
                            <textarea
                                rows={4}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Tell us about your company's mission and culture..."
                                required
                                className="w-full p-3.5 bg-[#15171e] border border-zinc-800/80 hover:border-zinc-700 focus:border-indigo-500 focus:outline-none rounded-xl text-zinc-200 text-sm leading-relaxed transition-colors resize-none"
                            />
                        </div>
                    </div>
                </section>
            </div>
        </form>
    );
}
