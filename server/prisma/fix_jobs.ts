
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Fixing job categories...');

    // 1. Fix "Coach" jobs
    const coaches = await prisma.job.updateMany({
        where: {
            title: {
                contains: 'Coach'
            }
        },
        data: {
            category: 'COACH'
        }
    });
    console.log(`Updated ${coaches.count} jobs to COACH category.`);

    // 2. Fix "Physio" or other non-internal jobs? 
    // For now, let's keep them as SocioSports unless we have specific rules.
    // The user requested: Athlete, Coach, SocioSports. 

    // 3. Ensure we have at least one ATHLETE job for testing/display
    const athleteJob = await prisma.job.findFirst({
        where: { category: 'ATHLETE' }
    });

    if (!athleteJob) {
        console.log('No Athlete job found. Creating one...');
        await prisma.job.create({
            data: {
                title: 'Professional Cricket Player',
                location: 'Mumbai, India',
                type: 'Contract',
                department: 'Cricket',
                description: 'Looking for a verified professional batsman for the upcoming league season.',
                requirements: 'State level participation minimum.',
                category: 'ATHLETE',
                isActive: true
            }
        });
        console.log('Created sample Athlete job.');
    }

    // 4. Ensure we have at least one COACH job
    const coachJob = await prisma.job.findFirst({
        where: { category: 'COACH' }
    });

    if (!coachJob) {
        console.log('No Coach job found (even after update). Creating one...');
        await prisma.job.create({
            data: {
                title: 'Senior Tennis Coach',
                location: 'Delhi, India',
                type: 'Full-time',
                department: 'Tennis',
                description: 'experienced tennis coach needed.',
                requirements: 'ITF Level 2 certification.',
                category: 'COACH',
                isActive: true
            }
        });
        console.log('Created sample Coach job.');
    }

    // 5. Check SocioSports jobs (everything else)
    const otherJobs = await prisma.job.count({
        where: {
            category: 'SOCIOSPORTS'
        }
    });
    console.log(`Found ${otherJobs} SocioSports jobs.`);

    console.log('Job fixes completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
