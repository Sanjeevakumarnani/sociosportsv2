import { useEffect, useLayoutEffect, useState, createContext, useContext, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AnalyticsProvider } from './components/AnalyticsProvider';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from './sections/Navigation';
import SkipLink from './components/SkipLink';
import ProtectedRoute from './components/ProtectedRoute';
import CookieConsent from './components/CookieConsent';
import ToastContainer from './components/Toast';
import SocioMateBot from './components/SocioMateBot';
import { PermissionProvider } from './contexts/PermissionContext';
// Lazy load pages for performance
const HomePage = lazy(() => import('./pages/HomePage'));
const AthletesPage = lazy(() => import('./pages/AthletesPage'));
const CoachesPage = lazy(() => import('./pages/CoachesPage'));
const EcosystemPage = lazy(() => import('./pages/EcosystemPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const MobileAppPage = lazy(() => import('./pages/MobileAppPage'));
const JobsPage = lazy(() => import('./pages/JobsPage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const EventList = lazy(() => import('./pages/admin/events/EventList'));
const UserList = lazy(() => import('./pages/admin/users/UserList'));
const BookingList = lazy(() => import('./pages/admin/bookings/BookingList'));
const BlogList = lazy(() => import('./pages/admin/content/BlogList'));

const ContentCMS = lazy(() => import('./pages/admin/content/ContentManager'));
const HomePageCms = lazy(() => import('./pages/admin/content/HomePageCms'));
const AboutPageCms = lazy(() => import('./pages/admin/content/AboutPageCms'));
const SportsOnWheelsCms = lazy(() => import('./pages/admin/content/SportsOnWheelsCms'));
const MobileAppCms = lazy(() => import('./pages/admin/content/MobileAppCms'));
const VendorsPageCms = lazy(() => import('./pages/admin/content/VendorsPageCms'));
const JobsPageCms = lazy(() => import('./pages/admin/content/JobsPageCms'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const InstitutionsPage = lazy(() => import('./pages/InstitutionsPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));
const ChildSafety = lazy(() => import('./pages/ChildSafety'));
const SportsOnWheelsPage = lazy(() => import('./pages/SportsOnWheelsPage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const VendorsPage = lazy(() => import('./pages/VendorsPage'));
const ExploreSportsPage = lazy(() => import('./pages/ExploreSportsPage'));
const Settings = lazy(() => import('./pages/admin/Settings'));
const InquiriesAdmin = lazy(() => import('./pages/admin/InquiriesAdmin'));
const JobsAdmin = lazy(() => import('./pages/admin/JobsAdmin'));
const VendorsAdmin = lazy(() => import('./pages/admin/VendorsAdmin'));
const AthletesAdmin = lazy(() => import('./pages/admin/AthletesAdmin'));
const InstitutionsAdmin = lazy(() => import('./pages/admin/InstitutionsAdmin'));
const TrainersAdmin = lazy(() => import('./pages/admin/TrainersAdmin'));
const TeamAdmin = lazy(() => import('./pages/admin/content/TeamAdmin'));
const EmployerVerificationsAdmin = lazy(() => import('./pages/admin/EmployerVerificationsAdmin'));


// Loading component
const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-[var(--bg-primary)] z-50">
    <img src="/favicon.png" alt="Loading..." className="w-16 h-16 animate-spin" />
  </div>
);

gsap.registerPlugin(ScrollTrigger);

import type { Theme } from './contexts/ThemeContext';
import { ThemeContext } from './contexts/ThemeContext';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    // Disable browser's default scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Force instant scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Refresh ScrollTrigger
    ScrollTrigger.refresh();
  }, [pathname]);

  return null;
};

function App() {
  const [theme, setTheme] = useState<Theme>('navy');

  useEffect(() => {
    // Apply theme class to HTML element
    if (theme === 'navy') {
      document.documentElement.className = '';
    } else {
      document.documentElement.className = `theme-${theme}`;
    }

    // Refresh ScrollTrigger on theme change
    ScrollTrigger.refresh();
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <HelmetProvider>
        <PermissionProvider>
          <BrowserRouter>
            <AnalyticsProvider>
              <ToastContainer />
              <ScrollToTop />
              <SkipLink />
              <div className="relative min-h-screen bg-[var(--bg-primary)]">
                {/* Grain overlay */}
                <div className="grain-overlay" />

                {/* Navigation */}
                <Navigation />

                <div id="main-content">
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/ecosystem" element={<EcosystemPage />} />
                      <Route path="/athletes" element={<AthletesPage />} />
                      <Route path="/coaches" element={<CoachesPage />} />
                      <Route path="/events" element={<EventsPage />} />
                      <Route path="/community" element={<CommunityPage />} />
                      <Route path="/blog" element={<ResourcesPage />} />
                      <Route path="/blog/:id" element={<BlogPostPage />} />
                      <Route path="/resources" element={<ResourcesPage />} />
                      <Route path="/mobile-app" element={<MobileAppPage />} />
                      <Route path="/jobs" element={<JobsPage />} />
                      <Route path="/careers" element={<CareersPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                      <Route path="/terms-conditions" element={<TermsConditions />} />
                      <Route path="/child-safety" element={<ChildSafety />} />
                      <Route path="/sports-on-wheels" element={<SportsOnWheelsPage />} />
                      <Route path="/about" element={<AboutUsPage />} />
                      <Route path="/sports-events" element={<EventsPage />} />
                      <Route path="/vendors" element={<Navigate to="/sports-on-wheels" replace />} />
                      <Route path="/institutions" element={<InstitutionsPage />} />
                      <Route path="/explore-sports" element={<ExploreSportsPage />} />

                      {/* Public Admin Entry */}
                      <Route path="/admin" element={<AdminLogin />} />

                      {/* Protected Admin Routes with Layout */}
                      <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                      <Route path="/admin/inquiries" element={<ProtectedRoute><InquiriesAdmin /></ProtectedRoute>} />
                      <Route path="/admin/jobs" element={<ProtectedRoute><JobsAdmin /></ProtectedRoute>} />
                      <Route path="/admin/blog" element={<ProtectedRoute><BlogList /></ProtectedRoute>} />

                      {/* Admin pages with built-in AdminLayout - NO wrapper needed */}
                      <Route path="/admin/events" element={<ProtectedRoute><EventList /></ProtectedRoute>} />
                      <Route path="/admin/users" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
                      <Route path="/admin/vendors" element={<ProtectedRoute><VendorsAdmin /></ProtectedRoute>} />
                      <Route path="/admin/institutions" element={<ProtectedRoute><InstitutionsAdmin /></ProtectedRoute>} />
                      <Route path="/admin/bookings" element={<ProtectedRoute><BookingList /></ProtectedRoute>} />
                      <Route path="/admin/team" element={<ProtectedRoute><AdminLayout><TeamAdmin /></AdminLayout></ProtectedRoute>} />
                      <Route path="/admin/pages" element={<ProtectedRoute><ContentCMS /></ProtectedRoute>} />
                      <Route path="/admin/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                      <Route path="/admin/employer-verifications" element={<ProtectedRoute><EmployerVerificationsAdmin /></ProtectedRoute>} />

                      {/* Content CMS Pages - check if they have built-in layout */}
                      <Route path="/admin/pages/home" element={<ProtectedRoute><AdminLayout><HomePageCms /></AdminLayout></ProtectedRoute>} />
                      <Route path="/admin/pages/about" element={<ProtectedRoute><AdminLayout><AboutPageCms /></AdminLayout></ProtectedRoute>} />
                      <Route path="/admin/pages/sports-on-wheels" element={<ProtectedRoute><AdminLayout><SportsOnWheelsCms /></AdminLayout></ProtectedRoute>} />
                      <Route path="/admin/pages/mobile-app" element={<ProtectedRoute><AdminLayout><MobileAppCms /></AdminLayout></ProtectedRoute>} />
                      <Route path="/admin/pages/vendors" element={<ProtectedRoute><AdminLayout><VendorsPageCms /></AdminLayout></ProtectedRoute>} />
                      <Route path="/admin/pages/jobs" element={<ProtectedRoute><AdminLayout><JobsPageCms /></AdminLayout></ProtectedRoute>} />
                    </Routes>
                  </Suspense>
                </div>
                <CookieConsent />
                <SocioMateBot />
              </div>
            </AnalyticsProvider>
          </BrowserRouter>
        </PermissionProvider>
      </HelmetProvider>
    </ThemeContext.Provider>
  );
}


export default App;
