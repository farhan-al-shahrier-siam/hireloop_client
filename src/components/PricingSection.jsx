import { Star, ChartBar, Thunderbolt, FileCheck } from "@gravity-ui/icons";

const plans = [
    {
        name: "Starter",
        price: "$0",
        icon: <Star />,
        description: "Start building your insights hub:",
        features: ["Daily AI match brief (top 5)", "Verified salary bands", "Company insight dashboards", "1-click apply, unlimited"],
        button: "Choose This Plan",
    },
    {
        name: "Growth",
        price: "$17",
        icon: <ChartBar />,
        description: "Start building your insights hub:",
        features: ["Daily AI match brief", "Verified salary bands", "Company insight dashboards", "1-click apply, unlimited"],
        button: "Choose This Plan",
        popular: true,
    },
    {
        name: "Premium",
        price: "$99",
        icon: <Thunderbolt />,
        description: "Start building your insights hub:",
        features: ["Everything in Pro", "Multi-profile career portfolios", "Shared talent rooms", "Recruiter view (read-only)"],
        button: "Choose This Plan",
    },
];

export default function PricingSection() {
    return (
        <section className="relative min-h-screen overflow-hidden bg-black px-4 py-16 text-white sm:px-6 sm:py-20">
            {/* HEADER */}
            <div className="relative z-10 mx-auto max-w-3xl text-center">
                {/* Label */}
                <div className="mb-4 flex items-center justify-center gap-3">
                    <span className="h-1 w-1 bg-violet-500" />

                    <span className="text-xs font-medium tracking-wider text-zinc-400">PRICING</span>

                    <span className="h-1 w-1 bg-violet-500" />
                </div>

                {/* Heading */}
                <h2 className="text-3xl font-medium leading-tight sm:text-4xl md:text-5xl">
                    Pay for the leverage,
                    <br />
                    not the listings
                </h2>

                {/* Toggle */}
                <div className="mt-8 inline-flex items-center rounded-full bg-zinc-800 p-1 text-xs sm:mt-9">
                    <button className="rounded-full bg-white px-4 py-2 text-black">Monthly</button>

                    <button className="px-3 py-2 text-zinc-300">Yearly</button>

                    <span className="rounded-full bg-fuchsia-600 px-2 py-1 text-[10px] font-medium text-white">25%</span>
                </div>
            </div>

            {/* PRICING CARDS */}
            <div className="relative z-10 mx-auto mt-10 grid w-full max-w-6xl grid-cols-1 items-stretch gap-4 sm:mt-12 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`
              relative flex min-h-[300px] flex-col
              rounded-2xl border p-5 sm:p-6
              ${plan.popular ? "border-zinc-700 bg-zinc-900 shadow-[0_0_40px_rgba(255,255,255,0.08)]" : "border-zinc-800 bg-black"}
            `}
                    >
                        {/* Card Top */}
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-zinc-800 text-fuchsia-300">{plan.icon}</div>

                                <span className="text-sm text-zinc-200">{plan.name}</span>
                            </div>

                            <div className="flex shrink-0 items-baseline">
                                <span className="text-2xl font-medium text-white">{plan.price}</span>

                                <span className="ml-1 text-[10px] text-zinc-400">/month</span>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="mt-6 text-xs text-zinc-200">{plan.description}</p>

                        {/* Features */}
                        <div className="mt-4 space-y-3">
                            {plan.features.map((feature) => (
                                <div key={feature} className="flex items-center gap-2 text-xs text-zinc-400">
                                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-zinc-700 text-zinc-300">
                                        <FileCheck className="h-3 w-3" />
                                    </span>

                                    {feature}
                                </div>
                            ))}
                        </div>

                        {/* Button */}
                        <button
                            className={`
                mt-auto flex h-10 items-center justify-between
                rounded-md px-4 pt-0 text-xs transition
                ${plan.popular ? "mt-8 bg-white text-black hover:bg-zinc-200" : "mt-8 bg-zinc-800 text-white hover:bg-zinc-700"}
              `}
                        >
                            <span>{plan.button}</span>
                            <span className="text-base">→</span>
                        </button>
                    </div>
                ))}
            </div>

            {/* BOTTOM GLOBE */}
            <div className="pointer-events-none absolute bottom-[-130px] left-1/2 z-0 h-[300px] w-[150vw] max-w-[1100px] -translate-x-1/2 sm:bottom-[-160px] sm:h-[420px]">
                {/* Purple Glow */}
                <div
                    className="
            absolute left-1/2 top-0
            h-[180px] w-[80%]
            -translate-x-1/2
            rounded-full
            bg-indigo-600/30
            blur-[80px] sm:h-[250px] sm:blur-[100px]
          "
                />

                {/* Globe Surface */}
                <div
                    className="
            absolute left-1/2 top-0
            h-full w-full
            -translate-x-1/2
            rounded-[50%]
            border border-indigo-400/30
            bg-[radial-gradient(ellipse_at_50%_0%,rgba(79,70,229,0.9)_0%,rgba(30,27,75,0.7)_35%,rgba(0,0,0,0.95)_70%)]
          "
                >
                    {/* Horizontal Grid */}
                    <div
                        className="
              absolute inset-0
              rounded-[50%]
              opacity-40
              bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_35px,rgba(129,140,248,0.35)_36px,transparent_37px)]
            "
                    />

                    {/* Vertical Grid */}
                    <div
                        className="
              absolute inset-0
              rounded-[50%]
              opacity-40
              bg-[repeating-radial-gradient(ellipse_at_50%_0%,transparent_0px,transparent_55px,rgba(129,140,248,0.3)_56px,transparent_58px)]
            "
                    />
                </div>
            </div>

            {/* BOTTOM CTA */}
            <div className="relative z-20 mx-auto mt-24 w-full max-w-2xl px-2 pb-8 text-center sm:mt-32 sm:px-6 sm:pb-12">
                <h3 className="text-3xl font-medium leading-tight sm:text-4xl">
                    Your next role is
                    <br />
                    already looking for you
                </h3>

                <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-zinc-400 sm:text-sm">Build a profile in three minutes. The matches start arriving tomorrow morning.</p>

                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                    <button className="rounded-md bg-white px-5 py-3 text-xs font-medium text-black transition hover:bg-zinc-200">Create a free account</button>

                    <button className="rounded-md border border-zinc-700 bg-zinc-950 px-5 py-3 text-xs text-white transition hover:bg-zinc-900">View pricing</button>
                </div>
            </div>
        </section>
    );
}
