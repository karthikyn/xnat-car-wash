# xNAT Car Wash Services - Project Structure

## 📁 Folder Organization

```
xNAT-Car-Wash/
├── 📂 public/                    # Client-side files (served by Express)
│   ├── 📂 assets/               # Static assets
│   │   └── 📂 images/          # Images, logos, icons
│   │       ├── logo.svg        # Main xNAT logo
│   │       └── favicon.svg     # Browser tab icon
│   │
│   ├── 📂 css/                  # Stylesheets
│   │   ├── theme.css           # Global theme variables & utilities
│   │   ├── styles.css          # Customer pages styles
│   │   └── admin.css           # Admin dashboard styles
│   │
│   ├── 📂 js/                   # Client-side JavaScript
│   │   ├── app.js              # Customer booking logic
│   │   ├── admin.js            # Admin dashboard logic
│   │   └── login.js            # Authentication logic
│   │
│   └── 📂 pages/                # HTML pages
│       ├── index.html          # Customer booking page
│       ├── login.html          # Login/Register page
│       └── admin.html          # Admin dashboard
│
├── 📂 src/                       # Server-side source code
│   ├── 📂 server/               # Backend server files
│   │   ├── server.js           # Express server & API routes
│   │   └── seed-data.js        # Dummy data generator
│   │
│   └── 📂 data/                 # Database files (JSON)
│       ├── users.json          # User accounts
│       ├── bookings.json       # Booking records
│       └── partners.json       # Partner data (if applicable)
│
├── 📂 docs/                      # Documentation
│   ├── README.md               # Project overview & setup
│   ├── BRANDING.md             # Brand guidelines
│   └── FEATURES.md             # Feature documentation
│
├── 📂 node_modules/              # Dependencies (auto-generated)
│
├── 📄 package.json               # Project configuration
├── 📄 package-lock.json          # Dependency lock file
├── 📄 .gitignore                 # Git ignore rules
└── 📄 PROJECT_STRUCTURE.md       # This file

```

## 🎯 File Purposes

### Public Directory (`public/`)
Contains all client-facing files served directly by the Express server.

