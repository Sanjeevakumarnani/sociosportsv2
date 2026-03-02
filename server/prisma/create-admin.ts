import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
    const email = 'admin@sociosports.in';
    const password = 'Admin@2026';
    const name = 'SocioSports Admin';

    try {
        // Check if admin already exists
        const existing = await prisma.user.findUnique({ where: { email } });

        if (existing) {
            // Update to admin role and reset password
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.user.update({
                where: { email },
                data: { role: 'ADMIN', password: hashedPassword, name }
            });
            console.log(`✅ Admin user updated: ${email}`);
        } else {
            // Create new admin
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.user.create({
                data: { email, password: hashedPassword, name, role: 'ADMIN' }
            });
            console.log(`✅ Admin user created: ${email}`);
        }

        console.log(`📧 Email: ${email}`);
        console.log(`🔑 Password: ${password}`);
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
