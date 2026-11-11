import Image from "next/image";
import globeImg from "@/assets/images/globe.png";

const stats = [
    {
        value: "50K",
        label: "Active Jobs",
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7h-4V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 5a1 1 0 011-1h2a1 1 0 011 1v2h-4V5z" />
            </svg>
        ),
    },
    {
        value: "12K",
        label: "Companies",
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
            </svg>
        ),
    },
    {
        value: "2M",
        label: "Job Seekers",
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M16.65 11a5.65 5.65 0 11-11.3 0 5.65 5.65 0 0111.3 0z" />
                <circle cx="11" cy="9" r="2.2" strokeWidth={1.5} />
            </svg>
        ),
    },
    {
        value: "97%",
        label: "Satisfaction Rate",
        icon: (
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
        ),
    },
];

export default function StatsSection() {
    return (
        <section className="relative min-h-[650px] w-full overflow-hidden bg-black py-16 sm:min-h-[700px] sm:py-20">
            {/* GLOBE BACKGROUND */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <Image
                    src={globeImg}
                    alt="Globe"
                    priority
                    className="
            absolute
            left-1/2
            top-[-180px]
            w-[850px]
            max-w-none
            -translate-x-1/2
            sm:top-[-350px]
            sm:w-[1100px]
            lg:top-[-510px]
            lg:w-[1200px]
          "
                />
            </div>

            {/* CONTENT */}
            <div className="relative z-10 mx-auto w-full max-w-[1250px] px-4 sm:px-6">
                {/* HEADING */}
                <div className="mx-auto max-w-3xl pt-6 text-center sm:pt-10 lg:pt-14">
                    <h2 className="text-2xl font-normal leading-tight text-white sm:text-3xl lg:text-[32px]">
                        Assisting over 15,000 job seekers
                        <br className="hidden sm:block" /> find their dream positions.
                    </h2>
                </div>

                {/* STAT CARDS */}
                <div className="mt-16 grid grid-cols-1 gap-4 sm:mt-24 sm:grid-cols-2 lg:mt-32 lg:grid-cols-4 lg:gap-5">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="
                flex
                min-h-[165px]
                flex-col
                justify-between
                rounded-2xl
                border
                border-zinc-700/80
                bg-black/85
                p-5
                backdrop-blur-sm
                transition
                hover:border-zinc-500
                sm:min-h-[190px]
                sm:p-6
                lg:h-[230px]
              "
                        >
                            {/* Icon */}
                            <div className="text-white">{stat.icon}</div>

                            {/* Text */}
                            <div>
                                <div className="text-4xl font-medium leading-none tracking-tight text-white sm:text-[42px]">{stat.value}</div>

                                <div className="mt-3 text-sm text-zinc-400">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
