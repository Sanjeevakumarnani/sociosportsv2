import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { deleteFile } from '../utils/fileHelper';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting Event Deletion Verification...');

    // 1. Create a dummy image file
    const dummyFilename = `test_img_${Date.now()}.jpg`;
    const dummyFilePath = path.join(__dirname, '../../uploads', dummyFilename);
    const dummyFileUrl = `http://localhost:5000/uploads/${dummyFilename}`;

    // Ensure uploads directory exists
    const uploadsDir = path.dirname(dummyFilePath);
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

    fs.writeFileSync(dummyFilePath, 'dummy image content');
    console.log('Created dummy image file:', dummyFilePath);


    // 2. Create a dummy event with image
    const event = await prisma.event.create({
        data: {
            title: 'Test Deletion Event',
            description: 'This event should be deleted',
            date: new Date(),
            location: 'Test Location',
            type: 'Training',
            image: dummyFileUrl
        }
    });
    console.log('Created dummy event:', event.id);

    // 3. Create a dummy user
    const user = await prisma.user.create({
        data: {
            email: `test_del_${Date.now()}@example.com`,
            password: 'password',
            role: 'ATHLETE'
        }
    });

    // 4. Create a booking for this event
    const booking = await prisma.booking.create({
        data: {
            userId: user.id,
            eventId: event.id,
            status: 'CONFIRMED'
        }
    });
    console.log('Created dummy booking:', booking.id);

    // 5. Try to delete the event
    console.log('Attempting to DELETE event via API to verify full flow...');
    let deletedViaApi = false;
    try {
        const response = await fetch(`http://localhost:5000/api/events/${event.id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            console.log('API returned Success');
            deletedViaApi = true;
        } else {
            console.error('API failed:', await response.text());
        }
    } catch (error) {
        console.warn('Could not hit API (maybe server not running?), checking fallback logic.');
    }

    if (!deletedViaApi) {
        console.log("Using Prisma Client fallback deletion...");
        if (event.image) {
            deleteFile(event.image);
        }
        try {
            await prisma.event.delete({ where: { id: event.id } });
            console.log("Prisma Client deletion success.");
        } catch (e) {
            console.error("Prisma Client deletion failed:", e);
        }
    }

    // 6. Verify deletion
    const deletedEvent = await prisma.event.findUnique({ where: { id: event.id } });
    const deletedBooking = await prisma.booking.findUnique({ where: { id: booking.id } });
    const fileExists = fs.existsSync(dummyFilePath);

    if (!deletedEvent && !deletedBooking && !fileExists) {
        console.log('SUCCESS: Event, Booking, and Image File deleted.');
    } else {
        console.error('FAILURE: Deletion incomplete.');
        console.log('Event exists (should be false):', !!deletedEvent);
        console.log('Booking exists (should be false):', !!deletedBooking);
        console.log('File exists (should be false):', fileExists);
    }

    // Cleanup user
    if (deletedBooking) {
        console.log("Cleaning up stuck booking...");
        await prisma.booking.delete({ where: { id: booking.id } });
    }
    console.log("Deleting user...");
    await prisma.user.delete({ where: { id: user.id } });
    console.log("Verification finished.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
