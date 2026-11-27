import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductOverview } from './components/ProductOverview';
import { FeatureHighlights } from './components/FeatureHighlights';
import { ModuleShowcase } from './components/ModuleShowcase';
import { DashboardPreview } from './components/DashboardPreview';
import { OperationalBenefits } from './components/OperationalBenefits';
import { WorkflowSection } from './components/WorkflowSection';
import { FAQSection } from './components/FAQSection';
import { ContactDemoModal } from './components/ContactDemoModal';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const handleOpenDemo = () => {
    setIsDemoModalOpen(true);
  };

  const handleCloseDemo = () => {
    setIsDemoModalOpen(false);
  };

  return (
    <div className="app">
      {/* 1. Header / Navbar */}
      <Navbar onOpenDemo={handleOpenDemo} />

      <main>
        {/* 2. Hero Section */}
        <Hero onOpenDemo={handleOpenDemo} />

        {/* 3. Product Overview */}
        <ProductOverview />

        {/* 4. Feature Highlights */}
        <FeatureHighlights />

        {/* 5. Module Showcase (Interactive Tabs) */}
        <ModuleShowcase onOpenDemo={handleOpenDemo} />

        {/* 6. Dashboard Preview (Interactive Simulation) */}
        <DashboardPreview />

        {/* 7. Operational Benefits */}
        <OperationalBenefits />

        {/* 8. Workflow Explanation (Patient Journey) */}
        <WorkflowSection />

        {/* 9. FAQ Section */}
        <FAQSection />
      </main>

      {/* 10. Contact & Demo Request Modal */}
      <ContactDemoModal
        isOpen={isDemoModalOpen}
        onClose={handleCloseDemo}
      />

      {/* 11. Footer */}
      <Footer onOpenDemo={handleOpenDemo} />
    </div>
  );
};

export default App;
