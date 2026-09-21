import Hero from "@/components/landing/Hero";
import PlatformOverview from "@/components/landing/PlatformOverview";
import GamesSection from "@/components/landing/GamesSection";
import TeamsSection from "@/components/landing/TeamsSection";
import TournamentSection from "@/components/landing/TournamentSection";
import AdditionalFeatures from "@/components/landing/AdditionalFeatures";
import FinalCTA from "@/components/landing/FinalCTA";
import ScrollReveal from "@/components/common/ScrollReveal";
export default function Home() {
  return (
    <main>
      <Hero />
      <ScrollReveal>
        <PlatformOverview />
      </ScrollReveal>

      <ScrollReveal direction="left" delay={100}>
        <GamesSection />
      </ScrollReveal>

      <ScrollReveal direction="right" delay={100}>
        <TeamsSection />
      </ScrollReveal>

      <ScrollReveal direction="left" delay={100}>
        <TournamentSection />
      </ScrollReveal>

      <ScrollReveal>
        <AdditionalFeatures />
      </ScrollReveal>

      <ScrollReveal delay={150}>
        <FinalCTA />
      </ScrollReveal>
    </main>
  );
}
