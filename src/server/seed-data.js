const fs = require('fs').promises;
const path = require('path');

const USERS_FILE = path.join(__dirname, '../data/users.json');
const BOOKINGS_FILE = path.join(__dirname, '../data/bookings.json');

// Dummy users
const users = [
    {
        id: 1,
        name: 'Admin',
        email: 'admin@carwash.com',
        phone: '1234567890',
        password: 'admin123',
        role: 'admin'
    },
    {
        id: 2,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '5551234567',
        password: 'password123',
        role: 'user'
    },
    {
        id: 3,
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '5559876543',
        password: 'password123',
        role: 'user'
    },
    {
        id: 4,
        name: 'Mike Wilson',
        email: 'mike@example.com',
        phone: '5555551234',
        password: 'password123',
        role: 'user'
    },
    {
        id: 5,
        name: 'Emily Brown',
        email: 'emily@example.com',
        phone: '5554443333',
        password: 'password123',
        role: 'user'
    }
];

// Generate dummy bookings
const services = [
    { name: 'Basic Wash - $15', price: '15' },
    { name: 'Premium Wash - $30', price: '30' },
    { name: 'Deluxe Detail - $50', price: '50' }
];

const carModels = [
    'Toyota Camry', 'Honda Civic', 'Ford F-150', 'Tesla Model 3',
    'BMW 3 Series', 'Mercedes C-Class', 'Audi A4', 'Chevrolet Silverado',
    'Nissan Altima', 'Hyundai Sonata', 'Mazda CX-5', 'Jeep Wrangler'
];

const statuses = ['pending', 'in-progress', 'completed', 'cancelled'];

const feedbacks = [
    { rating: 5, text: 'Excellent service! My car looks brand new.' },
    { rating: 5, text: 'Very professional and thorough. Highly recommend!' },
    { rating: 4, text: 'Good job overall, just took a bit longer than expected.' },
    { rating: 5, text: 'Amazing attention to detail. Will definitely come back!' },
    { rating: 4, text: 'Great service, friendly staff.' },
    { rating: 5, text: 'Best car wash in town! Super satisfied.' },
    { rating: 3, text: 'Decent service but could be better.' },
    { rating: 5, text: 'Spotless! Worth every penny.' },
    { rating: 4, text: 'Very happy with the results.' },
    { rating: 5, text: 'Professional and efficient service.' }
];

function getRandomDate(daysBack, daysForward) {
    const today = new Date();
    const randomDays = Math.floor(Math.random() * (daysBack + daysForward)) - daysBack;
    const date = new Date(today);
    date.setDate(date.getDate() + randomDays);
    return date.toISOString().split('T')[0];
}

function getRandomTime() {
    const hours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
    return hours[Math.floor(Math.random() * hours.length)];
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Generate 30 bookings
const bookings = [];
let bookingId = 1000;

const technicians = ['John Smith', 'Mike Johnson', 'Sarah Williams', 'David Brown'];

for (let i = 0; i < 30; i++) {
    const user = users[Math.floor(Math.random() * (users.length - 1)) + 1]; // Exclude admin
    const service = getRandomElement(services);
    const status = getRandomElement(statuses);
    const date = getRandomDate(30, 14); // 30 days back to 14 days forward
    const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    
    const booking = {
        id: bookingId++,
        userId: user.id,
        customerName: user.name,
        phone: user.phone,
        carModel: getRandomElement(carModels),
        serviceType: service.name,
        date: date,
        time: getRandomTime(),
        price: service.price,
        status: status,
        createdAt: createdAt.toISOString(),
        timeline: [
            {
                status: 'pending',
                timestamp: createdAt.toISOString(),
                technician: 'System',
                action: 'Booking created'
            }
        ]
    };
    
    // Add timeline events for status changes
    if (status !== 'pending') {
        const inProgressTime = new Date(createdAt.getTime() + Math.random() * 2 * 60 * 60 * 1000);
        booking.timeline.push({
            status: 'in-progress',
            timestamp: inProgressTime.toISOString(),
            technician: getRandomElement(technicians),
            action: 'Status changed from pending to in-progress'
        });
        
        if (status === 'completed' || status === 'cancelled') {
            const finalTime = new Date(inProgressTime.getTime() + Math.random() * 2 * 60 * 60 * 1000);
            booking.timeline.push({
                status: status,
                timestamp: finalTime.toISOString(),
                technician: getRandomElement(technicians),
                action: `Status changed from in-progress to ${status}`
            });
        }
    }
    
    // Add feedback for completed bookings (80% chance)
    if (status === 'completed' && Math.random() > 0.2) {
        const feedback = getRandomElement(feedbacks);
        booking.rating = feedback.rating;
        booking.feedback = feedback.text;
        booking.feedbackAt = new Date(booking.timeline[booking.timeline.length - 1].timestamp).toISOString();
    }
    
    bookings.push(booking);
}

// Sort bookings by date (most recent first)
bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

async function seedData() {
    try {
        await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
        console.log('✓ Created users.json with', users.length, 'users');
        
        await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
        console.log('✓ Created bookings.json with', bookings.length, 'bookings');
        
        console.log('\n📊 Data Summary:');
        console.log('- Total Users:', users.length);
        console.log('- Total Bookings:', bookings.length);
        console.log('- Pending:', bookings.filter(b => b.status === 'pending').length);
        console.log('- In Progress:', bookings.filter(b => b.status === 'in-progress').length);
        console.log('- Completed:', bookings.filter(b => b.status === 'completed').length);
        console.log('- Cancelled:', bookings.filter(b => b.status === 'cancelled').length);
        console.log('- With Feedback:', bookings.filter(b => b.feedback).length);
        
        const totalRevenue = bookings
            .filter(b => b.status === 'completed')
            .reduce((sum, b) => sum + parseFloat(b.price), 0);
        console.log('- Total Revenue: $' + totalRevenue.toFixed(2));
        
        console.log('\n🔑 Login Credentials:');
        console.log('Admin: admin@carwash.com / admin123');
        console.log('Users: john@example.com / password123 (and others)');
        
        console.log('\n✅ Dummy data created successfully!');
        console.log('Run "npm start" to start the server.');
    } catch (error) {
        console.error('Error creating dummy data:', error);
    }
}

seedData();
