"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, Chip } from "@heroui/react";
import { CircleCheck, ArrowRight, ChevronDown, Sparkles, Person, Briefcase, CircleQuestion } from "@gravity-ui/icons";

const PRICING_DATA = {
    seekers: [
        {
            name: "Free",
            price: "$0",
            period: "/forever",
            description: "Essential tools to explore opportunities and start applying.",
            popular: false,
            ctaText: "Get Started Free",
            ctaHref: "/signUp?role=seeker&plan=free",
            features: ["Browse & save up to 10 jobs", "Apply to up to 3 jobs per month", "Basic profile", "Email alerts"],
        },
        {
            name: "Pro",
            price: "$19",
            period: "/month",
            description: "More monthly applications and deeper insights to land faster.",
            popular: true,
            ctaText: "Upgrade to Pro",
            ctaHref: "/signUp?role=seeker&plan=pro",
            features: ["Apply to up to 30 jobs per month", "Unlimited saved jobs", "Application tracking", "Salary insights"],
        },
        {
            name: "Premium",
            price: "$39",
            period: "/month",
            description: "Unlimited applications and top visibility for active job hunters.",
            popular: false,
            ctaText: "Go Premium",
            ctaHref: "/signUp?role=seeker&plan=premium",
            features: ["Everything in Pro", "Unlimited applications", "Profile boost to recruiters", "Early access to new jobs", "Priority support"],
        },
    ],
    recruiters: [
        {
            name: "Free",
            price: "$0",
            period: "/forever",
            description: "Great for a company's first year of hiring and early team growth.",
            popular: false,
            ctaText: "Start Hiring Free",
            ctaHref: "/signUp?role=recruiter&plan=free",
            features: ["Up to 3 active job posts", "Basic applicant management", "Standard listing visibility"],
        },
        {
            name: "Growth",
            price: "$49",
            period: "/month",
            description: "Streamlined applicant tracking and analytics for scaling teams.",
            popular: true,
            ctaText: "Choose Growth",
            ctaHref: "/signUp?role=recruiter&plan=growth",
            features: ["Up to 10 active job posts", "Applicant tracking", "Basic analytics", "Email support"],
        },
        {
            name: "Enterprise",
            price: "$149",
            period: "/month",
            description: "Full-scale hiring power with featured placements and branding.",
            popular: false,
            ctaText: "Choose Enterprise",
            ctaHref: "/signUp?role=recruiter&plan=enterprise",
            features: ["Up to 50 active job posts", "Advanced analytics dashboard", "Featured job listings", "Team collaboration", "Custom branding", "Priority support"],
        },
    ],
};

const FAQ_ITEMS = [
    {
        question: "How does cancellation work?",
        answer: "You can cancel your paid subscription at any time from your account billing settings with a single click. Once canceled, you will keep full access to your paid plan features until the end of your current billing cycle, after which your account automatically reverts to the Free plan.",
    },
    {
        question: "What is your refund policy?",
        answer: "We offer a 7-day money-back guarantee on your first paid subscription payment if you are not satisfied and have not exceeded the Free tier usage limits during that period. Renewal charges are non-refundable once a billing cycle begins.",
    },
    {
        question: "Which payment methods do you accept?",
        answer: "We accept all major credit and debit cards (Visa, Mastercard, American Express) as well as supported digital wallets. All transactions are encrypted and processed securely.",
    },
    {
        question: "Can I switch between plans at any time?",
        answer: "Yes. When upgrading to a higher tier, your new limits take effect immediately and you are only charged a prorated difference for the remainder of the month. When downgrading, the change takes effect at the start of your next billing cycle.",
    },
];

