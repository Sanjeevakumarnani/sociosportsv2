import AdminLayout from '../../../layouts/AdminLayout';
import { useState } from 'react';
import PageEditor from './PageEditor';
import HomePageCms from './HomePageCms';
import AboutPageCms from './AboutPageCms';
import SportsOnWheelsCms from './SportsOnWheelsCms';
import MobileAppCms from './MobileAppCms';
import VendorsPageCms from './VendorsPageCms';
import JobsPageCms from './JobsPageCms';
import SettingsCms from './SettingsCms';
import { FileText, Shield, Info, Book, Trophy, Smartphone, Briefcase, Globe } from 'lucide-react';

const ContentManager = () => {
    const [selectedPage, setSelectedPage] = useState('about-us');

    const pages = [
        { id: 'about-us', title: 'About Us', icon: Info },
        { id: 'sports-on-wheels', title: 'Sports on Wheels', icon: Trophy },
        { id: 'mobile-app', title: 'Mobile App', icon: Smartphone },
        { id: 'vendors-page', title: 'Vendors / Partners', icon: Book },
        { id: 'jobs-page', title: 'Careers / Jobs', icon: Briefcase },
        { id: 'privacy-policy', title: 'Privacy Policy', icon: Shield },
        { id: 'terms-conditions', title: 'Terms & Conditions', icon: FileText },
        { id: 'child-safety', title: 'Child Safety', icon: Shield },
        { id: 'settings-page', title: 'Global Settings', icon: Globe },
        { id: 'home-hero', title: 'Home Hero Configuration', icon: Book },
    ];



    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto h-[calc(100vh-80px)] flex gap-6">
                {/* Sidebar Page List */}
                <div className="w-64 space-y-2">
                    <h3 className="text-white/50 text-xs font-bold uppercase mb-4 px-2">Static Pages</h3>
                    {pages.map((page) => {
                        const Icon = page.icon;
                        return (
                            <button
                                key={page.id}
                                onClick={() => setSelectedPage(page.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${selectedPage === page.id
                                    ? 'bg-white/10 text-white border border-white/10'
                                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="font-medium text-sm">{page.title}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Main Editor Area */}
                <div className="flex-1">
                    {selectedPage === 'home-hero' ? (
                        <HomePageCms />
                    ) : selectedPage === 'about-us' ? (
                        <AboutPageCms />
                    ) : selectedPage === 'sports-on-wheels' ? (
                        <SportsOnWheelsCms />
                    ) : selectedPage === 'mobile-app' ? (
                        <MobileAppCms />
                    ) : selectedPage === 'vendors-page' ? (
                        <VendorsPageCms />
                    ) : selectedPage === 'jobs-page' ? (
                        <JobsPageCms />
                    ) : selectedPage === 'settings-page' ? (
                        <SettingsCms />
                    ) : (
                        <PageEditor
                            key={selectedPage}
                            slug={selectedPage}
                            title={pages.find(p => p.id === selectedPage)?.title || 'Page'}
                        />
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default ContentManager;
