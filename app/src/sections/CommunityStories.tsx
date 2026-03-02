import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  readTime: string;
  category: string;
  slug: string;
}

const FEATURED_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Why Sports Reduce Digital Addiction',
    excerpt: 'Discover how physical activity helps break the dopamine loop of endless scrolling and rebuilds focus.',
    image: '/images/digital_wellness.png',
    readTime: '5 min',
    category: 'Wellness',
    slug: 'why-sports-reduce-digital-addiction',
  },
  {
    id: '2',
    title: 'Building Stronger Communities Through Play',
    excerpt: 'How local sports create belonging, connection, and purpose in an increasingly isolated world.',
    image: '/images/community_01.jpg',
    readTime: '4 min',
    category: 'Community',
    slug: 'building-stronger-communities-through-play',
  },
  {
    id: '3',
    title: 'How Local Sports Improve Mental Health',
    excerpt: 'The science behind why movement is medicine and how community sports boost mental wellness.',
    image: '/images/community_yoga_park.png',
    readTime: '6 min',
    category: 'Health',
    slug: 'how-local-sports-improve-mental-health',
  },
];

const CommunityStories = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.story-header > *',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );

      gsap.fromTo(
        '.story-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.stories-grid',
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-[var(--bg-secondary)]"
    >
      <div className="px-4 sm:px-6 lg:px-8 xl:px-16">
        {/* Header */}
        <div className="story-header text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-5 h-5 text-[var(--accent-orange)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent-orange)]">
              From Our Blog
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] mb-4 tracking-tight">
            Community <span className="text-gradient">Stories</span>
          </h2>

          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Insights, research, and stories about building healthier communities through sports.
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="stories-grid grid md:grid-cols-3 gap-6 mb-10">
          {FEATURED_POSTS.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="story-card group"
            >
              <article className="h-full rounded-[24px] bg-[var(--bg-primary)] border border-[var(--border)] overflow-hidden hover:border-[var(--accent-orange)]/30 transition-all">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-[var(--accent-orange)] text-[10px] font-black text-white uppercase tracking-wider">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-black text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-orange)] transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                      <Clock className="w-3 h-3" />
                      {post.readTime} read
                    </div>

                    <span className="flex items-center gap-1 text-xs font-bold text-[var(--accent-orange)] opacity-0 group-hover:opacity-100 transition-opacity">
                      Read
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] text-sm font-bold text-[var(--text-primary)] hover:border-[var(--accent-orange)]/50 transition-all"
          >
            Read More Stories
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CommunityStories;
