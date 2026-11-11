"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function SignIn() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSignIn = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const { data, error } = await authClient.signIn.email({
                email: e.target.email.value,
                password: e.target.password.value,
            });

            if (error) {
                setError(error.message || "Invalid email or password.");
            } else {
                setSuccess("Signed in successfully!");

                // Redirect after successful sign in
                window.location.href = "/";
            }
        } catch (err) {
            setError("Unable to sign in. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-12 text-white">
            {/* Background Glow */}
            <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-purple-700/20 blur-[150px]" />

            {/* Sign In Card */}
            <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950/90 p-6 shadow-2xl sm:p-8">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>

                    <p className="mt-2 text-sm text-zinc-400">Sign in to continue to your account</p>
                </div>

                <form onSubmit={handleSignIn} className="space-y-5">
                    {/* Email */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-300">Email Address</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            required
                            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-300">Password</label>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                required
                                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 pr-20 text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
                            />

                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-400 hover:text-white">
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                            {error}
                        </p>
                    )}

                    {/* Success Message */}
                    {success && (
                        <p role="status" className="rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-400">
                            {success}
                        </p>
                    )}

                    {/* Sign In Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-white py-3 font-semibold text-black transition hover:bg-violet-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                {/* Sign Up Link */}
                <p className="mt-7 text-center text-sm text-zinc-400">
                    Don&apos;t have an account?{" "}
                    <Link href="/signUp" className="font-medium text-violet-400 transition hover:text-violet-300">
                        Create Account
                    </Link>
                </p>

                {/* Footer */}
                <p className="mt-8 text-center text-xs text-zinc-600">By signing in, you agree to our Terms of Service and Privacy Policy.</p>
            </div>
        </main>
    );
}
