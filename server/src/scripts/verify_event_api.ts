
const API_URL = 'http://localhost:5000/api';

async function main() {
    console.log('Starting API Verification...');

    // 1. Login
    console.log('Logging in...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: 'admin@sociosports.co.in',
            password: 'password123'
        })
    });

    if (!loginRes.ok) {
        console.error('Login failed:', await loginRes.text());
        return;
    }

    const { token } = await loginRes.json();
    console.log('Login successful, token obtained.');

    // 2. Create Event
    console.log('Creating event...');
    const eventRes = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            title: 'API Test Event',
            description: 'Testing API Deletion',
            date: new Date().toISOString(),
            location: 'API Test Loc',
            type: 'Training',
            price: 100
        })
    });

    if (!eventRes.ok) {
        console.error('Create event failed:', await eventRes.text());
        return;
    }

    const event = await eventRes.json();
    console.log('Event created:', event.id);

    // 3. Update Event
    console.log('Updating event...');
    const updateRes = await fetch(`${API_URL}/events/${event.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            title: 'API Test Event Updated',
            description: 'Updated Description',
            date: new Date().toISOString(),
            location: 'Updated Loc',
            type: 'Training',
            price: 200
        })
    });

    if (!updateRes.ok) {
        console.error('Update event failed:', await updateRes.text());
        // Continue to delete anyway
    } else {
        console.log('Event updated successfully.');
    }

    // 4. Delete Event
    console.log('Deleting event...');
    const deleteRes = await fetch(`${API_URL}/events/${event.id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!deleteRes.ok) {
        console.error('Delete event failed:', await deleteRes.text());
    } else {
        console.log('Event deleted successfully.');
    }
}

main().catch(console.error);
