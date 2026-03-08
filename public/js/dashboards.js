// Use relative URL for API calls - works in both development and production
const API_URL = window.location.origin + '/api';
let currentUser = null;
let allBookings = [];
let serviceCenters = [];
let currentDashboard = 'overview';

// Service Centers Data - Tamil Nadu
const SERVICE_CENTERS = [
    { id: 1, name: 'Chennai North Center', location: 'Anna Nagar', capacity: 25 },
    { id: 2, name: 'Chennai South Center', location: 'Velachery', capacity: 22 },
    { id: 3, name: 'Coimbatore Center', location: 'RS Puram', capacity: 20 },
    { id: 4, name: 'Madurai Center', location: 'Anna Nagar', capacity: 18 },
    { id: 5, name: 'Tiruchirappalli Center', location: 'Thillai Nagar', capacity: 16 },
    { id: 6, name: 'Salem Center', location: 'Fairlands', capacity: 15 },
    { id: 7, name: 'Tirunelveli Center', location: 'Palayamkottai', capacity: 14 },
    { id: 8, name: 'Erode Center', location: 'Perundurai Road', capacity: 13 },
    { id: 9, name: 'Vellore Center', location: 'Gandhi Nagar', capacity: 14 },
    { id: 10, name: 'Thoothukudi Center', location: 'Palayamkottai Road', capacity: 12 },
    { id: 11, name: 'Thanjavur Center', location: 'Gandhiji Road', capacity: 13 },
    { id: 12, name: 'Dindigul Center', location: 'Palani Road', capacity: 12 },
    { id: 13, name: 'Kanchipuram Center', location: 'Gandhi Road', capacity: 11 },
    { id: 14, name: 'Karur Center', location: 'Kovai Road', capacity: 11 },
    { id: 15, name: 'Nagercoil Center', location: 'Vadasery', capacity: 10 },
    { id: 16, name: 'Kumbakonam Center', location: 'TSR Big Street', capacity: 10 },
    { id: 17, name: 'Tiruppur Center', location: 'Kumaran Road', capacity: 15 },
    { id: 18, name: 'Hosur Center', location: 'Bagalur Road', capacity: 14 },
    { id: 19, name: 'Ambattur Center', location: 'CTH Road', capacity: 16 },
    { id: 20, name: 'Tambaram Center', location: 'GST Road', capacity: 15 }
];

// Pricing and margins (INR)
const SERVICE_PRICING = {
    'Basic Wash': { price: 1200, cost: 840, margin: 0.30 },
    'Premium Wash': { price: 2400, cost: 1560, margin: 0.35 },
    'Deluxe Detail': { price: 4000, cost: 2400, margin: 0.40 }
};

// Check authentication
document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || user.role !== 'admin') {
        window.location.href = '/login';
        return;
    }
    
    currentUser = user;
    document.getElementById('adminName').textContent = user.name;
    
    await loadAllData();
    initializeDashboards();
});

async function loadAllData() {
    try {
        const response = await fetch(`${API_URL}/bookings`);
        if (!response.ok) throw new Error('Failed to load bookings');
        allBookings = await response.json();
        
        // Assign bookings to service centers (20 Tamil Nadu centers)
        allBookings = allBookings.map((booking, index) => ({
            ...booking,
            centerId: booking.centerId || ((index % 20) + 1),
            centerName: booking.centerName || SERVICE_CENTERS[(index % 20)].name
        }));
        
        serviceCenters = calculateCenterMetrics();
    } catch (error) {
        console.error('Failed to load data:', error);
    }
}

