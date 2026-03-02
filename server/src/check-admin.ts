import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function checkAdmin() {
    console.log('Checking Admin User...');
    const email = 'admin@sociosports.co.in';
    const password = 'password123';

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            console.error('❌ User NOT found:', email);
            return;
        }

        console.log('✅ User found:', user.email);
        console.log('   Role:', user.role);
        console.log('   Stored Hash:', user.password);

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            console.log('✅ Password Match: SUCCESS');
        } else {
            console.error('❌ Password Match: FAILED');
        }

    } catch (error) {
        console.error('Error checking admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkAdmin();
