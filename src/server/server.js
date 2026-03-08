const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, '../data/bookings.json');
const USERS_FILE = path.join(__dirname, '../data/users.json');
const PARTNERS_FILE = path.join(__dirname, '../data/partners.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../public')));

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/pages/index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/pages/login.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/pages/admin.html'));
});

app.get('/dashboards', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/pages/dashboards.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/pages/profile.html'));
});

// Initialize database files
async function initDB() {
    try {
        // Ensure data directory exists
        const dataDir = path.join(__dirname, '../data');
        try {
            await fs.access(dataDir);
        } catch {
            await fs.mkdir(dataDir, { recursive: true });
        }
        
        // Initialize bookings file
        try {
            await fs.access(DB_FILE);
        } catch {
            await fs.writeFile(DB_FILE, JSON.stringify([]));
        }
        
        // Initialize users file
        try {
            await fs.access(USERS_FILE);
        } catch {
            // Create default admin user
            const defaultUsers = [{
                id: 1,
                name: 'Admin',
                email: 'admin@carwash.com',
                phone: '1234567890',
                password: 'admin123',
                role: 'admin'
            }];
            await fs.writeFile(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
        }
        
        // Initialize partners file
        try {
            await fs.access(PARTNERS_FILE);
        } catch {
            const defaultPartners = [
                { id: 1, name: 'Pavi', profitShare: 50, expenses: 0, outstandingDue: 0, totalEarnings: 0, transactions: [] },
                { id: 2, name: 'Kiruthi', profitShare: 12.5, expenses: 0, outstandingDue: 0, totalEarnings: 0, transactions: [] },
                { id: 3, name: 'Siva', profitShare: 12.5, expenses: 0, outstandingDue: 0, totalEarnings: 0, transactions: [] },
                { id: 4, name: 'Bharat', profitShare: 12.5, expenses: 0, outstandingDue: 0, totalEarnings: 0, transactions: [] },
                { id: 5, name: 'Vasanth', profitShare: 12.5, expenses: 0, outstandingDue: 0, totalEarnings: 0, transactions: [] }
            ];
            await fs.writeFile(PARTNERS_FILE, JSON.stringify(defaultPartners, null, 2));
        }
    } catch (error) {
        console.error('Database initialization error:', error);
        throw error;
    }
}

// Auth routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const data = await fs.readFile(USERS_FILE, 'utf8');
        const users = JSON.parse(data);
        
        if (users.find(u => u.email === req.body.email)) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        
        const newUser = {
            id: Date.now(),
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
            role: 'user'
        };
        
        users.push(newUser);
        await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
        
        const { password, ...userWithoutPassword } = newUser;
        res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        console.log('Login attempt:', req.body.email);
        const data = await fs.readFile(USERS_FILE, 'utf8');
        const users = JSON.parse(data);
        
        console.log('Users in database:', users.length);
        
        const user = users.find(u => u.email === req.body.email && u.password === req.body.password);
        
        if (!user) {
            console.log('User not found or password mismatch');
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        console.log('Login successful for:', user.email);
        const { password, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get all bookings (admin only)
app.get('/api/bookings', async (req, res) => {
    try {
        const data = await fs.readFile(DB_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Failed to read bookings' });
    }
});

// Get user bookings
app.get('/api/bookings/user/:userId', async (req, res) => {
    try {
        const data = await fs.readFile(DB_FILE, 'utf8');
        const bookings = JSON.parse(data);
        const userBookings = bookings.filter(b => b.userId === parseInt(req.params.userId));
        res.json(userBookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read bookings' });
    }
});

// Create new booking
app.post('/api/bookings', async (req, res) => {
    try {
        console.log('Creating booking:', req.body);
        const data = await fs.readFile(DB_FILE, 'utf8');
        const bookings = JSON.parse(data);
        
        const newBooking = {
            id: Date.now(),
            ...req.body,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        bookings.push(newBooking);
        await fs.writeFile(DB_FILE, JSON.stringify(bookings, null, 2));
        
        console.log('Booking created successfully:', newBooking.id);
        res.status(201).json(newBooking);
    } catch (error) {
        console.error('Failed to create booking:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
});

// Update booking status
app.patch('/api/bookings/:id', async (req, res) => {
    try {
        console.log('Updating booking:', req.params.id, req.body);
        const data = await fs.readFile(DB_FILE, 'utf8');
        const bookings = JSON.parse(data);
        
        const index = bookings.findIndex(b => b.id === parseInt(req.params.id));
        if (index === -1) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        const oldStatus = bookings[index].status || 'pending';
        const newStatus = req.body.status;
        const technician = req.body.technician || 'Admin';
        
        // Initialize timeline if it doesn't exist
        if (!bookings[index].timeline) {
            bookings[index].timeline = [{
                status: oldStatus,
                timestamp: bookings[index].createdAt,
                technician: 'System',
                action: 'Booking created'
            }];
        }
        
        // Add new timeline entry
        if (oldStatus !== newStatus) {
            bookings[index].timeline.push({
                status: newStatus,
                timestamp: new Date().toISOString(),
                technician: technician,
                action: `Status changed from ${oldStatus} to ${newStatus}`
            });
        }
        
        bookings[index] = {
            ...bookings[index],
            ...req.body,
            updatedAt: new Date().toISOString()
        };
        
        await fs.writeFile(DB_FILE, JSON.stringify(bookings, null, 2));
        res.json(bookings[index]);
    } catch (error) {
        console.error('Failed to update booking:', error);
        res.status(500).json({ error: 'Failed to update booking' });
    }
});

// Add feedback to booking
app.patch('/api/bookings/:id/feedback', async (req, res) => {
    try {
        const data = await fs.readFile(DB_FILE, 'utf8');
        const bookings = JSON.parse(data);
        
        const index = bookings.findIndex(b => b.id === parseInt(req.params.id));
        if (index === -1) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        bookings[index] = {
            ...bookings[index],
            rating: req.body.rating,
            feedback: req.body.feedback,
            feedbackAt: new Date().toISOString()
        };
        
        await fs.writeFile(DB_FILE, JSON.stringify(bookings, null, 2));
        res.json(bookings[index]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add feedback' });
    }
});

// Delete booking
app.delete('/api/bookings/:id', async (req, res) => {
    try {
        const data = await fs.readFile(DB_FILE, 'utf8');
        const bookings = JSON.parse(data);
        
        const filtered = bookings.filter(b => b.id !== parseInt(req.params.id));
        await fs.writeFile(DB_FILE, JSON.stringify(filtered, null, 2));
        
        res.json({ message: 'Booking deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete booking' });
    }
});

// Partner routes
app.get('/api/partners', async (req, res) => {
    try {
        const data = await fs.readFile(PARTNERS_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Failed to read partners' });
    }
});

app.post('/api/partners/:id/expense', async (req, res) => {
    try {
        const data = await fs.readFile(PARTNERS_FILE, 'utf8');
        const partners = JSON.parse(data);
        
        const index = partners.findIndex(p => p.id === parseInt(req.params.id));
        if (index === -1) {
            return res.status(404).json({ error: 'Partner not found' });
        }
        
        const { amount, description } = req.body;
        const transaction = {
            id: Date.now(),
            type: 'expense',
            amount: parseFloat(amount),
            description,
            date: new Date().toISOString()
        };
        
        partners[index].expenses += parseFloat(amount);
        partners[index].outstandingDue += parseFloat(amount);
        partners[index].transactions.push(transaction);
        
        await fs.writeFile(PARTNERS_FILE, JSON.stringify(partners, null, 2));
        res.json(partners[index]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add expense' });
    }
});

app.post('/api/partners/:id/payment', async (req, res) => {
    try {
        const data = await fs.readFile(PARTNERS_FILE, 'utf8');
        const partners = JSON.parse(data);
        
        const index = partners.findIndex(p => p.id === parseInt(req.params.id));
        if (index === -1) {
            return res.status(404).json({ error: 'Partner not found' });
        }
        
        const { amount, description } = req.body;
        const transaction = {
            id: Date.now(),
            type: 'payment',
            amount: parseFloat(amount),
            description,
            date: new Date().toISOString()
        };
        
        partners[index].outstandingDue -= parseFloat(amount);
        partners[index].transactions.push(transaction);
        
        await fs.writeFile(PARTNERS_FILE, JSON.stringify(partners, null, 2));
        res.json(partners[index]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to record payment' });
    }
});

app.post('/api/partners/distribute-profit', async (req, res) => {
    try {
        const partnersData = await fs.readFile(PARTNERS_FILE, 'utf8');
        const bookingsData = await fs.readFile(DB_FILE, 'utf8');
        
        const partners = JSON.parse(partnersData);
        const bookings = JSON.parse(bookingsData);
        
        const completedBookings = bookings.filter(b => b.status === 'completed');
        const totalRevenue = completedBookings.reduce((sum, b) => {
            const price = parseFloat(b.price.replace('₹', ''));
            return sum + price;
        }, 0);
        
        partners.forEach(partner => {
            const share = (totalRevenue * partner.profitShare) / 100;
            const transaction = {
                id: Date.now() + partner.id,
                type: 'profit',
                amount: share,
                description: `Profit distribution from ${completedBookings.length} completed bookings`,
                date: new Date().toISOString()
            };
            
            partner.totalEarnings += share;
            partner.outstandingDue += share; // We OWE them their profit share
            partner.transactions.push(transaction);
        });
        
        await fs.writeFile(PARTNERS_FILE, JSON.stringify(partners, null, 2));
        res.json({ totalRevenue, partners });
    } catch (error) {
        res.status(500).json({ error: 'Failed to distribute profit' });
    }
});

initDB().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`Login page: /login`);
        console.log(`Default admin: admin@carwash.com / admin123`);
    });
}).catch(error => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
});
