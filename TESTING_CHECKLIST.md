# 🧪 xNAT Car Wash Services - Testing Checklist

## How to Test the Application

### Prerequisites
```bash
# 1. Start the server
npm start

# 2. Open browser
http://localhost:3000/login
```

---

## ✅ Test Scenarios

### 1. Authentication Tests

#### Test 1.1: User Registration
- [ ] Go to http://localhost:3000/login
- [ ] Click "Register" tab
- [ ] Fill in: Name, Email, Phone, Password (min 6 chars)
- [ ] Click "Create Account"
- [ ] **Expected**: Redirect to customer booking page
- [ ] **Verify**: User name appears in header

#### Test 1.2: User Login
- [ ] Go to http://localhost:3000/login
- [ ] Enter: john@example.com / password123
- [ ] Click "Login"
- [ ] **Expected**: Redirect to customer booking page
- [ ] **Verify**: "Welcome, John Doe!" in header

#### Test 1.3: Admin Login
- [ ] Go to http://localhost:3000/login
- [ ] Enter: admin@carwash.com / admin123
- [ ] Click "Login"
- [ ] **Expected**: Redirect to admin dashboard
- [ ] **Verify**: "Welcome, Admin!" in header

#### Test 1.4: Login Error Handling
- [ ] Go to http://localhost:3000/login
- [ ] Enter: wrong@email.com / wrongpass
- [ ] Click "Login"
- [ ] **Expected**: Red error message displays
- [ ] **Verify**: "Invalid email or password" shown

#### Test 1.5: Registration Error Handling
- [ ] Go to http://localhost:3000/login
- [ ] Click "Register" tab
- [ ] Enter existing email: john@example.com
- [ ] Click "Create Account"
- [ ] **Expected**: Red error message displays
- [ ] **Verify**: "Email already exists" shown

---

### 2. Customer Booking Tests

#### Test 2.1: Create Booking
- [ ] Login as user (john@example.com / password123)
- [ ] Select Location: Chennai
- [ ] Enter Car Model: Honda Civic
- [ ] Select Service: Premium Wash - ₹2400
- [ ] **Verify**: Price displays "Total: ₹2400"
- [ ] Select Date: Tomorrow
- [ ] Select Time: 10:00 AM
- [ ] Click "Book Now"
- [ ] **Expected**: Confirmation message appears
- [ ] **Verify**: All booking details shown correctly

#### Test 2.2: View Booking History
- [ ] After creating booking
- [ ] Scroll down to "Your Bookings" section
- [ ] **Expected**: New booking appears in list
- [ ] **Verify**: Shows car model, service, date, time, price, status

#### Test 2.3: Price Display Update
- [ ] Go to booking form
- [ ] Select "Basic Wash - ₹1200"
- [ ] **Verify**: Price shows "Total: ₹1200"
- [ ] Select "Deluxe Detail - ₹4000"
- [ ] **Verify**: Price shows "Total: ₹4000"

#### Test 2.4: Form Validation
- [ ] Try to submit empty form
- [ ] **Expected**: Browser validation prevents submission
- [ ] **Verify**: Required fields highlighted

---

### 3. Feedback Tests

#### Test 3.1: Leave Feedback (Setup)
- [ ] Login as admin
- [ ] Find a booking
- [ ] Update status to "completed"
- [ ] Logout
- [ ] Login as the booking's user

#### Test 3.2: Submit Feedback
- [ ] Find completed booking in history
- [ ] Click "Leave Feedback" button
- [ ] **Expected**: Feedback modal opens
- [ ] Select Rating: 5 - Excellent
- [ ] Enter Feedback: "Great service!"
- [ ] Click "Submit"
- [ ] **Expected**: Modal closes
- [ ] **Verify**: Feedback appears in booking history

#### Test 3.3: Feedback Button Disappears
- [ ] After submitting feedback
- [ ] **Verify**: "Leave Feedback" button no longer shows
- [ ] **Verify**: Feedback text displays with rating

---

### 4. Admin Dashboard Tests

#### Test 4.1: View Statistics
- [ ] Login as admin
- [ ] **Verify**: 6 stat cards display:
  - Total Bookings
  - Pending
  - In Progress
  - Completed
  - Total Revenue (₹)
  - Avg Rating (⭐)

