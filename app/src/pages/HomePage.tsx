import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from '../sections/Hero';
import Ecosystem from '../sections/Ecosystem';
import WhyChooseUs from '../sections/WhyChooseUs';
import SportsPocket from '../sections/SportsPocket';
// import DesignedForEveryone from '../sections/DesignedForEveryone';
import CorePrinciples from '../sections/CorePrinciples';
import CommunityStories from '../sections/CommunityStories';
import AthleteIdentity from '../sections/AthleteIdentity';

import HowItWorks from '../sections/HowItWorks';
// import ReadyToStart from '../sections/ReadyToStart';
import PlatformModules from '../sections/PlatformModules';
import EcosystemBenefits from '../sections/EcosystemBenefits';
import SimpleFooter from '../sections/SimpleFooter';
import SEOHead from '../components/SEOHead';
import StructuredData from '../components/StructuredData';

const HomePage = () => {
    useEffect(() => {
        if (window.location.hash === '#athletes') {
            const el = document.getElementById('athletes');
            el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "SocioSports",
        "url": "https://sociosports.co.in",
        "logo": "https://sociosports.co.in/images/logo.png",
        "sameAs": [
            "https://www.facebook.com/sociosports",
            "https://twitter.com/sociosports",
            "https://www.instagram.com/sociosports"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-9876543210",
            "contactType": "customer service"
        }
    };

    return (
        <main className="relative">
            <SEOHead />
            <StructuredData data={organizationSchema} />
            <Hero />
            <div className="py-2" />
            <AthleteIdentity />
            <WhyChooseUs />
            <div className="py-2" />
            <SportsPocket />
            {/* <DesignedForEveryone /> */}
            <div className="py-2" />
            <HowItWorks />
            {/* <PlatformModules /> */}
            <div className="py-2" />
            <Ecosystem />
            <div className="py-2" />
            <EcosystemBenefits />
            <div className="py-2" />
            <CorePrinciples />
            {/* <CommunityStories /> */}
            <SimpleFooter />
        </main>
    );
};

export default HomePage;
