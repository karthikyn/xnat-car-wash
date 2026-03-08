// Generate 5 years of booking data with ₹3 Cr initial revenue and 30% CAGR
// Tamil Nadu specific names and locations

const fs = require('fs').promises;
const path = require('path');

// Tamil Nadu specific names
const tamilNames = {
    male: [
        'Rajesh Kumar', 'Vijay Prakash', 'Karthik Subramanian', 'Arun Murugan', 'Senthil Kumar',
        'Prakash Raman', 'Suresh Natarajan', 'Ganesh Venkatesh', 'Ramesh Krishnan', 'Dinesh Kumar',
        'Mahesh Sundaram', 'Naveen Raja', 'Praveen Kumar', 'Sathish Babu', 'Vignesh Anand',
        'Balaji Ravi', 'Harish Kumar', 'Manoj Pandian', 'Saravanan Murugan', 'Selvam Raja',
        'Arjun Shankar', 'Bharath Kumar', 'Chandran Iyer', 'Deepak Raman', 'Elango Subramanian',
        'Gokul Krishna', 'Hari Prasad', 'Ilango Murugan', 'Jagan Mohan', 'Kiran Kumar',
        'Lakshman Raj', 'Mohan Das', 'Nagaraj Venkat', 'Prabhu Deva', 'Ranjith Kumar',
        'Sanjay Raghavan', 'Tarun Vijay', 'Udhay Kumar', 'Varun Prakash', 'Yogesh Raman',
        'Ashok Kumar', 'Bala Murugan', 'Chandra Sekar', 'Dhanush Raja', 'Ezhil Arasan',
        'Gowtham Kumar', 'Hari Haran', 'Inba Raj', 'Jeeva Kumar', 'Kamal Hassan'
    ],
    female: [
        'Priya Lakshmi', 'Divya Bharathi', 'Kavya Subramanian', 'Meera Devi', 'Nithya Kumar',
        'Pooja Raman', 'Ranjitha Devi', 'Sangeetha Murugan', 'Thamarai Selvi', 'Uma Maheshwari',
        'Vani Priya', 'Yamini Devi', 'Anitha Kumari', 'Bhavani Devi', 'Chitra Lakshmi',
        'Deepa Rani', 'Gayathri Devi', 'Hema Malini', 'Indira Devi', 'Janaki Raman',
        'Kamala Devi', 'Lalitha Kumari', 'Malathi Devi', 'Nalini Priya', 'Padma Lakshmi',
        'Radha Krishna', 'Saranya Devi', 'Thulasi Devi', 'Usha Rani', 'Vasantha Kumari',
        'Archana Devi', 'Brinda Lakshmi', 'Chithra Devi', 'Devika Rani', 'Eswari Devi',
        'Geetha Kumari', 'Hemalatha Devi', 'Iswarya Lakshmi', 'Jayanthi Devi', 'Kalpana Kumari',
        'Lakshmi Priya', 'Mythili Devi', 'Nandini Kumari', 'Pavithra Devi', 'Revathi Lakshmi'
    ]
};

