import PricingSection from "@/components/PricingSection";
import StatsSection from "@/components/StatsSection";
import Image from "next/image";

export default function Home() {
    return (
        <div>
            <StatsSection></StatsSection>
            <PricingSection></PricingSection>
        </div>
    );
}