export default function PlansPage() {
    const [activeTab, setActiveTab] = useState("seekers"); // "seekers" | "recruiters"
    const [openFaqIndex, setOpenFaqIndex] = useState(0);

    const activePlans = PRICING_DATA[activeTab];

    const toggleFaq = (idx) => {
        setOpenFaqIndex((prev) => (prev === idx ? null : idx));
    };

    return (
        <main className="min-h-screen bg-zinc-950 px-4 py-12 sm:px-6 lg:px-8 text-white">
            <div className="mx-auto max-w-7xl space-y-16">
                {/* Header & Audience Toggle */}
                <section className="flex flex-col items-center text-center space-y-6">
                    <div className="space-y-3 max-w-2xl">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#222222] px-3.5 py-1.5 text-xs font-medium text-[#e5a9f7]">
                            <Sparkles className="h-3.5 w-3.5" />
                            Simple, transparent pricing
                        </span>
                        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">Plans built for every stage of your career</h1>
                        <p className="text-sm sm:text-base text-zinc-400">Start free forever, or unlock higher limits and priority tools when you are ready to move faster.</p>
                    </div>

                    {/* Audience Switcher Pill */}
                    <div className="inline-flex items-center rounded-full border border-white/5 bg-[#141414] p-1.5 shadow-lg">
                        <button
                            type="button"
                            onClick={() => setActiveTab("seekers")}
                            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                                activeTab === "seekers" ? "bg-[#e5a9f7] text-zinc-950 shadow-sm" : "text-zinc-400 hover:text-white"
                            }`}
                        >
                            <Person className="h-4 w-4" />
                            <span>For Job Seekers</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab("recruiters")}
                            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                                activeTab === "recruiters" ? "bg-[#e5a9f7] text-zinc-950 shadow-sm" : "text-zinc-400 hover:text-white"
                            }`}
                        >
                            <Briefcase className="h-4 w-4" />
                            <span>For Recruiters</span>
                        </button>
                    </div>
                </section>

                {/* Pricing Tiers Grid */}
                <section className="grid grid-cols-1 gap-6 md:grid-cols-3 items-stretch">
                    {activePlans.map((plan) => (
                        <Card
                            key={plan.name}
                            className={`relative flex h-full flex-col rounded-3xl p-4 sm:p-6 shadow-xl transition-transform duration-200 hover:-translate-y-1 ${
                                plan.popular ? "border border-[#e5a9f7]/40 bg-[#18161a]" : "border border-white/5 bg-[#141414]"
                            }`}
                        >
                            <Card.Content className="flex flex-1 flex-col justify-between gap-6 p-2">
                                <div className="space-y-5">
                                    {/* Tier Name & Popular Badge */}
                                    <div className="flex items-center justify-between gap-2">
                                        <h2 className="text-xl font-bold text-white">{plan.name}</h2>
                                        {plan.popular && (
                                            <Chip variant="soft" className="inline-flex h-auto items-center gap-1 rounded-full bg-[#e5a9f7]/15 px-3 py-1">
                                                <Sparkles className="h-3.5 w-3.5 text-[#e5a9f7]" />
                                                <Chip.Label className="text-xs font-semibold text-[#e5a9f7]">Most Popular</Chip.Label>
                                            </Chip>
                                        )}
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-bold tracking-tight text-white sm:text-5xl">{plan.price}</span>
                                        <span className="text-sm font-medium text-zinc-400">{plan.period}</span>
                                    </div>

                                    {/* Short Description */}
                                    <p className="text-sm leading-relaxed text-zinc-400">{plan.description}</p>

                                    {/* Divider */}
                                    <div className="border-t border-white/5" />

                                    {/* Key Features List */}
                                    <ul className="space-y-3">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-3 text-sm text-zinc-200">
                                                <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#e5a9f7]" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* CTA Button */}
                                <div className="pt-4">
                                    <Link
                                        href={plan.ctaHref}
                                        className={`group flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all ${
                                            plan.popular ? "bg-[#e5a9f7] text-zinc-950 hover:bg-[#d88ef0]" : "bg-[#222222] text-white hover:bg-[#2c2c2c] hover:text-[#e5a9f7]"
                                        }`}
                                    >
                                        <span>{plan.ctaText}</span>
                                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </Card.Content>
                        </Card>
                    ))}
                </section>

                {/* FAQ Accordion Section */}
                <section className="mx-auto max-w-3xl space-y-6 pt-4">
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#e5a9f7]">
                            <CircleQuestion className="h-4 w-4" />
                            <span>FAQ</span>
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Frequently Asked Questions</h2>
                        <p className="text-sm text-zinc-400">Everything you need to know about billing, refunds, and switching plans.</p>
                    </div>

                    <div className="space-y-3">
                        {FAQ_ITEMS.map((item, idx) => {
                            const isOpen = openFaqIndex === idx;
                            return (
                                <div key={idx} className="overflow-hidden rounded-3xl border border-white/5 bg-[#141414] transition-colors">
                                    <button type="button" onClick={() => toggleFaq(idx)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left">
                                        <span className="text-base font-medium text-white">{item.question}</span>
                                        <span
                                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#222222] text-[#e5a9f7] transition-transform duration-200 ${
                                                isOpen ? "rotate-180" : ""
                                            }`}
                                        >
                                            <ChevronDown className="h-4 w-4" />
                                        </span>
                                    </button>

                                    {isOpen && <div className="px-6 pb-5 pt-0 text-sm leading-relaxed text-zinc-400">{item.answer}</div>}
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </main>
    );
}
