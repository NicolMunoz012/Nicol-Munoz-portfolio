import { HeroSection } from "./_sections/HeroSection";
import { ProjectsSection } from "./_sections/ProjectsSection";
import { AboutSection } from "./_sections/AboutSection";
import { SkillsSection } from "./_sections/SkillsSection";
import { ExperienceSection } from "./_sections/ExperienceSection";
import { TestimonialsSection } from "./_sections/TestimonialsSection";
import { ContactSection } from "./_sections/ContactSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <TestimonialsSection />
      <ExperienceSection />
      <SkillsSection />
      <ContactSection />
    </>
  );
}
