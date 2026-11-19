// app/unauthorized/page.jsx
import React from "react";
import Link from "next/link";
import { Card } from "@heroui/react";
import { ShieldExclamation, ArrowLeft } from "@gravity-ui/icons";

const UnauthorizedPage = () => {
    return (
        <main className="min-h-screen bg-zinc-950 px-4 py-12 flex items-center justify-center text-white">
            <Card className="w-full max-w-md rounded-3xl border border-white/5 bg-[#141414] p-6 sm:p-8 shadow-xl">
                <Card.Content className="flex flex-col items-center gap-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
                        <ShieldExclamation className="h-6 w-6" />
                    </div>

                    <span className="rounded-full bg-[#222222] px-3 py-1 text-xs font-semibold text-amber-400">403 Forbidden</span>

                    <h1 className="text-xl font-bold text-white">Access Denied</h1>

                    <p className="text-sm leading-relaxed text-zinc-400">You don&apos;t have permission to view this page. Please sign in with an authorized account or return to the homepage.</p>

                    <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-full bg-[#222222] px-5 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-[#2c2c2c] hover:text-[#e5a9f7]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Back to Home</span>
                        </Link>
                        <Link href="/signIn" className="rounded-full bg-[#e5a9f7] px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-[#d88ef0]">
                            Switch Account
                        </Link>
                    </div>
                </Card.Content>
            </Card>
        </main>
    );
};

export default UnauthorizedPage;
