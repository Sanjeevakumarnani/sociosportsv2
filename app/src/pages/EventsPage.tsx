import { CommunityTypeProvider } from '../contexts/CommunityTypeContext';
// import EventsTournaments from '../sections/EventsTournaments';
import QuickStartTemplates from '../sections/QuickStartTemplates';
import ImpactCalculator from '../sections/ImpactCalculator';
import SimpleFooter from '../sections/SimpleFooter';
import SowServices from '../sections/SowServices';
import SEOHead from '../components/SEOHead';

const EventsPage = () => {
    return (
        <CommunityTypeProvider>
            <main>
                <SEOHead
                    title="Sports Events & Tournaments in India | SocioSports"
                    description="Discover and register for upcoming sports events, tournaments, and leagues across India. Cricket, football, badminton, running events & more. Find your next competition today."
                />
                <div className="pt-20">
                    {/* Our Services */}
                    <SowServices />

                    {/* Moved from Community Section */}
                    <QuickStartTemplates />
                    <ImpactCalculator />

                    <SimpleFooter />
                </div>
            </main>
        </CommunityTypeProvider>
    );
};

export default EventsPage;
