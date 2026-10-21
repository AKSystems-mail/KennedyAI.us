import HeroSection from './components/HeroSection';
import CapabilitiesGrid from './components/CapabilitiesGrid';
import CaseStudySlabs from './components/CaseStudySlabs';
import TechStackSection from './components/TechStackSection';
import EngagementModel from './components/EngagementModel';
import SocialProof from './components/SocialProof';
import ContactSection from './components/ContactSection';

const SolutionsLayout = () => {
  return (
    <main className="bg-[#0A0A0A]">
      <HeroSection />
      <CapabilitiesGrid />
      <CaseStudySlabs />
      <SocialProof />
      <TechStackSection />
      <EngagementModel />
      <ContactSection />
    </main>
  );
};

export default SolutionsLayout;
