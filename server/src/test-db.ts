
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function main() {
    try {
        console.log('Connecting to database...');
        console.log('Database URL:', process.env.DATABASE_URL);
        await prisma.$connect();
        console.log('Successfully connected to database!');

        // Check if tables exist by counting users
        const userCount = await prisma.user.count();
        console.log(`Found ${userCount} users in the database.`);

        const eventCount = await prisma.event.count();
        console.log(`Found ${eventCount} events in the database.`);
    } catch (e) {
        console.error('Error connecting to database:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
