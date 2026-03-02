import { useState, useRef } from 'react';
import { CommunityTypeProvider } from '../contexts/CommunityTypeContext';
import CommunityTypeSelector from '../sections/CommunityTypeSelector';
import CommunitiesHero from '../sections/CommunitiesHero';
import LiveActivityFeed from '../sections/LiveActivityFeed';
import WhatYouCanDo from '../sections/WhatYouCanDo';
import CommunitiesEcosystem from '../sections/CommunitiesEcosystem';
import CommunityUseCases from '../sections/CommunityUseCases';
import CommunityTestimonials from '../sections/CommunityTestimonials';
import CommunitiesCTA from '../sections/CommunitiesCTA';
import CommunityRegistrationModal from '../components/CommunityRegistrationModal';
import SimpleFooter from '../sections/SimpleFooter';
import SEOHead from '../components/SEOHead';

const CommunityPage = () => {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const heroSectionRef = useRef<HTMLElement>(null);

  const handleStartCommunity = () => {
    setShowRegistrationModal(true);
  };

  return (
    <CommunityTypeProvider>
      <main className="pt-20">
        <SEOHead
          title="Build Sports Communities | Organize Local Leagues | SocioSports"
          description="Create and manage sports communities, organize local tournaments, and connect with athletes. Join 500+ active communities across India."
        />

        {/* Community Type Selector - Sticky, hides when scrolling past hero */}
        <CommunityTypeSelector heroSectionRef={heroSectionRef} />

        {/* Hero Section */}
        <CommunitiesHero ref={heroSectionRef} onStartCommunity={handleStartCommunity} />

        {/* Live Activity Feed */}
        <LiveActivityFeed />

        {/* What You Can Do */}
        <WhatYouCanDo />



        {/* Ecosystem Integration */}
        <CommunitiesEcosystem />

        {/* Use Cases / Success Stories */}
        <CommunityUseCases />

        {/* Testimonials */}
        <CommunityTestimonials />

        {/* Final CTA */}
        <CommunitiesCTA onStartCommunity={handleStartCommunity} />

        {/* Footer */}
        <SimpleFooter />

        {/* Registration Modal */}
        <CommunityRegistrationModal
          isOpen={showRegistrationModal}
          onClose={() => setShowRegistrationModal(false)}
        />
      </main>
    </CommunityTypeProvider>
  );
};

export default CommunityPage;
