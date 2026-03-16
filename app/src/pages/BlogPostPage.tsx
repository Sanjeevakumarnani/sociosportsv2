import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ArrowLeft, Clock, User, Music, Video as VideoIcon, Share2, Bookmark, ThumbsUp, MessageCircle } from 'lucide-react';
import SimpleFooter from '../sections/SimpleFooter';

// Static blog content for fallback
const staticBlogContent = [
    {
        id: "penguin-journey",
        title: 'The Penguin Journey: Breaking Barriers in Antarctica',
        excerpt: 'The incredible true story of how grit and adaptation are universal, from the ice caps to the sports arena. A lesson in resilience.',
        image: '/images/penguin_journey_cover.png',
        author: { name: 'Editorial Desk' },
        category: 'Inspiration',
        type: 'article',
        createdAt: new Date().toISOString(),
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
    //     id: "coach-sunita",
    //     title: 'Coach Sunita\'s Empty Facility: A Solved Problem',
    //     excerpt: 'How one booking app transformed a barren badminton court into a thriving academy in just 3 months. The power of digital visibility.',
    //     image: '/images/coach_sunita_court.png',
    //     author: { name: 'Case Study' },
    //     category: 'Success Stories',
    //     type: 'article',
    //     createdAt: new Date().toISOString(),
    //     content: `...`
    // },
    {
        id: "1",
        title: 'Telangana\'s Boxing Prodigy: Nikhat Zareen\'s Journey',
        excerpt: 'From the streets of Nizamabad to becoming a World Champion. A story of grit, determination, and breaking barriers.',
        image: '/images/telangana_boxer.png',
        author: { name: 'Editorial Desk' },
        category: 'Athlete Stories',
        type: 'article',
        createdAt: new Date().toISOString(),
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
        id: "2",
        title: 'SocioSports Podcast: The Hyderabad Badminton Factory',
        excerpt: 'National coaches discuss how Hyderabad became India\'s badminton capital and the future of the sport.',
        image: '/images/podcast_hub.png',
        author: { name: 'Host: Vikram R.' },
        category: 'Podcasts',
        type: 'video',
        createdAt: new Date().toISOString(),
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
        id: "3",
        title: 'The Future of Indian Football: Grassroots in Rural Telangana',
        excerpt: 'How local scouting programs are identifying talent in the smallest villages of the state.',
        image: '/images/rural_football.png',
        author: { name: 'Sanjeev Kumar' },
        category: 'Articles',
        type: 'article',
        createdAt: new Date().toISOString(),
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
        id: "4",
        title: 'Mastering the Smash: Training at Gachibowli Stadium',
        excerpt: 'A professional guide to advanced badminton techniques used by elite athletes in Hyderabad.',
        image: '/images/badminton_action.png',
        author: { name: 'Coach Anjali M.' },
        category: 'Articles',
        type: 'article',
        createdAt: new Date().toISOString(),
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

const BlogPostPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [galleryPhotos, setGalleryPhotos] = useState<string[]>([]);

    useEffect(() => {
        if (!id) return;

        // First check static content
        const staticPost = staticBlogContent.find(p => p.id === id || p.id === (id ? parseInt(id) : NaN).toString());
        if (staticPost) {
            setPost(staticPost);
            setLoading(false);
            return;
        }

        // Then try API
        const fetchPost = async () => {
            try {
                const data = await api.getPost(id);
                if (data && !data.error) {
                    setPost(data);
                    // Parse gallery if exists
                    if (data.gallery) {
                        try {
                            const parsed = JSON.parse(data.gallery);
                            setGalleryPhotos(Array.isArray(parsed) ? parsed : []);
                        } catch {
                            setGalleryPhotos([]);
                        }
                    }
                } else {
                    setError('Post not found');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load post');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-[var(--bg-primary)]">
                <img src="/favicon.png" alt="Loading..." className="w-16 h-16 animate-spin" />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen pt-32 pb-20 px-6 bg-[var(--bg-primary)] text-center">
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">{error || 'Post not found'}</h2>
                <button onClick={() => navigate('/blog')} className="btn-secondary gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Blog
                </button>
            </div>
        );
    }

    return (
        <main className="bg-[var(--bg-primary)] min-h-screen">
            <div className="relative pt-24 pb-16">
                {/* Header Image */}
                {post.image && (
                    <div className="w-full h-[50vh] md:h-[60vh] relative mb-8 overflow-hidden">
                        <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/images/sow_generic.png' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/30 to-transparent" />
                    </div>
                )}

                <article className="container mx-auto px-4 md:px-6 max-w-3xl">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/blog')}
                        className="mb-6 flex items-center gap-2 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--accent-orange)] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Knowledge Hub
                    </button>

                    {/* Category & Date */}
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-4 py-1.5 rounded-full bg-[var(--accent-orange)]/10 border border-[var(--accent-orange)]/30 text-[11px] font-black uppercase tracking-widest text-[var(--accent-orange)]">
                            {post.category || 'Article'}
                        </span>
                        <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)]">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(post.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl md:text-4xl font-black text-[var(--text-primary)] mb-6 leading-tight tracking-tight">
                        {post.title}
                    </h1>

                    {/* Author & Actions */}
                    <div className="flex items-center justify-between py-5 border-y border-[var(--border)] mb-10">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center border border-[var(--border)]">
                                <User className="w-5 h-5 text-[var(--text-secondary)]" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-[var(--text-primary)]">{post.author?.name || 'SocioSports Editorial'}</p>
                                <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">Author</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors" aria-label="Share">
                                <Share2 className="w-4 h-4 text-[var(--text-secondary)]" />
                            </button>
                            <button className="p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors" aria-label="Bookmark">
                                <Bookmark className="w-4 h-4 text-[var(--text-secondary)]" />
                            </button>
                        </div>
                    </div>

                    {/* Video Player */}
                    {post.video && (
                        <div className="mb-10 rounded-2xl overflow-hidden border border-[var(--border)] bg-black">
                            <div className="flex items-center gap-2 px-4 py-3 bg-[var(--bg-secondary)] border-b border-[var(--border)]">
                                <VideoIcon className="w-4 h-4 text-[var(--accent-orange)]" />
                                <span className="text-sm font-bold text-[var(--text-primary)]">Video Content</span>
                            </div>
                            <video controls className="w-full">
                                <source src={post.video} type="video/mp4" />
                                <source src={post.video} type="video/webm" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    )}

                    {/* Audio Player */}
                    {post.audio && (
                        <div className="mb-10 p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]">
                            <div className="flex items-center gap-2 mb-4">
                                <Music className="w-5 h-5 text-[var(--accent-orange)]" />
                                <span className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Podcast / Audio</span>
                            </div>
                            <audio controls className="w-full">
                                <source src={post.audio} type="audio/mpeg" />
                                <source src={post.audio} type="audio/wav" />
                                <source src={post.audio} type="audio/ogg" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    )}

                    {/* Content - Clean Readable Typography */}
                    <div className="article-content">
                        {post.content.split('\n').map((para: string, i: number) => {
                            // Check if it's a heading (starts with # or all caps short line)
                            if (para.startsWith('# ') || para.startsWith('## ')) {
                                const level = para.startsWith('## ') ? 2 : 1;
                                const text = para.replace(/^#+ /, '');
                                return level === 1 ? (
                                    <h2 key={i} className="text-xl md:text-2xl font-black text-[var(--text-primary)] mt-10 mb-4 tracking-tight">
                                        {text}
                                    </h2>
                                ) : (
                                    <h3 key={i} className="text-lg md:text-xl font-bold text-[var(--text-primary)] mt-8 mb-3 tracking-tight">
                                        {text}
                                    </h3>
                                );
                            }
                            // Check if it's a bullet point
                            if (para.startsWith('- ') || para.startsWith('• ')) {
                                return (
                                    <div key={i} className="flex gap-3 mb-3 pl-4">
                                        <span className="text-[var(--accent-orange)] mt-1.5">•</span>
                                        <p className="text-base text-[var(--text-secondary)] leading-relaxed flex-1">
                                            {para.replace(/^[-•] /, '')}
                                        </p>
                                    </div>
                                );
                            }
                            // Regular paragraph
                            if (para.trim()) {
                                return (
                                    <p key={i} className="text-base md:text-lg text-[var(--text-secondary)] mb-5 leading-[1.8] font-medium">
                                        {para}
                                    </p>
                                );
                            }
                            return null;
                        })}
                    </div>

                    {/* Photo Gallery */}
                    {galleryPhotos.length > 0 && (
                        <div className="mt-12 pt-10 border-t border-[var(--border)]">
                            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6 uppercase tracking-tight">Photo Gallery</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {galleryPhotos.map((photo, idx) => (
                                    <div key={idx} className="relative group overflow-hidden rounded-xl border border-[var(--border)] aspect-square">
                                        <img
                                            src={photo}
                                            alt={`Gallery ${idx + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">Photo {idx + 1}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Engagement Section */}
                    <div className="mt-12 pt-8 border-t border-[var(--border)]">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent-orange)]/50 transition-colors">
                                    <ThumbsUp className="w-4 h-4 text-[var(--text-secondary)]" />
                                    <span className="text-sm font-bold text-[var(--text-secondary)]">Like</span>
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent-orange)]/50 transition-colors">
                                    <MessageCircle className="w-4 h-4 text-[var(--text-secondary)]" />
                                    <span className="text-sm font-bold text-[var(--text-secondary)]">Comment</span>
                                </button>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-orange)]/10 border border-[var(--accent-orange)]/30 hover:bg-[var(--accent-orange)]/20 transition-colors">
                                <Share2 className="w-4 h-4 text-[var(--accent-orange)]" />
                                <span className="text-sm font-bold text-[var(--accent-orange)]">Share</span>
                            </button>
                        </div>
                    </div>

                    {/* Related CTA */}
                    <div className="mt-12 p-6 md:p-8 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] text-center">
                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Want more stories like this?</h3>
                        <p className="text-sm text-[var(--text-secondary)] mb-4">Join our community and get the latest updates on sports, athletes, and events.</p>
                        <button
                            onClick={() => navigate('/community')}
                            className="btn-primary px-6 py-3 text-sm font-bold"
                        >
                            Join the Community
                        </button>
                    </div>
                </article>
            </div>
            <SimpleFooter />
        </main>
    );
};

export default BlogPostPage;