// Tamil Nadu service centers (20 locations)
const serviceCenters = [
    { id: 1, name: 'Chennai North Center', location: 'Anna Nagar, Chennai', capacity: 25, weight: 1.5 },
    { id: 2, name: 'Chennai South Center', location: 'Velachery, Chennai', capacity: 22, weight: 1.4 },
    { id: 3, name: 'Coimbatore Center', location: 'RS Puram, Coimbatore', capacity: 20, weight: 1.3 },
    { id: 4, name: 'Madurai Center', location: 'Anna Nagar, Madurai', capacity: 18, weight: 1.1 },
    { id: 5, name: 'Tiruchirappalli Center', location: 'Thillai Nagar, Trichy', capacity: 16, weight: 1.0 },
    { id: 6, name: 'Salem Center', location: 'Fairlands, Salem', capacity: 15, weight: 0.9 },
    { id: 7, name: 'Tirunelveli Center', location: 'Palayamkottai, Tirunelveli', capacity: 14, weight: 0.8 },
    { id: 8, name: 'Erode Center', location: 'Perundurai Road, Erode', capacity: 13, weight: 0.7 },
    { id: 9, name: 'Vellore Center', location: 'Gandhi Nagar, Vellore', capacity: 14, weight: 0.8 },
    { id: 10, name: 'Thoothukudi Center', location: 'Palayamkottai Road, Tuticorin', capacity: 12, weight: 0.7 },
    { id: 11, name: 'Thanjavur Center', location: 'Gandhiji Road, Thanjavur', capacity: 13, weight: 0.7 },
    { id: 12, name: 'Dindigul Center', location: 'Palani Road, Dindigul', capacity: 12, weight: 0.6 },
    { id: 13, name: 'Kanchipuram Center', location: 'Gandhi Road, Kanchipuram', capacity: 11, weight: 0.6 },
    { id: 14, name: 'Karur Center', location: 'Kovai Road, Karur', capacity: 11, weight: 0.6 },
    { id: 15, name: 'Nagercoil Center', location: 'Vadasery, Nagercoil', capacity: 10, weight: 0.5 },
    { id: 16, name: 'Kumbakonam Center', location: 'TSR Big Street, Kumbakonam', capacity: 10, weight: 0.5 },
    { id: 17, name: 'Tiruppur Center', location: 'Kumaran Road, Tiruppur', capacity: 15, weight: 0.9 },
    { id: 18, name: 'Hosur Center', location: 'Bagalur Road, Hosur', capacity: 14, weight: 0.8 },
    { id: 19, name: 'Ambattur Center', location: 'CTH Road, Ambattur', capacity: 16, weight: 1.0 },
    { id: 20, name: 'Tambaram Center', location: 'GST Road, Tambaram', capacity: 15, weight: 0.9 }
];

// Car models popular in Tamil Nadu
const carModels = [
    'Maruti Swift', 'Hyundai i20', 'Honda City', 'Maruti Baleno', 'Hyundai Creta',
    'Tata Nexon', 'Mahindra XUV500', 'Kia Seltos', 'Toyota Innova', 'Maruti Ertiga',
    'Hyundai Venue', 'Renault Kwid', 'Maruti Wagon R', 'Honda Amaze', 'Hyundai Verna',
    'Tata Tiago', 'Mahindra Scorpio', 'Ford EcoSport', 'Volkswagen Polo', 'Skoda Rapid',
    'MG Hector', 'Nissan Magnite', 'Renault Duster', 'Maruti Vitara Brezza', 'Hyundai Grand i10'
];

// Service types with pricing (INR) - adjusted weights for higher revenue per booking
const serviceTypes = [
    { name: 'Basic Wash', price: 1200, cost: 840, weight: 0.35 },
    { name: 'Premium Wash', price: 2400, cost: 1560, weight: 0.40 },
    { name: 'Deluxe Detail', price: 4000, cost: 2400, weight: 0.25 }
];

