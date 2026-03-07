// Use relative URL for API calls - works in both development and production
const API_URL = window.location.origin + '/api';
let currentUser = null;

// Check authentication
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
        window.location.href = '/login';
        return;
    }
    
    currentUser = user;
    document.getElementById('userName').textContent = user.name;
    
    const dateInput = document.getElementById('bookingDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    
    // Update price display when service type changes
    const serviceType = document.getElementById('serviceType');
    if (serviceType) {
        serviceType.addEventListener('change', (e) => {
            const selectedOption = e.target.options[e.target.selectedIndex];
            const price = selectedOption.getAttribute('data-price');
            const priceDisplay = document.getElementById('priceDisplay');
            
            if (price) {
                priceDisplay.textContent = `Total: ${price}`;
            } else {
                priceDisplay.textContent = '';
            }
        });
    }
    
    loadUserBookings();
});

// Handle form submission
document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const booking = {
        userId: currentUser.id,
        customerName: currentUser.name,
        phone: currentUser.phone,
        serviceRegion: document.getElementById('serviceRegion').value,
        carModel: document.getElementById('carModel').value,
        serviceType: document.getElementById('serviceType').options[document.getElementById('serviceType').selectedIndex].text,
        date: document.getElementById('bookingDate').value,
        time: document.getElementById('bookingTime').value,
        price: document.getElementById('serviceType').options[document.getElementById('serviceType').selectedIndex].getAttribute('data-price')
    };
    
    await saveBooking(booking);
});

async function saveBooking(booking) {
    try {
        console.log('Saving booking:', booking);
        
        const response = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(booking)
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Server error:', errorData);
            throw new Error(errorData.error || 'Failed to save booking');
        }
        
        const savedBooking = await response.json();
        console.log('Booking saved successfully:', savedBooking);
        showConfirmation(savedBooking);
        await loadUserBookings();
    } catch (error) {
        console.error('Booking error:', error);
        alert('Failed to save booking. Please check if server is running. Error: ' + error.message);
    }
}

function showConfirmation(booking) {
    document.getElementById('bookingForm').classList.add('hidden');
    
    const confirmationMessage = document.getElementById('confirmationMessage');
    const bookingDetails = document.getElementById('bookingDetails');
    
    bookingDetails.innerHTML = `
        <p><strong>Name:</strong> ${booking.customerName}</p>
        <p><strong>Phone:</strong> ${booking.phone}</p>
        <p><strong>Location:</strong> ${booking.serviceRegion}</p>
        <p><strong>Car:</strong> ${booking.carModel}</p>
        <p><strong>Service:</strong> ${booking.serviceType}</p>
        <p><strong>Date:</strong> ${booking.date}</p>
        <p><strong>Time:</strong> ${booking.time}</p>
        <p><strong>Total:</strong> ${booking.price}</p>
    `;
    
    confirmationMessage.classList.remove('hidden');
}

async function loadUserBookings() {
    try {
        const response = await fetch(`${API_URL}/bookings/user/${currentUser.id}`);
        if (!response.ok) throw new Error('Failed to load bookings');
        
        const bookings = await response.json();
        const bookingsList = document.getElementById('bookingsList');
        
        if (bookings.length === 0) {
            bookingsList.innerHTML = '<p class="no-bookings">No bookings yet</p>';
            return;
        }
        
        bookingsList.innerHTML = bookings.map(booking => `
            <div class="booking-item">
                <p><strong>${booking.carModel}</strong> - ${booking.serviceType}</p>
                <p>📍 ${booking.serviceRegion || 'Location not specified'}</p>
                <p>${booking.date} at ${booking.time}</p>
                <p>Status: <span class="status-badge status-${booking.status}">${booking.status}</span></p>
                <p><strong>${booking.price}</strong></p>
                ${booking.status === 'completed' && !booking.feedback ? 
                    `<button onclick="openFeedbackModal(${booking.id})" class="btn-feedback">Leave Feedback</button>` : ''}
                ${booking.feedback ? `<p class="feedback-text">Your feedback: "${booking.feedback}" (${booking.rating}⭐)</p>` : ''}
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load bookings:', error);
        document.getElementById('bookingsList').innerHTML = '<p class="no-bookings">Failed to load bookings</p>';
    }
}

function openFeedbackModal(bookingId) {
    document.getElementById('feedbackBookingId').value = bookingId;
    document.getElementById('feedbackModal').classList.remove('hidden');
}

function closeFeedbackModal() {
    document.getElementById('feedbackModal').classList.add('hidden');
    document.getElementById('feedbackForm').reset();
}

async function submitFeedback(e) {
    e.preventDefault();
    
    const bookingId = document.getElementById('feedbackBookingId').value;
    const rating = document.getElementById('rating').value;
    const feedback = document.getElementById('feedbackText').value;
    
    try {
        const response = await fetch(`${API_URL}/bookings/${bookingId}/feedback`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating, feedback })
        });
        
        if (!response.ok) throw new Error('Failed to submit feedback');
        
        closeFeedbackModal();
        await loadUserBookings();
    } catch (error) {
        alert('Failed to submit feedback. Please try again.');
    }
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = '/login';
}
