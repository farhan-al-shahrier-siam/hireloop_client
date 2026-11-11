"use client"
import Link from "next/link";
import * as motion from "motion/react-client"
import { Box } from "@gravity-ui/icons";

const footerSections = [
    {
        title: "Product",
        links: [
            { label: "Job discovery", href: "/jobs" },
            { label: "Worker AI", href: "/worker-ai" },
            { label: "Companies", href: "/companies" },
            { label: "Salary data", href: "/salary-data" },
        ],
    },
    {
        title: "Navigations",
        links: [
            { label: "Help center", href: "/help" },
            { label: "Career library", href: "/careers" },
            { label: "Contact", href: "/contact" },
        ],
    },
    {
        title: "Resources",
        links: [
            { label: "Brand Guideline", href: "/brand" },
            { label: "Newsroom", href: "/newsroom" },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="w-full bg-[#0a0a0c] text-zinc-400">
            <div className="mx-auto max-w-7xl px-6 pt-16 pb-12 lg:px-8">
                {/* Main Grid */}
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
                    {/* Brand Column */}
                    <div className="lg:col-span-5">
                        <Link href="/" className="group inline-flex items-center gap-2">
                            <motion.div style={Box} animate={{ rotate: 360 }} transition={{ duration: 1 }} className="flex items-baseline text-2xl font-black tracking-tight">
                                <span className="text-[#0080FF] transition group-hover:brightness-110">hire</span>
                                <div className="relative inline-flex items-center">
                                    <span className="text-[#0080FF] transition group-hover:brightness-110">l</span>
                                    <div className="relative mx-0.5 flex items-center -space-x-1">
                                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-linear-to-tr from-cyan-500 to-blue-600 shadow-sm shadow-blue-500/50" />
                                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-linear-to-tr from-amber-500 to-orange-600 shadow-sm shadow-orange-500/50" />
                                    </div>
                                    <span className="text-[#FF6600] transition group-hover:brightness-110">p</span>
                                </div>
                            </motion.div>
                        </Link>

                        <p className="mt-6 max-w-sm text-sm leading-relaxed text-zinc-500">The AI-native career platform. Built for people who take their work seriously.</p>
                    </div>

                    {/* Links Columns */}
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
                        {footerSections.map((section) => (
                            <div key={section.title}>
                                <h3 className="text-sm font-medium text-indigo-400">{section.title}</h3>
                                <ul className="mt-5 space-y-3.5">
                                    {section.links.map((link) => (
                                        <li key={link.label}>
                                            <Link href={link.href} className="text-sm text-zinc-500 transition-colors duration-150 hover:text-zinc-300">
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-zinc-900 pt-8 sm:flex-row">
                    {/* Social Icons */}
                    <div className="flex items-center gap-3">
                        {/* Facebook */}
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Facebook"
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900/90 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                        >
                            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </a>

                        {/* Pinterest / Primary Accent Button */}
                        <a
                            href="https://pinterest.com"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Pinterest"
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3d3896] text-zinc-100 transition hover:bg-[#4d47b5]"
                        >
                            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                            </svg>
                        </a>

                        {/* LinkedIn */}
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="LinkedIn"
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900/90 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                        >
                            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                        </a>
                    </div>

                    {/* Copyright & Legal Links */}
                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-500 sm:justify-end">
                        <span>Copyright 2024 — Programming Hero[cite: 2]</span>
                        <Link href="/terms" className="transition-colors hover:text-zinc-300">
                            Terms &amp; Policy - Privacy Guideline[cite: 2]
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