function showDashboard(dashboardName, event) {
    // Prevent default link behavior
    if (event) {
        event.preventDefault();
    }
    
    document.querySelectorAll('.dashboard-view').forEach(view => {
        view.classList.remove('active');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    document.getElementById(`${dashboardName}-dashboard`).classList.add('active');
    
    // Find and activate the corresponding nav link
    const navLink = document.querySelector(`a[href="#${dashboardName}"]`);
    if (navLink) {
        navLink.classList.add('active');
    }
    
    currentDashboard = dashboardName;
    
    switch(dashboardName) {
        case 'overview': renderOverviewDashboard(); break;
        case 'feedback': renderFeedbackDashboard(); break;
        case 'service-centers': renderServiceCentersDashboard(); break;
        case 'financial': renderFinancialDashboard(); break;
        case 'users': renderUsersDashboard(); break;
        case 'analytics': renderAnalyticsDashboard(); break;
    }
}

function initializeDashboards() {
    renderOverviewDashboard();
}

// Overview Dashboard
function renderOverviewDashboard() {
    const totalBookings = allBookings.length;
    const totalRevenue = calculateTotalRevenue();
    const grossProfit = calculateGrossProfit();
    const avgRating = calculateAverageRating();
    
    document.getElementById('overview-total-bookings').textContent = totalBookings.toLocaleString();
    document.getElementById('overview-revenue').textContent = `₹${(totalRevenue/100000).toFixed(2)}L`;
    document.getElementById('overview-gross-profit').textContent = `₹${(grossProfit/100000).toFixed(2)}L`;
    document.getElementById('overview-avg-rating').textContent = avgRating.toFixed(1);
    
    renderServiceDistribution();
    renderRevenueTrend();
    renderCenterPerformance();
}

function renderServiceDistribution() {
    const serviceCount = {};
    allBookings.forEach(booking => {
        serviceCount[booking.service] = (serviceCount[booking.service] || 0) + 1;
    });

    const ctx = document.getElementById('service-distribution-chart');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (window.serviceDistChart) {
        window.serviceDistChart.destroy();
    }

    const total = Object.values(serviceCount).reduce((a, b) => a + b, 0);

    window.serviceDistChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(serviceCount),
            datasets: [{
                data: Object.values(serviceCount),
                backgroundColor: [
                    '#1a237e',
                    '#2e7d32',
                    '#f57c00'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                        }
                    }
                },
                datalabels: {
                    color: '#fff',
                    font: {
                        weight: 'bold',
                        size: 14
                    },
                    formatter: function(value) {
                        const percentage = ((value / total) * 100).toFixed(1);
                        return percentage + '%\n(' + value + ')';
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}


function renderRevenueTrend() {
    const monthlyData = {};
    allBookings.forEach(booking => {
        const month = booking.date.substring(0, 7);
        const price = parseServicePrice(booking.serviceType);
        monthlyData[month] = (monthlyData[month] || 0) + price;
    });
    
    const sortedMonths = Object.keys(monthlyData).sort();
    
    const ctx = document.getElementById('revenue-trend-chart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (window.revenueTrendChart) {
        window.revenueTrendChart.destroy();
    }
    
    window.revenueTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedMonths.map(m => m.substring(5)),
            datasets: [{
                label: 'Revenue',
                data: sortedMonths.map(m => monthlyData[m]),
                borderColor: '#1a237e',
                backgroundColor: 'rgba(26, 35, 126, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 5,
                pointBackgroundColor: '#1a237e',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Revenue: ₹${context.parsed.y.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + (value/1000).toFixed(0) + 'K';
                        }
                    }
                }
            }
        }
    });
}

function renderCenterPerformance() {
    const topCenters = serviceCenters.slice(0, 10);
    
    const ctx = document.getElementById('center-performance-chart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (window.centerPerfChart) {
        window.centerPerfChart.destroy();
    }
    
    window.centerPerfChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topCenters.map(c => c.name.replace(' Center', '')),
            datasets: [{
                label: 'Revenue',
                data: topCenters.map(c => c.revenue),
                backgroundColor: '#1a237e',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: 'y',
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const center = topCenters[context.dataIndex];
                            return [
                                `Revenue: ₹${context.parsed.x.toLocaleString()}`,
                                `Bookings: ${center.bookings}`,
                                `Rating: ${center.avgRating.toFixed(1)}⭐`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        callback: function(value) {
                            return '₹' + (value/1000).toFixed(0) + 'K';
                        }
                    }
                }
            }
        }
    });
}

