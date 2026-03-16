import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Clock, User, Play, Podcast, FileText, CheckCircle, Trophy, TrendingUp, Users, MapPin, Quote, Search } from 'lucide-react';
import { useAnalytics } from '../components/AnalyticsProvider';

gsap.registerPlugin(ScrollTrigger);

const KnowledgeHub = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const { trackEvent } = useAnalytics();

  const blogContent = [
    {
      id: "nutrition-tips",
      title: 'Top 5 Nutrition Tips for Young Athletes',
      excerpt: 'Fueling your body is as critical as training it. Discover the five essential nutrition strategies to maximize performance and recovery.',
      image: '/images/blog_02.jpg',
      author: 'Dr. Sarah Chen',
      category: 'Health',
      type: 'article',
      date: 'Feb 15, 2026',
      content: `# Fueling the Future: Top 5 Nutrition Tips for Young Athletes

Expert guidance on how to optimize your diet for peak performance, sustained energy, and rapid recovery.

## 1. Hydration is Non-Negotiable
Water is the most critical nutrient for athletes. Even 2% dehydration can lead to a significant drop in performance and cognitive function.
- **Before**: Drink 500ml 2 hours before exercise.
- **During**: Small sips every 15-20 minutes.
- **After**: Rehydrate slowly but steadily.

## 2. Timing the "Window"
Your body is most receptive to nutrients in the 30-60 minutes following intense activity. This is the "Anabolic Window."
- Focus on a 3:1 ratio of carbohydrates to protein.
- A simple banana and a protein shake or a bowl of yogurt with fruit can kickstart the repair process.

## 3. Don't Fear the Fats
Healthy fats (omega-3s) are essential for reducing inflammation and supporting brain health.
- Include avocados, nuts, seeds, and oily fish in your weekly meal plan.
- Stay away from trans fats found in processed snacks.

## 4. Quality Over Calories
While young athletes need significant energy, where that energy comes from matters.
- Prioritize whole grains, lean proteins, and a "rainbow" of vegetables.
- Minimize sugary drinks and highly processed "energy" bars that cause insulin spikes.

## 5. Listen to Your Body
Every athlete is different. Keep a food diary to correlate what you eat with how you feel during training.
- Consistency is better than perfection. 
- Build habits that you can maintain long-term.`
    },
    {
      id: "penguin-journey",
      title: 'The Penguin Journey: Breaking Barriers in Antarctica',
      excerpt: 'The incredible true story of how grit and adaptation are universal, from the ice caps to the sports arena. A lesson in resilience.',
      image: '/images/penguin_journey_cover.png',
      author: 'Editorial Desk',
      category: 'Inspiration',
      type: 'article',
      date: 'Must Read',
      content: `# Lessons from the Ice: What Athletes Can Learn from Nature's Greatest Survivors

In the harshest environment on Earth, where temperatures drop to -60°C and winds howl at 200 km/h, one creature thrives against all odds. The emperor penguin's journey across the Antarctic ice offers profound lessons for athletes at every level.

## The Power of Community

When thousands of penguins huddle together for warmth, they create something remarkable. Birds on the outside rotate inward, ensuring no individual bears the brunt of the cold indefinitely. This natural rotation system has kept their species alive for millions of years.

Athletes often train in isolation, believing individual effort alone determines success. But the penguin model teaches us differently. Training groups, coaching teams, and supportive communities aren't just nice-to-have—they're essential for survival at the highest levels.

Consider the Kenyan distance runners who train together in camps, pushing each other daily. Or the Brazilian football academies where young players develop not just skills, but the collective understanding that makes their national style unique.

## Endurance Beyond Comfort

The emperor penguin's 120-kilometer march to breeding grounds represents one of nature's most grueling endurance events. They walk for weeks without food, in conditions that would kill most creatures within hours.

For athletes, this mirrors the preseason grind, the rehabilitation process, or the long years of development before breakthrough performances. The penguin doesn't question the journey's difficulty—it simply continues, one step at a time.

Mental endurance often separates good athletes from great ones. Research shows that perceived effort, not actual physical limits, often determines when athletes stop. The penguin's journey suggests that our minds may be capable of far more than we believe.

## Adaptation as Strategy

Penguins didn't always live in Antarctica. Fossil evidence shows their ancestors lived in warmer climates. Over millions of years, they adapted—developing dense feathers, specialized blood circulation, and the ability to drink saltwater.

Athletes face similar evolutionary pressures. The game changes, opponents improve, and what worked yesterday may not work tomorrow. Those who adapt survive; those who don't, fade away.

Consider how cricket has evolved. Test specialists now develop T20 skills. Footballers who once relied on physicality now need technical sophistication. The ability to adapt isn't just an advantage—it's survival.

## The Sacrifice of the Parent

Perhaps the most remarkable aspect of penguin life is the male's 65-day fast while incubating the egg. He loses nearly half his body weight, protecting the next generation through the darkest Antarctic winter.

This level of sacrifice resonates with athletes who postpone careers, education, and relationships to pursue their sporting dreams. The parent penguin doesn't see this as sacrifice—it's simply what must be done.

Every Olympic champion has a story of early mornings, missed parties, and choices that peers didn't have to make. The penguin reminds us that extraordinary outcomes require extraordinary commitment.

## Lessons for the Modern Athlete

What can we take from the penguin's journey?

First, build your community. Find training partners who push you, coaches who believe in you, and supporters who sustain you through difficult periods.

Second, embrace discomfort. Growth happens at the edge of your comfort zone, not within it. The penguin doesn't seek the easy path—it walks into the storm because that's where it needs to go.

Third, adapt continuously. The sporting landscape changes rapidly. New training methods, technologies, and tactical approaches emerge constantly. Stay curious, stay flexible.

Fourth, commit fully. Half-measures don't survive Antarctic winters, and they don't produce champions. Whatever your goal, pursue it with everything you have.

## The Final Step

The penguin's journey ends not at the breeding grounds, but with the next generation taking its first steps. Similarly, an athlete's legacy isn't just personal achievement—it's the inspiration provided to those who follow.

When you next face a seemingly impossible challenge, remember the penguin. If a bird can survive the Antarctic winter, what might you be capable of achieving?

The ice is cold, the journey is long, but step by step, you'll get there.`
    },
    // Coach earnings / facility case study temporarily hidden
    // {
    //   id: "coach-sunita",
    //   title: 'Coach Sunita\'s Empty Facility: A Solved Problem',
    //   excerpt: 'How one booking app transformed a barren badminton court into a thriving academy in just 3 months. The power of digital visibility.',
    //   image: '/images/coach_sunita_court.png',
    //   author: 'Case Study',
    //   category: 'Success Stories',
    //   type: 'article',
    //   date: 'Feb 10, 2026',
    //   content: `...`
    // },
    {
      id: 1,
      title: 'Telangana\'s Boxing Prodigy: Nikhat Zareen\'s Journey',
      excerpt: 'From the streets of Nizamabad to becoming a World Champion. A story of grit, determination, and breaking barriers.',
      image: '/images/telangana_boxer.png',
      author: 'Editorial Desk',
      category: 'Athlete Stories',
      type: 'article',
      date: 'Top Story',
      content: `# From Nizamabad to World Champion: The Nikhat Zareen Story

In the bylanes of Nizamabad, Telangana, a young girl once fought for the right to box. Today, Nikhat Zareen stands as a world champion, her journey a testament to talent, determination, and the refusal to accept limitations placed on her.

## The Beginning

Nikhat was 13 when she first walked into a boxing ring. Her father, a former footballer, had encouraged her interest in sports. But boxing? That was different. In her community, girls didn't box.

"I remember people telling my father, 'What are you doing? She's a girl. Boxing is not for girls,'" Nikhat recalls. "But my father never listened to them. He said if she has talent, let her prove herself."

That support would prove crucial. While other girls were discouraged from sports, Nikhat had a champion in her corner—her father, Mohammed Jameel Ahmed.

## Early Struggles

The boxing gym in Nizamabad was basic. Equipment was limited. Training partners were mostly boys who didn't always welcome a girl in their space. But Nikhat had something they didn't: an unshakeable will to succeed.

"I used to get beaten up in sparring," she admits. "But I never gave up. Every punch made me stronger, more determined."

Her breakthrough came at the 2010 Erode Nationals, where she won gold in the sub-junior category. The victory announced her arrival. But the real challenges were just beginning.

## The System

Indian boxing, while producing world champions, has limited infrastructure at the grassroots level. For athletes from smaller towns like Nizamabad, the path to the top requires navigating significant obstacles.

Nikhat's journey took her from local tournaments to state camps, then to national selections. Each step required proving herself anew. Each level brought better opponents, better facilities, and stiffer competition.

"The gap between local and national level was huge," she remembers. "I had to improve everything—technique, fitness, mental strength. It was like starting from zero."

## The Setback

In 2019, Nikhat faced the biggest challenge of her career. A shoulder injury threatened to end her Olympic dreams. Surgery was required. The recovery would take months.

"I was devastated," she says. "The Olympics were so close, and suddenly everything was in doubt."

But champions are defined by how they respond to adversity. Nikhat attacked rehabilitation with the same intensity she brought to training. Day after day, she worked to regain strength and mobility.

## The Comeback

The return to boxing wasn't smooth. Doubts lingered. The shoulder needed testing in competition. But Nikhat's belief never wavered.

In 2022, she entered the IBA Women's World Boxing Championships in Istanbul. The field was stacked with Olympic medalists and world champions. Few gave the Indian from Telangana a serious chance.

They should have.

Nikhat fought through the bracket with increasing confidence. Her speed, technique, and tactical intelligence were on full display. In the final, she faced Thailand's Jitpong Jutamas—a formidable opponent.

The bout was decisive. Nikhat won 5-0, becoming only the fifth Indian woman to win a world boxing title.

## The Impact

Nikhat's victory resonated far beyond the boxing world. In Telangana, young girls saw a champion who looked like them, spoke their language, came from their communities.

"I get messages from girls across India," Nikhat says. "They tell me they started boxing because they saw me. That means more than any medal."

Her success has also highlighted the potential of athletes from smaller towns and cities. The next Nikhat Zareen might be training in a basic gym in any of India's countless small towns, waiting for opportunity.

## The Future

At 26, Nikhat is entering her prime. The Paris Olympics beckon. More world titles are possible. But her ambitions extend beyond personal achievement.

"I want to open an academy in Nizamabad," she shares. "Girls there should have facilities, coaching, opportunities I didn't have. They shouldn't have to struggle like I did."

## Lessons from a Champion

Nikhat's journey offers lessons for every athlete:

**Believe in yourself when others don't**: The world told her girls don't box. She proved them wrong.

**Embrace struggle as preparation**: Every setback, every obstacle, built the resilience that would define her career.

**Use doubt as fuel**: When people questioned her, she trained harder. When injuries threatened her, she rehabilitated with fierce determination.

**Remember where you came from**: Success hasn't made Nikhat forget her roots. Instead, it's given her the platform to help others follow her path.

## The Legacy

Nikhat Zareen's story is still being written. But already, she's achieved something remarkable: she's shown a generation of Indian girls that they belong in the ring, on the field, in any arena they choose.

From Nizamabad to world champion—that's not just a journey. It's a roadmap for anyone who's ever been told they can't.`
    },
    {
      id: 2,
      title: 'SocioSports Podcast: The Hyderabad Badminton Factory',
      excerpt: 'National coaches discuss how Hyderabad became India\'s badminton capital and the future of the sport.',
      image: '/images/podcast_hub.png',
      author: 'Host: Vikram R.',
      category: 'Podcasts',
      type: 'video',
      date: 'Latest Episode',
      content: `# The Hyderabad Badminton Factory: How a City Became India's Shuttle Capital

In this episode of the SocioSports Podcast, we sit down with three legendary coaches who shaped Hyderabad's badminton revolution: Coach Arif, Coach Ganguly Prasad, and Coach Ilyas.

## The Origins

Hyderabad wasn't always a badminton powerhouse. In the 1980s, the city had a handful of clubs and a few passionate players. But something was missing: infrastructure, coaching systems, and a pathway from grassroots to excellence.

Coach Arif remembers those early days: "We had one indoor hall. Players would queue for hours just to hit for 30 minutes. But there was hunger. The kids wanted to learn."

That hunger would become the foundation of something remarkable.

## The Gopichand Effect

The transformation began in earnest when Pullela Gopichand returned to Hyderabad after his All England Open victory in 2001. His academy, opened in 2004, would change Indian badminton forever.

"Gopichand showed what was possible," Coach Prasad explains. "He proved that an Indian could beat the world's best. Then he built a system to produce more champions."

The academy's success—Saina Nehwal, P.V. Sindhu, Kidambi Srikanth—created a template. Other coaches studied the methods. Facilities multiplied. A pipeline of talent began flowing.

## The Ecosystem

Today, Hyderabad's badminton ecosystem is unparalleled in India:

- 50+ professional academies
- 200+ indoor courts
- 10,000+ active junior players
- Regular national and international camps
- Specialized fitness and recovery centers

But numbers don't capture the culture. In Hyderabad, badminton isn't just a sport—it's a career path, a community, an identity.

## The Coaching Philosophy

What makes Hyderabad's coaching different? Our guests break it down:

**Technical Foundation**: "We spend years on basics," Coach Ilyas says. "Footwork, grip, swing—these must be perfect before any advanced training."

**Mental Conditioning**: "Indian players used to lose close matches," Coach Arif notes. "Now we train the mind as much as the body."

**Competition Exposure**: "We created a tournament ecosystem," Coach Prasad adds. "Players compete every week. Pressure becomes normal."

**Holistic Development**: "Badminton is the focus, but we develop the whole person," all three coaches emphasize. "Education, character, life skills—these matter too."

## The Challenges

Success brings its own problems. The demand for quality coaching exceeds supply. Many academies lack qualified coaches. Commercial interests sometimes override player welfare.

"We need to maintain standards," Coach Arif warns. "Not every academy with a court is an academy. Coaching quality must be regulated."

## The Future

What's next for Hyderabad badminton?

**Olympic Dreams**: With the 2028 Los Angeles Olympics approaching, the city's academies are producing the next generation of medal contenders.

**Grassroots Expansion**: Programs are reaching into schools and communities, identifying talent earlier than ever.

**International Collaboration**: Partnerships with Malaysian, Indonesian, and Danish coaches are bringing new perspectives.

**Technology Integration**: Video analysis, AI coaching tools, and data-driven training are becoming standard.

## Listen to the Full Episode

This summary captures only highlights. The full podcast includes:

- Detailed training methodologies
- Stories of champion development
- Predictions for Indian badminton's future
- Advice for young players and parents

Available on all major podcast platforms. Subscribe to SocioSports for more conversations with the people shaping Indian sports.`
    },
    {
      id: 3,
      title: 'The Future of Indian Football: Grassroots in Rural Telangana',
      excerpt: 'How local scouting programs are identifying talent in the smallest villages of the state.',
      image: '/images/rural_football.png',
      author: 'Sanjeev Kumar',
      category: 'Articles',
      type: 'article',
      date: 'Feb 12, 2026',
      content: `# Scouting the Villages: Telangana's Football Revolution

In a village of 3,000 people, 150 kilometers from Hyderabad, a 14-year-old boy runs across a dusty ground. His feet move with a grace that catches the eye. He doesn't know it yet, but scouts are watching.

This scene is repeating across rural Telangana, as systematic talent identification reaches India's smallest communities.

## The Hidden Talent Pool

For decades, Indian football scouting focused on cities and established academies. The assumption was simple: if talent existed, it would be found in the system.

But the system was missing something. In villages across India, children played football daily—on uneven grounds, without proper equipment, invisible to the football establishment.

"We were looking in the wrong places," admits a senior scout from a ISL club. "The cities have infrastructure, but the villages have hunger. That's where the talent is."

## The Telangana Initiative

In 2023, the Telangana Football Association launched an ambitious program: systematic scouting across all 33 districts. The goal was simple—find talent that traditional systems missed.

The approach was revolutionary in its simplicity:

**Village-Level Trials**: Scouts visited every mandal, conducting open trials for children aged 10-16.

**School Partnerships**: Physical education teachers were trained to identify football potential, creating a network of grassroots scouts.

**Technology Integration**: A mobile app allowed anyone to report talented players, democratizing the scouting process.

**Follow-Up Systems**: Identified players received ongoing support—training guidance, equipment, and pathways to higher levels.

## The Results

Two years in, the numbers are striking:

- 50,000+ children assessed
- 2,000+ identified as high-potential
- 200+ selected for district academies
- 50+ moved to professional club youth systems

But numbers don't tell the full story. Consider Ramesh, a 15-year-old from a farming family in Warangal district. He'd never played organized football. A village trial revealed exceptional ball control and game intelligence.

Today, he trains at a ISL club academy. His trajectory has changed forever.

## The Challenges

Rural scouting isn't without obstacles:

**Parental Resistance**: Many families view sports as a distraction from education. Convincing them requires patience and proof of opportunity.

**Infrastructure Gaps**: Identified talent often lacks access to quality training facilities. Bridging this gap requires investment.

**Retention**: Keeping talented children in the system through adolescence—when other pressures mount—is an ongoing challenge.

**Competition**: Other sports, particularly cricket, compete for the same talent pool.

## The Way Forward

Those involved in the program see clear next steps:

**Scale**: Expand to more villages, reaching deeper into rural India.

**Integration**: Connect grassroots identification with professional pathways, ensuring talent doesn't stagnate.

**Girls' Programs**: Extend the initiative to girls, who face even greater barriers to football participation.

**Coach Development**: Train local coaches to sustain development beyond initial identification.

## A Model for India?

Telangana's approach offers lessons for football development nationwide:

- Talent exists everywhere; scouting must reach everywhere
- Technology can democratize identification
- Local partnerships create sustainable systems
- Follow-up is as important as identification

As Indian football dreams of World Cup qualification, the answer may lie not in metropolitan academies, but in the dusty grounds of villages yet to be discovered.

The next Sunil Chhetri might be running across a field right now, waiting to be found.`
    },
    {
      id: 4,
      title: 'Mastering the Smash: Training at Gachibowli Stadium',
      excerpt: 'A professional guide to advanced badminton techniques used by elite athletes in Hyderabad.',
      image: '/images/badminton_action.png',
      author: 'Coach Anjali M.',
      category: 'Articles',
      type: 'article',
      date: 'Feb 10, 2026',
      content: `# The Perfect Smash: Technical Mastery in Badminton

The smash is badminton's most aggressive shot—a declaration of intent that says "this rally ends now." But for all its power, the smash is primarily about technique. Understanding this separates players who hit hard from players who hit effectively.

## The Physics

Before technique, understand what makes a smash effective:

**Angle**: The steeper the descent, the harder to return. A smash that lands at your opponent's feet is more effective than one they can volley.

**Speed**: Generated through racket head velocity, not arm strength. A relaxed arm moves faster than a tense one.

**Placement**: A smash to open court beats a smash to a ready opponent. Direction matters more than power.

**Deception**: If opponents read your smash, they can prepare. Disguise until the last moment.

## The Preparation

Great smashes begin before the racket moves:

**Positioning**: Get behind the shuttle early. You can't smash effectively from a defensive position.

**Grip**: A relaxed forehand grip allows wrist snap. Tension kills power.

**Stance**: Weight on the back foot, ready to transfer forward. Shoulders rotated, non-racket arm pointing at the shuttle.

**Mindset**: Commit to the shot. Hesitation produces weak smashes.

## The Execution

The smash sequence, broken down:

**1. The Reach**: Extend your racket arm upward. Your non-racket arm provides balance and targeting.

**2. The Rotation**: Hips and shoulders rotate forward. This generates the power base.

**3. The Whip**: Arm extends, wrist snaps forward. The motion is like cracking a whip—power transfers from body to arm to racket to shuttle.

**4. The Contact**: Hit the shuttle at the highest point possible, slightly in front of your body. Contact point determines angle.

**5. The Follow-Through**: Racket continues downward across your body. This ensures full power transfer and prepares for the next shot.

## Common Mistakes

Even experienced players make these errors:

**Tension**: Trying to hit hard creates muscle tension, which slows the swing. Power comes from speed, which comes from relaxation.

**Poor Footwork**: If you're not in position, you can't smash effectively. Work on getting behind the shuttle early.

**Wrong Contact Point**: Hitting too far behind or to the side reduces angle and power. The shuttle must be in the hitting zone.

**Telegraphing**: Dropping the racket early signals your intention. Keep the racket up until the last moment.

**Over-hitting**: Not every smash needs maximum power. Placement often beats power.

## Training Drills

Develop your smash through systematic practice:

**Shadow Practice**: Without a shuttle, practice the motion. Focus on technique, not power. Build muscle memory.

**Multi-Feed Drills**: Have a coach feed shuttles for repeated smashes. Focus on consistency before power.

**Target Practice**: Place targets on the court. Aim for specific zones. Accuracy develops through deliberate practice.

**Pressure Situations**: Practice smashes under fatigue or with consequences. Match conditions require performing when it matters.

**Video Analysis**: Record your smash. Compare with elite players. Identify specific areas for improvement.

## The Mental Game

Technical skill means nothing without mental strength:

**Commitment**: Once you decide to smash, commit fully. Half-hearted smashes are easily returned.

**Adaptability**: Not every smash works. Be ready for the next shot if your opponent returns it.

**Patience**: Sometimes the smash isn't the right shot. Develop the judgment to know when to attack and when to build.

**Confidence**: Believe in your ability to win points with the smash. Doubt produces weak shots.

## Recovery and Prevention

Smashing places stress on the body:

**Shoulder Care**: Rotator cuff exercises strengthen the muscles involved in smashing.

**Wrist Stability**: Strong wrists prevent injury and improve power transfer.

**Core Strength**: Power generation begins in the core. A strong core protects the back and improves smash quality.

**Rest**: Adequate recovery between sessions prevents overuse injuries.

## The Path Forward

The smash is a skill that develops over years, not weeks. Elite players continue refining their technique throughout their careers.

Start with fundamentals. Build consistency. Add power gradually. Develop placement. Master deception.

The perfect smash isn't about hitting the shuttle as hard as possible. It's about hitting it in a way your opponent can't return. That's the art of badminton's most devastating shot.`
    }
  ];

  // State for dynamic posts
  const [dynamicPosts, setDynamicPosts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Posts');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Athlete Success Stories - Dedicated Content
  const athleteSuccessStories = [
    {
      name: 'Priya Sharma',
      sport: 'Badminton',
      location: 'Hyderabad',
      story: 'From a local academy player to state-level champion in 18 months. Priya discovered tournaments through SocioSports and never looked back.',
      achievement: 'State Gold Medalist',
      image: '/images/athlete_profile_new.jpg'
    },
    {
      name: 'Rahul Verma',
      sport: 'Cricket',
      location: 'Warangal',
      story: 'A rural cricketer who got scouted at a SocioSports tournament. Now playing for the district team and coaching young talent.',
      achievement: 'District Team Selection',
      image: '/images/telangana_boxer.png'
    },
    {
      name: 'Anjali Reddy',
      sport: 'Athletics',
      location: 'Secunderabad',
      story: 'Connected with a professional coach through our platform. Improved her 400m time by 3 seconds in 6 months.',
      achievement: 'National Qualifier',
      image: '/images/athlete_story_feature.png'
    }
  ];

  // Coach Earnings Stories - Dedicated Content
  const coachEarningsStories = [
    {
      name: 'Coach Suresh Kumar',
      sport: 'Badminton',
      location: 'Gachibowli, Hyderabad',
      story: 'Doubled his monthly bookings from 40 to 85 sessions within 4 months. Now runs a full academy with 3 assistant coaches.',
      metric: '2x Bookings',
      income: '₹1.2L/month',
      image: '/images/coach_card.jpg'
    },
    {
      name: 'Coach Lakshmi Devi',
      sport: 'Tennis',
      location: 'Banjara Hills, Hyderabad',
      story: 'Struggled with empty courts. After joining SocioSports, she filled all morning slots and started weekend camps for kids.',
      metric: '85% Slot Utilization',
      income: '₹90K/month',
      image: '/images/coach_mentoring.png'
    },
    {
      name: 'Coach Venkat Rao',
      sport: 'Cricket',
      location: 'Secunderabad',
      story: 'From freelance coaching to running a registered academy. Now trains 120+ students across 3 batches daily.',
      metric: '120+ Students',
      income: '₹1.5L/month',
      image: '/images/coaching_cricket_main.png'
    }
  ];

  // Community Transformations - Dedicated Content
  const communityTransformations = [
    {
      name: 'Hyderabad Runners Club',
      location: 'Hyderabad',
      story: 'Started with 15 runners. Now 500+ members with weekly runs across 5 locations. Organized 3 marathons last year.',
      metric: '500+ Members',
      impact: '3 Marathons Organized',
      image: '/images/community_yoga_main.png'
    },
    {
      name: 'Secunderabad Badminton Group',
      location: 'Secunderabad',
      story: 'A WhatsApp group of 20 friends became a structured community with tournaments, coaching sessions, and junior programs.',
      metric: '200+ Active Players',
      impact: '12 Tournaments/Year',
      image: '/images/community_hub_feature.png'
    },
    {
      name: 'Women\'s Wellness Circle',
      location: 'Multiple Cities',
      story: 'Fitness sessions for women by women. From yoga to Zumba, creating safe spaces for 300+ women to stay active.',
      metric: '300+ Women',
      impact: '5 Cities Active',
      image: '/images/community_yoga_park.png'
    }
  ];

  // Problem Facts
  const problemFacts = [
    {
      metric: '70%+',
      title: 'Drop-off after school',
      description: 'Young athletes disengage without structured access or coaching pathways.',
      icon: '📉'
    },
    {
      metric: '1 in 3',
      title: 'Coaches underbooked',
      description: 'Facilities struggle to fill slots without consistent discovery and scheduling.',
      icon: '🏟️'
    },
    {
      metric: '₹0',
      title: 'No income visibility',
      description: 'Trained athletes lack platforms to monetize skills or find sustainable opportunities.',
      icon: '💰'
    },
    {
      metric: '4+ hrs',
      title: 'Daily screen time',
      description: 'Kids and adults increasingly sedentary, disconnected from physical activity.',
      icon: '📱'
    }
  ];

  useEffect(() => {
    // Fetch posts from backend
    import('../services/api').then(({ api }) => {
      api.getPosts().then(posts => {
        // Map backend posts to blog content format
        const mapped = posts.map((p: any) => ({
          id: p.id,
          title: p.title,
          excerpt: p.content.substring(0, 100) + '...',
          image: p.image || '/images/blog_01.jpg',
          author: p.author?.name || 'SocioSports',
          category: p.category || 'Article',
          type: 'article',
          date: new Date(p.createdAt).toLocaleDateString()
        }));
        setDynamicPosts(mapped);
      }).catch(err => console.log('Failed to fetch public posts', err));
    });
  }, []);

  // Merge dynamic posts with static (Dynamic first)
  const allPosts = dynamicPosts.length > 0 ? dynamicPosts : blogContent;

  // Filter posts by selected category AND search query
  const filteredPosts = allPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All Posts' ||
      (selectedCategory === 'Articles' && (post.category === 'Articles' || post.category === 'Article')) ||
      (selectedCategory === 'Podcasts' && (post.category === 'Podcasts' || post.category === 'Podcast')) ||
      (selectedCategory === 'Videos' && (post.category === 'Videos' || post.category === 'Video')) ||
      (selectedCategory === 'Athlete Stories' && post.category === 'Athlete Stories');

    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const displayPosts = filteredPosts.slice(0, 6);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        '.kh-title',
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
      ScrollTrigger.refresh();

      gsap.fromTo(
        '.kh-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.kh-grid',
            start: 'top 75%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [dynamicPosts, selectedCategory]);

  return (
    <section
      ref={sectionRef}
      id="blog"
      className="relative py-20 md:py-32 bg-[var(--bg-primary)]"
    >
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="kh-title">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-[var(--accent-orange)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-orange)]">Knowledge Hub</span>
              <div className="w-8 h-0.5 bg-[var(--accent-orange)]" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[var(--text-primary)] mb-4 tracking-tighter uppercase">
              STORIES THAT <span className="text-gradient">INSPIRE.</span>
            </h2>
            <p className="text-base text-[var(--text-secondary)] font-medium max-w-2xl mx-auto">
              Real journeys from athletes, coaches, and communities. Discover how sports transforms lives across India.
            </p>
          </div>
        </div>

        {/* Athlete Success Stories Section */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="w-5 h-5 text-[var(--accent-orange)]" />
            <h3 className="text-xl md:text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight">
              Athlete Success Stories
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {athleteSuccessStories.map((athlete, i) => (
              <div key={i} className="bg-[var(--bg-secondary)] rounded-3xl overflow-hidden border border-[var(--border)] hover:border-[var(--accent-orange)]/30 transition-all duration-300">
                <div className="relative h-48">
                  <img src={athlete.image} alt={athlete.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-[var(--accent-orange)] text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                      {athlete.achievement}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-3 h-3 text-[var(--text-secondary)]" />
                    <span className="text-xs text-[var(--text-secondary)]">{athlete.location}</span>
                    <span className="text-xs text-[var(--accent-orange)] font-bold">• {athlete.sport}</span>
                  </div>
                  <h4 className="text-lg font-black text-[var(--text-primary)] mb-2">{athlete.name}</h4>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{athlete.story}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coach Earnings Stories Section (temporarily hidden) */}
        {/*
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-5 h-5 text-[var(--accent-orange)]" />
            <h3 className="text-xl md:text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight">
              Coach Earnings Stories
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {coachEarningsStories.map((coach, i) => (
              <div key={i} className="bg-[var(--bg-secondary)] rounded-3xl overflow-hidden border border-[var(--border)] hover:border-[var(--accent-orange)]/30 transition-all duration-300">
                <div className="relative h-48">
                  <img src={coach.image} alt={coach.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <span className="px-3 py-1 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                      {coach.metric}
                    </span>
                    <span className="text-lg font-black text-white drop-shadow-lg">{coach.income}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-3 h-3 text-[var(--text-secondary)]" />
                    <span className="text-xs text-[var(--text-secondary)]">{coach.location}</span>
                    <span className="text-xs text-[var(--accent-orange)] font-bold">• {coach.sport}</span>
                  </div>
                  <h4 className="text-lg font-black text-[var(--text-primary)] mb-2">{coach.name}</h4>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{coach.story}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        */}

        {/* Community Transformations Section */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Users className="w-5 h-5 text-[var(--accent-orange)]" />
            <h3 className="text-xl md:text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight">
              Community Transformations
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {communityTransformations.map((community, i) => (
              <div key={i} className="bg-[var(--bg-secondary)] rounded-3xl overflow-hidden border border-[var(--border)] hover:border-[var(--accent-orange)]/30 transition-all duration-300">
                <div className="relative h-48">
                  <img src={community.image} alt={community.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <span className="px-3 py-1 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                      {community.metric}
                    </span>
                    <span className="text-xs font-bold text-white drop-shadow-lg">{community.impact}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-3 h-3 text-[var(--text-secondary)]" />
                    <span className="text-xs text-[var(--text-secondary)]">{community.location}</span>
                  </div>
                  <h4 className="text-lg font-black text-[var(--text-primary)] mb-2">{community.name}</h4>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{community.story}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Problem Facts Section */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[32px] p-6 md:p-10 mb-20">
          <div className="text-center mb-8">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-orange)]">Why We Exist</span>
            <h3 className="text-xl md:text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight mt-2">
              THE PROBLEMS WE'RE <span className="text-gradient">SOLVING.</span>
            </h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {problemFacts.map((fact, i) => (
              <div key={i} className="bg-[var(--bg-primary)] rounded-2xl p-6 text-center hover:border-[var(--accent-orange)]/30 transition-all border border-[var(--border)]">
                <div className="text-3xl mb-3">{fact.icon}</div>
                <div className="text-2xl font-black text-[var(--accent-orange)] mb-1">{fact.metric}</div>
                <h4 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-tight mb-2">
                  {fact.title}
                </h4>
                <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
                  {fact.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Blog Articles Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight">
                Latest <span className="text-gradient">Articles</span>
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Insights, guides, and stories from the sports world.</p>
            </div>
            <button
              onClick={() => navigate('/blog')}
              className="btn-secondary gap-2 self-start md:self-auto"
              aria-label="Browse all blog posts"
            >
              Browse all posts
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Categories & Search Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {['All Posts', 'Articles', 'Podcasts', 'Videos', 'Athlete Stories'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  aria-label={`Filter posts by category: ${cat}`}
                  className={`px-5 py-2 rounded-full border text-sm font-bold transition-all whitespace-nowrap ${selectedCategory === cat
                    ? 'border-[var(--accent-orange)] text-[var(--text-primary)] bg-[var(--accent-orange)]/10'
                    : 'border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-orange)]'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative group min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] group-focus-within:text-[var(--accent-orange)] transition-colors" />
              <input
                type="text"
                placeholder="Search articles, topics, or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-full py-3 pl-12 pr-6 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-orange)]/50 transition-all placeholder:text-[var(--text-secondary)]/50"
              />
            </div>
          </div>

          {/* Content Grid */}
          <div className="kh-grid min-h-[400px]">
            {displayPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayPosts.map((item) => (
                  <article
                    key={item.id}
                    className="kh-card bg-[var(--bg-secondary)] rounded-2xl overflow-hidden border border-[var(--border)] group hover:border-[var(--accent-orange)]/30 transition-all duration-300 cursor-pointer flex flex-col"
                    aria-label={`Read more about: ${item.title}`}
                    onClick={() => {
                      trackEvent('read_article', { article_id: item.id, title: item.title });
                      navigate(`/blog/${item.id}`);
                    }}
                  >
                    {/* Image Container */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 text-transparent"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/images/blog_01.jpg' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)]/80 to-transparent" />

                      {/* Type Overlay */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest text-white">
                          {item.category === 'Podcasts' || item.category === 'Podcast' ? <Podcast className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                          {item.category}
                        </span>
                        {(item.category === 'Athlete Stories' || item.date === 'Top Story') && (
                          <span className="flex items-center gap-1 px-2 py-1 bg-[var(--accent-orange)] rounded-lg text-[10px] font-black uppercase tracking-widest text-white">
                            <CheckCircle className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                      </div>

                      {item.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-[var(--accent-orange)] rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-2 text-[10px] font-bold text-[var(--accent-orange)] uppercase tracking-tighter">
                        <Clock className="w-3 h-3" />
                        {item.date}
                      </div>
                      <h3 className="text-base font-bold text-[var(--text-primary)] mb-2 group-hover:text-gradient transition-all duration-300 line-clamp-2 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-2 flex-1">
                        {item.excerpt}
                      </p>

                      {/* Author */}
                      <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[var(--bg-primary)] flex items-center justify-center border border-[var(--border)]">
                            <User className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                          </div>
                          <span className="text-xs font-bold text-[var(--text-secondary)]">{item.author}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--accent-orange)] group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-[var(--bg-secondary)] rounded-3xl border border-dashed border-[var(--border)]">
                <div className="w-16 h-16 rounded-full bg-[var(--bg-primary)] flex items-center justify-center mb-6">
                  <Search className="w-8 h-8 text-[var(--text-secondary)]/30" />
                </div>
                <h4 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tight mb-2">
                  No Articles Found
                </h4>
                <p className="text-[var(--text-secondary)] max-w-xs mx-auto mb-8">
                  We couldn't find any articles matching "{searchQuery}". Try using different keywords or categories.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All Posts'); }}
                  className="text-[var(--accent-orange)] font-bold text-sm uppercase tracking-widest hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default KnowledgeHub;
