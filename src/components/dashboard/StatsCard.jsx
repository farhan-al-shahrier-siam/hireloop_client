import { FileText, Persons, Thunderbolt, CircleCheck } from "@gravity-ui/icons";

const defaultStats = [
    {
        title: "Total Job Posts",
        value: "48",
        icon: FileText,
    },
    {
        title: "Total Applicants",
        value: "1,284",
        icon: Persons,
    },
    {
        title: "Active Jobs",
        value: "18",
        icon: Thunderbolt,
    },
    {
        title: "Jobs Closed",
        value: "32",
        icon: CircleCheck,
    },
];

export default function StatsCards({ stats = defaultStats }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item, index) => {
                const Icon = item.icon;

                return (
                    <div key={index} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
                        {/* Icon */}
                        <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-800/80 text-zinc-200">
                            <Icon className="h-7 w-7" />
                        </div>

                        {/* Title */}
                        <p className="text-base text-zinc-400">{item.title}</p>

                        {/* Value */}
                        <h2 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-100">{item.value}</h2>
                    </div>
                );
            })}
        </div>
    );
}
