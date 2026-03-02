import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Extended Database Diagnostic Report ---');

    const models = [
        'user', 'event', 'booking', 'post', 'teamMember', 'pageContent',
        'job', 'vendor', 'product', 'athleteProfile', 'trainerProfile',
        'inquiry', 'otpVerification'
    ];

    for (const model of models) {
        try {
            // @ts-ignore
            const count = await prisma[model].count();
            console.log(`${model.padEnd(20)}: ${count} records`);
        } catch (error) {
            console.error(`Error checking model ${model}:`, error.message);
        }
    }

    console.log('\n--- Specific Content Checks ---');
    try {
        const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
        console.log('Admin User Found     :', admin ? `${admin.email} (${admin.name})` : 'NONE');

        const events = await prisma.event.findMany({ take: 3, select: { title: true } });
        console.log('Sample Events        :', events.map(e => e.title).join(', '));

        const posts = await prisma.post.findMany({ take: 3, select: { title: true } });
        console.log('Sample Posts         :', posts.map(p => p.title).join(', '));

        const pages = await prisma.pageContent.findMany({ select: { slug: true } });
        console.log('CMS Page Slugs       :', pages.map(p => p.slug).join(', '));

        const athletes = await prisma.athleteProfile.count();
        const trainers = await prisma.trainerProfile.count();
        console.log('Athletes/Trainers    :', `${athletes}/${trainers}`);

    } catch (error) {
        console.error('Error during content checks:', error.message);
    }

    console.log('\n---------------------------------');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
