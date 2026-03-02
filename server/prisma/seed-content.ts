import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting database seed...');

    // Create or find admin user
    console.log('Creating admin user...');
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@sociosports.com' },
        update: {},
        create: {
            name: 'SocioSports Admin',
            email: 'admin@sociosports.com',
            phone: '+919876543210',
            password: '$2b$10$K7L/K/LQeqYqF9lO8O8O0.ePQMxOJdY.7Kf4Kf4Kf4Kf4Kf4Kf4Km',
            role: 'ADMIN'
        }
    });
    console.log('Admin user ready:', adminUser.email);

    // Seed Events (5 production-ready events)
    console.log('Seeding events...');

    const event1 = await prisma.event.create({
        data: {
            title: 'Mumbai Inter-Corporate Cricket Championship 2026',
            type: 'Tournament - Cricket',
            description: `Bring your corporate team to India's most exciting inter-company cricket championship! Compete with top teams from Mumbai's leading organizations.

Format: T20 (20 overs per side)
Prize Pool: ₹1,50,000
Professionally umpired matches, live scoring, winner trophies, and networking opportunities.`,
            location: 'Wankhede Stadium Practice Grounds, Mumbai',
            date: new Date('2026-03-15'),
            price: 12000,
            maxParticipants: 176,
            image: '/images/events/cricket-tournament.jpg'
        }
    });

    const event2 = await prisma.event.create({
        data: {
            title: 'Hyderabad Badminton Open 2026',
            type: 'Tournament - Badminton',
            description: `Compete in Hyderabad's premier badminton tournament featuring junior and senior divisions. BWF-standard courts, experienced referees.

Divisions: Junior Boys, Junior Girls, Men's Singles, Women's Singles, Mixed Doubles
8 synthetic courts (BWF standard)
Prizes: Trophies + certificates for Top 4 in each category`,
            location: 'GMC Balayogi Sports Complex, Hyderabad',
            date: new Date('2026-04-05'),
            price: 800,
            maxParticipants: 200,
            image: '/images/events/badminton-tournament.jpg'
        }
    });

    const event3 = await prisma.event.create({
        data: {
            title: 'Pune Youth Football Development Camp',
            type: 'Training Camp - Football',
            description: `Elevate your child's football skills with professional UEFA-certified coaches. Two-week intensive camp covering technical skills, tactical awareness, fitness, and match play.

Coaches: UEFA B & C License certified
Ages: 10-16 years
Certificate of completion for all participants`,
            location: 'Balewadi Sports Complex, Pune',
            date: new Date('2026-05-10'),
            price: 6500,
            maxParticipants: 60,
            image: '/images/events/football-camp.jpg'
        }
    });

    const event4 = await prisma.event.create({
        data: {
            title: 'Bengaluru Run for Health - 5K & 10K Marathon',
            type: 'Community Event - Running',
            description: `Join Bengaluru's biggest community run promoting health and wellness! Chip-timed races, post-race refreshments, live entertainment.

Categories: 5K and 10K
All finishers receive medals and certificates
Proceeds support local sports education programs`,
            location: 'Cubbon Park, Bengaluru',
            date: new Date('2026-03-23'),
            price: 500,
            maxParticipants: 2000,
            image: '/images/events/marathon.jpg'
        }
    });

    const event5 = await prisma.event.create({
        data: {
            title: 'Delhi NCR School Basketball League - Season 1',
            type: 'League - Basketball',
            description: `Delhi NCR's premier inter-school basketball league. Two months of competitive action featuring 24 top schools.

Format: 4 groups of 6 teams → Top 8 advance to playoffs
FIBA rules, certified referees
Championship trophy, runner-up trophy, player awards`,
            location: 'Various venues, Delhi NCR',
            date: new Date('2026-04-01'),
            price: 8000,
            maxParticipants: 288,
            image: '/images/events/basketball-league.jpg'
        }
    });

    console.log('Created 5 events successfully');

    // Seed Blog Posts (7 articles)
    console.log('Seeding blog posts...');

    await prisma.post.create({
        data: {
            title: "From Street Cricket to National Selection - Rajesh Kumar's Journey",
            content: `A powerful story of determination, community support, and raw talent meeting opportunity. Rajesh Kumar's journey from Mumbai's streets to Maharashtra Ranji Trophy team.`,
            category: 'Athlete Stories',
            status: 'PUBLISHED',
            image: '/images/blog/cricket-story.jpg',
            tags: 'cricket, athlete stories, Mumbai sports, success stories',
            authorId: adminUser.id
        }
    });

    await prisma.post.create({
        data: {
            title: "5 Mobility Exercises Every Athlete Should Master",
            content: `Professional-grade mobility exercises to enhance performance, prevent injuries, and extend your sports career. Includes 90/90 hip stretch, thoracic rotations, and more.`,
            category: 'Training & Fitness',
            status: 'PUBLISHED',
            image: '/images/blog/mobility-training.jpg',
            tags: 'mobility, fitness, training tips, injury prevention',
            authorId: adminUser.id
        }
    });

    await prisma.post.create({
        data: {
            title: "How Sports Communities Are Transform ing Urban India",
            content: `From Bengaluru running clubs to Mumbai beach volleyball groups, organized sports communities are reshaping urban India's relationship with fitness and connection.`,
            category: 'Community Impact',
            status: 'PUBLISHED',
            image: '/images/blog/community-sports.jpg',
            tags: 'community sports, social impact, urban India',
            authorId: adminUser.id
        }
    });

    await prisma.post.create({
        data: {
            title: "Mental Toughness - What Elite Athletes Know About the Mind",
            content: `Learn the mental skills that separate good athletes from great ones. Pre-performance routines, controlled breathing, and reframing negative thoughts.`,
            category: 'Mental Health & Sports',
            status: 'PUBLISHED',
            image: '/images/blog/mental-toughness.jpg',
            tags: 'mental toughness, sports psychology, athlete mindset',
            authorId: adminUser.id
        }
    });

    await prisma.post.create({
        data: {
            title: "Nutrition Guide for Weekend Warriors - What the Pros Know",
            content: `Practical nutrition advice for recreational athletes. Macronutrient balance, meal timing, hydration strategies, and Indian athlete-friendly foods.`,
            category: 'Training & Fitness',
            status: 'PUBLISHED',
            image: '/images/blog/sports-nutrition.jpg',
            tags: 'nutrition, sports diet, fitness, recovery',
            authorId: adminUser.id
        }
    });

    await prisma.post.create({
        data: {
            title: "The Rise of Women's Football in Maharashtra",
            content: `Maharashtra witnesses a 340% increase in registered female football players. Breaking barriers, improving infrastructure, and creating opportunities.`,
            category: 'Sports Industry',
            status: 'PUBLISHED',
            image: '/images/blog/womens-football.jpg',
            tags: 'women football, Maharashtra sports, gender equality',
            authorId: adminUser.id
        }
    });

    await prisma.post.create({
        data: {
            title: "How to Choose the Right Coach for Your Sport",
            content: `Complete guide to finding the perfect coach. Certification criteria, questions to ask, red flags to watch for, and when to change coaches.`,
            category: 'Training & Fitness',
            status: 'PUBLISHED',
            image: '/images/blog/choosing-coach.jpg',
            tags: 'coaching, sports training, athlete development',
            authorId: adminUser.id
        }
    });

    console.log('Created 7 blog posts successfully');
    console.log('✅ Database seeding completed successfully!');
    console.log('📊 Summary: 1 admin user, 5 events, 7 blog posts');
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
