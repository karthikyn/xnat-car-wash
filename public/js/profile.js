// Profile Page JavaScript
const API_URL = window.location.origin + '/api';
let currentUser = null;
let userVehicles = [];

// Ghibli-style avatar URLs (using placeholder service with anime/ghibli style)
const ghibliAvatars = [
    'https://i.pravatar.cc/150?img=1',
    'https://i.pravatar.cc/150?img=2',
    'https://i.pravatar.cc/150?img=3',
    'https://i.pravatar.cc/150?img=5',
    'https://i.pravatar.cc/150?img=8',
    'https://i.pravatar.cc/150?img=9',
    'https://i.pravatar.cc/150?img=12',
    'https://i.pravatar.cc/150?img=13',
    'https://i.pravatar.cc/150?img=14',
    'https://i.pravatar.cc/150?img=15',
    'https://i.pravatar.cc/150?img=16',
    'https://i.pravatar.cc/150?img=17',
    'https://i.pravatar.cc/150?img=18',
    'https://i.pravatar.cc/150?img=20',
    'https://i.pravatar.cc/150?img=23',
    'https://i.pravatar.cc/150?img=24',
    'https://i.pravatar.cc/150?img=25',
    'https://i.pravatar.cc/150?img=26',
    'https://i.pravatar.cc/150?img=27',
    'https://i.pravatar.cc/150?img=28',
    'https://i.pravatar.cc/150?img=29',
    'https://i.pravatar.cc/150?img=30',
    'https://i.pravatar.cc/150?img=31',
    'https://i.pravatar.cc/150?img=32'
];

document.addEventListener('DOMContentLoaded', () => {
    currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    
    if (!currentUser) {
        window.location.href = '/login';
        return;
    }
    
    loadProfile();
    loadVehicles();
    loadStats();
    initializeAvatarGrid();
});

function loadProfile() {
    // Load user profile data
    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    
    // Set avatar
    const avatar = profile.avatar || ghibliAvatars[0];
    document.getElementById('currentAvatar').src = avatar;
    
    // Set user info
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userEmail').textContent = currentUser.email;
    document.getElementById('userPhone').textContent = currentUser.phone || 'Not provided';
    
    // Set member since (use current date if not available)
    const memberSince = profile.memberSince || new Date().toISOString().split('T')[0];
    document.getElementById('memberSince').textContent = new Date(memberSince).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long'
    });
}

function loadVehicles() {
    // Load vehicles from localStorage
    const vehicles = JSON.parse(localStorage.getItem(`vehicles_${currentUser.id}`) || '[]');
    userVehicles = vehicles;
    displayVehicles(vehicles);
}

function displayVehicles(vehicles) {
    const grid = document.getElementById('vehiclesGrid');
    
    if (vehicles.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🚗</div>
                <p>No vehicles added yet</p>
                <p style="font-size: 14px; margin-top: 8px;">Click "Add Vehicle" to get started</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = vehicles.map((vehicle, index) => `
        <div class="vehicle-card">
            <div class="vehicle-icon">🚗</div>
            <h3 class="vehicle-name">${vehicle.name}</h3>
            <p class="vehicle-model">${vehicle.model}</p>
            <div class="vehicle-details">
                <div class="vehicle-detail">📋 ${vehicle.registration}</div>
                <div class="vehicle-detail">🎨 ${vehicle.color}</div>
                <div class="vehicle-detail">📅 ${vehicle.year}</div>
            </div>
            <div class="vehicle-actions">
                <button onclick="deleteVehicle(${index})" class="btn-delete-vehicle">Delete</button>
            </div>
        </div>
    `).join('');
}

async function loadStats() {
    try {
        const response = await fetch(`${API_URL}/bookings/user/${currentUser.id}`);
        if (!response.ok) throw new Error('Failed to load bookings');
        
        const bookings = await response.json();
        
        const total = bookings.length;
        const completed = bookings.filter(b => b.status === 'completed').length;
        const totalSpent = bookings
            .filter(b => b.status === 'completed')
            .reduce((sum, b) => {
                const price = parseInt(b.price.replace('₹', '').replace(',', ''));
                return sum + price;
            }, 0);
        
        const ratings = bookings.filter(b => b.rating).map(b => parseInt(b.rating));
        const avgRating = ratings.length > 0 
            ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1)
            : '0.0';
        
        document.getElementById('totalBookings').textContent = total;
        document.getElementById('completedBookings').textContent = completed;
        document.getElementById('totalSpent').textContent = `₹${totalSpent.toLocaleString()}`;
        document.getElementById('avgRating').textContent = avgRating;
    } catch (error) {
        console.error('Failed to load stats:', error);
    }
}

