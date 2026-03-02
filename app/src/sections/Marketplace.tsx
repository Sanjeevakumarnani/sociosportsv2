import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingBag, ArrowRight, Store, Package, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const Marketplace = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const vendors = [
    {
      name: 'SPORTS GEAR',
      image: '/images/vendor_01.jpg',
      items: '2,500+',
      rating: 4.8,
      overlayClass: 'sport-card-overlay-blue',
    },
    {
      name: 'NUTRITION',
      image: '/images/vendor_02.jpg',
      items: '800+',
      rating: 4.9,
      overlayClass: 'sport-card-overlay-green',
    },
    {
      name: 'RECOVERY',
      image: '/images/vendor_03.jpg',
      items: '450+',
      rating: 4.7,
      overlayClass: 'sport-card-overlay-orange',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        '.mp-title',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      // Cards animation
      gsap.fromTo(
        '.mp-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.mp-grid',
            start: 'top 75%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-32 bg-[var(--bg-secondary)]"
    >
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="mp-title">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-[var(--accent-orange)]" />
              <span className="eyebrow">Event Marketplace</span>
              <div className="w-8 h-0.5 bg-[var(--accent-orange)]" />
            </div>
            <h2 className="section-title mb-6">
              Stalls at <span className="text-gradient">SportsOnWheels</span>
            </h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Launch your pop-up store right where the action is. Connect directly with over 500+ active athletes and spectators at our weekend tournaments.
            </p>
          </div>
        </div>

        {/* Vendors Grid */}
        <div className="mp-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[
            {
              name: 'Retail Pop-ups',
              image: '/images/event_stall_gear.png',
              stats: 'High Footfall Area',
              desc: 'Ideal for sports gear, jerseys, and equipment. Positioned near player dugouts for maximum visibility.',
              feature: '10x10 Tent Setup',
            },
            {
              name: 'Nutrition Station',
              image: '/images/event_stall_nutrition.png',
              stats: 'Peak Hours 8AM-2PM',
              desc: 'Perfect for energy drinks, supplements, and healthy snacks. Located near water stations and rest zones.',
              feature: 'Power Supply Included',
            },
            {
              name: 'Recovery Zone',
              image: '/images/event_stall_physio.png',
              stats: 'Exclusive Zone',
              desc: 'Dedicated quiet area for physiotherapy, massage, and recovery services. Premium placement options.',
              feature: 'Semi-Private Enclosure',
            },
          ].map((vendor, idx) => (
            <div
              key={idx}
              className="mp-card group relative rounded-[32px] overflow-hidden bg-white/5 border border-white/10 hover:border-[var(--accent-orange)]/50 transition-all duration-500"
            >
              {/* Image Container */}
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={vendor.image}
                  alt={vendor.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-[var(--accent-orange)] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                    {vendor.stats}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 relative -mt-12 bg-gradient-to-t from-[var(--bg-secondary)] via-[var(--bg-secondary)] to-transparent pt-12">
                <h3 className="text-2xl font-black text-[var(--text-primary)] mb-3 group-hover:text-[var(--accent-orange)] transition-colors">
                  {vendor.name}
                </h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6 font-medium">
                  {vendor.desc}
                </p>

                <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
                  <div className="flex items-center gap-2 text-[var(--text-primary)]/80 text-xs font-bold uppercase tracking-wider">
                    <Package className="w-4 h-4 text-[var(--accent-orange)]" />
                    {vendor.feature}
                  </div>
                  <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center transform group-hover:rotate-45 transition-all duration-300 hover:bg-[var(--accent-orange)] hover:text-white">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Become a Vendor CTA */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-[var(--bg-primary)] rounded-2xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-orange)]/20 flex items-center justify-center">
                <Store className="w-6 h-6 text-[var(--accent-orange)]" />
              </div>
              <div className="text-left">
                <div className="text-[var(--text-primary)] font-semibold">Become a Vendor</div>
                <div className="text-sm text-[var(--text-secondary)]">List your products & services</div>
              </div>
            </div>
            <Link
              to="/vendors"
              className="btn-primary gap-2 whitespace-nowrap"
            >
              <Package className="w-4 h-4" />
              Start Selling
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Marketplace;
