// Use relative URL for API calls - works in both development and production
const API_URL = window.location.origin + '/api';
let allBookings = [];
let currentBookingId = null;

document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || user.role !== 'admin') {
        window.location.href = '/login';
        return;
    }
    
    document.getElementById('adminName').textContent = user.name;
    loadBookings();
    loadPartners();
    
    document.getElementById('statusFilter').addEventListener('change', filterBookings);
    document.getElementById('dateFilter').addEventListener('change', filterBookings);
    document.getElementById('searchFilter').addEventListener('input', filterBookings);
});

async function loadBookings() {
    try {
        const response = await fetch(`${API_URL}/bookings`);
        if (!response.ok) throw new Error('Failed to load bookings');
        
        allBookings = await response.json();
        displayBookings(allBookings);
        updateStats(allBookings);
    } catch (error) {
        console.error('Failed to load bookings:', error);
        document.getElementById('bookingsTableBody').innerHTML = 
            '<tr><td colspan="10" class="loading">Failed to load bookings</td></tr>';
    }
}

function displayBookings(bookings) {
    const tbody = document.getElementById('bookingsTableBody');
    
    if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="loading">No bookings found</td></tr>';
        return;
    }
    
    tbody.innerHTML = bookings.map(booking => `
        <tr>
            <td>#${booking.id}</td>
            <td>${booking.customerName}</td>
            <td>${booking.phone}</td>
            <td>${booking.serviceRegion || 'N/A'}</td>
            <td>${booking.carModel}</td>
            <td>${booking.serviceType}</td>
            <td>${booking.date}</td>
            <td>${booking.time}</td>
            <td>${booking.price}</td>
            <td><span class="status-badge status-${booking.status || 'pending'}">${booking.status || 'pending'}</span></td>
            <td>
                <button onclick="openModal(${booking.id})" class="btn-update">Update</button>
                <button onclick="deleteBooking(${booking.id})" class="btn-delete">Delete</button>
            </td>
        </tr>
    `).join('');
}

function updateStats(bookings) {
    const total = bookings.length;
    const pending = bookings.filter(b => !b.status || b.status === 'pending').length;
    const inProgress = bookings.filter(b => b.status === 'in-progress').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const revenue = bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + parseFloat(b.price), 0);
    
    const ratings = bookings.filter(b => b.rating).map(b => parseInt(b.rating));
    const avgRating = ratings.length > 0 
        ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1)
        : '0';
    
    document.getElementById('totalBookings').textContent = total;
    document.getElementById('pendingBookings').textContent = pending;
    document.getElementById('inProgressBookings').textContent = inProgress;
    document.getElementById('completedBookings').textContent = completed;
    document.getElementById('totalRevenue').textContent = `₹${revenue.toFixed(2)}`;
    document.getElementById('avgRating').textContent = avgRating + '⭐';
    
    // Popular services
    const serviceCounts = {};
    bookings.forEach(b => {
        const service = b.serviceType.split(' - ')[0];
        serviceCounts[service] = (serviceCounts[service] || 0) + 1;
    });
    
    const popularServices = Object.entries(serviceCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([service, count]) => `<p style="margin:8px 0;color:#666;">${service}: <strong>${count}</strong> bookings</p>`)
        .join('');
    
    document.getElementById('popularServices').innerHTML = popularServices || '<p style="color:#999;">No data</p>';
    
    // Recent feedback
    const recentFeedback = bookings
        .filter(b => b.feedback)
        .sort((a, b) => new Date(b.feedbackAt) - new Date(a.feedbackAt))
        .slice(0, 3)
        .map(b => `<p style="margin:8px 0;color:#666;font-size:14px;">${b.rating}⭐ - ${b.customerName}: "${b.feedback.substring(0, 50)}${b.feedback.length > 50 ? '...' : ''}"</p>`)
        .join('');
    
    document.getElementById('recentFeedback').innerHTML = recentFeedback || '<p style="color:#999;">No feedback yet</p>';
}

