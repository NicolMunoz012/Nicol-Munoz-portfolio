import { HeroSection } from "./_sections/HeroSection";
import { ProjectsSection } from "./_sections/ProjectsSection";
import { AboutSection } from "./_sections/AboutSection";
import { SkillsSection } from "./_sections/SkillsSection";
import { ExperienceSection } from "./_sections/ExperienceSection";
import { TestimonialsSection } from "./_sections/TestimonialsSection";
import { ContactSection } from "./_sections/ContactSection";
import { Footer } from "./_components/layout/Footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-6 md:gap-8">
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <TestimonialsSection />
      <ExperienceSection />
      <SkillsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