// Phone number generator (Tamil Nadu)
function generateTNPhone() {
    const prefixes = ['98', '99', '97', '96', '95', '94', '93', '90', '91', '92'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const number = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    return prefix + number;
}

// Random date generator
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Random time generator (8 AM to 6 PM)
function randomTime() {
    const hour = Math.floor(Math.random() * 10) + 8; // 8-17
    const minute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

// Weighted random selection
function weightedRandom(items, weightKey = 'weight') {
    const totalWeight = items.reduce((sum, item) => sum + (item[weightKey] || 1), 0);
    let random = Math.random() * totalWeight;
    
    for (const item of items) {
        random -= (item[weightKey] || 1);
        if (random <= 0) return item;
    }
    return items[items.length - 1];
}

// Generate users
function generateUsers(count) {
    const users = [];
    const allNames = [...tamilNames.male, ...tamilNames.female];
    
    for (let i = 1; i <= count; i++) {
        const name = allNames[Math.floor(Math.random() * allNames.length)];
        users.push({
            id: i,
            name: name,
            email: `${name.toLowerCase().replace(/\s+/g, '.')}${i}@gmail.com`,
            phone: generateTNPhone(),
            password: 'password123',
            role: 'user'
        });
    }
    
    // Add admin user
    users.unshift({
        id: 0,
        name: 'Admin',
        email: 'admin@carwash.com',
        phone: '9876543210',
        password: 'admin123',
        role: 'admin'
    });
    
    return users;
}

// Calculate target bookings for a year based on revenue target
function calculateYearlyBookings(targetRevenue) {
    // Average revenue per booking (weighted by service type distribution)
    const avgRevenue = serviceTypes.reduce((sum, st) => sum + (st.price * st.weight), 0);
    return Math.round(targetRevenue / avgRevenue);
}

// Generate bookings for 5 years with 30% CAGR
function generateBookings(users) {
    const bookings = [];
    let bookingId = 1;
    
    // Initial revenue: ₹3 Crores = ₹30,000,000
    // Reduced to 2 years of data to keep file size manageable
    const initialRevenue = 30000000;
    const cagr = 0.30; // 30% growth
    
    // Calculate yearly revenues for 2 years
    const yearlyRevenues = [];
    for (let year = 0; year < 2; year++) {
        yearlyRevenues.push(initialRevenue * Math.pow(1 + cagr, year));
    }
    
    console.log('Yearly Revenue Targets (2-year data for demo):');
    yearlyRevenues.forEach((rev, idx) => {
        console.log(`Year ${2025 + idx}: ₹${(rev / 10000000).toFixed(2)} Cr`);
    });
    
    // Generate bookings for each year
    for (let yearIdx = 0; yearIdx < 2; yearIdx++) {
        const year = 2025 + yearIdx;
        const targetRevenue = yearlyRevenues[yearIdx];
        const yearlyBookingCount = calculateYearlyBookings(targetRevenue);
        
        console.log(`Generating ${yearlyBookingCount} bookings for year ${year}...`);
        
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);
        
        for (let i = 0; i < yearlyBookingCount; i++) {
            const user = users[Math.floor(Math.random() * (users.length - 1)) + 1]; // Skip admin
            const center = weightedRandom(serviceCenters);
            const serviceType = weightedRandom(serviceTypes);
            const carModel = carModels[Math.floor(Math.random() * carModels.length)];
            const bookingDate = randomDate(startDate, endDate);
            const time = randomTime();
            
            // Status distribution
            const statusRand = Math.random();
            let status;
            const now = new Date();
            
            if (bookingDate < now) {
                // Past bookings - higher completion rate
                if (statusRand < 0.90) status = 'completed';
                else if (statusRand < 0.97) status = 'cancelled';
                else status = 'in-progress';
            } else {
                // Future bookings
                if (statusRand < 0.6) status = 'pending';
                else if (statusRand < 0.9) status = 'in-progress';
                else status = 'completed'; // Some pre-completed for future dates
            }
            
            const booking = {
                id: bookingId++,
                userId: user.id,
                customerName: user.name,
                phone: user.phone,
                carModel: carModel,
                service: serviceType.name,
                serviceType: `${serviceType.name} - ₹${serviceType.price}`,
                price: `₹${serviceType.price}`,
                date: bookingDate.toISOString().split('T')[0],
                time: time,
                status: status,
                centerId: center.id,
                centerName: center.name,
                location: center.location,
                createdAt: bookingDate.toISOString()
            };
            
            // Add timeline for completed/cancelled bookings
            if (status === 'completed' || status === 'cancelled') {
                const createdDate = new Date(bookingDate);
                const progressDate = new Date(createdDate.getTime() + 30 * 60000); // +30 min
                const completedDate = new Date(progressDate.getTime() + 90 * 60000); // +90 min
                
                booking.timeline = [
                    {
                        status: 'pending',
                        timestamp: createdDate.toISOString(),
                        technician: 'System',
                        action: 'Booking created'
                    },
                    {
                        status: 'in-progress',
                        timestamp: progressDate.toISOString(),
                        technician: 'Technician',
                        action: 'Service started'
                    },
                    {
                        status: status,
                        timestamp: completedDate.toISOString(),
                        technician: 'Technician',
                        action: status === 'completed' ? 'Service completed' : 'Booking cancelled'
                    }
                ];
                
                booking.updatedAt = completedDate.toISOString();
            }
            
            // Add feedback for 70% of completed bookings
            if (status === 'completed' && Math.random() < 0.7) {
                // Rating distribution: mostly 4-5 stars
                const ratingRand = Math.random();
                let rating;
                if (ratingRand < 0.5) rating = 5;
                else if (ratingRand < 0.8) rating = 4;
                else if (ratingRand < 0.95) rating = 3;
                else rating = 2;
                
                const feedbacks = {
                    5: ['Excellent service!', 'Very satisfied with the work', 'Outstanding quality', 'Highly recommended', 'Perfect job!'],
                    4: ['Good service', 'Satisfied with the work', 'Nice experience', 'Well done', 'Good quality'],
                    3: ['Average service', 'Okay experience', 'Could be better', 'Decent work', 'Satisfactory'],
                    2: ['Not satisfied', 'Below expectations', 'Needs improvement', 'Poor service', 'Disappointed']
                };
                
                booking.rating = rating;
                booking.feedback = feedbacks[rating][Math.floor(Math.random() * feedbacks[rating].length)];
                booking.feedbackAt = new Date(new Date(booking.updatedAt).getTime() + 3600000).toISOString();
            }
            
            bookings.push(booking);
        }
    }
    
    return bookings;
}

// Main function
async function generateData() {
    console.log('Starting 2-year data generation (2025-2026)...\n');
    console.log('Note: Generating 2 years of data to keep file size manageable for GitHub');
    console.log('Revenue growth: ₹3 Cr (2025) → ₹3.9 Cr (2026) with 30% CAGR\n');
    
    // Generate users (300 unique customers)
    console.log('Generating 300 users...');
    const users = generateUsers(300);
    
    // Generate bookings
    console.log('\nGenerating bookings with revenue targets...');
    const bookings = generateBookings(users);
    
    // Calculate actual revenue
    const actualRevenue = bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + parseInt(b.price.replace('₹', '')), 0);
    
    console.log(`\nTotal bookings generated: ${bookings.length}`);
    console.log(`Completed bookings: ${bookings.filter(b => b.status === 'completed').length}`);
    console.log(`Actual revenue from completed bookings: ₹${(actualRevenue / 10000000).toFixed(2)} Cr`);
    
    // Year-wise breakdown
    console.log('\nYear-wise breakdown:');
    for (let year = 2025; year <= 2026; year++) {
        const yearBookings = bookings.filter(b => b.date.startsWith(year.toString()));
        const yearCompleted = yearBookings.filter(b => b.status === 'completed');
        const yearRevenue = yearCompleted.reduce((sum, b) => sum + parseInt(b.price.replace('₹', '')), 0);
        console.log(`${year}: ${yearBookings.length} bookings, ${yearCompleted.length} completed, ₹${(yearRevenue / 10000000).toFixed(2)} Cr revenue`);
    }
    
    // Save to files
    const dataDir = path.join(__dirname, '../data');
    
    console.log('\nSaving data files...');
    await fs.writeFile(
        path.join(dataDir, 'users.json'),
        JSON.stringify(users, null, 2)
    );
    console.log('✓ users.json saved');
    
    await fs.writeFile(
        path.join(dataDir, 'bookings.json'),
        JSON.stringify(bookings, null, 2)
    );
    console.log('✓ bookings.json saved');
    
    console.log('\n✅ Data generation complete!');
    console.log(`\nTo use this data, restart your server: npm start`);
}

// Run the generator
generateData().catch(console.error);
