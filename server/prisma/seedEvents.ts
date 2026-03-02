import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding events...');

    const events = [
        {
            title: 'Hyderabad Corporate Cricket League',
            description: 'The premier corporate cricket tournament in Hyderabad. 16 teams, 4 groups, one winner. T20 format with professional umpiring and live scoring.',
            date: new Date('2026-03-15T09:00:00Z'),
            location: 'LB Stadium, Hyderabad',
            type: 'Cricket',
            price: 15000,
            image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800',
            maxParticipants: 16
        },
        {
            title: 'Mumbai Badminton Open 2026',
            description: 'Open for all categories: Singles, Doubles, and Mixed Doubles. Cash prizes worth ₹50,000 for winners.',
            date: new Date('2026-03-20T10:00:00Z'),
            location: 'NSCI Dome, Mumbai',
            type: 'Badminton',
            price: 1500,
            image: 'https://images.unsplash.com/photo-1626244422470-363675688582?auto=format&fit=crop&q=80&w=800',
            maxParticipants: 128
        },
        {
            title: 'Bangalore 5K Run for Fitness',
            description: 'Join thousands of fitness enthusiasts for a morning run through Cubbon Park. Medal and certificate for all finishers.',
            date: new Date('2026-04-05T06:00:00Z'),
            location: 'Cubbon Park, Bangalore',
            type: 'Running',
            price: 500,
            image: 'https://images.unsplash.com/photo-1552674605-5d226a5be380?auto=format&fit=crop&q=80&w=800',
            maxParticipants: 5000
        },
        {
            title: 'National Youth Football Championship',
            description: 'Under-19 football championship featuring the best academies from across the country. Scouting opportunities available.',
            date: new Date('2026-04-12T16:00:00Z'),
            location: 'Salt Lake Stadium, Kolkata',
            type: 'Football',
            price: 5000,
            image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=800',
            maxParticipants: 32
        },
        {
            title: 'Pune Tennis Masters',
            description: 'Clay court tournament for intermediate and advanced players. Singles and Doubles categories.',
            date: new Date('2026-04-18T08:00:00Z'),
            location: 'Deccan Gymkhana, Pune',
            type: 'Tennis',
            price: 2000,
            image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=800',
            maxParticipants: 64
        },
        {
            title: 'Delhi Table Tennis District Cup',
            description: 'District level tournament for all age groups. Selection trials for state team.',
            date: new Date('2026-03-28T09:30:00Z'),
            location: 'Thyagaraj Stadium, Delhi',
            type: 'Table Tennis',
            price: 800,
            image: 'https://images.unsplash.com/photo-1534158914592-062992bbe900?auto=format&fit=crop&q=80&w=800',
            maxParticipants: 200
        }
    ];

    for (const event of events) {
        // Check if event exists to avoid duplicates (by title and date)
        const existing = await prisma.event.findFirst({
            where: {
                title: event.title,
                date: event.date
            }
        });

        if (!existing) {
            await prisma.event.create({
                data: event
            });
            console.log(`Created event: ${event.title}`);
        } else {
            console.log(`Event already exists: ${event.title}`);
        }
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
