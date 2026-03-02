
import CoachOrganizer from '../sections/CoachOrganizer';
import CoachSolutions from '../sections/CoachSolutions';

import SuccessStories from '../sections/SuccessStories';
import SimpleFooter from '../sections/SimpleFooter';
import SEOHead from '../components/SEOHead';

const CoachesPage = () => {
    return (
        <main className="bg-[var(--bg-primary)]">
            <SEOHead
                title="Find Certified Coaches | SocioSports India"
                description="Connect with NIS certified coaches and trainers. Professionalize your training with expert guidance."
            />
            <div className="pt-20">
                <CoachSolutions />
                <CoachOrganizer />

                {/* Featured Profiles Disclaimer Banner */}
                <div className="container mx-auto px-6 pb-8">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 px-6 py-4 rounded-r-xl">
                        <div className="flex items-start gap-3">
                            <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold uppercase">Note</div>
                            <div className="flex-1">
                                <p className="text-sm text-blue-900 dark:text-blue-100">
                                    <strong>Featured Trainers:</strong> The profiles below showcase our platform's capabilities. Real trainer registrations will open in <strong>March 2026</strong>.
                                    <a href="#waitlist" className="underline font-semibold ml-2 hover:text-blue-600">Join Waitlist →</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>




                <SuccessStories />
                <SimpleFooter />
            </div>
        </main>
    );
};

export default CoachesPage;
