import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, Check, ArrowRight, Instagram, Linkedin, Youtube, Twitter } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ContactFooter = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Content animation
      gsap.fromTo(
        '.cf-content > *',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      // Form animation
      gsap.fromTo(
        '.cf-form',
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.cf-form',
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
      }, 3000);
    }
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'info@sociosports.com', href: 'mailto:info@sociosports.com' },
    { icon: Phone, label: 'Phone', value: '+91 7842983839', href: 'tel:+917842983839' },
    { icon: MapPin, label: 'Location', value: 'Plot 417, Vasanth Nagar, KPHB 9th Phase, Hyderabad, Telangana - 500085', href: 'https://maps.google.com/?q=Plot+417+Vasanth+Nagar+KPHB+9th+Phase+Hyderabad' },
  ];

  const footerLinks = {
    Platform: [
      { label: 'Sports', href: '/#sports' },
      { label: 'Coaches', href: '/#coaches' },
      { label: 'Events', href: '/#events' },
      { label: 'Community', href: '/#community' },
      // { label: 'Jobs', href: '/#jobs' }, // hidden
    ],
    Company: [
      { label: 'About Us', href: '/#about' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Partners', href: '/contact?reason=partner' },
    ],
    Support: [
      { label: 'Help Center', href: '#' },
      { label: 'Contact Us', href: '#' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-conditions' },
      { label: 'Child Safety', href: '/child-safety' },
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/sociosportsofficial', label: 'Instagram' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/sociobeats-app/', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  const scrollToSection = (href: string) => {
    if (href.startsWith('/#')) {
      const sectionId = href.replace('/#', '');
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer
      ref={sectionRef}
      className="relative bg-[var(--bg-primary)]"
    >
      {/* Contact Section */}
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-20 md:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left - Content */}
            <div className="cf-content">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-0.5 bg-[var(--accent-orange)]" />
                <span className="eyebrow">Contact</span>
              </div>

              <h2 className="section-title mb-6">
                LET&apos;S BUILD THE <span className="text-gradient">FUTURE</span> OF SPORTS
              </h2>

              <p className="section-subtitle mb-8 max-w-lg">
                Partner with us. Host events. Bring Sports on Wheels to your city.
                We&apos;re always looking for collaborators.
              </p>

              {/* Contact Info */}
              <div className="space-y-4 mb-8">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={index}
                      href={item.href}
                      className="flex items-center gap-4 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center group-hover:border-[var(--accent-orange)]/50 transition-colors">
                        <Icon className="w-5 h-5" style={{ color: 'var(--accent-orange)' }} />
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{item.label}</div>
                        <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{item.value}</div>
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center hover:border-[var(--accent-orange)]/50 hover:bg-[var(--accent-orange)]/10 transition-all duration-300"
                    >
                      <Icon className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Right - Form */}
            <div className="cf-form">
              <div className="bg-[var(--bg-secondary)] rounded-3xl p-8 border border-[var(--border)]">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                      <Check className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Message Sent!</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>We&apos;ll get back to you soon.</p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Send us a message</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <input
                          type="text"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl py-4 px-5 focus:outline-none focus:border-[var(--accent-orange)]/50 transition-colors"
                          style={{ color: 'var(--text-primary)' }}
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          placeholder="Your email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl py-4 px-5 focus:outline-none focus:border-[var(--accent-orange)]/50 transition-colors"
                          style={{ color: 'var(--text-primary)' }}
                        />
                      </div>
                      <div>
                        <textarea
                          placeholder="Your message"
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl py-4 px-5 focus:outline-none focus:border-[var(--accent-orange)]/50 transition-colors resize-none"
                          style={{ color: 'var(--text-primary)' }}
                        />
                      </div>
                      <button type="submit" className="w-full btn-primary gap-2 py-4">
                        <Send className="w-4 h-4" />
                        Send message
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="border-t border-[var(--border)]">
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
              {/* Brand */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'var(--accent-orange)' }}
                  >
                    <span className="text-white font-black text-xl">S</span>
                  </div>
                  <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>SocioSports</span>
                </div>
                <p className="max-w-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                  India&apos;s sports ecosystem platform. Connecting athletes, coaches,
                  and organizers to build a stronger sports community.
                </p>
                <Link to="/mobile-app">
                  <button className="btn-primary gap-2">
                    Download App
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>

              {/* Links */}
              {Object.entries(footerLinks).map(([title, links]) => (
                <div key={title}>
                  <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{title}</h4>
                  <ul className="space-y-3">
                    {links.map((link) => (
                      <li key={link.label}>
                        {link.href.startsWith('/#') ? (
                          <button
                            onClick={() => scrollToSection(link.href)}
                            className="transition-colors hover:text-[var(--accent-orange)]"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            {link.label}
                          </button>
                        ) : (
                          <Link
                            to={link.href}
                            className="transition-colors hover:text-[var(--accent-orange)]"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            {link.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                © 2026 SocioSports. All rights reserved.
              </p>
              <div className="flex gap-6">
                <Link to="/privacy-policy" className="text-sm transition-colors hover:text-[var(--accent-orange)]" style={{ color: 'var(--text-secondary)' }}>
                  Privacy Policy
                </Link>
                <Link to="/terms-conditions" className="text-sm transition-colors hover:text-[var(--accent-orange)]" style={{ color: 'var(--text-secondary)' }}>
                  Terms of Service
                </Link>
                <Link to="/child-safety" className="text-sm transition-colors hover:text-[var(--accent-orange)]" style={{ color: 'var(--text-secondary)' }}>
                  Child Safety
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ContactFooter;