#### Assets (`public/assets/`)
- **images/**: Brand assets, logos, and icons
  - `logo.svg`: Full xNAT logo with text
  - `favicon.svg`: Browser tab icon

#### CSS (`public/css/`)
- **theme.css**: Global CSS variables, utilities, and reusable components
- **styles.css**: Styles for customer-facing pages (booking, login)
- **admin.css**: Styles specific to admin dashboard

#### JavaScript (`public/js/`)
- **app.js**: Customer booking functionality
  - Form handling
  - Booking submission
  - User booking history
  - Feedback system
  
- **admin.js**: Admin dashboard functionality
  - Booking management
  - Status updates
  - Timeline viewing
  - Analytics
  
- **login.js**: Authentication
  - Login form handling
  - Registration
  - Session management

#### Pages (`public/pages/`)
- **index.html**: Main customer booking interface
- **login.html**: Login and registration page
- **admin.html**: Admin dashboard with booking management

### Source Directory (`src/`)
Contains server-side code and data.

#### Server (`src/server/`)
- **server.js**: Main Express server
  - API routes
  - Authentication endpoints
  - Booking CRUD operations
  - Static file serving
  
- **seed-data.js**: Data generation script
  - Creates dummy users
  - Generates sample bookings
  - Populates timeline data

#### Data (`src/data/`)
JSON files used as database (development only).
- **users.json**: User accounts (admin & customers)
- **bookings.json**: All booking records with timeline
- **partners.json**: Partner/service center data

### Documentation (`docs/`)
- **README.md**: Setup instructions and project overview
- **BRANDING.md**: Brand identity, colors, typography
- **FEATURES.md**: Feature list and roadmap

## 🔄 Request Flow

### Customer Booking Flow
```
1. User visits http://localhost:3000/
2. Server serves public/pages/index.html
3. Browser loads:
   - /css/theme.css
   - /css/styles.css
   - /js/app.js
   - /assets/images/logo.svg
4. User submits booking
5. POST /api/bookings
6. Server saves to src/data/bookings.json
7. Response sent back to client
```

### Admin Dashboard Flow
```
1. Admin visits http://localhost:3000/admin
2. Server serves public/pages/admin.html
3. Browser loads:
   - /css/theme.css
   - /css/admin.css
   - /js/admin.js
4. GET /api/bookings
5. Server reads from src/data/bookings.json
6. Data displayed in dashboard
```

## 🚀 Development Workflow

### Starting the Server
```bash
npm start              # Production mode
npm run dev            # Development mode (auto-restart)
```

### Generating Dummy Data
```bash
npm run seed           # Creates users and bookings
```

### File Locations
- **Edit HTML**: `public/pages/*.html`
- **Edit Styles**: `public/css/*.css`
- **Edit Client JS**: `public/js/*.js`
- **Edit Server**: `src/server/server.js`
- **Edit API Routes**: `src/server/server.js`
- **View Data**: `src/data/*.json`

## 📝 Path References

### In HTML Files
```html
<!-- CSS -->
<link rel="stylesheet" href="/css/theme.css">
<link rel="stylesheet" href="/css/styles.css">

<!-- JavaScript -->
<script src="/js/app.js"></script>

<!-- Images -->
<img src="/assets/images/logo.svg">

<!-- Navigation -->
<a href="/">Home</a>
<a href="/login">Login</a>
<a href="/admin">Admin</a>
```

### In JavaScript Files
```javascript
// API calls
fetch('/api/bookings')
fetch('/api/auth/login')

// Navigation
window.location.href = '/'
window.location.href = '/login'
window.location.href = '/admin'
```

### In Server (server.js)
```javascript
// Serve static files
app.use(express.static(path.join(__dirname, '../../public')));

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/pages/index.html'));
});

// Data files
const DB_FILE = path.join(__dirname, '../data/bookings.json');
```

## 🎨 Asset Management

### Adding New Images
1. Place in `public/assets/images/`
2. Reference as `/assets/images/filename.ext`

### Adding New Styles
1. Global styles → `public/css/theme.css`
2. Page-specific → `public/css/[page].css`

### Adding New Scripts
1. Create in `public/js/`
2. Include in HTML: `<script src="/js/filename.js"></script>`

## 🔒 Security Notes

### Data Files
- `src/data/*.json` files are gitignored
- Never commit sensitive data
- Use environment variables for production

### Static Files
- Only `public/` directory is served
- `src/` directory is not accessible from browser
- API routes require authentication

## 📦 Deployment Considerations

### Production Setup
1. Use proper database (PostgreSQL/MongoDB)
2. Move from JSON files to DB
3. Add environment variables
4. Enable HTTPS
5. Add authentication tokens (JWT)
6. Implement rate limiting

### File Structure Benefits
- ✅ Clear separation of concerns
- ✅ Easy to navigate
- ✅ Scalable architecture
- ✅ Standard Express.js pattern
- ✅ Ready for deployment

## 🛠️ Maintenance

### Adding New Features
1. **New Page**: Add HTML to `public/pages/`
2. **New Route**: Add to `src/server/server.js`
3. **New Styles**: Add to `public/css/`
4. **New Logic**: Add to `public/js/`

### Updating Existing Features
1. **UI Changes**: Edit `public/pages/*.html` and `public/css/*.css`
2. **Logic Changes**: Edit `public/js/*.js`
3. **API Changes**: Edit `src/server/server.js`
4. **Data Structure**: Update `src/data/*.json` and seed script

## 📚 Additional Resources

- Express.js Documentation: https://expressjs.com/
- Node.js Best Practices: https://github.com/goldbergyoni/nodebestpractices
- Project README: `docs/README.md`
- Brand Guidelines: `docs/BRANDING.md`

---

**Last Updated**: March 2026
**Version**: 2.0 (Reorganized Structure)
