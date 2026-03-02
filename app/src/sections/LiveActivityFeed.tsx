import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Trophy, Users, Calendar, Target, MapPin, ArrowRight } from 'lucide-react';

interface Activity {
  id: string;
  type: 'achievement' | 'join' | 'event' | 'milestone';
  icon: typeof Trophy;
  title: string;
  location?: string;
  time: string;
  highlight?: string;
}

const ACTIVITIES: Activity[] = [
  {
    id: '1',
    type: 'achievement',
    icon: Trophy,
    title: 'My Home Vihanga won their weekend cricket league',
    location: 'Hyderabad',
    time: '2 min ago',
    highlight: 'Champions',
  },
  {
    id: '2',
    type: 'join',
    icon: Users,
    title: 'Tech Mahindra Hyderabad just joined with 200+ employees',
    location: 'Gachibowli',
    time: '15 min ago',
    highlight: '200+ members',
  },
  {
    id: '3',
    type: 'event',
    icon: Calendar,
    title: 'Marathon Morning Run scheduled for tomorrow',
    location: 'Gachibowli Stadium',
    time: '32 min ago',
    highlight: '50 registered',
  },
  {
    id: '4',
    type: 'milestone',
    icon: Target,
    title: '15 new members joined Brigade Gateway Community',
    location: 'Bangalore',
    time: '1 hour ago',
    highlight: '100+ total',
  },
  {
    id: '5',
    type: 'achievement',
    icon: Trophy,
    title: 'Kondapur Youth Club reached 100 members milestone',
    location: 'Kondapur',
    time: '2 hours ago',
    highlight: 'Growing fast',
  },
  {
    id: '6',
    type: 'event',
    icon: Calendar, // Using Calendar as it imports are available
    title: 'Weekend Badminton Tournament registration closing soon',
    location: 'Jubilee Hills',
    time: '12 min ago',
    highlight: 'Last few spots',
  },
  {
    id: '7',
    type: 'join',
    icon: Users,
    title: 'Villas at Orchid Lake started a new tennis community',
    location: 'Manikonda',
    time: '45 min ago',
    highlight: 'New Group',
  },
  {
    id: '8',
    type: 'achievement',
    icon: Trophy,
    title: 'Ravi Kumar completed his 50th marathon training session',
    location: 'KBR Park',
    time: '3 hours ago',
    highlight: 'Personal Best',
  },
];

const LiveActivityFeed = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [showAll, setShowAll] = useState(false);
  const visibleActivities = showAll ? ACTIVITIES : ACTIVITIES.slice(0, 4);
  const [rotatedActivities, setRotatedActivities] = useState<Activity[]>(showAll ? [] : ACTIVITIES.slice(0, 4));

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.activity-card',
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Rotate activities only when not showing all
  useEffect(() => {
    if (showAll) return;

    const interval = setInterval(() => {
      setRotatedActivities((prev) => {
        const source = prev.length > 0 ? prev : ACTIVITIES.slice(0, 4);
        const rotated = [...source.slice(1), ACTIVITIES[(ACTIVITIES.indexOf(source[source.length - 1]) + 1) % ACTIVITIES.length]];
        return rotated;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [showAll]);


  const handleViewAllClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowAll(!showAll);
  };

  const getTypeColor = (type: Activity['type']) => {
    switch (type) {
      case 'achievement':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'join':
        return 'text-green-500 bg-green-500/10';
      case 'event':
        return 'text-blue-500 bg-blue-500/10';
      case 'milestone':
        return 'text-purple-500 bg-purple-500/10';
      default:
        return 'text-[var(--accent-orange)] bg-[var(--accent-orange)]/10';
    }
  };

  return (
    <section
      ref={sectionRef}
      className="py-16 bg-[var(--bg-secondary)]"
    >
      <div className="px-4 sm:px-6 lg:px-8 xl:px-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500">
                Live Activity
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-[var(--text-primary)]">
              What's Happening Now
            </h2>
          </div>
          <button
            onClick={handleViewAllClick}
            className="hidden md:flex items-center gap-2 text-sm font-bold text-[var(--accent-orange)] hover:text-white transition-colors"
          >
            {showAll ? 'Show Less' : 'View All Activity'}
            <ArrowRight className={`w-4 h-4 transition-transform ${showAll ? 'rotate-90' : ''}`} />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(showAll ? ACTIVITIES : rotatedActivities.length > 0 ? rotatedActivities : ACTIVITIES.slice(0, 4)).map((activity) => (
            <div
              key={activity.id}
              className="activity-card group p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--accent-orange)]/30 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-xl ${getTypeColor(activity.type)}`}>
                  <activity.icon className="w-4 h-4" />
                </div>
                {activity.highlight && (
                  <span className="text-[9px] font-black uppercase tracking-wider text-[var(--accent-orange)] bg-[var(--accent-orange)]/10 px-2 py-1 rounded">
                    {activity.highlight}
                  </span>
                )}
              </div>

              <p className="text-sm font-bold text-[var(--text-primary)] mb-2 line-clamp-2 group-hover:text-[var(--accent-orange)] transition-colors">
                {activity.title}
              </p>

              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                {activity.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {activity.location}
                  </div>
                )}
                <span>{activity.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center md:hidden">
          <button
            onClick={handleViewAllClick}
            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--accent-orange)]"
          >
            {showAll ? 'Show Less' : 'View All Activity'}
            <ArrowRight className={`w-4 h-4 transition-transform ${showAll ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default LiveActivityFeed;