#### Test 4.2: View All Bookings
- [ ] Scroll to bookings table
- [ ] **Verify**: All bookings displayed
- [ ] **Verify**: 12 columns visible:
  - ID, Customer, Phone, Location, Car, Service, Date, Time, Price, Status, Feedback, Actions

#### Test 4.3: Filter by Status
- [ ] Select "Pending" from status filter
- [ ] **Expected**: Only pending bookings show
- [ ] Select "Completed"
- [ ] **Expected**: Only completed bookings show
- [ ] Select "All Status"
- [ ] **Expected**: All bookings show

#### Test 4.4: Filter by Date
- [ ] Select today's date in date filter
- [ ] **Expected**: Only today's bookings show
- [ ] Clear date
- [ ] **Expected**: All bookings show

#### Test 4.5: Search Functionality
- [ ] Type customer name in search box
- [ ] **Expected**: Matching bookings show
- [ ] Type phone number
- [ ] **Expected**: Matching bookings show
- [ ] Type car model
- [ ] **Expected**: Matching bookings show

#### Test 4.6: Clear Filters
- [ ] Apply multiple filters
- [ ] Click "Clear Filters"
- [ ] **Expected**: All filters reset
- [ ] **Verify**: All bookings show

---

### 5. Status Update Tests

#### Test 5.1: Update Booking Status
- [ ] Click "Update" button on any booking
- [ ] **Expected**: Modal opens
- [ ] **Verify**: Booking info displays
- [ ] Select Status: "in-progress"
- [ ] Select Technician: "John Smith"
- [ ] Click "Update"
- [ ] **Expected**: Modal closes
- [ ] **Verify**: Status badge updates in table

#### Test 5.2: Cancel Update
- [ ] Click "Update" button
- [ ] Click "Cancel"
- [ ] **Expected**: Modal closes without changes

---

### 6. Timeline Tests

#### Test 6.1: View Timeline
- [ ] Click "Timeline" button on any booking
- [ ] **Expected**: Timeline modal opens
- [ ] **Verify**: Booking details at top
- [ ] **Verify**: Timeline shows all status changes
- [ ] **Verify**: Each entry shows:
  - Status badge
  - Timestamp
  - Technician name
  - Action description

#### Test 6.2: Timeline Accuracy
- [ ] Update a booking status
- [ ] View timeline
- [ ] **Verify**: New entry appears
- [ ] **Verify**: Correct technician shown
- [ ] **Verify**: Correct timestamp

---

### 7. Delete Tests

#### Test 7.1: Delete Booking
- [ ] Click "Delete" button on any booking
- [ ] **Expected**: Confirmation dialog appears
- [ ] Click "Cancel"
- [ ] **Verify**: Booking still exists
- [ ] Click "Delete" again
- [ ] Click "OK"
- [ ] **Expected**: Booking removed from table
- [ ] **Verify**: Statistics update

---

### 8. Export Tests

#### Test 8.1: Export to CSV
- [ ] Click "Export CSV" button
- [ ] **Expected**: File downloads
- [ ] **Verify**: Filename format: bookings-YYYY-MM-DD.csv
- [ ] Open CSV file
- [ ] **Verify**: All booking data present
- [ ] **Verify**: Headers correct
- [ ] **Verify**: Feedback included

---

### 9. Partner Management Tests

#### Test 9.1: View Partners
- [ ] Scroll to "Partner Management" section
- [ ] **Verify**: 5 partner cards display
- [ ] **Verify**: Each shows:
  - Name
  - Profit Share %
  - Total Earnings
  - Total Expenses
  - Outstanding Due

#### Test 9.2: Add Expense
- [ ] Click "Add Expense" on any partner
- [ ] **Expected**: Expense modal opens
- [ ] Enter Amount: 1000
- [ ] Enter Description: "Equipment purchase"
- [ ] Click "Add Expense"
- [ ] **Expected**: Modal closes
- [ ] **Verify**: Partner's expenses increase
- [ ] **Verify**: Outstanding due increases

#### Test 9.3: Record Payment
- [ ] Click "Record Payment" on any partner
- [ ] **Expected**: Payment modal opens
- [ ] Enter Amount: 500
- [ ] Enter Description: "Partial payment"
- [ ] Click "Record Payment"
- [ ] **Expected**: Modal closes
- [ ] **Verify**: Outstanding due decreases

