import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { gsap } from 'gsap';
import { Download, Search, Home, Truck, Calendar, Briefcase, Info, Phone } from 'lucide-react';
import SearchModal from '../components/SearchModal';


const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const location = useLocation();
  const { theme } = useTheme();

  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  const navLinks = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Sports on Wheels', href: '/sports-on-wheels', icon: Truck },
    { label: 'Sports Events', href: '/sports-events', icon: Calendar },
    // { label: 'Sports Jobs', href: '/jobs', icon: Briefcase }, // hidden
    { label: 'About', href: '/about', icon: Info },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine direction and toggle visibility
      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY.current) {
          // Scrolling DOWN
          setIsVisible(false);
        } else {
          // Scrolling UP
          setIsVisible(true);
        }
      } else {
        // Always show at the very top
        setIsVisible(true);
      }

      setIsScrolled(currentScrollY > 100);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: 'power2.out', onComplete: () => {
            if (navRef.current) {
              navRef.current.style.transform = '';
              navRef.current.style.opacity = '';
            }
          }
        }
      );
    }
  }, []);

  const scrollToSection = (href: string) => {
    if (href.startsWith('/#')) {
      const sectionId = href.replace('/#', '');
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };


  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          } ${isScrolled || !isHomePage
            ? theme === 'light'
              ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50'
              : 'bg-[var(--bg-primary)]/90 backdrop-blur-lg shadow-lg'
            : theme === 'light'
              ? 'bg-white/90 backdrop-blur-lg shadow-sm border-b border-black/5'
              : 'bg-transparent'
          }`}
      >
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center gap-4 min-h-[56px]">
            {/* Logo */}
            <Link
              to="/"
              aria-label="SocioSports Home - Visit the homepage"
              className="flex items-center gap-2 group logo-container"
            >
              <img
                src="/images/logo.png"
                alt="SocioSports Logo"
                className={`h-12 md:h-14 w-auto object-contain transition-all duration-300 transform group-hover:scale-105 ${theme === 'light' ? 'brightness-0' : ''
                  }`}
              />
            </Link>

            {/* Responsive Navigation Pill – height aligned with search bar */}
            <div className={`hidden lg:flex items-center gap-1 p-1.5 rounded-full border backdrop-blur-md transition-all duration-500 ${isHomePage && !isScrolled
              ? theme === 'light'
                ? 'bg-white/90 border-gray-200/50 shadow-sm'
                : 'bg-black/50 border-white/10'
              : 'bg-[var(--bg-secondary)]/50 border-[var(--border)]'
              }`}>
              {navLinks.map((link) => {
                const isActive = link.href === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    aria-label={`Navigate to ${link.label}`}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={(e) => {
                      if (link.href.startsWith('/#')) {
                        e.preventDefault();
                        scrollToSection(link.href);
                      }
                    }}
                    className={`flex items-center justify-center px-3 py-2 rounded-full transition-all duration-300 relative flex-shrink-0 font-medium text-sm whitespace-nowrap ${isActive
                      ? 'bg-[var(--accent-orange)] text-white'
                      : isHomePage && !isScrolled
                        ? theme === 'light'
                          ? 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                          : 'text-gray-400 hover:bg-white/10 hover:text-white'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]'
                      }`}
                  >
                    <link.icon className="w-4 h-4 mr-1.5" />
                    {link.label}
                  </Link>
                );
              })}

              <div className="w-px h-5 bg-[var(--border)] mx-1 flex-shrink-0" />

              <Link
                to="/contact"
                aria-label="Contact Us"
                className={`flex items-center justify-center px-3 py-2 rounded-full transition-all duration-300 relative flex-shrink-0 font-medium text-sm whitespace-nowrap ${location.pathname === '/contact'
                  ? 'bg-[var(--accent-orange)] text-white'
                  : isHomePage && !isScrolled
                    ? theme === 'light'
                      ? 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                      : 'text-gray-400 hover:bg-white/10 hover:text-white'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]'
                  }`}
              >
                <Phone className="w-4 h-4 mr-1.5" />
                Contact Us
              </Link>
            </div>

            {/* Desktop Search Bar in Nav (replaces icon + Get the app) */}
            <div className="hidden lg:flex items-center ml-auto flex-1 max-w-xl">
              <div className="w-full flex items-stretch rounded-2xl border border-[var(--accent-orange)]/70 bg-[var(--bg-secondary)]/95 backdrop-blur-xl shadow-2xl overflow-hidden min-h-[44px]">
                {/* Fake input area – opens modal on click */}
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="flex-1 flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-left"
                  aria-label="Search sports person by name or USID"
                >
                  <Search className="w-4 h-4 text-[var(--accent-orange)] flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-[var(--text-secondary)] truncate">
                    Search by name or USID
                  </span>
                </button>

                {/* Right Search button */}
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="px-4 min-h-[44px] text-xs sm:text-sm font-semibold bg-[var(--accent-orange)] text-white hover:bg-orange-600 transition-colors whitespace-nowrap"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Mobile Actions & Menu Toggle */}
            <div className="lg:hidden flex items-center gap-3">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)]"
              >
                <Search className="w-5 h-5" />
              </button>
              <button onClick={() => setIsMobileMenuOpen(true)}>
                <div className="space-y-1.5 p-2">
                  <span className="block w-6 h-0.5 bg-[var(--text-primary)]"></span>
                  <span className="block w-6 h-0.5 bg-[var(--text-primary)]"></span>
                  <span className="block w-6 h-0.5 bg-[var(--text-primary)]"></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-20 left-4 right-4 bg-[var(--bg-secondary)] rounded-2xl p-6 shadow-xl animate-in fade-in slide-in-from-top-4 border border-[var(--border)] max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const isActive = link.href === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={(e) => {
                      if (link.href.startsWith('/#')) {
                        e.preventDefault();
                        scrollToSection(link.href);
                      }
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 text-left text-lg font-medium py-3 border-b last:border-0 transition-colors"
                    style={{
                      color: isActive ? 'var(--accent-orange)' : 'var(--text-primary)',
                      borderColor: 'var(--border)'
                    }}
                  >
                    <link.icon className={`w-5 h-5 ${isActive ? 'text-[var(--accent-orange)]' : 'text-[var(--text-secondary)]'}`} />
                    {link.label}
                  </Link>
                );
              })}
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-left text-lg font-medium py-3 border-b transition-colors"
                style={{
                  color: location.pathname === '/contact' ? 'var(--accent-orange)' : 'var(--text-primary)',
                  borderColor: 'var(--border)'
                }}
              >
                <Phone className={`w-5 h-5 ${location.pathname === '/contact' ? 'text-[var(--accent-orange)]' : 'text-[var(--text-secondary)]'}`} />
                Contact Us
              </Link>
              <div className="pt-4 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsSearchOpen(true);
                  }}
                  className="w-full py-3 rounded-xl border border-[var(--border)] flex items-center justify-center gap-2 text-[var(--text-primary)] font-medium"
                >
                  <Search className="w-5 h-5" />
                  Search Profiles
                </button>

                {/* Removed mobile "Get the app" button */}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navigation;
