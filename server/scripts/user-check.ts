import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- User Role Distribution ---');

    const users = await prisma.user.findMany({
        include: {
            athleteProfile: true,
            trainerProfile: true,
            vendorProfile: true
        }
    });

    users.forEach(u => {
        const profiles = [];
        if (u.athleteProfile) profiles.push('ATHLETE');
        if (u.trainerProfile) profiles.push('TRAINER');
        if (u.vendorProfile) profiles.push('VENDOR');

        console.log(`${u.role.padEnd(10)} | ${u.email.padEnd(30)} | ${u.name || 'N/A'}`);
        console.log(`           Profiles: ${profiles.join(', ') || 'NONE'}`);
    });

    console.log('------------------------------');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