#### Test 9.4: View Transactions
- [ ] Click "View Transactions" on any partner
- [ ] **Expected**: Transactions modal opens
- [ ] **Verify**: Transaction table displays
- [ ] **Verify**: Shows Date, Type, Description, Amount
- [ ] **Verify**: Expenses show with + sign
- [ ] **Verify**: Payments show with - sign

#### Test 9.5: Distribute Profit
- [ ] Ensure some bookings are "completed"
- [ ] Click "Distribute Profit to All Partners"
- [ ] **Expected**: Confirmation dialog
- [ ] Click "OK"
- [ ] **Expected**: Success message with total revenue
- [ ] **Verify**: All partners' earnings increase
- [ ] **Verify**: Profit distributed based on share %

---

### 10. Analytics Tests

#### Test 10.1: Popular Services
- [ ] View "Popular Services" section
- [ ] **Verify**: Top 3 services listed
- [ ] **Verify**: Booking count shown for each

#### Test 10.2: Recent Feedback
- [ ] View "Recent Feedback" section
- [ ] **Verify**: Latest 3 feedbacks shown
- [ ] **Verify**: Shows rating, customer name, feedback text

---

### 11. Logout Tests

#### Test 11.1: Customer Logout
- [ ] Login as user
- [ ] Click "Logout" in header
- [ ] **Expected**: Redirect to login page
- [ ] Try to access http://localhost:3000/
- [ ] **Expected**: Redirect to login page

#### Test 11.2: Admin Logout
- [ ] Login as admin
- [ ] Click "Logout" in header
- [ ] **Expected**: Redirect to login page
- [ ] Try to access http://localhost:3000/admin
- [ ] **Expected**: Redirect to login page

---

### 12. Responsive Design Tests

#### Test 12.1: Mobile View
- [ ] Open browser DevTools (F12)
- [ ] Toggle device toolbar (Ctrl+Shift+M)
- [ ] Select "iPhone 12 Pro"
- [ ] **Verify**: Layout adapts to mobile
- [ ] **Verify**: All buttons accessible
- [ ] **Verify**: Forms usable

#### Test 12.2: Tablet View
- [ ] Select "iPad"
- [ ] **Verify**: Layout adapts to tablet
- [ ] **Verify**: All features accessible

#### Test 12.3: Desktop View
- [ ] Select "Responsive" and resize
- [ ] **Verify**: Layout scales properly
- [ ] **Verify**: No horizontal scroll

---

### 13. Browser Compatibility Tests

#### Test 13.1: Chrome
- [ ] Test all features in Chrome
- [ ] **Verify**: Everything works

#### Test 13.2: Firefox
- [ ] Test all features in Firefox
- [ ] **Verify**: Everything works

#### Test 13.3: Edge
- [ ] Test all features in Edge
- [ ] **Verify**: Everything works

---

## 📊 Test Results Template

```
Date: ___________
Tester: ___________

Authentication Tests: ___/5 passed
Customer Booking Tests: ___/4 passed
Feedback Tests: ___/3 passed
Admin Dashboard Tests: ___/6 passed
Status Update Tests: ___/2 passed
Timeline Tests: ___/2 passed
Delete Tests: ___/1 passed
Export Tests: ___/1 passed
Partner Management Tests: ___/5 passed
Analytics Tests: ___/2 passed
Logout Tests: ___/2 passed
Responsive Design Tests: ___/3 passed
Browser Compatibility Tests: ___/3 passed

Total: ___/39 passed

Overall Status: PASS / FAIL
```

---

## 🐛 Bug Report Template

```
Bug ID: ___________
Date: ___________
Tester: ___________

Test Case: ___________
Expected Result: ___________
Actual Result: ___________
Severity: Critical / High / Medium / Low
Steps to Reproduce:
1. ___________
2. ___________
3. ___________

Screenshots: ___________
Browser: ___________
```

---

## ✅ Sign-off

All tests completed: [ ]
All bugs fixed: [ ]
Ready for deployment: [ ]

Tester Signature: ___________
Date: ___________

---

*End of Testing Checklist*
