import Link from "next/link";
import { Lock, ArrowRight, House, ChevronRight } from "@gravity-ui/icons";

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen bg-[#0d0e12] text-zinc-100 py-10 px-4 rounded-2xl lg:m-2 sm:px-8 flex items-center justify-center">
            <div className="max-w-2xl w-full space-y-8">
                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-1.5 text-xs">
                    <Link href="/" className="text-zinc-400 hover:text-zinc-200 transition-colors">
                        Home
                    </Link>
                    <ChevronRight className="w-3 h-3 text-zinc-600" />
                    <span className="text-rose-400 font-medium">401 Unauthorized</span>
                </nav>

                {/* Main Card */}
                <div className="rounded-2xl bg-[#15171e] border border-dashed border-zinc-800 p-10 sm:p-14 text-center flex flex-col items-center justify-center space-y-6">
                    {/* Icon Badge */}
                    <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                        <Lock className="w-8 h-8" />
                    </div>

                    {/* Error Code Pill */}
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/30">Error 401 • Unauthorized Access</span>

                    {/* Heading & Description */}
                    <div className="max-w-md space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-white">Authentication Required</h1>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            You don&apos;t have permission to access this page or your session has expired. Please sign in with an authorized account to continue.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full sm:w-auto">
                        <Link
                            href="/signIn"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-600/25 transition-colors"
                        >
                            <span>Sign In</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>

                        <Link
                            href="/"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0d0e12] hover:bg-zinc-800/80 border border-zinc-800 text-zinc-300 text-sm font-medium px-6 py-2.5 rounded-xl transition-colors"
                        >
                            <House className="w-4 h-4 text-zinc-400" />
                            <span>Back to Home</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
