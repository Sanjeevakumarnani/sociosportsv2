import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Restoring sports profiles (Athletes & Coaches)...');

    // Clear existing profiles first
    await prisma.sportsProfile.deleteMany({});
    console.log('Cleared existing profiles.');

    const profiles = [
        // ===== ATHLETES =====
        {
            sportsId: 'SS-ATH-001',
            name: 'Arjun Mehta',
            email: 'arjun.mehta@sociosports.com',
            phone: '9876543210',
            role: 'ATHLETE',
            sport: 'Cricket',
            location: 'Mumbai, Maharashtra',
            image: 'https://ui-avatars.com/api/?name=Arjun+Mehta&background=ff6b35&color=fff&size=200',
        },
        {
            sportsId: 'SS-ATH-002',
            name: 'Priya Sharma',
            email: 'priya.sharma@sociosports.com',
            phone: '9876543211',
            role: 'ATHLETE',
            sport: 'Badminton',
            location: 'Hyderabad, Telangana',
            image: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=6c63ff&color=fff&size=200',
        },
        {
            sportsId: 'SS-ATH-003',
            name: 'Rohan Verma',
            email: 'rohan.verma@sociosports.com',
            phone: '9876543212',
            role: 'ATHLETE',
            sport: 'Football',
            location: 'Delhi, India',
            image: 'https://ui-avatars.com/api/?name=Rohan+Verma&background=00b4d8&color=fff&size=200',
        },
        {
            sportsId: 'SS-ATH-004',
            name: 'Ananya Reddy',
            email: 'ananya.reddy@sociosports.com',
            phone: '9876543213',
            role: 'ATHLETE',
            sport: 'Athletics',
            location: 'Bengaluru, Karnataka',
            image: 'https://ui-avatars.com/api/?name=Ananya+Reddy&background=f72585&color=fff&size=200',
        },

        // ===== COACHES / TRAINERS =====
        {
            sportsId: 'SS-TRN-001',
            name: 'Sunitha Rao',
            email: 'sunitha.rao@sociosports.com',
            phone: '9876543220',
            role: 'TRAINER',
            sport: 'Tennis',
            profession: 'Tennis Coach',
            location: 'Chennai, Tamil Nadu',
            image: 'https://ui-avatars.com/api/?name=Sunitha+Rao&background=43aa8b&color=fff&size=200',
        },
        {
            sportsId: 'SS-TRN-002',
            name: 'Rajesh Kumar',
            email: 'rajesh.kumar@sociosports.com',
            phone: '9876543221',
            role: 'TRAINER',
            sport: 'Football',
            profession: 'Football Coach',
            location: 'Pune, Maharashtra',
            image: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=f77f00&color=fff&size=200',
        },
        {
            sportsId: 'SS-TRN-003',
            name: 'Meera Nair',
            email: 'meera.nair@sociosports.com',
            phone: '9876543222',
            role: 'TRAINER',
            sport: 'Swimming',
            profession: 'Swimming Coach',
            location: 'Kochi, Kerala',
            image: 'https://ui-avatars.com/api/?name=Meera+Nair&background=4361ee&color=fff&size=200',
        },
        {
            sportsId: 'SS-TRN-004',
            name: 'Vikram Singh',
            email: 'vikram.singh@sociosports.com',
            phone: '9876543223',
            role: 'TRAINER',
            sport: 'Basketball',
            profession: 'Basketball Coach',
            location: 'Jaipur, Rajasthan',
            image: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=7209b7&color=fff&size=200',
        },
    ];

    for (const profile of profiles) {
        await prisma.sportsProfile.create({ data: profile });
        console.log(`Created: ${profile.name} [${profile.role}] - ${profile.sport} - ${profile.location}`);
    }

    console.log(`\nSuccessfully restored ${profiles.length} profiles (4 Athletes + 4 Coaches).`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
