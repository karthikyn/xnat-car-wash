# xNAT Car Wash Services

A modern, full-stack car wash booking application with customer and admin interfaces.

![xNAT Logo](public/assets/images/logo.svg)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Generate dummy data (optional)
npm run seed

# Start the server
npm start
```

Visit http://localhost:3000/login

## 📋 Default Credentials

**Admin Account:**
- Email: admin@carwash.com
- Password: admin123

**Test User Accounts:**
- Email: john@example.com / Password: password123
- Email: sarah@example.com / Password: password123
- Email: mike@example.com / Password: password123
- Email: emily@example.com / Password: password123

## ✨ Features

### Customer Features
- 🔐 User authentication (login/register)
- 📅 Book car wash services
- 📊 View booking history
- 🔔 Track booking status in real-time
- ⭐ Leave feedback and ratings
- 💳 Three service tiers (Basic, Premium, Deluxe)

### Admin Features
- 📈 Comprehensive dashboard with analytics
- 👥 Manage all customer bookings
- ✏️ Update booking status
- 👨‍🔧 Assign technicians to bookings
- 📜 View complete timeline of status changes
- 💬 View customer feedback
- 🔍 Advanced filtering and search
- 📊 Popular services analytics
- 📥 Export data to CSV

## 🏗️ Project Structure

```
xNAT-Car-Wash/
├── public/              # Client-side files
│   ├── assets/         # Images, logos
│   ├── css/            # Stylesheets
│   ├── js/             # Client JavaScript
│   └── pages/          # HTML pages
├── src/
│   ├── server/         # Backend server
│   └── data/           # JSON database
└── docs/               # Documentation
```

See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for detailed structure.

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: JSON files (development)
- **Authentication**: Session-based (localStorage)

## 📦 NPM Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server (auto-restart)
npm run seed       # Generate dummy data
```

## 🎨 Branding

- **Primary Color**: #2563eb (Professional Blue)
- **Secondary Color**: #0ea5e9 (Cyan)
- **Font**: System fonts (San Francisco, Segoe UI, Roboto)

See [docs/BRANDING.md](docs/BRANDING.md) for complete brand guidelines.

## 📖 Documentation

- [Project Structure](PROJECT_STRUCTURE.md) - Detailed folder organization
- [Brand Guidelines](docs/BRANDING.md) - Colors, typography, logo usage
- [Features](docs/FEATURES.md) - Complete feature list and roadmap

## 🔧 Configuration

### Server Port
Default: `3000`
Change in `src/server/server.js`:
```javascript
const PORT = 3000;
```

### Data Files
Located in `src/data/`:
- `users.json` - User accounts
- `bookings.json` - Booking records
- `partners.json` - Partner data

## 🚀 Deployment

### Production Recommendations
1. **Database**: Migrate from JSON to PostgreSQL/MongoDB
2. **Authentication**: Implement JWT tokens
3. **Security**: Add HTTPS, rate limiting, input validation
4. **Environment**: Use environment variables
5. **Hosting**: Deploy to Heroku, AWS, or DigitalOcean

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is proprietary software for xNAT Car Wash Services.

## 📞 Support

For support, email support@xnatcarwash.com

## 🎯 Roadmap

### High Priority
- [ ] Email/SMS notifications
- [ ] Payment integration (Stripe)
- [ ] Loyalty program
- [ ] Booking rescheduling

### Medium Priority
- [ ] Before/after photo uploads
- [ ] Live tracking
- [ ] Multi-location support
- [ ] Staff management

### Future Enhancements
- [ ] Mobile app (iOS/Android)
- [ ] Live chat support
- [ ] Weather integration
- [ ] Social media integration

See [docs/FEATURES.md](docs/FEATURES.md) for complete roadmap.

## 🏆 Credits

**Developed by**: xNAT Development Team
**Version**: 2.0
**Last Updated**: March 2026

---

Made with ❤️ for xNAT Car Wash Services
