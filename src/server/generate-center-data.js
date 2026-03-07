// Script to generate booking data with service center assignments
const fs = require('fs');

const SERVICE_CENTERS = [
    { id: 1, name: 'Chennai North Center', location: 'Anna Nagar' },
    { id: 2, name: 'Chennai South Center', location: 'Velachery' },
    { id: 3, name: 'Coimbatore Center', location: 'RS Puram' },
    { id: 4, name: 'Madurai Center', location: 'Anna Nagar' },
    { id: 5, name: 'Tiruchirappalli Center', location: 'Thillai Nagar' },
    { id: 6, name: 'Salem Center', location: 'Fairlands' },
    { id: 7, name: 'Tirunelveli Center', location: 'Palayamkottai' },
    { id: 8, name: 'Erode Center', location: 'Perundurai Road' },
    { id: 9, name: 'Vellore Center', location: 'Gandhi Nagar' },
    { id: 10, name: 'Thoothukudi Center', location: 'Palayamkottai Road' },
    { id: 11, name: 'Thanjavur Center', location: 'Gandhiji Road' },
    { id: 12, name: 'Dindigul Center', location: 'Palani Road' },
    { id: 13, name: 'Kanchipuram Center', location: 'Gandhi Road' },
    { id: 14, name: 'Karur Center', location: 'Kovai Road' },
    { id: 15, name: 'Nagercoil Center', location: 'Vadasery' },
    { id: 16, name: 'Kumbakonam Center', location: 'TSR Big Street' },
    { id: 17, name: 'Tiruppur Center', location: 'Kumaran Road' },
    { id: 18, name: 'Hosur Center', location: 'Bagalur Road' },
    { id: 19, name: 'Ambattur Center', location: 'CTH Road' },
    { id: 20, name: 'Tambaram Center', location: 'GST Road' }
];

// Read existing bookings
const bookings = JSON.parse(fs.readFileSync('bookings.json', 'utf8'));

// Assign service centers to bookings
const updatedBookings = bookings.map((booking, index) => {
    const centerId = (index % 20) + 1;
    const center = SERVICE_CENTERS.find(c => c.id === centerId);
    
    return {
        ...booking,
        centerId: centerId,
        centerName: center.name,
        centerLocation: center.location
    };
});

// Write updated bookings
fs.writeFileSync('bookings.json', JSON.stringify(updatedBookings, null, 2));

console.log('✅ Service center data added to bookings!');
console.log(`📊 Total bookings: ${updatedBookings.length}`);
console.log(`🏢 Service centers: ${SERVICE_CENTERS.length}`);

// Generate distribution report
const distribution = {};
SERVICE_CENTERS.forEach(center => {
    const count = updatedBookings.filter(b => b.centerId === center.id).length;
    distribution[center.name] = count;
});

console.log('\n📈 Booking Distribution:');
Object.entries(distribution).forEach(([name, count]) => {
    console.log(`   ${name}: ${count} bookings`);
});