function filterBookings() {
    const statusFilter = document.getElementById('statusFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    const searchFilter = document.getElementById('searchFilter').value.toLowerCase();
    
    let filtered = allBookings;
    
    if (statusFilter !== 'all') {
        filtered = filtered.filter(b => (b.status || 'pending') === statusFilter);
    }
    
    if (dateFilter) {
        filtered = filtered.filter(b => b.date === dateFilter);
    }
    
    if (searchFilter) {
        filtered = filtered.filter(b => 
            b.customerName.toLowerCase().includes(searchFilter) ||
            b.phone.includes(searchFilter) ||
            b.carModel.toLowerCase().includes(searchFilter)
        );
    }
    
    displayBookings(filtered);
}

function clearFilters() {
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('dateFilter').value = '';
    document.getElementById('searchFilter').value = '';
    displayBookings(allBookings);
}

function exportData() {
    const csv = [
        ['ID', 'Customer', 'Phone', 'Car', 'Service', 'Date', 'Time', 'Price', 'Status', 'Rating', 'Feedback'],
        ...allBookings.map(b => [
            b.id,
            b.customerName,
            b.phone,
            b.carModel,
            b.serviceType,
            b.date,
            b.time,
            b.price,
            b.status || 'pending',
            b.rating || '',
            b.feedback ? `"${b.feedback.replace(/"/g, '""')}"` : ''
        ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

function openModal(bookingId) {
    const booking = allBookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    currentBookingId = bookingId;
    document.getElementById('modalBookingInfo').textContent = 
        `${booking.customerName} - ${booking.carModel} (${booking.date} at ${booking.time})`;
    document.getElementById('modalStatus').value = booking.status || 'pending';
    document.getElementById('modalTechnician').value = 'Admin';
    document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
    currentBookingId = null;
}

async function updateStatus() {
    const newStatus = document.getElementById('modalStatus').value;
    const technician = document.getElementById('modalTechnician').value;
    
    try {
        const response = await fetch(`${API_URL}/bookings/${currentBookingId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus, technician: technician })
        });
        
        if (!response.ok) throw new Error('Failed to update status');
        
        closeModal();
        await loadBookings();
    } catch (error) {
        alert('Failed to update status. Please try again.');
        console.error(error);
    }
}

async function deleteBooking(bookingId) {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    
    try {
        const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete booking');
        
        await loadBookings();
    } catch (error) {
        alert('Failed to delete booking. Please try again.');
        console.error(error);
    }
}


function displayBookings(bookings) {
    const tbody = document.getElementById('bookingsTableBody');
    
    if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="12" class="loading">No bookings found</td></tr>';
        return;
    }
    
    tbody.innerHTML = bookings.map(booking => `
        <tr>
            <td>#${booking.id}</td>
            <td>${booking.customerName}</td>
            <td>${booking.phone}</td>
            <td>${booking.serviceRegion || 'N/A'}</td>
            <td>${booking.carModel}</td>
            <td>${booking.serviceType}</td>
            <td>${booking.date}</td>
            <td>${booking.time}</td>
            <td>${booking.price}</td>
            <td><span class="status-badge status-${booking.status || 'pending'}">${booking.status || 'pending'}</span></td>
            <td>${booking.feedback ? `${booking.rating}⭐ - ${booking.feedback}` : 'No feedback'}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="viewTimeline(${booking.id})" class="btn-timeline">Timeline</button>
                    <button onclick="openModal(${booking.id})" class="btn-update">Update</button>
                    <button onclick="deleteBooking(${booking.id})" class="btn-delete">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = '/login';
}


function viewTimeline(bookingId) {
    const booking = allBookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    const timelineContent = document.getElementById('timelineContent');
    
    if (!booking.timeline || booking.timeline.length === 0) {
        timelineContent.innerHTML = '<p style="color:#999;text-align:center;padding:20px;">No timeline data available</p>';
    } else {
        timelineContent.innerHTML = `
            <div style="margin-bottom:20px;padding:15px;background:#f5f5f5;border-radius:6px;">
                <p><strong>Booking #${booking.id}</strong></p>
                <p>${booking.customerName} - ${booking.carModel}</p>
                <p>${booking.date} at ${booking.time}</p>
            </div>
            <div class="timeline">
                ${booking.timeline.map(event => `
                    <div class="timeline-item ${event.status}">
                        <div class="timeline-status">
                            <span class="status-badge status-${event.status}">${event.status}</span>
                        </div>
                        <div class="timeline-time">${formatDateTime(event.timestamp)}</div>
                        <div class="timeline-technician">👤 ${event.technician}</div>
                        <div class="timeline-action">${event.action}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    document.getElementById('timelineModal').classList.remove('hidden');
}

function closeTimelineModal() {
    document.getElementById('timelineModal').classList.add('hidden');
}

function formatDateTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

async function updateStatus() {
    const newStatus = document.getElementById('modalStatus').value;
    const technician = document.getElementById('modalTechnician').value;
    
    try {
        const response = await fetch(`${API_URL}/bookings/${currentBookingId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus, technician: technician })
        });
        
        if (!response.ok) throw new Error('Failed to update status');
        
        closeModal();
        await loadBookings();
    } catch (error) {
        alert('Failed to update status. Please try again.');
        console.error(error);
    }
}


// Partner Management Functions
async function loadPartners() {
    try {
        const response = await fetch(`${API_URL}/partners`);
        if (!response.ok) throw new Error('Failed to load partners');
        
        const partners = await response.json();
        displayPartners(partners);
    } catch (error) {
        console.error('Failed to load partners:', error);
    }
}

function displayPartners(partners) {
    const grid = document.getElementById('partnersGrid');
    
    grid.innerHTML = partners.map(partner => `
        <div style="background:white;padding:24px;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,0.08);border:1px solid #e0e0e0;transition:all 0.3s ease;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <h3 style="margin:0;color:#1a237e;font-size:22px;font-weight:600;">${partner.name}</h3>
                <span style="background:#e8eaf6;color:#1a237e;padding:6px 14px;border-radius:20px;font-size:13px;font-weight:600;">${partner.profitShare}% Share</span>
            </div>
            
            <div style="background:#f5f7fa;padding:16px;border-radius:8px;margin-bottom:16px;">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                    <div>
                        <p style="color:#666;margin:0;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Total Earnings</p>
                        <p style="color:#333;margin:4px 0 0 0;font-size:18px;font-weight:600;">₹${partner.totalEarnings.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    </div>
                    <div>
                        <p style="color:#666;margin:0;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Expenses</p>
                        <p style="color:#333;margin:4px 0 0 0;font-size:18px;font-weight:600;">₹${partner.expenses.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    </div>
                </div>
                
                <div style="margin-top:16px;padding-top:16px;border-top:1px solid #e0e0e0;">
                    <p style="color:#666;margin:0;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Outstanding Due</p>
                    <p style="color:${partner.outstandingDue > 0 ? '#d32f2f' : partner.outstandingDue < 0 ? '#388e3c' : '#666'};margin:4px 0 0 0;font-size:24px;font-weight:700;">₹${Math.abs(partner.outstandingDue).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    ${partner.outstandingDue > 0 ? '<p style="color:#d32f2f;margin:4px 0 0 0;font-size:11px;font-weight:500;">⚠️ Payment Due</p>' : partner.outstandingDue < 0 ? '<p style="color:#388e3c;margin:4px 0 0 0;font-size:11px;font-weight:500;">✓ Overpaid</p>' : '<p style="color:#666;margin:4px 0 0 0;font-size:11px;font-weight:500;">✓ Settled</p>'}
                </div>
            </div>
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
                <button onclick="openExpenseModal(${partner.id})" style="padding:10px 16px;background:#1a237e;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:13px;transition:all 0.2s;text-transform:uppercase;letter-spacing:0.5px;" onmouseover="this.style.background='#283593'" onmouseout="this.style.background='#1a237e'">
                    💸 Add Expense
                </button>
                <button onclick="openPaymentModal(${partner.id})" style="padding:10px 16px;background:#2e7d32;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:13px;transition:all 0.2s;text-transform:uppercase;letter-spacing:0.5px;" onmouseover="this.style.background='#388e3c'" onmouseout="this.style.background='#2e7d32'">
                    💵 Record Payment
                </button>
            </div>
            <button onclick="viewTransactions(${partner.id})" style="width:100%;padding:10px 16px;background:#f5f7fa;color:#1a237e;border:2px solid #e0e0e0;border-radius:8px;cursor:pointer;font-weight:600;font-size:13px;transition:all 0.2s;text-transform:uppercase;letter-spacing:0.5px;" onmouseover="this.style.background='#e8eaf6';this.style.borderColor='#1a237e'" onmouseout="this.style.background='#f5f7fa';this.style.borderColor='#e0e0e0'">
                📊 View Transactions
            </button>
        </div>
    `).join('');
}

function openExpenseModal(partnerId) {
    document.getElementById('expensePartnerId').value = partnerId;
    document.getElementById('expenseModal').classList.remove('hidden');
}

function closeExpenseModal() {
    document.getElementById('expenseModal').classList.add('hidden');
    document.getElementById('expenseForm').reset();
}

async function submitExpense(e) {
    e.preventDefault();
    
    const partnerId = document.getElementById('expensePartnerId').value;
    const amount = document.getElementById('expenseAmount').value;
    const description = document.getElementById('expenseDescription').value;
    
    try {
        const response = await fetch(`${API_URL}/partners/${partnerId}/expense`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, description })
        });
        
        if (!response.ok) throw new Error('Failed to add expense');
        
        closeExpenseModal();
        await loadPartners();
        alert('Expense added successfully!');
    } catch (error) {
        alert('Failed to add expense. Please try again.');
    }
}

function openPaymentModal(partnerId) {
    document.getElementById('paymentPartnerId').value = partnerId;
    document.getElementById('paymentModal').classList.remove('hidden');
}

function closePaymentModal() {
    document.getElementById('paymentModal').classList.add('hidden');
    document.getElementById('paymentForm').reset();
}

async function submitPayment(e) {
    e.preventDefault();
    
    const partnerId = document.getElementById('paymentPartnerId').value;
    const amount = document.getElementById('paymentAmount').value;
    const description = document.getElementById('paymentDescription').value;
    
    try {
        const response = await fetch(`${API_URL}/partners/${partnerId}/payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, description })
        });
        
        if (!response.ok) throw new Error('Failed to record payment');
        
        closePaymentModal();
        await loadPartners();
        alert('Payment recorded successfully!');
    } catch (error) {
        alert('Failed to record payment. Please try again.');
    }
}

async function distributeProfit() {
    if (!confirm('This will distribute profit from all completed bookings to partners based on their profit share. Continue?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/partners/distribute-profit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) throw new Error('Failed to distribute profit');
        
        const result = await response.json();
        await loadPartners();
        alert(`Profit distributed successfully! Total Revenue: ₹${result.totalRevenue.toFixed(2)}`);
    } catch (error) {
        alert('Failed to distribute profit. Please try again.');
        console.error(error);
    }
}

async function viewTransactions(partnerId) {
    try {
        const response = await fetch(`${API_URL}/partners`);
        if (!response.ok) throw new Error('Failed to load partners');
        
        const partners = await response.json();
        const partner = partners.find(p => p.id === partnerId);
        
        if (!partner) return;
        
        const content = document.getElementById('transactionsContent');
        
        if (!partner.transactions || partner.transactions.length === 0) {
            content.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">No transactions yet</p>';
        } else {
            const sortedTransactions = [...partner.transactions].sort((a, b) => 
                new Date(b.date) - new Date(a.date)
            );
            
            content.innerHTML = `
                <h3 style="margin-bottom:15px;color:#333;">${partner.name}'s Transactions</h3>
                <table style="width:100%;border-collapse:collapse;">
                    <thead>
                        <tr style="background:#f5f5f5;">
                            <th style="padding:12px;text-align:left;border-bottom:2px solid #ddd;">Date</th>
                            <th style="padding:12px;text-align:left;border-bottom:2px solid #ddd;">Type</th>
                            <th style="padding:12px;text-align:left;border-bottom:2px solid #ddd;">Description</th>
                            <th style="padding:12px;text-align:right;border-bottom:2px solid #ddd;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sortedTransactions.map(t => `
                            <tr>
                                <td style="padding:12px;border-bottom:1px solid #eee;">${new Date(t.date).toLocaleDateString()}</td>
                                <td style="padding:12px;border-bottom:1px solid #eee;">
                                    <span style="padding:4px 8px;border-radius:4px;font-size:12px;font-weight:600;background:${
                                        t.type === 'profit' ? '#e8f5e9' : t.type === 'expense' ? '#fff3e0' : '#e3f2fd'
                                    };color:${
                                        t.type === 'profit' ? '#4caf50' : t.type === 'expense' ? '#ff9800' : '#2196f3'
                                    };">${t.type.toUpperCase()}</span>
                                </td>
                                <td style="padding:12px;border-bottom:1px solid #eee;">${t.description}</td>
                                <td style="padding:12px;border-bottom:1px solid #eee;text-align:right;font-weight:600;color:${
                                    t.type === 'expense' ? '#f44336' : '#4caf50'
                                };">${t.type === 'expense' ? '+' : '-'}₹${t.amount.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }
        
        document.getElementById('transactionsModal').classList.remove('hidden');
    } catch (error) {
        alert('Failed to load transactions. Please try again.');
    }
}

function closeTransactionsModal() {
    document.getElementById('transactionsModal').classList.add('hidden');
}
