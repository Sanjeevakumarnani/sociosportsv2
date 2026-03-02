import EcosystemProblems from '../sections/ecosystem/EcosystemProblems';
import EcosystemVision from '../sections/ecosystem/EcosystemVision';
import EcosystemLiveAction from '../sections/ecosystem/EcosystemLiveAction';
import ChooseJourney from '../sections/ecosystem/ChooseJourney';
import EcosystemHowItWorks from '../sections/ecosystem/EcosystemHowItWorks';
import EcosystemImpact from '../sections/ecosystem/EcosystemImpact';
import EcosystemStories from '../sections/ecosystem/EcosystemStories';
import ExploreDirectory from '../sections/ecosystem/ExploreDirectory';
import SimpleFooter from '../sections/SimpleFooter';
import SEOHead from '../components/SEOHead';

const EcosystemPage = () => {
    return (
        <main className="bg-[var(--bg-primary)]">
            <SEOHead
                title="Sports Ecosystem | Athletes, Coaches & Facilities | SocioSports"
                description="One platform connecting India's entire sports ecosystem. Athletes get discovered, coaches grow their business, and facilities maximize utilization. Join the movement."
            />
            <div className="pt-20">
                {/* Section 1: The Core Problem — 3 Big Gaps */}
                <EcosystemProblems />

                {/* Section 2: The Unified Vision */}
                <EcosystemVision />

                {/* Section 3: Live Action - Compete. Conquer. */}
                <EcosystemLiveAction />

                {/* Section 4: Choose Your Journey (Athlete vs Coach) */}
                <ChooseJourney />

                {/* Section 5: How It Works */}
                <EcosystemHowItWorks />

                {/* Section 6: Real Impact — Combined Metrics */}
                <EcosystemImpact />

                {/* Section 7: Success Stories (Arjun, Sunitha, Rajesh) */}
                <EcosystemStories />

                {/* Section 8: Explore the Directory (Tabbed) */}
                <ExploreDirectory />

                <SimpleFooter />
            </div>
        </main>
    );
};

export default EcosystemPage;
