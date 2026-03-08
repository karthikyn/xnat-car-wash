# xNAT Car Wash Services - Data Summary

## Overview
Generated comprehensive booking data for 2 years (2025-2026) with Tamil Nadu specific details and revenue growth targets.

## Data Statistics

### Users
- **Total Users**: 300 unique customers
- **Names**: Tamil Nadu specific names (mix of male and female)
  - Examples: Rajesh Kumar, Priya Lakshmi, Vijay Prakash, Divya Bharathi, etc.
- **Phone Numbers**: Tamil Nadu format (98/99/97/96/95/94/93/90/91/92 prefixes)
- **Email**: Auto-generated based on names (@gmail.com)

### Bookings
- **Total Bookings**: 28,992
- **Completed Bookings**: 15,381
- **Year 2025**: 12,608 bookings (11,332 completed)
- **Year 2026**: 16,380 bookings (4,045 completed - many are future dates)

### Revenue Targets & Actuals

| Year | Target Revenue | Actual Revenue (Completed) | Bookings | Completed |
|------|---------------|---------------------------|----------|-----------|
| 2025 | ₹3.00 Cr | ₹2.71 Cr | 12,608 | 11,332 |
| 2026 | ₹3.90 Cr | ₹0.95 Cr | 16,380 | 4,045 |
| **Total** | **₹6.90 Cr** | **₹3.66 Cr** | **28,992** | **15,381** |

**Note**: 2026 has lower completed revenue as many bookings are future-dated (pending/in-progress).

**Growth Rate**: 30% CAGR (Compound Annual Growth Rate)

### Service Centers
20 locations across Tamil Nadu:

1. Chennai North Center (Anna Nagar) - Capacity: 25
2. Chennai South Center (Velachery) - Capacity: 22
3. Coimbatore Center (RS Puram) - Capacity: 20
4. Madurai Center (Anna Nagar) - Capacity: 18
5. Tiruchirappalli Center (Thillai Nagar) - Capacity: 16
6. Salem Center (Fairlands) - Capacity: 15
7. Tirunelveli Center (Palayamkottai) - Capacity: 14
8. Erode Center (Perundurai Road) - Capacity: 13
9. Vellore Center (Gandhi Nagar) - Capacity: 14
10. Thoothukudi Center (Palayamkottai Road) - Capacity: 12
11. Thanjavur Center (Gandhiji Road) - Capacity: 13
12. Dindigul Center (Palani Road) - Capacity: 12
13. Kanchipuram Center (Gandhi Road) - Capacity: 11
14. Karur Center (Kovai Road) - Capacity: 11
15. Nagercoil Center (Vadasery) - Capacity: 10
16. Kumbakonam Center (TSR Big Street) - Capacity: 10
17. Tiruppur Center (Kumaran Road) - Capacity: 15
18. Hosur Center (Bagalur Road) - Capacity: 14
19. Ambattur Center (CTH Road) - Capacity: 16
20. Tambaram Center (GST Road) - Capacity: 15

### Service Types & Pricing

| Service Type | Price (INR) | Cost (INR) | Margin | Distribution |
|-------------|-------------|------------|--------|--------------|
| Basic Wash | ₹1,200 | ₹840 | 30% | 35% |
| Premium Wash | ₹2,400 | ₹1,560 | 35% | 40% |
| Deluxe Detail | ₹4,000 | ₹2,400 | 40% | 25% |

**Average Revenue per Booking**: ₹2,380

### Car Models
Popular Tamil Nadu car models included:
- Maruti Swift, Hyundai i20, Honda City
- Maruti Baleno, Hyundai Creta, Tata Nexon
- Mahindra XUV500, Kia Seltos, Toyota Innova
- And 15+ more models

### Booking Status Distribution

**Past Bookings (2025 & early 2026)**:
- Completed: 90%
- Cancelled: 7%
- In-Progress: 3%

**Future Bookings (late 2026)**:
- Pending: 60%
- In-Progress: 30%
- Completed: 10%

### Customer Feedback
- **Feedback Rate**: 70% of completed bookings
- **Rating Distribution**:
  - 5 Stars: 50%
  - 4 Stars: 30%
  - 3 Stars: 15%
  - 2 Stars: 5%
- **Average Rating**: ~4.3 stars

### Timeline Tracking
All completed and cancelled bookings include detailed timeline:
1. Booking created (pending)
2. Service started (in-progress) - +30 minutes
3. Service completed/cancelled - +90 minutes

## Data Generation

### Script Location
`src/server/generate-5year-data.js`

### How to Regenerate
```bash
node src/server/generate-5year-data.js
```

### Customization Options
Edit the script to adjust:
- Number of years
- Initial revenue target
- CAGR percentage
- Number of users
- Service type distribution
- Status distribution
- Feedback rate

## File Sizes
- `users.json`: ~100 KB (300 users)
- `bookings.json`: ~23 MB (28,992 bookings)

## Notes
- All dates are in ISO format (YYYY-MM-DD)
- All times are in 24-hour format (HH:MM)
- Phone numbers follow Tamil Nadu format
- Names are authentic Tamil Nadu names
- Locations are real Tamil Nadu cities
- Revenue calculations based on completed bookings only
- Data is optimized for analytics dashboard visualization

## Future Enhancements
To add more years of data:
1. Edit `generate-5year-data.js`
2. Change the loop from 2 years to desired number
3. Adjust the starting year
4. Run the script
5. Commit and push

**Warning**: Keep total bookings under 50,000 to maintain file size under GitHub's 100 MB limit.
