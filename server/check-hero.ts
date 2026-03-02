import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const hero = await prisma.pageContent.findUnique({
        where: { slug: 'home-hero' }
    });
    console.log('Home Hero Content:', JSON.stringify(hero, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
