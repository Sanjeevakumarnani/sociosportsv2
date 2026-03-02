import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Restoring job listings...');

    // Clear existing jobs first to avoid duplicates
    await prisma.job.deleteMany({});
    console.log('Cleared existing jobs.');

    const jobs = [
        // === ATHLETE OPPORTUNITIES ===
        {
            title: 'Professional Cricket Player',
            location: 'Mumbai, India',
            type: 'Contract',
            department: 'Cricket',
            organization: 'Mumbai Premier League',
            description: 'Looking for a verified professional batsman for the upcoming league season. Competitive salary and performance bonuses.',
            requirements: 'State level participation minimum. Age 18-30.',
            salary: '₹1,20,000 - ₹2,00,000/mo',
            category: 'ATHLETE_OPPORTUNITY',
            isActive: true
        },
        {
            title: 'Football Striker – U23 Team',
            location: 'Hyderabad, Telangana',
            type: 'Seasonal',
            department: 'Football',
            organization: 'Telangana FC',
            description: 'Seeking an energetic striker for our U23 football squad. Training facility, accommodation, and match fees provided.',
            requirements: 'AIFF registered player preferred. District level and above.',
            salary: '₹40,000 - ₹80,000/mo',
            category: 'ATHLETE_OPPORTUNITY',
            isActive: true
        },
        {
            title: 'Badminton Player – Corporate League',
            location: 'Bengaluru, Karnataka',
            type: 'Part-time',
            department: 'Badminton',
            organization: 'TechCorp Sports Club',
            description: 'Join our corporate badminton team for weekend inter-company tournaments. Flexible schedule.',
            requirements: 'State ranking or equivalent experience.',
            salary: '₹15,000/tournament',
            category: 'ATHLETE_OPPORTUNITY',
            isActive: true
        },

        // === COACHING POSITIONS ===
        {
            title: 'Head Football Coach (U-16)',
            location: 'Gachibowli, Hyderabad',
            type: 'Full-time',
            department: 'Football',
            organization: 'Telangana Sports Academy',
            description: 'Lead and develop our U-16 football squad. Plan training sessions, manage match schedules, and mentor young athletes.',
            requirements: 'AFC C License or equivalent. Minimum 3 years coaching experience.',
            salary: '₹45,000 - ₹60,000/mo',
            category: 'COACHING_POSITION',
            isActive: true
        },
        {
            title: 'Senior Tennis Coach',
            location: 'Delhi, India',
            type: 'Full-time',
            department: 'Tennis',
            organization: 'DTA Tennis Academy',
            description: 'Experienced tennis coach needed to train junior and senior players at our state-of-the-art facility.',
            requirements: 'ITF Level 2 certification. BCA certified preferred.',
            salary: '₹50,000 - ₹70,000/mo',
            category: 'COACHING_POSITION',
            isActive: true
        },
        {
            title: 'Swimming Coach',
            location: 'Pune, Maharashtra',
            type: 'Full-time',
            department: 'Swimming',
            organization: 'Aqua Elite Academy',
            description: 'We need a certified swimming coach for our competitive training program. Work with swimmers from age 8 to 25.',
            requirements: 'SWIM India certified or equivalent.',
            salary: '₹35,000 - ₹55,000/mo',
            category: 'COACHING_POSITION',
            isActive: true
        },

        // === JOIN SOCIOSPORTS ===
        {
            title: 'Tournament Operations Manager',
            location: 'Remote / On-site',
            type: 'Full-time',
            department: 'Operations',
            organization: 'SocioSports',
            description: 'Manage end-to-end tournament operations including scheduling, venue coordination, and participant management on the SocioSports platform.',
            requirements: '3+ years in sports event management. Excellent communication skills.',
            salary: '₹8,00,000 - ₹12,00,000/yr',
            category: 'JOIN_SOCIO_SPORTS',
            isActive: true
        },
        {
            title: 'Sports Photographer & Videographer',
            location: 'Hyderabad (Travel required)',
            type: 'Part-time',
            department: 'Media',
            organization: 'SocioSports',
            description: 'Capture high-quality photos and videos at sports events across India for the SocioSports platform and social media.',
            requirements: 'Portfolio of sports photography required. Own camera equipment preferred.',
            salary: '₹25,000/event',
            category: 'JOIN_SOCIO_SPORTS',
            isActive: true
        },
        {
            title: 'Sports Community Manager',
            location: 'Hyderabad, India',
            type: 'Full-time',
            department: 'Community',
            organization: 'SocioSports',
            description: 'Build and manage our growing sports community. Engage with athletes, coaches, and academies to drive platform adoption.',
            requirements: 'Passion for sports. 2+ years community management experience.',
            salary: '₹6,00,000 - ₹9,00,000/yr',
            category: 'JOIN_SOCIO_SPORTS',
            isActive: true
        }
    ];

    for (const job of jobs) {
        await prisma.job.create({ data: job });
        console.log(`Created: ${job.title} [${job.category}]`);
    }

    console.log(`\nSuccessfully restored ${jobs.length} jobs across all 3 categories.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
