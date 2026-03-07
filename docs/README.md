# Car Wash Booking App

A web application with backend for customers to book car wash services.

## Features

- Book car wash appointments with date and time selection
- Three service tiers: Basic ($15), Premium ($30), Deluxe ($50)
- View all bookings
- Booking confirmation with details
- Responsive design for mobile and desktop
- Backend API with persistent storage
- Admin dashboard to manage bookings
- Update booking status (Pending, In Progress, Completed, Cancelled)
- Filter bookings by status and date
- Real-time statistics and revenue tracking

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: JSON file storage

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create dummy data (optional):
```bash
npm run seed
```

This creates 5 users and 30 bookings with various statuses and feedback.

## How to Run

1. Start the server:
```bash
npm start
```

2. Open your browser and go to:
```
http://localhost:3000
```

## Development Mode

For auto-restart on file changes:
```bash
npm run dev
```

## API Endpoints

- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create new booking
- `PATCH /api/bookings/:id` - Update booking status
- `DELETE /api/bookings/:id` - Delete booking

## Admin Dashboard

Access the admin dashboard at:
```
http://localhost:3000/admin.html
```

Features:
- View all bookings in a table
- Update booking status
- Delete bookings
- Filter by status and date
- View statistics (total bookings, pending, completed, revenue)

## Usage

1. Start the server: `npm start`
2. Open http://localhost:3000/login.html
3. Register a new account or login with:
   - Admin: admin@carwash.com / admin123
   - Regular users: Create your own account

### For Users:
- Book car wash services
- View booking history with status
- Leave feedback after service completion
- Track booking status in real-time

### For Admin:
- View all bookings
- Update booking status
- View customer feedback
- Filter bookings by status and date
- Track revenue and statistics
