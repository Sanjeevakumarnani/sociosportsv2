
import { PrismaClient } from '@prisma/client';
import process from 'process';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting Full Data Seed...');

    // ==========================================
    // 1. PAGE CONTENT (CMS JSON)
    // ==========================================

    const homeHeroContent = JSON.stringify({
        taglines: [
            { line1: 'PLAY.', line2: 'TRAIN.', line3: 'BELONG.' },
            { line1: 'COMPETE.', line2: 'EXCEL.', line3: 'WIN.' },
            { line1: 'LEARN.', line2: 'GROW.', line3: 'ACHIEVE.' },
            { line1: 'CONNECT.', line2: 'INSPIRE.', line3: 'THRIVE.' },
            { line1: 'DISCOVER.', line2: 'CHALLENGE.', line3: 'SUCCEED.' },
            { line1: 'PRACTICE.', line2: 'PERFECT.', line3: 'PERFORM.' },
        ],
        heroImages: [
            { src: 'hero_action.jpg', alt: 'Sports action', sport: 'Action' },
            { src: 'hero_badminton.jpg', alt: 'Badminton', sport: 'Badminton' },
            { src: 'hero_basketball.jpg', alt: 'Basketball', sport: 'Basketball' },
            { src: 'hero_football.jpg', alt: 'Football', sport: 'Football' },
            { src: 'hero_tennis.jpg', alt: 'Tennis', sport: 'Tennis' },
        ],
        stats: [
            { value: '95%', label: 'Athletes have ZERO digital presence', detail: 'Talent remains invisible to scouts' },
            { value: '143', label: 'Tournaments monthly in Mumbai', detail: 'Most athletes miss 90% of opportunities' },
            { value: '80%', label: 'Quit sports by age 15', detail: 'Not from lost passion, but lost direction' },
            { value: '50K+', label: 'Unfilled tournament slots', detail: 'Information gap bridging needed' },
        ]
    });

    await prisma.pageContent.upsert({
        where: { slug: 'home-hero' },
        update: { content: homeHeroContent },
        create: {
            slug: 'home-hero',
            title: 'Home Page Hero Section',
            content: homeHeroContent
        }
    });

    // --- Home Ecosystem ---
    await prisma.pageContent.upsert({
        where: { slug: 'home-ecosystem' },
        update: {},
        create: {
            slug: 'home-ecosystem',
            title: 'Home Page Ecosystem Section',
            content: JSON.stringify({
                cards: [
                    {
                        title: "Sports Networking",
                        subtitle: "Connect. Discover. Grow.",
                        description: "Build trusted connections with athletes, coaches, and professionals. Share your journey and grow your visibility.",
                        iconName: "Network",
                        color: "var(--accent-orange)",
                        link: "/community",
                        cta: "Explore Networking",
                        features: ["Connect with Pros", "Discover Opportunities", "Share Profile"]
                    },
                    {
                        title: "Trainers Ecosystem",
                        subtitle: "Visibility. Credibility. Income.",
                        description: "Professionalize your coaching career. Get discovered by students and institutions, manage bookings, and track progress.",
                        iconName: "Activity",
                        color: "#3b82f6",
                        link: "/coaches",
                        cta: "Become a Trainer",
                        features: ["Certified Profile", "Student Mapping", "Income Tracking"]
                    },
                    {
                        title: "Athletes Ecosystem",
                        subtitle: "Recognition. Opportunities. Career.",
                        description: "A permanent digital home for your achievements. verified stats, video highlights, and direct access to recruiters.",
                        iconName: "Trophy",
                        color: "#10b981",
                        link: "/athletes",
                        cta: "Create Profile",
                        features: ["Digital Resume", "Video Uploads", "Scout Visibility"]
                    }
                ]
            })
        }
    });

    // --- Home Inspiration ---
    await prisma.pageContent.upsert({
        where: { slug: 'home-inspiration' },
        update: {},
        create: {
            slug: 'home-inspiration',
            title: 'Home Page Inspiration Section',
            content: JSON.stringify({
                heading: "SOME JOURNEYS BEGIN QUIETLY",
                subHeading: "But they change everything.",
                slides: [
                    {
                        title: "The Beginning",
                        text: "There was a penguin who didn't wait to be ready. No applause. No guarantees. Just a belief that standing still wouldn't take him anywhere."
                    },
                    {
                        title: "The Climb",
                        text: "Every step felt heavy. Every climb felt uncertain. But with each move forward, confidence followed. That's what building a career in sports really looks like."
                    },
                    {
                        title: "The Purpose",
                        text: "Slow days. Hard lessons. Small wins that mean everything. SocioSports is for those moments. When you're unsure, but still moving. When you're learning, growing, and choosing progress over comfort."
                    }
                ]
            })
        }
    });

    // --- Sports On Wheels ---
    await prisma.pageContent.upsert({
        where: { slug: 'sports-on-wheels' },
        update: {},
        create: {
            slug: 'sports-on-wheels',
            title: 'Sports On Wheels Page',
            content: JSON.stringify({
                features: [
                    { iconName: 'Clock', title: '60-Minute Setup', desc: 'Rapid deployment infrastructure that turns any vacant space into a professional arena in under an hour.' },
                    { iconName: 'Trophy', title: 'Elite Equipment', desc: 'International-grade gear for 12+ sports, from professional boundary ropes to electronic scoring systems.' },
                    { iconName: 'Users', title: 'Certified Officials', desc: 'NIS-certified coaches and international-standard referees to manage your tournaments and clinics.' },
                    { iconName: 'Shield', title: 'Safety Guaranteed', desc: 'Compliance with international sports safety standards for both equipment and on-ground management.' }
                ],
                sectors: [
                    {
                        id: 'residential',
                        title: 'Housing Societies',
                        image: '/images/sow_01.jpg',
                        iconName: 'Home',
                        points: [
                            'Weekend sports carnivals',
                            'Professional coaching at your doorstep',
                            'Community bonding events',
                            'Safe, supervised play for kids'
                        ]
                    },
                    {
                        id: 'educational',
                        title: 'Schools & Colleges',
                        image: '/images/sow_03.jpg',
                        iconName: 'School',
                        points: [
                            'Annual sports day infrastructure',
                            'Specialized workshop series',
                            'Inter-school championship hosting',
                            'Professional match-officiating services'
                        ]
                    },
                    {
                        id: 'corporate',
                        title: 'Corporate Parks',
                        image: '/images/sow_04.jpg',
                        iconName: 'Briefcase',
                        points: [
                            'Employee wellness tournaments',
                            'Team building through sport',
                            'Themed sports festivals',
                            'Full tournament logistics management'
                        ]
                    }
                ],
                eventFlow: [
                    { step: '01', title: 'Request an Event', desc: 'Tell us your location, audience, and goals.' },
                    { step: '02', title: 'Planning & Customization', desc: 'We design a tailored experience matching your needs.' },
                    { step: '03', title: 'Event Day', desc: 'Our team arrives with Sports-on-Wheels.' },
                    { step: '04', title: 'Execution', desc: 'Professional management ensures smooth operations.' }
                ],
                safetyItems: [
                    'Trained coordinators and first-aid support',
                    'Equipment safety checks and maintenance',
                    'Age-appropriate activity planning',
                    'Emergency protocols in place',
                    'Insurance coverage for all participants'
                ]
            })
        }
    });

    // --- About Us ---
    await prisma.pageContent.upsert({
        where: { slug: 'about-us' },
        update: {},
        create: {
            slug: 'about-us',
            title: 'About Us Page',
            content: JSON.stringify({
                missionPoints: [
                    { title: 'Empowerment', desc: 'Digital identity for athletes.', iconName: 'Award' },
                    { title: 'Sustainability', desc: 'Sustainable sports careers.', iconName: 'Target' },
                    { title: 'Participation', desc: 'Sports on Wheels access.', iconName: 'Users' },
                    { title: 'Revitalization', desc: 'Reviving physical bonding.', iconName: 'Zap' },
                    { title: 'Connectivity', desc: 'Linking the entire network.', iconName: 'Heart' },
                ],
                coreValues: [
                    { title: 'Community First', desc: 'Strengthening real-world bonds.', iconName: 'Users' },
                    { title: 'Health & Wellness', desc: 'Active engagement focus.', iconName: 'Sparkles' },
                    { title: 'Inclusivity', desc: 'Spaces where everyone thrives.', iconName: 'Target' },
                    { title: 'Joy in Movement', desc: 'Accessible fun for all.', iconName: 'Eye' },
                    { title: 'Trust & Safety', desc: 'Managed professional events.', iconName: 'Shield' },
                ],
                companyInfo: [
                    { label: 'Company Name', value: 'ViranAI Solutions' },
                    { label: 'Brand', value: 'SocioSports' },
                    { label: 'Headquarters', value: 'Hyderabad, India' },
                    { label: 'Founded', value: '2023' },
                ]
            })
        }
    });

    // --- Jobs Page ---
    await prisma.pageContent.upsert({
        where: { slug: 'jobs-page' },
        update: {},
        create: {
            slug: 'jobs-page',
            title: 'Jobs Page Content',
            content: JSON.stringify({
                hero: {
                    title: 'BUILD THE FUTURE OF SPORTS.',
                    description: 'Join the team revolutionizing India\'s sports ecosystem. We are looking for passionate individuals to drive our mission forward.'
                },
                jobs: [
                    {
                        id: 1,
                        role: 'Event Coordinator',
                        org: 'SocioSports Operations',
                        location: 'Hyderabad, On-site',
                        type: 'Full-time',
                        salary: '₹4.5L - ₹6L',
                        desc: 'Manage end-to-end execution of our SportsOnWheels tournaments. Coordinate with vendors, athletes, and ground staff.',
                        requirements: ['3+ years event management experience', 'Strong operational leadership skills', 'Willingness to travel on weekends']
                    }
                ]
            })
        }
    });

    // --- Vendors Page ---
    await prisma.pageContent.upsert({
        where: { slug: 'vendors-page' },
        update: {},
        create: {
            slug: 'vendors-page',
            title: 'Vendors Page Content',
            content: JSON.stringify({
                hero: {
                    subtitle: 'Partner Gateway',
                    title: 'SCALE YOUR BUSINESS.',
                    description: 'Join India\'s premier sports ecosystem. Access massive footfall, build institutional credibility, and connect directly with verified athletes.'
                },
                benefits: [
                    {
                        title: 'Direct Monetization',
                        desc: 'Turn spectators into customers. Sell gear, supplements, and services directly to an active audience.',
                        stats: '3-4x ROI'
                    },
                    {
                        title: 'Brand Visibility',
                        desc: 'Position your brand in the heart of high-performance tournament environments across India.',
                        stats: '5k+ Monthly Reach'
                    },
                    {
                        title: 'Verified Audience',
                        desc: 'Connect with a curated network of professional athletes, certified coaches, and sports enthusiasts.',
                        stats: '100% Verified Users'
                    }
                ],
                stallTypes: [
                    {
                        name: 'Retail Pop-up',
                        image: '/images/vendor_retail_indian.png',
                        desc: 'Maximum exposure for sports gear and apparel. Positioned in high-visibility dugout exits.',
                        features: ['10x10 FT Tent', '2 Display Tables', 'Branding Fascia']
                    },
                    {
                        name: 'Nutrition Station',
                        image: '/images/vendor_nutrition_indian.png',
                        desc: 'Located at hydration points. Perfect for energy drinks, snacks, and recovery supplements.',
                        features: ['8x8 FT Booth', 'Power Supply (15A)', 'Storage Zone']
                    }
                ],
                steps: [
                    { step: '01', title: 'Register', desc: 'Secure your spot through our digital portal.' },
                    { step: '02', title: 'Approve', desc: 'Our team verifies your business profile.' },
                    { step: '03', title: 'Setup', desc: 'Professional setup conducted before start.' },
                    { step: '04', title: 'Profit', desc: 'Connect and monetize at the event.' },
                ]
            })
        }
    });

    // --- Mobile App Page ---
    await prisma.pageContent.upsert({
        where: { slug: 'mobile-app' },
        update: {},
        create: {
            slug: 'mobile-app',
            title: 'Mobile App Page Content',
            content: JSON.stringify({
                hero: {
                    title: 'YOUR SPORTS IN YOUR POCKET.',
                    subtitle: 'Available Now',
                    description: 'The full power of the SocioSports ecosystem. Verified stats, instant bookings, and community connection.',
                    androidLink: '#',
                    iosLink: '#'
                },
                modal: {
                    title: "Shhh... You're Early.",
                    subtitle: 'Stealth Mode',
                    description: 'The ultimate sports ecosystem is currently in Stealth Mode. We are crafting an experience that will redefine how you play. Access is rolling out soon.'
                },
                features: [
                    { title: "Verified Sports ID", desc: "Your digital passport for tournaments and trials." },
                    { title: "Smart Alerts", desc: "Instant notifications for tournament registrations and results." },
                    { title: "Live Scores", desc: "Real-time updates from ongoing matches in your network." },
                    { title: "Easy Booking", desc: "Book turfs, coaches, and events in 3 taps." }
                ],
                steps: [
                    { step: 'Step 1', title: 'Create Profile' },
                    { step: 'Step 2', title: 'Discover & Connect' },
                    { step: 'Step 3', title: 'Book & Play' },
                    { step: 'Step 4', title: 'Grow & Earn' }
                ]
            })
        }
    });

    // ==========================================
    // 2. EVENTS (SQL Table)
    // ==========================================
    const events = [
        {
            title: 'Hyderabad District Badminton Championship',
            location: 'Gachibowli Stadium, Hyderabad',
            date: new Date('2026-02-12'),
            type: 'Ranking Tournament',
            image: '/images/event_badminton.jpg',
            description: 'The official district selection tournament. Categories: U13, U15, U17, U19, and Seniors.',
            price: 1500
        },
        {
            title: 'Corporate Cricket League - Season 5',
            location: 'Gymkhana Grounds, Mumbai',
            date: new Date('2026-02-21'),
            type: 'Corporate',
            image: '/images/event_cricket.jpg',
            description: 'Mumbai\'s premier corporate cricket showdown. 16 Teams. Pink ball format under lights.',
            price: 25000
        },
        {
            title: 'Summer Swimming Gala (U-16)',
            location: 'Olympic Pool, Jubilee Hills',
            date: new Date('2026-03-05'),
            type: 'Juniors',
            image: '/images/event_swimming.jpg',
            description: 'A dedicated gala for rising stars. 50m and 100m freestyle, breaststroke, and relays.',
            price: 500
        }
    ];

    for (const event of events) {
        const existing = await prisma.event.findFirst({ where: { title: event.title } });
        if (!existing) {
            await prisma.event.create({ data: event });
        }
    }

    // ==========================================
    // 3. TEAM MEMBERS (SQL Table)
    // ==========================================
    const team = [
        {
            name: 'Phanindra KKV',
            role: 'Founder & Chief Executive Officer',
            image: '/images/team_phanindra.png',
            bio: 'IIM Business Management graduate with 15 years of experience. Founder of MaxPark with Revenue of ₹1.6 Cr. Executed Government Projects including ISRO/BDL Project Experience.',
            category: 'LEADERSHIP',
            linkedin: '#'
        },
        {
            name: 'MD Javeed (Scientist)',
            role: 'Technology & Innovation Director',
            image: '/images/team_javeed.jpg',
            bio: 'Scientist & Guinness World Record Achiever. 12 International Research Awards & 70 International Research Articles. 12 Patents. Pillars of India Award.',
            category: 'LEADERSHIP',
            linkedin: '#'
        },
        {
            name: 'M Srinivas (Trainer)',
            role: 'Head of Sports Events & Training',
            image: '',
            bio: 'Sports Authority Telangana. 15+ Years Experience. Trained 40,000 Athletes. Medal-Winning Trainees. Large Event Specialist from 100 to 10,000 users.',
            category: 'LEADERSHIP',
            linkedin: '#'
        },
        {
            name: 'Shri Dr. N.S. Dileep, Ph.D.',
            role: 'Academic & University Sports Advisor',
            image: '',
            bio: 'Professor & Physical Director – Jawaharlal Nehru Technological University (JNTU). A highly respected academician, sports administrator, and physical education leader with decades of experience in developing university-level sports ecosystems. Known for his discipline, integrity, and commitment to excellence.',
            category: 'ADVISOR',
            linkedin: '#'
        },
        {
            name: 'T Vijaya Kumar',
            role: 'Mentor & Strategic Advisor – Business Growth',
            image: '',
            bio: 'Retired IAS Officer with extensive experience in governance, urban development, and education administration. Served as Commissioner in Education Department, Telangana Government. Held key positions including Vice Chancellor of Mahatma Gandhi University.',
            category: 'ADVISOR',
            linkedin: '#'
        }
    ];

    for (const member of team) {
        const existing = await prisma.teamMember.findFirst({ where: { name: member.name } });
        if (!existing) {
            await prisma.teamMember.create({ data: member });
        }
    }

    // ==========================================
    // 4. BLOG POSTS (SQL Table)
    // ==========================================
    // We need an author first. Let's ensure the default admin user exists and has the correct password.

    // Password: Admin@2026 (hashed with bcrypt 10 rounds)
    const adminEmail = 'admin@sociosports.com';
    const adminPasswordHash = '$2a$10$7Q9XQJj8W5Vp/MvF/h1P0u7C17R5o7v6H8mE2G3V4i5J6K7L8M9N.'; // Placeholder, will fix if needed but better to just use bcrypt in script

    // Using upsert to ensure the admin exists AND has the correct role/password
    const adminUser = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            role: 'ADMIN',
            name: 'System Admin'
            // We'll calculate the hash at runtime in the script below to be 100% sure
        },
        create: {
            email: adminEmail,
            name: 'System Admin',
            role: 'ADMIN',
            password: 'temporary-placeholder'
        }
    });

    // Update password separately to ensure it matches bcryptjs implementation exactly
    const bcrypt = require('bcryptjs');
    const finalHash = bcrypt.hashSync('Admin@2026', 10);
    await prisma.user.update({
        where: { id: adminUser.id },
        data: { password: finalHash }
    });

    const posts = [
        {
            title: 'The Future of Grassroots Sports in India',
            content: 'India is witnessing a revolution in sports at the grassroots level. With better infrastructure and digital connectivity...',
            category: 'Industry',
            status: 'PUBLISHED',
            image: '/images/blog_grassroots.jpg',
            authorId: adminUser.id
        },
        {
            title: 'Top 5 Nutrition Tips for Young Athletes',
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
- Build habits that you can maintain long-term.`,
            category: 'Health',
            status: 'PUBLISHED',
            image: '/images/blog_02.jpg',
            authorId: adminUser.id
        },
        {
            title: 'Why Mental Toughness Matters',
            content: 'In high-pressure situations, it is often mental toughness that separates the winners from the rest...',
            category: 'Psychology',
            status: 'DRAFT',
            image: '/images/blog_mental.jpg',
            authorId: adminUser.id
        }
    ];

    for (const post of posts) {
        const existing = await prisma.post.findFirst({ where: { title: post.title } });
        if (!existing) {
            await prisma.post.create({ data: post });
        }
    }

    // ==========================================
    // 5. JOBS (SQL Table)
    // ==========================================
    const jobRecords = [
        {
            title: 'Elite Cricket Coach',
            location: 'Mumbai, Maharashtra',
            type: 'FULL_TIME',
            description: 'We are looking for an NIS certified cricket coach to lead our regional academy program.',
            requirements: 'NIS Certification, 5+ years experience, State-level playing background preferred.',
            category: 'COACHING_POSITION',
            organization: 'SocioSports Academy',
            salary: '₹60,000 - ₹80,000 per month',
            isActive: true
        },
        {
            title: 'Professional Badminton Sparring Partner',
            location: 'Hyderabad, Telangana',
            type: 'PART_TIME',
            description: 'Looking for high-level sparring partners for our elite athlete program.',
            requirements: 'National-level participation, available mornings/evenings.',
            category: 'ATHLETE_OPPORTUNITY',
            organization: 'ViranAI Sports Hub',
            salary: '₹1,500 per session',
            isActive: true
        }
    ];

    for (const job of jobRecords) {
        const existing = await prisma.job.findFirst({ where: { title: job.title } });
        if (!existing) {
            await prisma.job.create({ data: job });
        }
    }

    // ==========================================
    // 6. SPORTS PROFILES — Telangana Athletes & Coaches
    // ==========================================
    const sportsProfiles = [
        // --- ATHLETES ---
        {
            sportsId: 'SOCIO-ATH-1001',
            name: 'Rajesh Kumar Reddy',
            email: 'rajesh.reddy@email.com',
            phone: '9876543210',
            role: 'ATHLETE',
            sport: 'Badminton',
            location: 'Hyderabad, Telangana',
            image: '/images/athlete_profile.jpg',
            dateOfBirth: '2002-03-15',
            height: '178 cm',
            weight: '72 kg',
            experience: '9 years',
            bio: 'A technically gifted singles player with 9 years of competitive badminton experience. Trained at the Pullela Gopichand Academy and has represented Telangana in multiple national-level tournaments. Known for sharp net play and deceptive drop shots.',
            achievements: JSON.stringify([
                { title: 'TELANGANA STATE SENIOR RANKING', result: 'Winner (Singles)', organization: 'Telangana Badminton Association', year: '2025', type: 'STATE' },
                { title: 'ALL INDIA INTER-UNIVERSITY CHAMPIONSHIP', result: 'Semi-Finalist', organization: 'AIU / Osmania University', year: '2024', type: 'NATIONAL' },
                { title: 'GACHIBOWLI OPEN BADMINTON', result: 'Runner-Up', organization: 'GHMC Sports Council', year: '2024', type: 'DISTRICT' },
                { title: 'UNDER-19 SOUTH ZONE CHAMPIONSHIP', result: 'Quarter-Finalist', organization: 'BAI South Zone', year: '2021', type: 'ZONAL' }
            ]),
            trainingHistory: JSON.stringify([
                { academy: 'Pullela Gopichand Badminton Academy', location: 'Gachibowli, Hyderabad', period: '2018 – 2022', coach: 'P. Gopichand (Head Coach)' },
                { academy: 'SAI Regional Training Centre', location: 'Hyderabad', period: '2022 – Present', coach: 'K. Ramesh Babu' }
            ]),
            socialLinks: JSON.stringify({ instagram: '@rajesh_badminton', twitter: '@rajeshkr_bwf', youtube: '', linkedin: 'linkedin.com/in/rajeshkumarreddy' }),
            skills: JSON.stringify(['Sports Coaching', 'Team Leadership', 'Physical Fitness', 'First Aid', 'Event Organization', 'Communication']),
            languages: JSON.stringify([{ name: 'English', level: 90 }, { name: 'Telugu', level: 100 }, { name: 'Hindi', level: 80 }]),
            hobbies: JSON.stringify(['Basketball', 'Running', 'Swimming', 'Reading Sports Literature', 'Volunteering']),
            references: JSON.stringify([{ name: 'Pullela Gopichand', title: 'Head Coach, PGBA', contact: '+91 40 1234 5678' }, { name: 'K. Ramesh Babu', title: 'Chief Coach, SAI', contact: 'ramesh.babu@sai.gov.in' }])
        },
        {
            sportsId: 'SOCIO-ATH-1002',
            name: 'Sai Priya Devi',
            email: 'saipriya.devi@email.com',
            phone: '9123456789',
            role: 'ATHLETE',
            sport: 'Athletics (400m Sprint)',
            location: 'Warangal, Telangana',
            image: '/images/warangal_sprinter.png',
            dateOfBirth: '2001-07-22',
            height: '168 cm',
            weight: '58 kg',
            experience: '7 years',
            bio: 'A powerful 400m sprinter who rose from the dusty tracks of Warangal to represent India at the Asian Junior Athletics Championship. Her explosive start and relentless endurance have made her one of Telangana\'s most promising track athletes. Dreams of qualifying for the 2028 Olympics.',
            achievements: JSON.stringify([
                { title: 'ASIAN JUNIOR ATHLETICS CHAMPIONSHIP', result: 'Bronze Medal (4x400m Relay)', organization: 'Asian Athletics Association', year: '2023', type: 'INTERNATIONAL' },
                { title: 'NATIONAL JUNIOR ATHLETICS CHAMPIONSHIP', result: 'Gold Medal (400m)', organization: 'Athletics Federation of India', year: '2022', type: 'NATIONAL' },
                { title: 'TELANGANA STATE ATHLETICS MEET', result: 'Gold Medal (200m & 400m)', organization: 'Telangana Athletics Association', year: '2024', type: 'STATE' },
                { title: 'INTER-DISTRICT CHAMPIONSHIP', result: 'Winner (4x100m Relay)', organization: 'Warangal District Sports Authority', year: '2021', type: 'DISTRICT' }
            ]),
            trainingHistory: JSON.stringify([
                { academy: 'SAI Training Centre Warangal', location: 'Warangal', period: '2017 – 2020', coach: 'Dr. Padma Rao' },
                { academy: 'Inspire Institute of Sport', location: 'Bellary, Karnataka', period: '2020 – 2022', coach: 'Galina Bukharina (Russian Sprint Coach)' },
                { academy: 'National Camp – AFI', location: 'Patiala', period: '2023', coach: 'National Coach Panel' }
            ]),
            socialLinks: JSON.stringify({ instagram: '@saipriya_runs', twitter: '@saipriya400m', youtube: 'SaiPriyaAthletics', linkedin: 'linkedin.com/in/saipriyadevi' }),
            skills: JSON.stringify(['Sprint Mechanics', 'Endurance Training', 'Mental Conditioning', 'Sports Nutrition']),
            languages: JSON.stringify([{ name: 'English', level: 85 }, { name: 'Telugu', level: 100 }]),
            hobbies: JSON.stringify(['Photography', 'Trekking', 'Cooking']),
            references: JSON.stringify([{ name: 'Dr. Padma Rao', title: 'Chief State Athletics Coach', contact: 'padma.rao@telangana.gov.in' }])
        },
        {
            sportsId: 'SOCIO-ATH-1003',
            name: 'Mohammed Faizan',
            email: 'faizan.cricket@email.com',
            phone: '9234567890',
            role: 'ATHLETE',
            sport: 'Cricket (Right-Arm Fast Bowler)',
            location: 'Karimnagar, Telangana',
            image: '/images/athlete_profile_new.jpg',
            dateOfBirth: '2000-11-08',
            height: '186 cm',
            weight: '82 kg',
            experience: '10 years',
            bio: 'A fiery right-arm fast bowler clocking 140+ kmph consistently. Represented Hyderabad Cricket Association in Ranji Trophy and Syed Mushtaq Ali Trophy. Known for aggressive yorkers and reverse swing on Indian pitches. Selected in IPL trials for Sunrisers Hyderabad in 2024.',
            achievements: JSON.stringify([
                { title: 'RANJI TROPHY SEASON 2024-25', result: '28 Wickets in 7 Matches', organization: 'Hyderabad Cricket Association / BCCI', year: '2025', type: 'NATIONAL' },
                { title: 'SYED MUSHTAQ ALI TROPHY', result: 'Best Bowling: 4/22', organization: 'BCCI', year: '2024', type: 'NATIONAL' },
                { title: 'IPL TRIALS — SRH', result: 'Shortlisted (Top 15)', organization: 'Sunrisers Hyderabad', year: '2024', type: 'FRANCHISE' },
                { title: 'UNDER-23 COL. CK NAYUDU TROPHY', result: 'Player of the Tournament', organization: 'BCCI / HCA', year: '2022', type: 'NATIONAL' },
                { title: 'KARIMNAGAR DISTRICT LEAGUE', result: 'Season MVP', organization: 'Karimnagar District Cricket Association', year: '2021', type: 'DISTRICT' }
            ]),
            trainingHistory: JSON.stringify([
                { academy: 'Hyderabad Cricket Academy', location: 'Uppal, Hyderabad', period: '2016 – 2020', coach: 'V.V.S. Laxman Foundation Coaches' },
                { academy: 'MRF Pace Foundation', location: 'Chennai', period: '2021 – 2022', coach: 'Dennis Lillee Program Alumni' },
                { academy: 'HCA Senior Squad', location: 'Rajiv Gandhi Stadium', period: '2023 – Present', coach: 'Azharuddin Academy Staff' }
            ]),
            socialLinks: JSON.stringify({ instagram: '@faizan_pace', twitter: '@faizancricket', youtube: '', linkedin: 'linkedin.com/in/mohammedfaizan' }),
            skills: JSON.stringify(['Pace Bowling', 'Reverse Swing', 'Cricket Strategy', 'Athlete Conditioning']),
            languages: JSON.stringify([{ name: 'English', level: 80 }, { name: 'Urdu', level: 100 }, { name: 'Telugu', level: 90 }, { name: 'Hindi', level: 90 }]),
            hobbies: JSON.stringify(['Gaming', 'Music', 'Fitness Vlogging']),
            references: JSON.stringify([{ name: 'V.V.S. Laxman', title: 'Mentor, HCA', contact: 'contact@vvslaxman.com' }])
        },
        {
            sportsId: 'SOCIO-ATH-1004',
            name: 'Ananya Sharma',
            email: 'ananya.swim@email.com',
            phone: '9345678901',
            role: 'ATHLETE',
            sport: 'Swimming (Freestyle & Butterfly)',
            location: 'Secunderabad, Telangana',
            image: '',
            dateOfBirth: '2004-01-30',
            height: '172 cm',
            weight: '62 kg',
            experience: '8 years',
            bio: 'An emerging aquatic talent specializing in 100m and 200m Freestyle and Butterfly events. Trained under Olympian coaches at the Secunderabad Swimming Academy. Has broken multiple state records and aims to qualify for the 2026 Asian Games.',
            achievements: JSON.stringify([
                { title: 'NATIONAL AQUATIC CHAMPIONSHIP', result: 'Silver Medal (200m Butterfly)', organization: 'Swimming Federation of India', year: '2024', type: 'NATIONAL' },
                { title: 'TELANGANA STATE AQUATIC MEET', result: '3 Gold Medals (100m Free, 200m Free, 100m Butterfly)', organization: 'Telangana Swimming Association', year: '2025', type: 'STATE' },
                { title: 'SOUTH ZONE AQUATIC CHAMPIONSHIP', result: 'Gold Medal (100m Freestyle)', organization: 'SFI South Zone', year: '2023', type: 'ZONAL' },
                { title: 'KHELO INDIA YOUTH GAMES', result: 'Bronze Medal', organization: 'Sports Authority of India', year: '2022', type: 'NATIONAL' }
            ]),
            trainingHistory: JSON.stringify([
                { academy: 'Secunderabad Swimming Academy', location: 'Secunderabad', period: '2016 – 2021', coach: 'Nihar Ameen' },
                { academy: 'Basavanagudi Aquatic Centre', location: 'Bangalore', period: '2021 – 2023', coach: 'Pradeep Kumar (Former Olympian)' },
                { academy: 'SAI National Camp', location: 'Bangalore', period: '2024 – Present', coach: 'National Coaching Panel' }
            ]),
            socialLinks: JSON.stringify({ instagram: '@ananya_swims', twitter: '', youtube: 'AnanyaSwimsTG', linkedin: 'linkedin.com/in/ananyasharma' }),
            skills: JSON.stringify(['Stroke Correction', 'Starts & Turns', 'Endurance Swimming', 'Water Safety']),
            languages: JSON.stringify([{ name: 'English', level: 95 }, { name: 'Hindi', level: 90 }, { name: 'Telugu', level: 80 }]),
            hobbies: JSON.stringify(['Reading', 'Yoga', 'Animal Welfare']),
            references: JSON.stringify([{ name: 'Nihar Ameen', title: 'Head Coach, SSA', contact: 'nihar.ameen@ssa.com' }])
        },
        {
            sportsId: 'SOCIO-ATH-1005',
            name: 'Venkat Srinivas Goud',
            email: 'venkat.football@email.com',
            phone: '9456789012',
            role: 'ATHLETE',
            sport: 'Football (Central Midfielder)',
            location: 'Nizamabad, Telangana',
            image: '',
            dateOfBirth: '2001-05-18',
            height: '175 cm',
            weight: '70 kg',
            experience: '8 years',
            bio: 'A technically brilliant central midfielder with exceptional vision and passing accuracy. Captained Telangana in the Santosh Trophy qualifiers. Played in the I-League 2nd Division for Deccan FC Hyderabad and is known for his leadership on and off the pitch.',
            achievements: JSON.stringify([
                { title: 'SANTOSH TROPHY QUALIFIERS', result: 'Captain — Telangana State Team', organization: 'AIFF / Telangana Football Association', year: '2024', type: 'NATIONAL' },
                { title: 'I-LEAGUE 2nd DIVISION', result: '12 Appearances, 3 Goals, 5 Assists', organization: 'Deccan FC Hyderabad', year: '2023-24', type: 'NATIONAL' },
                { title: 'TELANGANA PREMIER LEAGUE', result: 'Best Midfielder Award', organization: 'TFA', year: '2023', type: 'STATE' },
                { title: 'INTER-UNIVERSITY FOOTBALL', result: 'Gold Medal (Osmania University)', organization: 'AIU', year: '2022', type: 'NATIONAL' }
            ]),
            trainingHistory: JSON.stringify([
                { academy: 'Deccan FC Youth Academy', location: 'Hyderabad', period: '2017 – 2020', coach: 'Syed Nabi (Former Indian International)' },
                { academy: 'AIFF Elite Academy', location: 'Goa', period: '2020 – 2021', coach: 'Academy Coaching Staff' },
                { academy: 'Deccan FC Senior Team', location: 'Hyderabad', period: '2022 – Present', coach: 'Head Coach — Deccan FC' }
            ]),
            socialLinks: JSON.stringify({ instagram: '@venkat_midfield', twitter: '@venkatsrinivas10', youtube: '', linkedin: 'linkedin.com/in/venkatsrinivasgoud' }),
            skills: JSON.stringify(['Playmaking', 'Set Piece Specialist', 'Tactical Awareness', 'Team Leadership']),
            languages: JSON.stringify([{ name: 'English', level: 85 }, { name: 'Telugu', level: 100 }, { name: 'Hindi', level: 85 }]),
            hobbies: JSON.stringify(['E-Sports', 'Chess', 'Traveling']),
            references: JSON.stringify([{ name: 'Syed Nabi', title: 'Former Indian Footballer', contact: 'nabi.football@aiff.com' }])
        },
        // --- TRAINERS ---
        {
            sportsId: 'SOCIO-TRN-2001',
            name: 'K. Ramesh Babu',
            email: 'ramesh.coach@email.com',
            phone: '9567890123',
            role: 'TRAINER',
            profession: 'Badminton Coach',
            sport: 'Badminton',
            location: 'Gachibowli, Hyderabad',
            image: '/images/coach_card.jpg',
            dateOfBirth: '1978-09-12',
            height: '174 cm',
            weight: '76 kg',
            experience: '18 years',
            bio: 'An NIS-certified badminton coach with 18 years of experience training state and national-level players. Former Telangana state singles champion. Has trained 40+ athletes who have represented India at junior international events. Currently the Head Coach at SAI Regional Centre, Hyderabad.',
            achievements: JSON.stringify([
                { title: 'DRONACHARYA AWARD NOMINEE', result: 'Shortlisted', organization: 'Ministry of Youth Affairs & Sports', year: '2024', type: 'NATIONAL' },
                { title: 'COACHED 12 NATIONAL MEDALISTS', result: '6 Gold, 4 Silver, 2 Bronze', organization: 'BAI National Championships', year: '2018-2025', type: 'NATIONAL' },
                { title: 'TELANGANA STATE SINGLES CHAMPION', result: 'Winner (As Player)', organization: 'TBA', year: '2005', type: 'STATE' }
            ]),
            trainingHistory: JSON.stringify([
                { academy: 'SAI Regional Centre', location: 'Hyderabad', period: '2012 – Present', coach: 'Head Coach' },
                { academy: 'Pullela Gopichand Academy', location: 'Gachibowli', period: '2006 – 2012', coach: 'Assistant Coach' }
            ]),
            certifications: JSON.stringify([
                { name: 'NIS Diploma in Badminton Coaching', issuer: 'National Institute of Sports, Patiala', year: '2006' },
                { name: 'BWF Level 2 Coaching Certificate', issuer: 'Badminton World Federation', year: '2010' },
                { name: 'Sports Science & Nutrition Certificate', issuer: 'NSNIS Bangalore', year: '2015' }
            ]),
            specializations: JSON.stringify(['Singles Strategy', 'Footwork & Agility', 'Junior Development', 'Tournament Preparation']),
            socialLinks: JSON.stringify({ instagram: '@coach_ramesh_bwf', twitter: '', youtube: 'CoachRameshBadminton', linkedin: 'linkedin.com/in/rameshbabuk' }),
            skills: JSON.stringify(['Sports Coaching', 'Talent Scouting', 'Athlete Psychology', 'Video Analysis', 'Curriculum Design']),
            languages: JSON.stringify([{ name: 'English', level: 90 }, { name: 'Telugu', level: 100 }, { name: 'Hindi', level: 85 }]),
            hobbies: JSON.stringify(['Mentoring', 'Sports Literature', 'Meditation']),
            references: JSON.stringify([{ name: 'Pullela Gopichand', title: 'Chief Mentor, PGBA', contact: 'gopichand@pgba.com' }])
        },
        {
            sportsId: 'SOCIO-TRN-2002',
            name: 'Dr. Padma Rao',
            email: 'padma.athletics@email.com',
            phone: '9678901234',
            role: 'TRAINER',
            profession: 'Athletics Coach (Sprints & Hurdles)',
            sport: 'Athletics',
            location: 'LB Nagar, Hyderabad',
            image: '',
            dateOfBirth: '1972-04-05',
            height: '180 cm',
            weight: '78 kg',
            experience: '24 years',
            bio: 'A Ph.D. in Sports Science and one of Telangana\'s most respected athletics coaches. Has trained 3 Arjuna Award recipients and over 200 state-level athletes across sprints, hurdles, and relay events. Known for his scientific approach to training periodization and biomechanical analysis.',
            achievements: JSON.stringify([
                { title: 'DRONACHARYA AWARD', result: 'Recipient', organization: 'Government of India', year: '2020', type: 'NATIONAL' },
                { title: 'COACHED 3 ARJUNA AWARDEES', result: 'Sprint & Hurdle Athletes', organization: 'AFI / SAI', year: '2015-2023', type: 'NATIONAL' },
                { title: 'ASIAN GAMES COACHING STAFF', result: 'Assistant Sprint Coach — Team India', organization: 'Indian Olympic Association', year: '2018', type: 'INTERNATIONAL' },
                { title: '200+ STATE-LEVEL ATHLETES TRAINED', result: 'Across 24 Years', organization: 'Telangana Athletics Association', year: '2000-2025', type: 'STATE' }
            ]),
            trainingHistory: JSON.stringify([
                { academy: 'SAI Training Centre Warangal', location: 'Warangal', period: '2000 – 2010', coach: 'Head Athletics Coach' },
                { academy: 'Sports Authority of Telangana', location: 'LB Nagar, Hyderabad', period: '2010 – Present', coach: 'Chief State Athletics Coach' }
            ]),
            certifications: JSON.stringify([
                { name: 'Ph.D. in Sports Science', issuer: 'Osmania University', year: '2005' },
                { name: 'IAAF Level 3 Coaching Certificate', issuer: 'World Athletics (IAAF)', year: '2008' },
                { name: 'NIS Diploma in Athletics', issuer: 'National Institute of Sports, Patiala', year: '2000' },
                { name: 'Advanced Biomechanics Certificate', issuer: 'Loughborough University, UK', year: '2012' }
            ]),
            specializations: JSON.stringify(['Sprint Biomechanics', 'Hurdle Technique', 'Periodization Planning', 'Youth Talent Identification', 'Relay Exchange Coaching']),
            socialLinks: JSON.stringify({ instagram: '', twitter: '@drpadmarao_coach', youtube: '', linkedin: 'linkedin.com/in/drpadmarao' }),
            skills: JSON.stringify(['Biomechanical Analysis', 'Sports Science Research', 'Periodization', 'Public Speaking', 'Coaching Pedagogy']),
            languages: JSON.stringify([{ name: 'English', level: 95 }, { name: 'Telugu', level: 100 }, { name: 'Hindi', level: 90 }]),
            hobbies: JSON.stringify(['Writing Research Papers', 'Yoga', 'Nature Photography']),
            references: JSON.stringify([{ name: 'President, Athletics Federation of India', title: 'Adille Sumariwalla', contact: 'president@afi.com' }])
        },
        {
            sportsId: 'SOCIO-TRN-2003',
            name: 'Syed Amir Khan',
            email: 'amir.cricket.coach@email.com',
            phone: '9789012345',
            role: 'TRAINER',
            profession: 'Cricket Coach (Pace Bowling)',
            sport: 'Cricket',
            location: 'Tolichowki, Hyderabad',
            image: '/images/coach_hero.png',
            dateOfBirth: '1980-12-20',
            height: '183 cm',
            weight: '85 kg',
            experience: '16 years',
            bio: 'A former Ranji Trophy fast bowler for Hyderabad who transitioned into coaching after a shoulder injury. Specializes in pace bowling technique, swing mechanics, and fast bowler fitness conditioning. Has supplied 8 bowlers to IPL franchises and runs the premier pace bowling academy in Telangana.',
            achievements: JSON.stringify([
                { title: 'SUPPLIED 8 BOWLERS TO IPL FRANCHISES', result: 'SRH (3), DC (2), RCB (1), MI (1), CSK (1)', organization: 'IPL / BCCI', year: '2018-2025', type: 'NATIONAL' },
                { title: 'FORMER RANJI TROPHY PLAYER', result: '62 Wickets in 20 First-Class Matches', organization: 'Hyderabad Cricket Association', year: '2002-2008', type: 'NATIONAL' },
                { title: 'HCA BEST COACH AWARD', result: 'Winner', organization: 'Hyderabad Cricket Association', year: '2023', type: 'STATE' },
                { title: 'COACHED U-19 INDIA CAMP SELECTEES', result: '4 Players Selected', organization: 'BCCI U-19 Selection', year: '2022', type: 'NATIONAL' }
            ]),
            trainingHistory: JSON.stringify([
                { academy: 'Khan Cricket Academy', location: 'Tolichowki, Hyderabad', period: '2009 – Present', coach: 'Founder & Head Coach' },
                { academy: 'HCA Fast Bowling Program', location: 'Rajiv Gandhi Stadium', period: '2015 – Present', coach: 'Lead Pace Bowling Consultant' }
            ]),
            certifications: JSON.stringify([
                { name: 'BCCI Level 3 Coaching Certificate', issuer: 'Board of Control for Cricket in India', year: '2010' },
                { name: 'ECB Pace Bowling Specialist Certificate', issuer: 'England & Wales Cricket Board', year: '2014' },
                { name: 'NIS Diploma in Cricket Coaching', issuer: 'National Institute of Sports, Patiala', year: '2009' },
                { name: 'Sports Injury Management Certificate', issuer: 'NIMS Hyderabad', year: '2016' }
            ]),
            specializations: JSON.stringify(['Pace Bowling Mechanics', 'Swing & Seam Bowling', 'Fast Bowler Conditioning', 'Injury Prevention', 'Match Simulation Training']),
            socialLinks: JSON.stringify({ instagram: '@amirkhan_pace', twitter: '@syedamircoach', youtube: 'KhanCricketAcademy', linkedin: 'linkedin.com/in/syedamirkhan' }),
            skills: JSON.stringify(['Fast Bowling Technical Analysis', 'Swing Mechanics', 'Athlete Motivation', 'Franchise Relations']),
            languages: JSON.stringify([{ name: 'English', level: 85 }, { name: 'Urdu', level: 100 }, { name: 'Hindi', level: 95 }, { name: 'Telugu', level: 80 }]),
            hobbies: JSON.stringify(['Horse Riding', 'Swimming', 'Charity Work']),
            references: JSON.stringify([{ name: 'Arjun Yadav', title: 'HCA Senior Selector', contact: 'arjun.yadav@hca.in' }])
        }
    ];

    for (const profile of sportsProfiles) {
        await prisma.sportsProfile.upsert({
            where: { sportsId: profile.sportsId },
            update: profile,
            create: profile
        });
    }

    console.log('Full Data Seed Completed Successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
