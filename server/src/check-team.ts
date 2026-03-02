
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.teamMember.count();
        console.log(`Found ${count} team members.`);

        const members = await prisma.teamMember.findMany();
        console.log('Members:', JSON.stringify(members, null, 2));
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
