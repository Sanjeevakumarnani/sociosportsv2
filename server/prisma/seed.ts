import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // 1. Ensure Admin User Exists
    const email = 'admin@sociosports.co.in';
    const password = await bcrypt.hash('password123', 10);

    const admin = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            password,
            name: 'Super Admin',
            role: 'ADMIN',
        },
    });

    console.log({ admin });

    // 2. Seed Content Pages
    const pages = [
        {
            slug: 'home-hero',
            title: 'Home Hero Section',
            content: {
                taglines: [
                    { line1: 'PLAY.', line2: 'TRAIN.', line3: 'BELONG.' },
                    { line1: 'COMPETE.', line2: 'EXCEL.', line3: 'WIN.' },
                    { line1: 'LEARN.', line2: 'GROW.', line3: 'ACHIEVE.' },
                    { line1: 'CONNECT.', line2: 'INSPIRE.', line3: 'THRIVE.' },
                    { line1: 'DISCOVER.', line2: 'CHALLENGE.', line3: 'SUCCEED.' },
                    { line1: 'PRACTICE.', line2: 'PERFECT.', line3: 'PERFORM.' },
                ],
                heroImages: [
                    { src: 'hero_action.jpg', alt: 'Hero action', sport: 'Sports' },
                    { src: 'hero_athlete.jpg', alt: 'Athlete performance', sport: 'Athletics' },
                    { src: 'hero_track.jpg', alt: 'Track racing', sport: 'Racing' },
                ],
                stats: [
                    { value: '95%', label: 'Athletes have ZERO digital presence', detail: 'Talent remains invisible to scouts' },
                    { value: '143', label: 'Tournaments monthly in Mumbai', detail: 'Most athletes miss 90% of opportunities' },
                    { value: '80%', label: 'Quit sports by age 15', detail: 'Not from lost passion, but lost direction' },
                    { value: '50K+', label: 'Unfilled tournament slots', detail: 'Information gap bridging needed' },
                ]
            }
        },
        {
            slug: 'about-us',
            title: 'About Us Page',
            content: {
                missionPoints: [
                    { title: 'Empowerment', desc: 'Digital identity for athletes.' },
                    { title: 'Sustainability', desc: 'Sustainable sports careers.' },
                    { title: 'Participation', desc: 'Sports on Wheels access.' },
                    { title: 'Revitalization', desc: 'Reviving physical bonding.' },
                    { title: 'Connectivity', desc: 'Linking the entire network.' },
                ],
                coreValues: [
                    { title: 'Community First', desc: 'Strengthening real-world bonds.' },
                    { title: 'Health & Wellness', desc: 'Active engagement focus.' },
                    { title: 'Inclusivity', desc: 'Spaces where everyone thrives.' },
                    { title: 'Joy in Movement', desc: 'Accessible fun for all.' },
                    { title: 'Trust & Safety', desc: 'Managed professional events.' },
                ],
                companyInfo: [
                    { label: 'Company Name', value: 'ViranAI Solutions' },
                    { label: 'Brand', value: 'SocioSports' },
                    { label: 'Headquarters', value: 'Hyderabad, India' },
                    { label: 'Founded', value: '2023' },
                ],
                leadership: [
                    {
                        name: 'Phanindra KKV',
                        role: 'Founder & Chief Executive Officer',
                        image: '/images/team_phanindra.png',
                        bio: 'IIM Business Management graduate with 15 years of experience. Founder of MaxPark with Revenue of ₹1.6 Cr. Executed Government Projects including ISRO/BDL Project Experience.',
                        quote: 'SocioSports helps sportsmen build careers, recognition and income, not just participate in events.',
                        linkedin: '#'
                    },
                    {
                        name: 'MD Javeed (Scientist)',
                        role: 'Technology & Innovation Director',
                        image: '/images/team_javeed.jpg',
                        bio: 'Scientist & Guinness World Record Achiever. 12 International Research Awards & 70 International Research Articles. 12 Patents. Pillars of India Award.',
                        linkedin: '#'
                    },
                    {
                        name: 'M Srinivas (Trainer)',
                        role: 'Head of Sports Events & Training',
                        image: '',
                        bio: 'Sports Authority Telangana. 15+ Years Experience. Trained 40,000 Athletes. Medal-Winning Trainees. Large Event Specialist from 100 to 10,000 users.',
                        linkedin: '#'
                    }
                ]
            }
        },
        {
            slug: 'mobile-app',
            title: 'Mobile App Page',
            content: {
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
            }
        },
        {
            slug: 'sports-on-wheels',
            title: 'Sports On Wheels Page',
            content: {
                features: [
                    { title: '60-Minute Setup', desc: 'Rapid deployment infrastructure that turns any vacant space into a professional arena in under an hour.' },
                    { title: 'Elite Equipment', desc: 'International-grade gear for 12+ sports, from professional boundary ropes to electronic scoring systems.' },
                    { title: 'Certified Officials', desc: 'NIS-certified coaches and international-standard referees to manage your tournaments and clinics.' },
                    { title: 'Safety Guaranteed', desc: 'Compliance with international sports safety standards for both equipment and on-ground management.' }
                ],
                sectors: [
                    {
                        id: 'residential',
                        title: 'Housing Societies',
                        image: '/images/sow_01.jpg',
                        points: ['Weekend sports carnivals', 'Professional coaching at your doorstep', 'Community bonding events', 'Safe, supervised play for kids']
                    },
                    {
                        id: 'educational',
                        title: 'Schools & Colleges',
                        image: '/images/sow_03.jpg',
                        points: ['Annual sports day infrastructure', 'Specialized workshop series', 'Inter-school championship hosting', 'Professional match-officiating services']
                    },
                    {
                        id: 'corporate',
                        title: 'Corporate Parks',
                        image: '/images/sow_04.jpg',
                        points: ['Employee wellness tournaments', 'Team building through sport', 'Themed sports festivals', 'Full tournament logistics management']
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
            }
        },
        {
            slug: 'vendors-page',
            title: 'Vendors Page',
            content: {
                hero: {
                    subtitle: 'Partner Gateway',
                    title: 'SCALE YOUR BUSINESS.',
                    description: 'Join India\'s premier sports ecosystem. Access massive footfall, build institutional credibility, and connect directly with verified athletes.'
                },
                benefits: [
                    { title: 'Direct Monetization', desc: 'Turn spectators into customers. Sell gear, supplements, and services directly to an active audience.', stats: '3-4x ROI' },
                    { title: 'Brand Visibility', desc: 'Position your brand in the heart of high-performance tournament environments across India.', stats: '5k+ Monthly Reach' },
                    { title: 'Verified Audience', desc: 'Connect with a curated network of professional athletes, certified coaches, and sports enthusiasts.', stats: '100% Verified Users' }
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
            }
        },
        {
            slug: 'jobs-page',
            title: 'Jobs Page',
            content: {
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
            }
        },
        {
            slug: 'global-settings',
            title: 'Global Settings',
            content: {
                socials: {
                    instagram: 'https://instagram.com/sociosports',
                    linkedin: 'https://linkedin.com/company/sociosports',
                    twitter: '#',
                    youtube: '#'
                },
                contact: {
                    email: 'hello@sociosports.in',
                    phone: '+91 98765 43210',
                    address: 'Hitech City, Hyderabad'
                }
            }
        }
    ];

    for (const page of pages) {
        await prisma.pageContent.upsert({
            where: { slug: page.slug },
            update: {
                title: page.title,
                content: JSON.stringify(page.content)
            },
            create: {
                slug: page.slug,
                title: page.title,
                content: JSON.stringify(page.content)
            }
        });
        console.log(`Seeded content for ${page.slug}`);
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