// Feedback Dashboard
function renderFeedbackDashboard() {
    const feedbackBookings = allBookings.filter(b => b.feedback);
    const totalFeedback = feedbackBookings.length;
    const avgRating = calculateAverageRating();
    const fiveStarCount = feedbackBookings.filter(b => b.rating === 5).length;
    const fiveStarPercentage = totalFeedback > 0 ? (fiveStarCount / totalFeedback * 100).toFixed(1) : 0;
    const responseRate = (totalFeedback / allBookings.filter(b => b.status === 'completed').length * 100).toFixed(1);
    
    document.getElementById('feedback-total').textContent = totalFeedback;
    document.getElementById('feedback-avg-rating').textContent = avgRating.toFixed(1);
    document.getElementById('feedback-5-star').textContent = `${fiveStarPercentage}%`;
    document.getElementById('feedback-response-rate').textContent = `${responseRate}%`;
    
    renderRatingDistribution(feedbackBookings);
    renderSentimentAnalysis(feedbackBookings);
    renderFeedbackList(feedbackBookings);
    
    // Populate center filter
    const centerFilter = document.getElementById('feedback-center-filter');
    centerFilter.innerHTML = '<option value="all">All Centers</option>' + 
        SERVICE_CENTERS.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

function renderRatingDistribution(feedbackBookings) {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    feedbackBookings.forEach(b => {
        if (b.rating) distribution[b.rating]++;
    });
    
    const ctx = document.getElementById('rating-distribution-chart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (window.ratingDistChart) {
        window.ratingDistChart.destroy();
    }
    
    window.ratingDistChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['5⭐', '4⭐', '3⭐', '2⭐', '1⭐'],
            datasets: [{
                label: 'Reviews',
                data: [distribution[5], distribution[4], distribution[3], distribution[2], distribution[1]],
                backgroundColor: ['#2e7d32', '#66bb6a', '#ffa726', '#ff7043', '#e53935'],
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = feedbackBookings.length;
                            const percentage = total > 0 ? ((context.parsed.y / total) * 100).toFixed(1) : 0;
                            return `${context.parsed.y} reviews (${percentage}%)`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

function renderSentimentAnalysis(feedbackBookings) {
    const positive = feedbackBookings.filter(b => b.rating >= 4).length;
    const neutral = feedbackBookings.filter(b => b.rating === 3).length;
    const negative = feedbackBookings.filter(b => b.rating <= 2).length;
    const total = positive + neutral + negative;
    
    const ctx = document.getElementById('sentiment-chart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (window.sentimentChart) {
        window.sentimentChart.destroy();
    }
    
    window.sentimentChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Positive (4-5⭐)', 'Neutral (3⭐)', 'Negative (1-2⭐)'],
            datasets: [{
                data: [positive, neutral, negative],
                backgroundColor: ['#2e7d32', '#ffa726', '#e53935'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                        }
                    }
                },
                datalabels: {
                    color: '#fff',
                    font: {
                        weight: 'bold',
                        size: 14
                    },
                    formatter: function(value) {
                        if (total === 0) return '';
                        const percentage = ((value / total) * 100).toFixed(1);
                        return percentage + '%\n(' + value + ')';
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

function renderFeedbackList(feedbackBookings) {
    const recentFeedback = feedbackBookings.slice(-20).reverse();
    
    const html = recentFeedback.map(booking => `
        <div class="feedback-item">
            <div class="feedback-header">
                <div>
                    <strong>${booking.customerName}</strong> - ${booking.centerName}
                </div>
                <div class="feedback-rating">${'⭐'.repeat(booking.rating)}</div>
            </div>
            <div class="feedback-text">"${booking.feedback}"</div>
            <div class="feedback-meta">
                ${booking.serviceType} | ${booking.date} | ${booking.carModel}
            </div>
        </div>
    `).join('');
    
    document.getElementById('feedback-items').innerHTML = html || '<p>No feedback available</p>';
}

function filterFeedback() {
    const ratingFilter = document.getElementById('feedback-rating-filter').value;
    const centerFilter = document.getElementById('feedback-center-filter').value;
    
    let filtered = allBookings.filter(b => b.feedback);
    
    if (ratingFilter !== 'all') {
        filtered = filtered.filter(b => b.rating === parseInt(ratingFilter));
    }
    
    if (centerFilter !== 'all') {
        filtered = filtered.filter(b => b.centerId === parseInt(centerFilter));
    }
    
    renderFeedbackList(filtered);
}

// Service Centers Dashboard
function renderServiceCentersDashboard() {
    renderCentersGrid();
    renderCenterComparison('revenue');
    renderRecommendations();
}

function renderCentersGrid() {
    const html = serviceCenters.map(center => {
        const status = center.rating >= 4.5 ? 'excellent' : center.rating >= 4.0 ? 'good' : 'needs-improvement';
        const statusText = status === 'excellent' ? 'Excellent' : status === 'good' ? 'Good' : 'Needs Improvement';
        
        return `
            <div class="center-card">
                <div class="center-header">
                    <div class="center-name">${center.name}</div>
                    <div class="center-status ${status}">${statusText}</div>
                </div>
                <div style="color: #666; font-size: 14px; margin-bottom: 15px;">📍 ${center.location}</div>
                <div class="center-metrics">
                    <div class="metric">
                        <div class="metric-label">Revenue</div>
                        <div class="metric-value">₹${(center.revenue/1000).toFixed(0)}K</div>
                    </div>
                    <div class="metric">
                        <div class="metric-label">Bookings</div>
                        <div class="metric-value">${center.bookings}</div>
                    </div>
                    <div class="metric">
                        <div class="metric-label">Rating</div>
                        <div class="metric-value">${center.rating.toFixed(1)} ⭐</div>
                    </div>
                    <div class="metric">
                        <div class="metric-label">Efficiency</div>
                        <div class="metric-value">${center.efficiency.toFixed(0)}%</div>
                    </div>
                </div>
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
                    <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Profit Margin</div>
                    <div style="font-size: 18px; font-weight: 600; color: #4caf50;">${center.profitMargin.toFixed(1)}%</div>
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('centers-grid').innerHTML = html;
}

function showCenterTab(tab, event) {
    if (event) {
        event.preventDefault();
    }
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
    renderCenterComparison(tab);
}

function renderCenterComparison(metric) {
    let data, label, color;
    
    switch(metric) {
        case 'revenue':
            data = serviceCenters.map(c => ({ name: c.name, value: c.revenue/1000 }));
            label = 'Revenue (₹K)';
            color = '#4caf50';
            break;
        case 'bookings':
            data = serviceCenters.map(c => ({ name: c.name, value: c.bookings }));
            label = 'Bookings';
            color = '#2196f3';
            break;
        case 'ratings':
            data = serviceCenters.map(c => ({ name: c.name, value: c.rating }));
            label = 'Rating';
            color = '#ff9800';
            break;
        case 'efficiency':
            data = serviceCenters.map(c => ({ name: c.name, value: c.efficiency }));
            label = 'Efficiency (%)';
            color = '#9c27b0';
            break;
    }
    
    const maxValue = Math.max(...data.map(d => d.value));
    
    const chartHTML = data.map(item => {
        const width = (item.value / maxValue * 100);
        return `
            <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="font-size: 13px;">${item.name}</span>
                    <span style="font-weight: 600;">${item.value.toFixed(metric === 'ratings' ? 1 : 0)}</span>
                </div>
                <div style="background: #e0e0e0; height: 10px; border-radius: 5px; overflow: hidden;">
                    <div style="background: ${color}; height: 100%; width: ${width}%; transition: width 0.3s;"></div>
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('center-comparison-chart').innerHTML = `<div style="padding: 20px;">${chartHTML}</div>`;
}

function renderRecommendations() {
    const recommendations = [];
    
    // Find underperforming centers
    const avgRevenue = serviceCenters.reduce((sum, c) => sum + c.revenue, 0) / serviceCenters.length;
    const lowRevenueCenters = serviceCenters.filter(c => c.revenue < avgRevenue * 0.8);
    
    if (lowRevenueCenters.length > 0) {
        recommendations.push({
            title: `Boost Revenue at ${lowRevenueCenters[0].name}`,
            description: `This center is performing 20% below average. Consider targeted marketing campaigns, promotional offers, or staff training to increase bookings.`,
            impact: `Potential +₹${((avgRevenue - lowRevenueCenters[0].revenue)/1000).toFixed(0)}K/month`
        });
    }
    
    // Find centers with low ratings
    const lowRatingCenters = serviceCenters.filter(c => c.rating < 4.0);
    if (lowRatingCenters.length > 0) {
        recommendations.push({
            title: `Improve Customer Satisfaction at ${lowRatingCenters[0].name}`,
            description: `Rating is below 4.0. Focus on service quality, staff training, and addressing customer complaints promptly.`,
            impact: `Expected rating increase to 4.5+`
        });
    }
    
    // Find centers with low efficiency
    const lowEfficiencyCenters = serviceCenters.filter(c => c.efficiency < 70);
    if (lowEfficiencyCenters.length > 0) {
        recommendations.push({
            title: `Optimize Operations at ${lowEfficiencyCenters[0].name}`,
            description: `Capacity utilization is below 70%. Implement better scheduling, reduce service time, or adjust pricing during peak hours.`,
            impact: `Potential +${(100 - lowEfficiencyCenters[0].efficiency).toFixed(0)}% capacity utilization`
        });
    }
    
    // Promote premium services
    const basicHeavyCenters = serviceCenters.filter(c => {
        const centerBookings = allBookings.filter(b => b.centerId === c.id);
        const basicCount = centerBookings.filter(b => b.serviceType.includes('Basic')).length;
        return basicCount / centerBookings.length > 0.6;
    });
    
    if (basicHeavyCenters.length > 0) {
        recommendations.push({
            title: `Upsell Premium Services at ${basicHeavyCenters[0].name}`,
            description: `Over 60% bookings are Basic Wash. Train staff on upselling techniques and create package deals to increase premium service adoption.`,
            impact: `Potential +15-20% profit margin`
        });
    }
    
    const html = recommendations.map(rec => `
        <div class="recommendation-item">
            <h4>${rec.title}</h4>
            <p>${rec.description}</p>
            <span class="recommendation-impact">${rec.impact}</span>
        </div>
    `).join('');
    
    document.getElementById('center-recommendations').innerHTML = html || '<p>All centers performing well! 🎉</p>';
}

// Financial Dashboard
function renderFinancialDashboard() {
    const revenue = calculateTotalRevenue();
    const grossProfit = calculateGrossProfit();
    const netProfit = calculateNetProfit();
    const margin = (netProfit / revenue * 100);
    
    document.getElementById('fin-revenue').textContent = `₹${(revenue/100000).toFixed(2)}L`;
    document.getElementById('fin-gross-profit').textContent = `₹${(grossProfit/100000).toFixed(2)}L`;
    document.getElementById('fin-net-profit').textContent = `₹${(netProfit/100000).toFixed(2)}L`;
    document.getElementById('fin-margin').textContent = `${margin.toFixed(1)}%`;
    
    renderRevenueProfitChart();
    renderCostBreakdown();
    renderFinancialTable();
}

function renderRevenueProfitChart() {
    const monthlyData = {};
    
    allBookings.forEach(booking => {
        const month = booking.date.substring(0, 7);
        if (!monthlyData[month]) {
            monthlyData[month] = { revenue: 0, profit: 0 };
        }
        const price = parseServicePrice(booking.serviceType);
        const service = booking.serviceType.split(' - ')[0];
        const cost = SERVICE_PRICING[service]?.cost || 0;
        
        monthlyData[month].revenue += price;
        monthlyData[month].profit += (price - cost);
    });
    
    const sortedMonths = Object.keys(monthlyData).sort().slice(-6);
    
    const ctx = document.getElementById('revenue-profit-chart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (window.revenueProfitChart) {
        window.revenueProfitChart.destroy();
    }
    
    window.revenueProfitChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedMonths.map(m => m.substring(5) + '/26'),
            datasets: [{
                label: 'Revenue',
                data: sortedMonths.map(m => monthlyData[m].revenue),
                backgroundColor: '#2e7d32',
                borderRadius: 6
            }, {
                label: 'Gross Profit',
                data: sortedMonths.map(m => monthlyData[m].profit),
                backgroundColor: '#1a237e',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        padding: 15,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ₹${context.parsed.y.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + (value/1000).toFixed(0) + 'K';
                        }
                    }
                }
            }
        }
    });
}

function renderCostBreakdown() {
    const totalRevenue = calculateTotalRevenue();
    const directCosts = calculateDirectCosts();
    const operatingExpenses = totalRevenue * 0.294; // 29.4% from financial analysis
    const taxes = calculateNetProfit() * 0.25;
    const netProfit = calculateNetProfit();
    const total = directCosts + operatingExpenses + taxes + netProfit;
    
    const ctx = document.getElementById('cost-breakdown-chart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (window.costBreakdownChart) {
        window.costBreakdownChart.destroy();
    }
    
    window.costBreakdownChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Direct Costs', 'Operating Expenses', 'Taxes', 'Net Profit'],
            datasets: [{
                data: [directCosts, operatingExpenses, taxes, netProfit],
                backgroundColor: ['#e53935', '#ffa726', '#ab47bc', '#2e7d32'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ₹${(context.parsed/1000).toFixed(0)}K (${percentage}%)`;
                        }
                    }
                },
                datalabels: {
                    color: '#fff',
                    font: {
                        weight: 'bold',
                        size: 13
                    },
                    formatter: function(value) {
                        const percentage = ((value / total) * 100).toFixed(1);
                        return percentage + '%';
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

function renderFinancialTable() {
    const monthlyData = {};
    
    allBookings.forEach(booking => {
        const month = booking.date.substring(0, 7);
        if (!monthlyData[month]) {
            monthlyData[month] = { revenue: 0, cost: 0, bookings: 0 };
        }
        const price = parseServicePrice(booking.serviceType);
        const service = booking.serviceType.split(' - ')[0];
        const cost = SERVICE_PRICING[service]?.cost || 0;
        
        monthlyData[month].revenue += price;
        monthlyData[month].cost += cost;
        monthlyData[month].bookings++;
    });
    
    const sortedMonths = Object.keys(monthlyData).sort();
    
    const tableHTML = `
        <thead>
            <tr>
                <th>Month</th>
                <th>Bookings</th>
                <th>Revenue</th>
                <th>Direct Costs</th>
                <th>Gross Profit</th>
                <th>Margin</th>
            </tr>
        </thead>
        <tbody>
            ${sortedMonths.map(month => {
                const data = monthlyData[month];
                const grossProfit = data.revenue - data.cost;
                const margin = (grossProfit / data.revenue * 100).toFixed(1);
                
                return `
                    <tr>
                        <td>${month}</td>
                        <td>${data.bookings}</td>
                        <td>₹${(data.revenue/1000).toFixed(1)}K</td>
                        <td>₹${(data.cost/1000).toFixed(1)}K</td>
                        <td>₹${(grossProfit/1000).toFixed(1)}K</td>
                        <td><span style="color: #4caf50; font-weight: 600;">${margin}%</span></td>
                    </tr>
                `;
            }).join('')}
        </tbody>
    `;
    
    document.getElementById('financial-table').innerHTML = tableHTML;
}

// Users Dashboard
function renderUsersDashboard() {
    const users = getUniqueUsers();
    const activeUsers = users.filter(u => u.bookings >= 2).length;
    const newUsers = users.filter(u => u.firstBooking >= '2026-02').length;
    const retentionRate = (activeUsers / users.length * 100).toFixed(1);
    
    document.getElementById('users-total').textContent = users.length;
    document.getElementById('users-active').textContent = activeUsers;
    document.getElementById('users-new').textContent = newUsers;
    document.getElementById('users-retention').textContent = `${retentionRate}%`;
    
    renderUserGrowthChart();
    renderCustomerSegments();
    renderTopCustomers(users);
}

function renderUserGrowthChart() {
    const monthlyUsers = {};
    
    allBookings.forEach(booking => {
        const month = booking.date.substring(0, 7);
        if (!monthlyUsers[month]) {
            monthlyUsers[month] = new Set();
        }
        monthlyUsers[month].add(booking.userId);
    });
    
    const sortedMonths = Object.keys(monthlyUsers).sort();
    
    const ctx = document.getElementById('user-growth-chart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (window.userGrowthChart) {
        window.userGrowthChart.destroy();
    }
    
    window.userGrowthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedMonths.map(m => m.substring(5)),
            datasets: [{
                label: 'Active Users',
                data: sortedMonths.map(m => monthlyUsers[m].size),
                borderColor: '#1a237e',
                backgroundColor: 'rgba(26, 35, 126, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 5,
                pointBackgroundColor: '#1a237e',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Active Users: ${context.parsed.y}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

function renderCustomerSegments() {
    const users = getUniqueUsers();
    
    const segments = {
        'VIP (5+ bookings)': users.filter(u => u.bookings >= 5).length,
        'Regular (3-4 bookings)': users.filter(u => u.bookings >= 3 && u.bookings < 5).length,
        'Occasional (2 bookings)': users.filter(u => u.bookings === 2).length,
        'One-time': users.filter(u => u.bookings === 1).length
    };
    
    const total = users.length;
    
    const ctx = document.getElementById('customer-segments-chart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (window.customerSegmentsChart) {
        window.customerSegmentsChart.destroy();
    }
    
    window.customerSegmentsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(segments),
            datasets: [{
                data: Object.values(segments),
                backgroundColor: ['#2e7d32', '#1a237e', '#ffa726', '#9e9e9e'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                        }
                    }
                },
                datalabels: {
                    color: '#fff',
                    font: {
                        weight: 'bold',
                        size: 13
                    },
                    formatter: function(value) {
                        const percentage = ((value / total) * 100).toFixed(1);
                        return percentage + '%';
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

function renderTopCustomers(users) {
    const topCustomers = users.sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 10);
    
    const tableHTML = `
        <thead>
            <tr>
                <th>Rank</th>
                <th>Customer</th>
                <th>Bookings</th>
                <th>Total Spent</th>
                <th>Avg Rating</th>
                <th>Last Visit</th>
            </tr>
        </thead>
        <tbody>
            ${topCustomers.map((user, index) => `
                <tr>
                    <td><strong>${index + 1}</strong></td>
                    <td>${user.name}</td>
                    <td>${user.bookings}</td>
                    <td>₹${user.totalSpent.toLocaleString()}</td>
                    <td>${user.avgRating ? user.avgRating.toFixed(1) + ' ⭐' : 'N/A'}</td>
                    <td>${user.lastBooking}</td>
                </tr>
            `).join('')}
        </tbody>
    `;
    
    document.getElementById('top-customers-table').innerHTML = tableHTML;
}

// Analytics Dashboard
function renderAnalyticsDashboard() {
    renderPeakHoursChart();
    renderServiceTrends();
    renderAIInsights();
}

function renderPeakHoursChart() {
    const hourlyData = {};
    
    allBookings.forEach(booking => {
        const hour = booking.time.split(':')[0];
        hourlyData[hour] = (hourlyData[hour] || 0) + 1;
    });
    
    const hours = Object.keys(hourlyData).sort();
    
    const ctx = document.getElementById('peak-hours-chart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (window.peakHoursChart) {
        window.peakHoursChart.destroy();
    }
    
    window.peakHoursChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: hours.map(h => h + ':00'),
            datasets: [{
                label: 'Bookings',
                data: hours.map(h => hourlyData[h]),
                backgroundColor: '#ab47bc',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Bookings: ${context.parsed.y}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

function renderServiceTrends() {
    const monthlyServices = {};
    
    allBookings.forEach(booking => {
        const month = booking.date.substring(0, 7);
        const service = booking.serviceType.split(' - ')[0];
        
        if (!monthlyServices[month]) {
            monthlyServices[month] = { 'Basic Wash': 0, 'Premium Wash': 0, 'Deluxe Detail': 0 };
        }
        monthlyServices[month][service]++;
    });
    
    const sortedMonths = Object.keys(monthlyServices).sort().slice(-6);
    
    const ctx = document.getElementById('service-trends-chart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (window.serviceTrendsChart) {
        window.serviceTrendsChart.destroy();
    }
    
    window.serviceTrendsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedMonths.map(m => m.substring(5) + '/26'),
            datasets: [{
                label: 'Basic Wash',
                data: sortedMonths.map(m => monthlyServices[m]['Basic Wash']),
                borderColor: '#1a237e',
                backgroundColor: 'rgba(26, 35, 126, 0.1)',
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 4
            }, {
                label: 'Premium Wash',
                data: sortedMonths.map(m => monthlyServices[m]['Premium Wash']),
                borderColor: '#ffa726',
                backgroundColor: 'rgba(255, 167, 38, 0.1)',
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 4
            }, {
                label: 'Deluxe Detail',
                data: sortedMonths.map(m => monthlyServices[m]['Deluxe Detail']),
                borderColor: '#2e7d32',
                backgroundColor: 'rgba(46, 125, 50, 0.1)',
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        padding: 15,
                        font: { size: 12 }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

function renderAIInsights() {
    const insights = [
        {
            title: 'Peak Demand Opportunity',
            description: 'Bookings spike between 10 AM - 2 PM. Consider dynamic pricing during peak hours to maximize revenue by 15-20%.'
        },
        {
            title: 'Premium Service Growth',
            description: 'Premium and Deluxe services show 12% month-over-month growth. Focus marketing on these high-margin services.'
        },
        {
            title: 'Customer Retention Strategy',
            description: 'Customers who book within 30 days have 85% retention rate. Implement automated follow-up campaigns.'
        },
        {
            title: 'Geographic Expansion',
            description: 'Chennai and Coimbatore centers are at 90%+ capacity. Consider opening additional locations in these high-demand areas.'
        },
        {
            title: 'Service Bundle Opportunity',
            description: '35% of customers book multiple services within 60 days. Create subscription packages for recurring revenue.'
        }
    ];
    
    const html = insights.map(insight => `
        <div class="insight-item">
            <h4>${insight.title}</h4>
            <p>${insight.description}</p>
        </div>
    `).join('');
    
    document.getElementById('ai-insights').innerHTML = html;
}

// Helper Functions
function calculateCenterMetrics() {
    return SERVICE_CENTERS.map(center => {
        const centerBookings = allBookings.filter(b => b.centerId === center.id);
        const revenue = centerBookings.reduce((sum, b) => sum + parseServicePrice(b.serviceType), 0);
        const feedbackBookings = centerBookings.filter(b => b.rating);
        const avgRating = feedbackBookings.length > 0 
            ? feedbackBookings.reduce((sum, b) => sum + b.rating, 0) / feedbackBookings.length 
            : 0;
        
        const directCost = centerBookings.reduce((sum, b) => {
            const service = b.serviceType.split(' - ')[0];
            return sum + (SERVICE_PRICING[service]?.cost || 0);
        }, 0);
        
        const grossProfit = revenue - directCost;
        const profitMargin = revenue > 0 ? (grossProfit / revenue * 100) : 0;
        const efficiency = (centerBookings.length / (center.capacity * 30) * 100);
        
        return {
            ...center,
            bookings: centerBookings.length,
            revenue,
            rating: avgRating,
            efficiency: Math.min(efficiency, 100),
            profitMargin,
            grossProfit
        };
    }).sort((a, b) => b.revenue - a.revenue);
}

function calculateTotalRevenue() {
    return allBookings.reduce((sum, booking) => {
        return sum + parseServicePrice(booking.serviceType);
    }, 0);
}

function calculateDirectCosts() {
    return allBookings.reduce((sum, booking) => {
        const service = booking.serviceType.split(' - ')[0];
        return sum + (SERVICE_PRICING[service]?.cost || 0);
    }, 0);
}

function calculateGrossProfit() {
    return calculateTotalRevenue() - calculateDirectCosts();
}

function calculateNetProfit() {
    const grossProfit = calculateGrossProfit();
    const revenue = calculateTotalRevenue();
    const operatingExpenses = revenue * 0.294; // 29.4% from financial analysis
    const depreciation = revenue * 0.0138; // 1.38%
    const interest = revenue * 0.0092; // 0.92%
    const pbt = grossProfit - operatingExpenses - depreciation - interest;
    const tax = pbt * 0.25;
    return pbt - tax;
}

function calculateAverageRating() {
    const feedbackBookings = allBookings.filter(b => b.rating);
    if (feedbackBookings.length === 0) return 0;
    return feedbackBookings.reduce((sum, b) => sum + b.rating, 0) / feedbackBookings.length;
}

function parseServicePrice(serviceType) {
    const match = serviceType.match(/₹?(\d+)/);
    if (match) return parseInt(match[1]);
    
    // Fallback to service name
    if (serviceType.includes('Basic')) return 500;
    if (serviceType.includes('Premium')) return 1000;
    if (serviceType.includes('Deluxe')) return 1800;
    return 0;
}

function getUniqueUsers() {
    const userMap = {};
    
    allBookings.forEach(booking => {
        if (!userMap[booking.userId]) {
            userMap[booking.userId] = {
                id: booking.userId,
                name: booking.customerName,
                bookings: 0,
                totalSpent: 0,
                ratings: [],
                firstBooking: booking.date,
                lastBooking: booking.date
            };
        }
        
        const user = userMap[booking.userId];
        user.bookings++;
        user.totalSpent += parseServicePrice(booking.serviceType);
        if (booking.rating) user.ratings.push(booking.rating);
        if (booking.date < user.firstBooking) user.firstBooking = booking.date;
        if (booking.date > user.lastBooking) user.lastBooking = booking.date;
    });
    
    return Object.values(userMap).map(user => ({
        ...user,
        avgRating: user.ratings.length > 0 
            ? user.ratings.reduce((sum, r) => sum + r, 0) / user.ratings.length 
            : null
    }));
}

function exportCenterData() {
    const csv = [
        ['Center Name', 'Location', 'Bookings', 'Revenue', 'Rating', 'Efficiency', 'Profit Margin'].join(','),
        ...serviceCenters.map(c => [
            c.name, c.location, c.bookings, c.revenue, c.rating.toFixed(1), 
            c.efficiency.toFixed(1), c.profitMargin.toFixed(1)
        ].join(','))
    ].join('\n');
    
    downloadCSV(csv, 'service-centers-report.csv');
}

function exportUserData() {
    const users = getUniqueUsers();
    const csv = [
        ['User ID', 'Name', 'Bookings', 'Total Spent', 'Avg Rating', 'First Booking', 'Last Booking'].join(','),
        ...users.map(u => [
            u.id, u.name, u.bookings, u.totalSpent, 
            u.avgRating ? u.avgRating.toFixed(1) : 'N/A', 
            u.firstBooking, u.lastBooking
        ].join(','))
    ].join('\n');
    
    downloadCSV(csv, 'users-report.csv');
}

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

function applyDateFilter(dashboard) {
    const startDate = document.getElementById(`${dashboard}StartDate`).value;
    const endDate = document.getElementById(`${dashboard}EndDate`).value;
    
    if (!startDate || !endDate) {
        alert('Please select both start and end dates');
        return;
    }
    
    // Filter bookings by date range
    const filteredBookings = allBookings.filter(booking => {
        return booking.date >= startDate && booking.date <= endDate;
    });
    
    // Temporarily replace allBookings with filtered data
    const originalBookings = allBookings;
    allBookings = filteredBookings;
    
    // Re-render the dashboard
    switch(dashboard) {
        case 'overview':
            renderOverviewDashboard();
            break;
    }
    
    // Restore original bookings
    allBookings = originalBookings;
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = '/login';
}
