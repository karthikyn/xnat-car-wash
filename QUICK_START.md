# 🚀 Quick Start Guide - xNAT Car Wash Services

## Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Sample Data (Optional)
```bash
npm run seed
```

This creates:
- 5 users (1 admin + 4 customers)
- 30 sample bookings
- Realistic timeline data

### 3. Start the Server
```bash
npm start
```

Server will start at: http://localhost:3000

## 🔑 Login Credentials

### Admin Dashboard
- **URL**: http://localhost:3000/admin
- **Email**: admin@carwash.com
- **Password**: admin123

### Customer Accounts
- john@example.com / password123
- sarah@example.com / password123
- mike@example.com / password123
- emily@example.com / password123

## 📱 Application URLs

| Page | URL | Description |
|------|-----|-------------|
| Login | http://localhost:3000/login | Login/Register page |
| Customer | http://localhost:3000/ | Book services |
| Admin | http://localhost:3000/admin | Manage bookings |

## 🎯 Quick Tour

### As a Customer:
1. Visit http://localhost:3000/login
2. Register a new account or login with test credentials
3. Select a service (Basic $15, Premium $30, Deluxe $50)
4. Choose date and time
5. Submit booking
6. View booking history and status
7. Leave feedback after service completion

### As an Admin:
1. Visit http://localhost:3000/login
2. Login with admin credentials
3. View dashboard with statistics
4. Manage all bookings
5. Update booking status
6. Assign technicians
7. View timeline of changes
8. Export data to CSV

## 🛠️ Development Mode

For auto-restart on file changes:
```bash
npm run dev
```

## 📂 Project Structure

```
xNAT-Car-Wash/
├── public/          # Frontend files
│   ├── assets/     # Images, logos
│   ├── css/        # Stylesheets
│   ├── js/         # Client scripts
│   └── pages/      # HTML pages
├── src/
│   ├── server/     # Backend code
│   └── data/       # JSON database
└── docs/           # Documentation
```

## 🔧 Configuration

### Change Server Port
Edit `src/server/server.js`:
```javascript
const PORT = 3000; // Change to your preferred port
```

### Data Location
All data stored in: `src/data/`
- users.json
- bookings.json
- partners.json

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Change port in src/server/server.js
```

### Cannot Find Module
```bash
npm install
```

### Data Not Loading
```bash
npm run seed
```

### Login Not Working
1. Check if server is running
2. Clear browser localStorage
3. Regenerate data: `npm run seed`

## 📚 Next Steps

1. Read [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for detailed structure
2. Check [docs/FEATURES.md](docs/FEATURES.md) for feature list
3. Review [docs/BRANDING.md](docs/BRANDING.md) for design guidelines
4. Explore the code in `public/` and `src/` directories

## 💡 Tips

- Use Chrome DevTools (F12) to debug
- Check browser console for errors
- Server logs show API requests
- Data files are in `src/data/` (JSON format)

## 🎨 Customization

### Change Colors
Edit `public/css/theme.css`:
```css
:root {
    --primary-color: #2563eb;  /* Change this */
    --secondary-color: #0ea5e9; /* And this */
}
```

### Change Logo
Replace `public/assets/images/logo.svg`

### Add New Page
1. Create HTML in `public/pages/`
2. Add route in `src/server/server.js`
3. Create CSS in `public/css/`
4. Create JS in `public/js/`

## 📞 Support

Need help? Check:
- [README.md](README.md) - Main documentation
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - File organization
- [docs/FEATURES.md](docs/FEATURES.md) - Feature details

---

**Happy Coding! 🚀**