// Avatar Modal Functions
function initializeAvatarGrid() {
    const grid = document.getElementById('avatarGrid');
    grid.innerHTML = ghibliAvatars.map((avatar, index) => `
        <div class="avatar-option" onclick="selectAvatar('${avatar}')">
            <img src="${avatar}" alt="Avatar ${index + 1}">
        </div>
    `).join('');
}

function openAvatarModal() {
    document.getElementById('avatarModal').classList.remove('hidden');
}

function closeAvatarModal() {
    document.getElementById('avatarModal').classList.add('hidden');
}

function selectAvatar(avatarUrl) {
    // Update avatar display
    document.getElementById('currentAvatar').src = avatarUrl;
    
    // Save to localStorage
    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    profile.avatar = avatarUrl;
    localStorage.setItem('userProfile', JSON.stringify(profile));
    
    closeAvatarModal();
    
    // Show success message
    showNotification('Avatar updated successfully!', 'success');
}

// Edit Profile Functions
function openEditModal() {
    document.getElementById('editName').value = currentUser.name;
    document.getElementById('editEmail').value = currentUser.email;
    document.getElementById('editPhone').value = currentUser.phone || '';
    document.getElementById('editModal').classList.remove('hidden');
}

function closeEditModal() {
    document.getElementById('editModal').classList.add('hidden');
}

function saveProfile() {
    const name = document.getElementById('editName').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const phone = document.getElementById('editPhone').value.trim();
    
    if (!name || !email) {
        showNotification('Name and email are required', 'error');
        return;
    }
    
    // Update user object
    currentUser.name = name;
    currentUser.email = email;
    currentUser.phone = phone;
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(currentUser));
    
    // Update display
    loadProfile();
    closeEditModal();
    
    showNotification('Profile updated successfully!', 'success');
}

// Vehicle Functions
function openAddVehicleModal() {
    // Clear form
    document.getElementById('vehicleName').value = '';
    document.getElementById('vehicleModel').value = '';
    document.getElementById('vehicleReg').value = '';
    document.getElementById('vehicleColor').value = '';
    document.getElementById('vehicleYear').value = '';
    
    document.getElementById('vehicleModal').classList.remove('hidden');
}

function closeVehicleModal() {
    document.getElementById('vehicleModal').classList.add('hidden');
}

function saveVehicle() {
    const name = document.getElementById('vehicleName').value.trim();
    const model = document.getElementById('vehicleModel').value.trim();
    const registration = document.getElementById('vehicleReg').value.trim();
    const color = document.getElementById('vehicleColor').value.trim();
    const year = document.getElementById('vehicleYear').value.trim();
    
    if (!name || !model || !registration) {
        showNotification('Name, model, and registration are required', 'error');
        return;
    }
    
    const vehicle = {
        id: Date.now(),
        name,
        model,
        registration: registration.toUpperCase(),
        color: color || 'Not specified',
        year: year || 'Not specified'
    };
    
    // Add to vehicles array
    userVehicles.push(vehicle);
    
    // Save to localStorage
    localStorage.setItem(`vehicles_${currentUser.id}`, JSON.stringify(userVehicles));
    
    // Update display
    displayVehicles(userVehicles);
    closeVehicleModal();
    
    showNotification('Vehicle added successfully!', 'success');
}

function deleteVehicle(index) {
    if (!confirm('Are you sure you want to delete this vehicle?')) {
        return;
    }
    
    // Remove from array
    userVehicles.splice(index, 1);
    
    // Save to localStorage
    localStorage.setItem(`vehicles_${currentUser.id}`, JSON.stringify(userVehicles));
    
    // Update display
    displayVehicles(userVehicles);
    
    showNotification('Vehicle deleted successfully!', 'success');
}

// Notification Function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#2e7d32' : type === 'error' ? '#c62828' : '#1a237e'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-size: 14px;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
