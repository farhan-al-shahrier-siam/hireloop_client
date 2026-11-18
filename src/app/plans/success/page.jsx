import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { Card, Chip } from "@heroui/react";
import { CircleCheck, ArrowRight, Sparkles, Briefcase, House, Receipt, Envelope } from "@gravity-ui/icons";

export default async function SuccessPage({ searchParams }) {
    const { session_id, role = "seeker" } = await searchParams;

    if (!session_id) {
        redirect("/plans");
    }

    let session;
    try {
        session = await stripe.checkout.sessions.retrieve(session_id, {
            expand: ["line_items.data.price.product", "payment_intent"],
        });
    } catch (error) {
        redirect("/plans");
    }

    if (session.status === "open") {
        redirect("/plans");
    }

    if (session.status !== "complete") {
        redirect("/");
    }

    // Extract real details from the Stripe session
    const customerEmail = session.customer_details?.email || "your email";
    const lineItem = session.line_items?.data?.[0];
    const productName = lineItem?.price?.product?.name || lineItem?.description || "Pro Plan";

    const amountTotal = typeof session.amount_total === "number" ? `$${(session.amount_total / 100).toFixed(2)}` : null;

    const transactionDate = session.created
        ? new Date(session.created * 1000).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
          })
        : "Today";

    return (
        <main className="min-h-screen bg-zinc-950 px-4 py-12 sm:px-6 lg:px-8 flex items-center justify-center text-white">
            <Card className="w-full max-w-xl rounded-3xl border border-white/5 bg-[#141414] p-6 sm:p-8 text-white shadow-xl">
                <Card.Content className="flex flex-col items-center gap-6 p-2 text-center">
                    {/* Glowing Check Badge */}
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 ring-8 ring-emerald-500/5">
                        <CircleCheck className="h-9 w-9" />
                    </div>

                    {/* Status Chip */}
                    <Chip variant="soft" className="inline-flex h-auto items-center gap-1.5 rounded-full bg-[#222222] px-3.5 py-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-[#e5a9f7]" />
                        <Chip.Label className="text-xs font-semibold text-[#e5a9f7]">Payment Confirmed</Chip.Label>
                    </Chip>

                    {/* Heading & Confirmation Email Notice */}
                    <div className="space-y-2.5">
                        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Welcome to {productName}!</h1>
                        <p className="mx-auto max-w-md text-sm sm:text-base leading-relaxed text-zinc-400">
                            We appreciate your business! Your subscription is now active and a confirmation receipt has been sent to <span className="font-semibold text-white">{customerEmail}</span>.
                        </p>
                    </div>

                    {/* Stripe Session Receipt Box */}
                    <div className="w-full rounded-2xl border border-white/5 bg-[#1b1b1b] p-4 text-left space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-zinc-400">
                                <Receipt className="h-4 w-4 text-[#e5a9f7]" />
                                <span>Status</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                Paid &amp; Active
                            </span>
                        </div>

                        <div className="border-t border-white/5" />

                        <div className="flex items-center justify-between">
                            <span className="text-zinc-400">Plan</span>
                            <span className="font-medium text-zinc-100">{productName}</span>
                        </div>

                        {amountTotal && (
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-400">Amount Paid</span>
                                <span className="font-medium text-zinc-100">{amountTotal}</span>
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <span className="text-zinc-400">Date</span>
                            <span className="font-medium text-zinc-100">{transactionDate}</span>
                        </div>
                    </div>

                    {/* Support Notice */}
                    <p className="flex items-center justify-center gap-1.5 text-xs text-zinc-500">
                        <Envelope className="h-3.5 w-3.5 text-zinc-400" />
                        <span>
                            Questions? Contact{" "}
                            <a href="mailto:orders@example.com" className="text-zinc-300 underline decoration-white/20 underline-offset-4 hover:text-[#e5a9f7]">
                                orders@example.com
                            </a>
                        </span>
                    </p>

                    {/* Action Buttons */}
                    <div className="flex w-full flex-col gap-3 pt-1 sm:flex-row">
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
                            <span>{role === "recruiter" ? "Go to Dashboard" : "Browse Jobs"}</span>
                            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                    </div>
                </Card.Content>
            </Card>
        </main>
    );
}
