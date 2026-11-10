"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
    { label: "Browse Jobs", href: "/jobs",  },
    { label: "Company", href: "/company",  },
    { label: "Pricing", href: "/pricing",  },
];

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full px-4 py-4 sm:px-6 lg:px-8">
            {/* Floating Pill Container */}
            <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl border border-zinc-800/80 bg-zinc-950/80 px-6 backdrop-blur-xl shadow-2xl shadow-black/50">
                {/* Brand / Logo */}
                <Link href="/" className="group flex items-center gap-2">
                    <div className="flex items-baseline text-2xl font-black tracking-tight">
                        <span className="text-[#0080FF] transition group-hover:brightness-110">hire</span>
                        <div className="relative inline-flex items-center">
                            <span className="text-[#0080FF] transition group-hover:brightness-110">l</span>
                            {/* Loop swirl accent */}
                            <div className="relative mx-0.5 flex items-center -space-x-1">
                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-linear-to-tr from-cyan-500 to-blue-600 shadow-sm shadow-blue-500/50" />
                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-linear-to-tr from-amber-500 to-orange-600 shadow-sm shadow-orange-500/50" />
                            </div>
                            <span className="text-[#FF6600] transition group-hover:brightness-110">p</span>
                        </div>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden items-center gap-7 md:flex">
                    <ul className="flex items-center gap-7 text-sm font-medium text-zinc-300">
                        {navLinks.map((item) => {
                            return (
                                <li key={item.href}>
                                    <Link href={item.href} className="flex items-center gap-2 transition-colors duration-150 hover:text-white">
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Thin Vertical Separator */}
                    <div className="h-4 w-px bg-zinc-700/80" />

                    {/* Sign In Link */}
                    <Link href="/signin" className="flex items-center gap-1.5 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300">
                        <span>Sign In</span>
                    </Link>

                    {/* Glowing Gradient Get Started Button */}
                    <Link
                        href="/signup"
                        className="flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-600/30 transition-all duration-200 hover:opacity-95 hover:shadow-indigo-500/50 active:scale-[0.98]"
                    >
                        <span>Get Started</span>
                    </Link>
                </div>

                {/* Mobile Hamburger Button */}
                <button
                    type="button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle navigation menu"
                    aria-expanded={isMenuOpen}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-800 hover:text-white md:hidden"
                >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        {isMenuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
                    </svg>
                </button>
            </nav>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
                <div className="mx-auto mt-2 max-w-7xl rounded-2xl border border-zinc-800/90 bg-zinc-950/95 p-4 shadow-xl backdrop-blur-xl md:hidden">
                    <ul className="flex flex-col gap-1">
                        {navLinks.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white"
                                    >
                                        <Icon className="h-4 w-4 text-zinc-400" />
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="mt-3 flex flex-col gap-2 border-t border-zinc-800/80 pt-3">
                        <Link
                            href="/signin"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-indigo-400 hover:bg-zinc-900 hover:text-indigo-300"
                        >
                            <span>Sign In</span>
                        </Link>

                        <Link
                            href="/signup"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-600/30 hover:opacity-95"
                        >
                            <span>Get Started</span>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
