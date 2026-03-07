const API_URL = 'http://localhost:3000/api';

function switchTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    if (tab === 'login') {
        document.querySelectorAll('.tab')[0].classList.add('active');
        document.getElementById('loginTab').classList.add('active');
    } else {
        document.querySelectorAll('.tab')[1].classList.add('active');
        document.getElementById('registerTab').classList.add('active');
    }
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    console.log('Attempting login for:', email);
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
        
        if (!response.ok) {
            const errorEl = document.getElementById('loginError');
            errorEl.textContent = data.error || 'Login failed';
            errorEl.style.display = 'block';
            return;
        }
        
        localStorage.setItem('user', JSON.stringify(data.user));
        
        if (data.user.role === 'admin') {
            window.location.href = '/admin';
        } else {
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Login error:', error);
        document.getElementById('loginError').textContent = 'Login failed. Please check if server is running.';
    }
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            const errorEl = document.getElementById('registerError');
            errorEl.textContent = data.error;
            errorEl.style.display = 'block';
            return;
        }
        
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/';
    } catch (error) {
        document.getElementById('registerError').textContent = 'Registration failed. Please try again.';
    }
});
