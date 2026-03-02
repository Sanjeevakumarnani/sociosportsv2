import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const jobs = [
        {
            title: 'Head Football Coach (U-16)',
            location: 'Gachibowli, Hyderabad',
            type: 'Full-time',
            // Mapping 'organization' to description for now as schema lacks it, or ignoring if not critical
            description: 'Organization: Telangana Sports Academy. Salary: ₹45,000 - ₹60,000/mo. Category: Coaching',
            department: 'Coaching',
            isActive: true
        },
        {
            title: 'Sports Physiotherapist',
            location: 'Jubilee Hills, Hyderabad',
            type: 'Contract',
            description: 'Organization: Elite Recovery Center. Salary: ₹800/session. Category: Physio',
            department: 'Physio',
            isActive: true
        },
        {
            title: 'Tournament Operations Manager',
            location: 'Remote / On-site',
            type: 'Full-time',
            description: 'Organization: SocioSports Internal. Salary: ₹8,00,000 - ₹12,00,000/yr. Category: Management',
            department: 'Management',
            isActive: true
        },
        {
            title: 'Sports Photographer & Videographer',
            location: 'Hyderabad (Travel required)',
            type: 'Part-time',
            description: 'Organization: ProLeagues India. Salary: ₹25,000/event. Category: Media',
            department: 'Media',
            isActive: true
        }
    ];

    console.log(`Start seeding ${jobs.length} jobs...`);

    for (const job of jobs) {
        // Upsert to avoid duplicates if run multiple times (matching by title is imperfect but sufficient for seed)
        // Since schema doesn't have unique title, we'll just create.
        // Or better, delete all first? No, that might wipe real data.
        // Let's just create for now.
        await prisma.job.create({
            data: {
                title: job.title,
                location: job.location,
                type: job.type,
                description: job.description,
                department: job.department,
                isActive: job.isActive
            }
        });
    }

    console.log('Seeding finished.');
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
