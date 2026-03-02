import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetAdmin() {
    const email = 'superadmin@sociosports.in';
    const password = 'Socio@123';
    const name = 'Super Admin';

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Delete existing if any
        await prisma.user.deleteMany({ where: { email } });

        // Create fresh
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: 'ADMIN'
            }
        });

        console.log('✅ New admin created successfully!');
        console.log('📧 Email:   ', email);
        console.log('🔑 Password:', password);
        console.log('🆔 User ID: ', user.id);
    } catch (error) {
        console.error('❌ Error creating admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetAdmin();
