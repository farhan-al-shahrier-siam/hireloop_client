"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { Label, Radio, RadioGroup } from "@heroui/react";

export default function SignUp() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSignUp = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const { data, error } = await authClient.signUp.email({
                name: e.target.name.value,
                email: e.target.email.value,
                password: e.target.password.value,
                role: e.target.role.value,
                callbackURL: "/"
            });

            if (error) {
                setError(error.message || "Something went wrong. Please try again.");
            } else {
                setSuccess("Account created successfully! Welcome aboard.");
                e.target.reset();
            }
        } catch (err) {
            setError("Unable to create your account. Please try again.");
        } finally {
            setLoading(false);
            redirect("/signIn");
        }
    };

    return (
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-12 text-white">
            {/* Purple Glow */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />

            {/* Signup Card */}
            <div className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950/90 p-6 shadow-[0_0_50px_rgba(255,255,255,0.04)] sm:p-9">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-xl font-semibold text-fuchsia-400">A</div>

                    <p className="mb-3 text-xs font-medium tracking-[3px] text-zinc-500">GET STARTED</p>

                    <h1 className="text-3xl font-medium sm:text-4xl">Create your account</h1>

                    <p className="mt-3 text-sm text-zinc-400">Build your profile and discover your next opportunity.</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSignUp} className="space-y-5">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="mb-2 block text-sm text-zinc-300">
                            Full Name
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter your full name"
                            autoComplete="name"
                            required
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="mb-2 block text-sm text-zinc-300">
                            Email Address
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            autoComplete="email"
                            required
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter your password"
                            minLength={8}
                            required
                            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 pr-20 text-white outline-none transition focus:border-violet-500"
                        />

                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-400 hover:text-white">
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    <div className="flex flex-col gap-4">
                        <Label>Select your role:</Label>
                        <RadioGroup defaultValue="seeker" name="role" orientation="horizontal">
                            <Radio value="seeker">
                                <Radio.Content>
                                    <Radio.Control>
                                        <Radio.Indicator />
                                    </Radio.Control>
                                    Job Seeker
                                </Radio.Content>
                            </Radio>
                            <Radio value="recruiter">
                                <Radio.Content>
                                    <Radio.Control>
                                        <Radio.Indicator />
                                    </Radio.Control>
                                    Recruiter
                                </Radio.Content>
                            </Radio>
                        </RadioGroup>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div role="status" className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                            {success}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center rounded-lg bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                {/* Login Link */}
                <p className="mt-7 text-center text-sm text-zinc-400">
                    Already have an account?{" "}
                    <Link href="/signIn" className="font-medium text-white transition hover:text-violet-400">
                        Sign in
                    </Link>
                </p>

                {/* Footer */}
                <p className="mt-8 text-center text-xs text-zinc-600">By creating an account, you agree to our Terms of Service and Privacy Policy.</p>
            </div>
        </section>
    );
}
