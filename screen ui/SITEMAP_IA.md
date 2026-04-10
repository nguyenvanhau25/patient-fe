# PATIENT MANAGEMENT SYSTEM - INFORMATION ARCHITECTURE (Sitemap)
**Comprehensive UI Structure & Endpoint Mapping**

---

## TABLE OF CONTENTS
- [PART 1: PATIENT/USER PORTAL](#part-1-patientuserupplication)
- [PART 2: ADMIN DASHBOARD](#part-2-admin-staff-dashboard)
- [PART 3: ENDPOINT REFERENCE](#part-3-complete-endpoint-reference)
- [PART 4: DATA FLOW & ARCHITECTURE](#part-4-data-flow--architecture)

---

---

# PART 1: PATIENT/USER APPLICATION
## (Mobile App / Web Portal Interface)

### Goal
Empower patients to find doctors, book appointments, manage health records, and make payments.

---

## 1. AUTHENTICATION & ACCOUNT MANAGEMENT
**Service:** Auth Service  
**Primary User:** Unauthenticated / Patient User

### 1.1 Splash/Onboarding Screen
- **Purpose:** App intro and service overview
- **UI Elements:**
  - App logo & branding
  - Service highlight cards (appointment booking, health records, doctor search)
  - Navigation buttons: "Sign Up" / "Log In"
  
---

### 1.2 Sign Up Screen
- **Purpose:** Patient registration
- **UI Elements:**
  - Email input
  - Password input with strength indicator
  - Full name input
  - Phone number input
  - Confirm password
  - "Sign Up" button
  - "Already have account? Login" link

**API Endpoint:**
```
POST /signup
Request: {
  "email": "patient@example.com",
  "password": "securePass123",
  "fullName": "John Doe",
  "phone": "+84912345678"
}
Response: {
  "token": "jwt_token",
  "refreshToken": "refresh_token",
  "role": "USER"
}
```

---

### 1.3 Login Screen
- **Purpose:** Patient authentication
- **UI Elements:**
  - Email input
  - Password input
  - "Remember me" checkbox
  - "Login" button
  - "Forgot Password?" link
  - "Sign Up" link

**API Endpoints:**
```
POST /login
Request: {
  "email": "patient@example.com",
  "password": "securePass123"
}
Response: {
  "token": "jwt_token",
  "refreshToken": "refresh_token",
  "role": "USER"
}

GET /validate (Auto-validate token on app startup)
Header: Authorization: Bearer {token}
Response: {
  "email": "patient@example.com",
  "role": "USER",
  "isValid": true
}
```

---

### 1.4 Forgot Password / Password Reset Screen
- **Purpose:** Reset forgotten password via OTP
- **UI Elements:**
  - Email input
  - OTP code input (6 digits)
  - New password input
  - Confirm password input
  - "Send OTP" button → "Verify & Reset" button

**API Endpoint:**
```
POST /reset
Request: {
  "email": "patient@example.com",
  "otp": "123456",
  "newPassword": "newSecurePass456"
}
Response: {
  "success": true,
  "message": "Password reset successfully"
}
```

---

### 1.5 Patient Profile Screen
- **Purpose:** View and manage personal information
- **UI Elements:**
  - Profile picture (editable)
  - Full name (read-only)
  - Email (read-only)
  - Phone number (read-only)
  - Date of birth
  - Address
  - Emergency contact name & phone
  - "Edit Profile" button
  - "Logout" button
  - "Session History" section (shows last login time, devices)

**API Endpoints:**
```
GET /user
Response: [
  {
    "id": "user_123",
    "email": "patient@example.com",
    "fullName": "John Doe",
    "role": "USER"
  }
]

PATCH /patients/{patientId}/image
Request: FormData with image file
Response: {
  "imageUrl": "https://cdn.example.com/patient_id_123.jpg"
}

DELETE /logout
Response: {
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 1.6 Token Refresh (Background)
- **Purpose:** Automatically refresh access token before expiry
- **Trigger:** When token is about to expire or on app resume

**API Endpoint:**
```
POST /refresh
Request: {
  "refreshToken": "refresh_token"
}
Response: {
  "token": "new_jwt_token",
  "refreshToken": "new_refresh_token"
}
```

---

## 2. HOME & DOCTOR DISCOVERY
**Service:** Doctor Service  
**Primary User:** Patient User

### 2.1 Dashboard/Home Screen
- **Purpose:** Main landing page after login
- **UI Elements:**
  - Welcome banner with greeting (e.g., "Hello John! 👋")
  - Search bar (quick doctor search by name/specialty)
  - Quick action buttons: "Book Appointment", "View Health Records"
  - Medical specialties carousel/grid:
    * Internal Medicine (Nội khoa)
    * Surgery (Ngoại khoa)
    * Pediatrics (Nhi khoa)
    * Cardiology (Tim mạch)
    * etc.
  - **"Top Rated Doctors" section** (horizontal scroll)
    * Doctor cards showing: Name, specialty, rating stars, review count
  - Upcoming appointment reminder card (if any)
  - Quick access to health records
  - News/Article section (optional)

**API Endpoints:**
```
GET /doctors/top-rated?limit=10&specialization=all
Response: [
  {
    "id": "doctor_001",
    "name": "Dr. Nguyen Van A",
    "specialization": "Internal Medicine",
    "rating": 4.8,
    "reviewCount": 156,
    "profileImage": "url",
    "yearsOfExperience": 15
  }
]

GET /doctors/search?specialization=Internal%20Medicine
Response: [
  {
    "id": "doctor_001",
    "name": "Dr. Nguyen Van A",
    "specialization": "Internal Medicine",
    "rating": 4.8,
    "profileImage": "url"
  }
]
```

---

### 2.2 Doctor Search & Filter Screen
- **Purpose:** Advanced search and filtering of doctors
- **UI Elements:**
  - Search input field (name or symptom)
  - Filter panel (collapsible):
    * Specialization dropdown
    * Years of experience (range slider: 1-40 years)
    * Location/District (multi-select)
    * Availability (Date picker)
    * Rating filter (4+ stars, 3+ stars, etc.)
  - Search results list (paginated):
    * Doctor cards showing: photo, name, specialty, rating, experience, location
    * "View Details" button per card
  - Sort options: Rating (High to Low), Experience (High to Low), Newest

**API Endpoint:**
```
GET /doctors/search?specialization=Internal%20Medicine&experience=10-40&location=HCM&rating=4&availability=2024-04-10
Response: [
  {
    "id": "doctor_001",
    "name": "Dr. Nguyen Van A",
    "specialization": "Internal Medicine",
    "yearsOfExperience": 15,
    "location": "HCM",
    "rating": 4.8,
    "reviewCount": 156,
    "profileImage": "url",
    "consultation_Fee": 500000
  }
]
```

---

### 2.3 Doctor Detail Screen
- **Purpose:** View comprehensive doctor profile and book appointment
- **UI Elements:**
  - Doctor header: Profile image, name, specialty, qualification badges
  - Key info section:
    * Years of experience
    * Current location/clinic
    * Education background
    * Consultation fee
  - About section (biography)
  - Service pricing table (if multiple services)
  - **Availability Calendar:**
    * Interactive calendar showing available dates
    * Available time slots displayed as green buttons, unavailable as gray
    * User clicks on time slot to book
  - **Patient Reviews Section (Paginated):**
    * Review cards: Patient name (masked), rating stars, review text, date
    * Option to scroll to more reviews
    * "Write a Review" button (only for those who had appointment with this doctor)
  - Action buttons:
    * Primary: "Book Appointment" → navigates to booking flow
    * Secondary: "Call Doctor" (if available)

**API Endpoints:**
```
GET /doctors/{doctorid}
Response: {
  "id": "doctor_001",
  "name": "Dr. Nguyen Van A",
  "specialization": "Internal Medicine",
  "yearsOfExperience": 15,
  "location": "HCM",
  "education": "MD from University of Medicine HCMC",
  "biography": "Dr. Nguyen has...",
  "consultation_Fee": 500000,
  "rating": 4.8,
  "profileImage": "url"
}

GET /doctors/{doctorid}/availability
Response: {
  "doctorId": "doctor_001",
  "availableSlots": [
    {
      "date": "2024-04-10",
      "slots": [
        {"time": "08:00", "available": true},
        {"time": "08:30", "available": true},
        {"time": "09:00", "available": false}
      ]
    }
  ]
}

GET /doctors/{doctorid}/reviews?page=1&limit=10
Response: {
  "reviews": [
    {
      "id": "review_001",
      "patientName": "Patient XYZ",
      "rating": 5,
      "reviewText": "Great doctor, very professional",
      "date": "2024-03-15"
    }
  ],
  "totalCount": 156,
  "page": 1
}
```

---

### 2.4 Write Review Screen
- **Purpose:** Submit rating and review after completing appointment
- **UI Elements:**
  - Doctor name & appointment date (display only)
  - Star rating selector (1-5 stars, clickable)
  - Review text area (max 1000 characters)
  - Photo upload option (optional)
  - "Submit Review" button
  - "Skip" button
- **Trigger:** Automatically shown after appointment completion or from Appointment History

**API Endpoint:**
```
POST /doctors/{doctorid}/reviews
Request: {
  "patientId": "patient_123",
  "doctorId": "doctor_001",
  "appointmentId": "appt_456",
  "rating": 5,
  "reviewText": "Excellent doctor, very caring",
  "reviewPhotos": ["url1", "url2"]
}
Response: {
  "reviewId": "review_001",
  "success": true,
  "message": "Review submitted successfully"
}
```

---

## 3. APPOINTMENT BOOKING & MANAGEMENT
**Service:** Appointment Service, Patient Service  
**Primary User:** Patient User

### 3.1 Appointment Booking Flow (Step-by-step)

#### Step 1: Choose Doctor & Time Slot
- **Purpose:** Select desired doctor and appointment time
- **UI Elements:**
  - Breadcrumb: Step 1 → Step 2 → Step 3
  - Doctor card (selected): Name, specialty, fee, profile image
  - Calendar view showing available dates
  - Time slots list with time and availability status
  - "Next" button

**Prerequisite:** User selects doctor and time from Doctor Detail screen

---

#### Step 2: Select Patient Profile
- **Purpose:** Choose which patient profile to book for (self or family member)
- **UI Elements:**
  - Patient profile cards:
    * "Primary Profile (Self)" - with patient name
    * "Father's Profile" / "Mother's Profile" / Other family members
    * Option to "Add New Family Member" (if not found)
  - Info card showing:
    * Selected patient name
    * Age
    * Medical history summary
  - "Next" button

**Note:** Links to Patient Service to fetch saved patient profiles

---

#### Step 3: Input Chief Complaint & Confirm
- **Purpose:** Provide complaint description and confirm appointment
- **UI Elements:**
  - Summary section:
    * Doctor: Name, specialty
    * Date & time: Formatted display
    * Patient: Name
    * Fee: Amount in currency
  - Text area: "Chief Complaint / Symptoms" (optional but recommended)
  - Additional notes text area
  - Payment method selection (if instant payment required):
    * "Use Wallet Balance" (with current balance display)
    * "Credit/Debit Card"
    * "Bank Transfer"
  - "Confirm & Book" button
  - "Back" button

**API Endpoint:**
```
POST /appointment
Request: {
  "patientId": "patient_123",
  "doctorId": "doctor_001",
  "appointmentDate": "2024-04-10",
  "appointmentTime": "09:00",
  "chiefComplaint": "Headache and fever",
  "additionalNotes": "Have been having symptoms for 3 days"
}
Response: {
  "appointmentId": "appt_001",
  "status": "PENDING",
  "message": "Appointment booked successfully, waiting for confirmation"
}
```

---

### 3.2 My Appointments Screen (Main List)
- **Purpose:** View all patient's appointments
- **UI Elements:**
  - Tab navigation:
    * **"Upcoming" tab (default):**
      - Cards showing: Doctor name, specialty, date-time, status badge (Awaiting Confirmation/Confirmed)
      - Action buttons: "Reschedule", "Cancel"
    * **"History" tab:**
      - Cards showing: Doctor name, date, status (Completed/Cancelled)
      - Action button: "Write Review" (only if Completed and no review yet), "View Details"
  - Empty state message if no appointments
  - "Book New Appointment" button

**API Endpoint:**
```
GET /appointment?patientId=patient_123&status=CONFIRMED
(Fetches upcoming appointments)

GET /appointment?patientId=patient_123&status=COMPLETED,CANCELLED
(Fetches appointment history)
```

---

### 3.3 Appointment Detail Screen
- **Purpose:** View full appointment information and perform actions
- **UI Elements:**
  - Status badge (Awaiting Confirmation / Confirmed / Completed / Cancelled)
  - Doctor card:
    * Photo, name, specialty, clinic location
    * "Contact Doctor" button (messaging/calling)
  - Appointment details:
    * Date formatted: "Wednesday, April 10, 2024"
    * Time: "09:00 AM - 09:30 AM"
    * Location: Full clinic address, map link
    * Chief complaint: Displayed text
  - Fee section:
    * Consultation fee amount
    * Status: Paid/Unpaid
  - Action buttons (based on status):
    * If **Awaiting Confirmation:**
      - "Reschedule" → Opens reschedule picker
      - "Cancel Appointment" → Opens confirmation dialog
    * If **Confirmed:**
      - "Reschedule"
      - "Cancel"
      - "Get Directions" → Google Maps
      - "Join Video Call" (if virtual appointment)
    * If **Completed:**
      - "View Medical Record" → Links to Clinical Service
      - "Write Review" → Opens review screen
      - "View Prescription" → Links to Pharmacy Service
  - Cancellation/Rescheduling history (if applicable)

**API Endpoints:**
```
GET /appointment/{appointmentId}
Response: {
  "appointmentId": "appt_001",
  "doctorId": "doctor_001",
  "patientId": "patient_123",
  "appointmentDate": "2024-04-10",
  "appointmentTime": "09:00",
  "status": "CONFIRMED",
  "chiefComplaint": "Headache and fever",
  "consultationFee": 500000,
  "clinicLocation": "123 Main Street, HCM"
}
```

---

### 3.4 Reschedule Appointment Screen
- **Purpose:** Change appointment to different date/time
- **UI Elements:**
  - Current appointment info (display only):
    * Doctor, current date-time
  - New date & time picker:
    * Calendar showing available dates (only shows available slots)
    * Time slot selection
  - Reason for rescheduling (optional text field)
  - "Confirm Reschedule" button

**API Endpoint:**
```
POST /appointment/{appointmentId}/reschedule
Request: {
  "newDate": "2024-04-12",
  "newTime": "10:00",
  "reason": "Schedule conflict"
}
Response: {
  "appointmentId": "appt_001",
  "newDate": "2024-04-12",
  "newTime": "10:00",
  "status": "RESCHEDULED",
  "message": "Appointment rescheduled successfully"
}
```

---

### 3.5 Cancel Appointment Screen
- **Purpose:** Cancel appointment with reason
- **UI Elements:**
  - Appointment summary card (read-only)
  - "Are you sure?" confirmation message
  - Reason dropdown:
    * "Schedule conflict"
    * "Health recovered"
    * "Found alternative doctor"
    * "Personal reasons"
    * "Other" (with text field)
  - "Confirm Cancellation" button
  - "Go Back" button

**API Endpoint:**
```
POST /appointment/{appointmentId}/cancel
Request: {
  "cancellationReason": "Schedule conflict"
}
Response: {
  "appointmentId": "appt_001",
  "status": "CANCELLED",
  "refundAmount": 500000,
  "message": "Appointment cancelled successfully"
}
```

---

## 4. HEALTH RECORDS & PRESCRIPTIONS
**Services:** Patient Service, Clinical Service, Pharmacy Service  
**Primary User:** Patient User

### 4.1 My Health Record (Profile) Screen
- **Purpose:** Manage personal health information
- **UI Elements:**
  - Personal health info section:
    * Full name (editable)
    * Date of birth (editable)
    * Blood type (editable)
    * Allergies (editable - multi-line text)
    * Medical history (editable - multi-line text)
    * Emergency contact (editable)
  - Profile picture (changeable)
  - Insurance info (if applicable)
  - "Edit" button → enables all fields
  - "Save Changes" button (when in edit mode)
  - "Download PDF" button (exports full health record as PDF)

**API Endpoints:**
```
GET /patients/{patientId}
Response: {
  "patientId": "patient_123",
  "fullName": "John Doe",
  "dateOfBirth": "1990-01-15",
  "bloodType": "O+",
  "allergies": "Penicillin, Shellfish",
  "medicalHistory": "Diabetes (Family), Hypertension",
  "profileImage": "url",
  "emergencyContact": {"name": "Jane Doe", "phone": "+84901234567"}
}

PATCH /patients/{patientId}/image
Request: FormData with image file
Response: {
  "imageUrl": "url"
}

GET /patients/pdf?patientId=patient_123
Response: PDF binary data
```

---

### 4.2 Medical Records History Screen
- **Purpose:** Review all past consultations and diagnoses
- **UI Elements:**
  - Filter section:
    * Date range picker
    * Doctor filter dropdown
    * Medical condition search
  - Chronological list of medical records:
    * Cards showing: Date, Doctor name, Clinic, Chief complaint, Status
    * "View Details" button per card
  - Empty state if no records

**API Endpoint:**
```
GET /medical-records/patient/{patientId}?startDate=2024-01-01&endDate=2024-04-06&limit=20
Response: [
  {
    "medicalRecordId": "record_001",
    "patientId": "patient_123",
    "doctorId": "doctor_001",
    "appointmentDate": "2024-03-20",
    "chiefComplaint": "Fever and cough",
    "diagnosis": "Common cold",
    "notes": "Rest and drink fluids",
    "status": "COMPLETED"
  }
]
```

---

### 4.3 Medical Record Detail Screen
- **Purpose:** View complete medical report for specific consultation
- **UI Elements:**
  - Header:
    * Doctor name, specialty
    * Appointment date-time
    * Clinic location
  - Main content:
    * **Chief Complaint:** Patient's reported symptoms
    * **Vital Signs:** BP, Heart rate, Temperature, Weight (if recorded)
    * **Diagnosis:** Formal diagnosis from doctor
    * **Treatment Plan:** Prescribed actions and notes
    * **Prescriptions Section:** Link to view associated prescriptions
  - Action buttons:
    * "Share Record" (email/SMS)
    * "Download PDF"
    * "Print"

**API Endpoint:**
```
GET /medical-records/{recordId}
Response: {
  "medicalRecordId": "record_001",
  "patientId": "patient_123",
  "doctorId": "doctor_001",
  "doctorName": "Dr. Nguyen Van A",
  "appointmentDate": "2024-03-20",
  "chiefComplaint": "Fever and cough",
  "vitalSigns": {
    "bloodPressure": "120/80", "heartRate": 72, "temperature": 37.5, "weight": 70
  },
  "diagnosis": "Common cold",
  "treatment": "Rest, drink fluids, vitamin C supplement",
  "prescribedMedicines": ["prescription_001", "prescription_002"]
}
```

---

### 4.4 Prescriptions Screen
- **Purpose:** View all active and past prescriptions
- **UI Elements:**
  - Tab navigation:
    * **"Active Prescriptions" tab:**
      - Cards showing: Medicine name, doctor name, date prescribed, status badge (Pending/Dispensed)
      - "View Details" button
    * **"Past Prescriptions" tab:**
      - Historical prescriptions
  - Empty state if no prescriptions

**API Endpoint:**
```
GET /pharmacy/prescriptions/patient/{patientId}
Response: [
  {
    "prescriptionId": "rx_001",
    "patientId": "patient_123",
    "doctorId": "doctor_001",
    "medicines": [
      {
        "medicineId": "med_001",
        "name": "Paracetamol",
        "dosage": "500mg",
        "frequency": "3 times daily",
        "duration": "7 days",
        "quantity": 21
      }
    ],
    "dateIssued": "2024-03-20",
    "status": "DISPENSED"
  }
]
```

---

### 4.5 Prescription Detail Screen
- **Purpose:** View full prescription details
- **UI Elements:**
  - Prescription header: Date issued, doctor name, status badge
  - Table of medicines:
    * Columns: Medicine name, Dosage, Frequency, Duration, Quantity
  - Instructions section (if provided by doctor)
  - Pharmacist notes (if dispensed)
  - Status:
    * "Pending" (not yet dispensed)
    * "Dispensed" (ready for pickup or shipped)
  - Action buttons:
    * "Find Pharmacy" (searches nearby pharmacies that have this medicine)
    * "Print Prescription"
    * "Download PDF"

---

## 5. PAYMENTS & WALLET MANAGEMENT
**Service:** Billing Service  
**Primary User:** Patient User

### 5.1 Wallet / Billing Account Screen
- **Purpose:** Manage account balance and payment methods
- **UI Elements:**
  - Balance card (prominent):
    * Current balance: "₫ 500,000"
    * Account status: Active/Inactive
  - Quick action buttons:
    * "Add Money" (top-up balance)
    * "Transfer Out" (if applicable)
  - Recent transactions section (last 5 transactions):
    * Date, description, amount, type (debit/credit)
    * "View All Transactions" link
  - Payment method settings:
    * Saved credit cards
    * Bank accounts
    * "Add New Payment Method" button

**API Endpoints:**
```
GET /billing/accounts/{accountId}
Response: {
  "accountId": "acc_001",
  "patientId": "patient_123",
  "currentBalance": 500000,
  "status": "ACTIVE",
  "lastUpdated": "2024-04-06T10:30:00Z"
}

GET /billing/accounts/{accountId}/transactions?limit=5
Response: [
  {
    "transactionId": "txn_001",
    "accountId": "acc_001",
    "type": "DEBIT",
    "description": "Appointment with Dr. Nguyen Van A",
    "amount": -500000,
    "date": "2024-03-20",
    "status": "SUCCESS"
  }
]
```

---

### 5.2 Add Money / Top-up Screen
- **Purpose:** Add funds to wallet
- **UI Elements:**
  - Current balance display (read-only)
  - Amount input field with presets:
    * Quick buttons: "100K", "500K", "1M", "5M", "Custom"
  - Payment method selection:
    * Radio buttons: Credit/Debit Card, Bank Transfer, E-wallet
  - Amount to recharge field (auto-filled or manual entry)
  - "Process Payment" button
  - Payment gateway integration (Stripe, ZaloPay, VNPay, etc.)

**API Endpoint:**
```
PATCH /billing/accounts/{accountId}/recharge
Request: {
  "amount": 500000,
  "paymentMethod": "CREDIT_CARD",
  "paymentGatewayId": "txn_gateway_123"
}
Response: {
  "transactionId": "txn_recharge_001",
  "newBalance": 1000000,
  "status": "SUCCESS",
  "message": "Fund added successfully"
}
```

---

### 5.3 Transaction History Screen
- **Purpose:** View detailed transaction history
- **UI Elements:**
  - Filter section:
    * Date range picker
    * Transaction type filter (All/Debit/Credit)
    * Status filter (All/Pending/Success/Failed)
  - Transaction list (paginated):
    * Table or cards showing:
      - Date & time
      - Description (what the transaction was for)
      - Type (Payment/Refund/Top-up)
      - Amount
      - Status badge (Success/Pending/Failed)
    * "View Receipt" button per transaction
  - Export CSV/PDF option

**API Endpoint:**
```
GET /billing/accounts/{accountId}/transactions?startDate=2024-01-01&endDate=2024-04-06&type=ALL&status=ALL&page=1&limit=20
Response: {
  "transactions": [
    {
      "transactionId": "txn_001",
      "date": "2024-03-20T09:00:00Z",
      "description": "Appointment booking - Dr. A",
      "type": "DEBIT",
      "amount": -500000,
      "balance": 500000,
      "status": "SUCCESS",
      "receiptUrl": "url"
    }
  ],
  "totalCount": 45,
  "page": 1,
  "totalPages": 3
}
```

---

---

# PART 2: ADMIN STAFF DASHBOARD
## (Web-based Admin Portal)

### Goal
Manage the entire system: admin users, doctors, patients, appointments, medical records, pharmacy inventory, and generate analytics reports.

---

## 1. AUTHENTICATION & ADMIN LOGIN
**Service:** Auth Service  
**Primary User:** Admin / Healthcare Staff

### 1.1 Admin Login Screen
- **Purpose:** Secure login for admin/staff
- **UI Elements:**
  - Email input
  - Password input
  - "Login" button
  - "Forgot Password" link (similar to patient flow)
  - Organization logo

**API Endpoint:**
```
POST /login
Request: {
  "email": "admin@hospital.com",
  "password": "adminSecurePass"
}
Response: {
  "token": "jwt_admin_token",
  "refreshToken": "refresh_token",
  "role": "ADMIN"
}
```

---

### 1.2 Admin Profile & Settings
- **Purpose:** Manage admin account settings
- **UI Elements:**
  - Profile picture (editable)
  - Full name, email (read-only)
  - Clinic/Hospital name
  - Contact phone
  - Notification preferences (email alerts, dashboard warnings)
  - "Change Password" button
  - "Logout All Sessions" button

**API Endpoints:**
```
GET /user?role=ADMIN
(Admin can view own profile from user list)

DELETE /logout/all?email=admin@hospital.com
(Force logout all sessions)
```

---

## 2. ADMIN DASHBOARD & OVERVIEW
**Service:** Analytics Service, Appointment Service  
**Primary User:** Admin

### 2.1 Main Dashboard Screen
- **Purpose:** High-level system overview and KPIs
- **UI Elements:**
  - Header: Welcome message, current date-time, notifications bell
  - Key Performance Indicators (KPIs) - 4 cards:
    * **Total Patients:** Number with trend ↑↓
    * **Today's Appointments:** Count and status breakdown (Confirmed/Pending/Completed)
    * **Monthly Revenue:** Amount in currency with trend
    * **Active Doctors:** Number of working doctors
  - Charts section:
    * **Patient Growth Chart:** Line chart showing patient count over last 30 days
    * **Revenue Trend:** Bar/Line chart showing daily/weekly revenue
  - Recent activities section:
    * New appointments requiring confirmation (list of 5-10 newest pending appointments)
    * Quick action buttons: "Confirm", "Reject", "View Details"
  - Navigation sidebar (always visible on desktop)

**API Endpoints:**
```
GET /analytics/patients/count?period=30days
Response: {
  "totalPatients": 1250,
  "newPatientsToday": 5,
  "newPatientsThisMonth": 89,
  "trend": "UP"
}

GET /analytics/growth-rate
Response: {
  "data": [
    {"date": "2024-03-07", "count": 1100},
    {"date": "2024-03-08", "count": 1120},
    ...
    {"date": "2024-04-06", "count": 1250}
  ]
}

GET /analytics/revenue?period=30days
Response: {
  "totalRevenue": 50000000,
  "trend": "UP",
  "monthlyData": [
    {"date": "2024-03-01", "revenue": 1500000}
  ]
}

GET /appointment?status=PENDING&limit=10
Response: [
  {
    "appointmentId": "appt_001",
    "patientName": "John Doe",
    "doctorName": "Dr. Nguyen Van A",
    "appointmentDate": "2024-04-06",
    "appointmentTime": "09:00",
    "status": "PENDING"
  }
]
```

---

## 3. USER & ACCOUNT MANAGEMENT
**Service:** Auth Service  
**Primary User:** Admin

### 3.1 Users Management Screen
- **Purpose:** Manage all system accounts (Admin, Doctor, Patient)
- **UI Elements:**
  - Tab navigation:
    * "All Users" (default)
    * "Admins"
    * "Doctors"
    * "Patients"
  - Search bar (search by email, name)
  - Filter options:
    * Status: Active/Inactive
    * Last login date range
    * Account creation date range
  - User table with columns:
    * Email
    * Full name
    * Role
    * Status (Active/Inactive)
    * Last login date
    * Actions dropdown:
      - "View Profile"
      - "Lock Account"
      - "Reset Password"
      - "Force Logout"
      - "Delete Account"
  - Pagination controls

**API Endpoint:**
```
GET /user?role=&filter=&search=
Response: [
  {
    "userId": "user_001",
    "email": "admin@hospital.com",
    "fullName": "Admin User",
    "role": "ADMIN",
    "status": "ACTIVE",
    "lastLogin": "2024-04-06T08:30:00Z",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]

DELETE /logout/all?email=patient@example.com
(Force all sessions of a user to logout)
```

---

## 4. DOCTOR MANAGEMENT
**Service:** Doctor Service  
**Primary User:** Admin

### 4.1 Doctors List Screen
- **Purpose:** View and manage all doctors in the system
- **UI Elements:**
  - Search bar (doctor name, specialization)
  - Filter section:
    * Specialization filter dropdown
    * Status: Active/Inactive
  - Doctor table with columns:
    * Doctor name
    * Email
    * Specialization
    * Years of experience
    * Current status (Active/On Leave)
    * Rating (stars)
    * Actions dropdown:
      - "View Profile"
      - "Edit Info"
      - "Manage Schedule"
      - "View Reviews"
      - "Deactivate/Activate"
  - "Add New Doctor" button (opens modal/screen)
  - Pagination

**API Endpoints:**
```
GET /doctors
Response: [
  {
    "doctorId": "doctor_001",
    "name": "Dr. Nguyen Van A",
    "email": "doctor_a@hospital.com",
    "specialization": "Internal Medicine",
    "yearsOfExperience": 15,
    "status": "ACTIVE",
    "rating": 4.8
  }
]

GET /doctors/search?specialization=Internal%20Medicine&status=ACTIVE
Response: [...]
```

---

### 4.2 Add/Edit Doctor Screen
- **Purpose:** Create or update doctor profile
- **UI Elements:**
  - Form with fields:
    * Full name (required)
    * Email (required)
    * Phone number (required)
    * Specialization (dropdown, required)
    * Years of experience (number input)
    * Education background (text area)
    * Biography (text area)
    * Profile image upload
    * Status (Active/Inactive radio)
    * Consultation fee (number input)
  - Validation messages
  - "Save" button
  - "Cancel" button

**API Endpoint (Create):**
```
POST /doctors
Request: {
  "name": "Dr. Tran Van B",
  "email": "doctor_b@hospital.com",
  "phone": "+84912345679",
  "specialization": "Surgery",
  "yearsOfExperience": 12,
  "education": "MD from University X",
  "biography": "Specialized in...",
  "consultationFee": 600000,
  "status": "ACTIVE"
}
Response: {
  "doctorId": "doctor_002",
  "message": "Doctor created successfully"
}

PUT /doctors/{doctorId}
Request: {...updated fields...}
Response: {...updated doctor object...}

PATCH /doctors/{doctorId}/image
Request: FormData with image file
Response: {
  "imageUrl": "url"
}
```

---

### 4.3 Doctor Schedule Management Screen
- **Purpose:** Create and manage doctor working hours
- **UI Elements:**
  - Doctor selector (dropdown or search)
  - Schedule type selector: Weekly / Monthly / Custom range
  - Calendar view (grid format):
    * Rows: Days of the week (Mon-Sun)
    * Columns: Time slots (30-min or hourly intervals)
    * Cells: Toggle buttons or checkboxes to mark doctor's availability
  - Quick actions:
    * "Mark All Available"
    * "Mark All Unavailable"
    * "Copy From Previous Week"
  - Time-off section:
    * "Add Time Off" button → opens date-time picker for leave/vacation
  - "Save Schedule" button

**API Endpoint:**
```
POST /doctors/{doctorId}/schedules
Request: {
  "startDate": "2024-04-07",
  "endDate": "2024-04-13",
  "schedules": [
    {
      "dayOfWeek": "MONDAY",
      "timeSlots": [
        {"startTime": "08:00", "endTime": "08:30"},
        {"startTime": "08:30", "endTime": "09:00"}
      ]
    }
  ]
}
Response: {
  "scheduleId": "sched_001",
  "message": "Schedule created successfully"
}
```

---

### 4.4 Doctor Reviews Management Screen
- **Purpose:** View and respond to patient reviews
- **UI Elements:**
  - Doctor selector (filter reviews by doctor)
  - Filter options:
    * Rating: All / 1-2 stars / 3-4 stars / 5 stars
    * Date range picker
  - Reviews table with columns:
    * Doctor name
    * Patient (masked)
    * Rating (stars)
    * Review text (truncated, expandable)
    * Review date
    * Admin response status (Responded / Pending / No response)
    * Actions: "View Full Review", "Add Response", "Delete"
  - Modal for viewing full review and adding response

**API Endpoints:**
```
GET /doctors/{doctorId}/reviews?page=1&limit=20
Response: [
  {
    "reviewId": "review_001",
    "doctorId": "doctor_001",
    "patientName": "Patient XYZ",
    "rating": 5,
    "reviewText": "Great doctor",
    "date": "2024-03-15",
    "adminResponse": null
  }
]

POST /doctors/reviews/{reviewId}/response
Request: {
  "responseText": "Thank you for your kind words!"
}
Response: {
  "reviewId": "review_001",
  "adminResponse": {...},
  "message": "Response added successfully"
}
```

---

## 5. PATIENT MANAGEMENT
**Service:** Patient Service  
**Primary User:** Admin

### 5.1 Patients List Screen
- **Purpose:** View and manage all patients
- **UI Elements:**
  - Search bar (patient name, email, phone)
  - Filter options:
    * Registration date range
    * Status: Active/Inactive
  - Patient table with columns:
    * Patient ID
    * Full name
    * Email
    * Phone
    * Registration date
    * Last appointment date
    * Status
    * Actions dropdown:
      - "View Profile"
      - "Edit Info"
      - "View Medical Records"
      - "View Billing"
      - "Delete"
  - "Add New Patient" button (for walk-in patients at clinic)
  - Pagination

**API Endpoint:**
```
GET /patients
Response: [
  {
    "patientId": "patient_001",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+84901234567",
    "registrationDate": "2024-01-15",
    "lastAppointment": "2024-03-20",
    "status": "ACTIVE"
  }
]
```

---

### 5.2 Add/Edit Patient Screen
- **Purpose:** Create or update patient profile
- **UI Elements:**
  - Form with sections:
    * **Personal Info:**
      - Full name
      - Email
      - Phone
      - Date of birth
      - Gender (dropdown: Male/Female/Other)
    * **Medical Info:**
      - Blood type
      - Allergies (text area)
      - Medical history (text area)
    * **Emergency Contact:**
      - Contact name
      - Relationship
      - Contact phone
    * **Address:**
      - Street address
      - District/Province
      - Ward
    * **Image Upload:**
      - Profile picture
  - Status toggle: Active/Inactive
  - "Save Patient" button
  - "Cancel" button

**API Endpoints:**
```
POST /patients
Request: {
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+84909876543",
  "dateOfBirth": "1995-06-20",
  "bloodType": "A+",
  "allergies": "Latex",
  "gender": "FEMALE"
}
Response: {
  "patientId": "patient_002",
  "message": "Patient created successfully"
}

PUT /patients/{patientId}
Request: {...updated fields...}
Response: {...updated patient object...}

PATCH /patients/{patientId}/image
Request: FormData with image file
Response: {
  "imageUrl": "url"
}

DELETE /patients/{patientId}
Response: {
  "message": "Patient deleted successfully"
}
```

---

### 5.3 Patient Medical Records Screen
- **Purpose:** View patient's medical history
- **UI Elements:**
  - Patient info card (name, age, contact info)
  - Medical records chronological list:
    * Cards showing: Date, doctor name, chief complaint, diagnosis
    * "View Details" button
  - "Add New Medical Record" button
  - Filter options: Date range, doctor name

**API Endpoint:**
```
GET /medical-records/patient/{patientId}
Response: [
  {
    "medicalRecordId": "record_001",
    "appointmentDate": "2024-03-20",
    "doctorName": "Dr. Nguyen Van A",
    "chiefComplaint": "Fever",
    "diagnosis": "Common cold"
  }
]
```

---

### 5.4 Patient Billing Screen
- **Purpose:** View and manage patient's billing account
- **UI Elements:**
  - Patient info header
  - Billing account section:
    * Current balance
    * Account status (Active/Inactive)
  - Account actions:
    * "View Balance History"
    * "Print Billing Statement"
    * "Add Funds / Recharge" button
  - Recent transactions (last 10):
    * Date, description, amount, type

**API Endpoint:**
```
GET /billing/accounts/{accountId}
Response: {
  "accountId": "acc_001",
  "patientName": "John Doe",
  "currentBalance": 500000,
  "status": "ACTIVE"
}
```

---

## 6. APPOINTMENT MANAGEMENT
**Service:** Appointment Service  
**Primary User:** Admin

### 6.1 Appointment Master Screen (Calendar/Grid View)
- **Purpose:** Manage all appointments across all doctors
- **UI Elements:**
  - View selector: Calendar / List / Grid
  - Date range selector:
    * Week view / Month view buttons
    * Date navigation (< >)
  - Doctor filter (multi-select dropdown or filter panel)
  - Status filter: All / Pending / Confirmed / Completed / Cancelled
  - **Calendar/Grid view:**
    * X-axis: Time slots (hourly or 30-min intervals)
    * Y-axis: Doctors or appointment slots
    * Cells: Appointment cards color-coded by status:
      - Red: Pending confirmation
      - Green: Confirmed
      - Gray: Cancelled
      - Blue: Completed
    * Click on card to see details/actions
  - Quick action buttons on cards: Confirm, Reject, Reschedule, Cancel

**API Endpoints:**
```
GET /appointment?startDate=2024-04-01&endDate=2024-04-07&status=ALL
Response: [
  {
    "appointmentId": "appt_001",
    "patientName": "John Doe",
    "doctorName": "Dr. A",
    "appointmentDate": "2024-04-06",
    "appointmentTime": "09:00",
    "status": "PENDING"
  }
]
```

---

### 6.2 Appointment Detail Screen
- **Purpose:** View complete appointment info and perform admin actions
- **UI Elements:**
  - Appointment summary card:
    * Status badge (Pending/Confirmed/Completed/Cancelled)
    * Patient: Name, phone, email
    * Doctor: Name, specialization
    * Date-Time: Formatted display
    * Location: Clinic address
  - Appointment details:
    * Chief complaint
    * Duration (e.g., 30 min)
    * Fee amount
  - Status history (timeline showing state changes)
  - Admin action buttons (context-sensitive based on current status):
    * If **PENDING:**
      - "Confirm Appointment" → Changes status to CONFIRMED
      - "Reject Appointment" → Changes status to REJECTED
      - "Reschedule" → Opens reschedule picker
      - "Cancel" → Changes status to CANCELLED
    * If **CONFIRMED:**
      - "Complete Appointment" → Changes status to COMPLETED (typically after appointment time)
      - "Reschedule"
      - "Cancel"
    * If **COMPLETED:**
      - "View Medical Record" (if available)
      - "View Prescription" (if available)
      - Cannot change status
    * If **CANCELLED:**
      - Display cancellation reason
      - Cannot change status
  - Notes section (admin can add internal notes)

**API Endpoints:**
```
GET /appointment/{appointmentId}
Response: {
  "appointmentId": "appt_001",
  "patientId": "patient_001",
  "doctorId": "doctor_001",
  "appointmentDate": "2024-04-06",
  "appointmentTime": "09:00",
  "status": "PENDING",
  "chiefComplaint": "Headache",
  "consultationFee": 500000
}

POST /appointment/{appointmentId}/confirm
Response: {
  "appointmentId": "appt_001",
  "status": "CONFIRMED",
  "message": "Appointment confirmed"
}

POST /appointment/{appointmentId}/reject
Request: {
  "rejectionReason": "Doctor unavailable"
}
Response: {
  "appointmentId": "appt_001",
  "status": "REJECTED",
  "message": "Appointment rejected"
}

POST /appointment/{appointmentId}/reschedule
Request: {
  "newDate": "2024-04-08",
  "newTime": "10:00"
}
Response: {
  "appointmentId": "appt_001",
  "newDate": "2024-04-08",
  "newTime": "10:00",
  "status": "RESCHEDULED"
}

POST /appointment/{appointmentId}/cancel
Request: {
  "cancellationReason": "Patient requested cancellation"
}
Response: {
  "appointmentId": "appt_001",
  "status": "CANCELLED"
}
```

---

## 7. CLINICAL & MEDICAL RECORDS MANAGEMENT
**Service:** Clinical Service  
**Primary User:** Doctor / Admin

### 7.1 Create Medical Record Screen (Doctor/Consultation Entry)
- **Purpose:** Doctor enters patient examination data during/after consultation
- **UI Elements:**
  - Patient selector or auto-populated if accessed from appointment
  - Appointment info display (read-only): Date, time, chief complaint
  - Form sections:
    * **Vital Signs:**
      - Blood pressure (input: 120/80 format)
      - Heart rate (bpm)
      - Temperature (°C)
      - Respiratory rate (breaths/min)
      - Weight (kg)
      - Height (cm)
    * **Physical Examination:**
      - Text area for examination findings
    * **Diagnosis:**
      - Primary diagnosis (dropdown or autocomplete)
      - Secondary diagnoses (multi-select)
      - ICD-10 codes (if applicable)
    * **Treatment Plan:**
      - Text area for treatment recommendations
      - Doctor's notes
    * **Prescription:**
      - "Add Medicine" button → opens medicine selector
      - Medicine table: Medicine name, dosage, frequency, duration
    * **Attachments:**
      - Option to upload test results, X-ray images, etc.
  - "Save Record" button
  - "Save & Print" button
  - "Cancel" button

**API Endpoint:**
```
POST /medical-records
Request: {
  "patientId": "patient_001",
  "appointmentId": "appt_001",
  "doctorId": "doctor_001",
  "vitalSigns": {
    "bloodPressure": "120/80",
    "heartRate": 72,
    "temperature": 37.0,
    "weight": 70
  },
  "chiefComplaint": "Fever and cough",
  "diagnosis": "Common cold",
  "treatment": "Rest and fluids",
  "prescribedMedicines": ["med_001", "med_002"]
}
Response: {
  "medicalRecordId": "record_001",
  "message": "Medical record created successfully"
}
```

---

### 7.2 Edit Medical Record Screen
- **Purpose:** Modify existing medical record (for corrections or updates)
- **UI Elements:**
  - Similar to "Create Medical Record" but with pre-filled fields
  - "Last modified" timestamp display
  - "Save Changes" button
  - "Cancel" button
  - "Delete Record" button (with confirmation)

**API Endpoint:**
```
PUT /medical-records/{medicalRecordId}
Request: {...updated record fields...}
Response: {
  "medicalRecordId": "record_001",
  "message": "Medical record updated successfully"
}
```

---

### 7.3 Medical Records Lookup Screen
- **Purpose:** Search and retrieve existing medical records
- **UI Elements:**
  - Search criteria section:
    * Patient name/ID (autocomplete)
    * Date range picker
    * Doctor name filter
  - Search results list:
    * Cards showing: Date, doctor, patient, chief complaint
    * "View" button → Opens record detail
    * "Edit" button → Opens edit screen
  - Pagination

**API Endpoint:**
```
GET /medical-records?patientId=patient_001&startDate=2024-01-01&endDate=2024-04-06
Response: [
  {
    "medicalRecordId": "record_001",
    "appointmentDate": "2024-03-20",
    "doctorName": "Dr. A",
    "patientName": "John Doe",
    "chiefComplaint": "Fever",
    "diagnosis": "Common cold"
  }
]

GET /medical-records/{recordId}
Response: {...full record details...}
```

---

## 8. PHARMACY MANAGEMENT
**Service:** Pharmacy Service  
**Primary User:** Pharmacist / Admin

### 8.1 Medicines Inventory Screen
- **Purpose:** Manage medicine stock and information
- **UI Elements:**
  - Search bar (medicine name, SKU)
  - Filter options:
    * Medicine category (dropdown)
    * Stock status: In Stock / Low Stock / Out of Stock
  - Medicines table with columns:
    * Medicine name
    * Generic name
    * Category
    * Current stock quantity
    * Reorder level
    * Unit price
    * Expiry date
    * Actions dropdown:
      - "Edit Medicine"
      - "Adjust Stock"
      - "View History"
      - "Deactivate"
  - "Add New Medicine" button
  - Pagination

**API Endpoint:**
```
GET /pharmacy/medicines?category=&status=&search=
Response: [
  {
    "medicineId": "med_001",
    "name": "Paracetamol",
    "genericName": "Acetaminophen",
    "category": "Analgesic",
    "stockQuantity": 500,
    "reorderLevel": 100,
    "unitPrice": 5000,
    "expiryDate": "2025-12-31"
  }
]
```

---

### 8.2 Add/Edit Medicine Screen
- **Purpose:** Create or update medicine records
- **UI Elements:**
  - Form fields:
    * Medicine name (required)
    * Generic name
    * Category (dropdown)
    * Description
    * Dosage form (tablet, capsule, liquid, injection, etc.)
    * Unit price
    * Manufacturer
    * Supplier info
    * Stock quantity
    * Reorder level
    * Expiry date (date picker)
    * Warnings/Contraindications (text area)
  - "Save Medicine" button
  - "Cancel" button

**API Endpoint:**
```
POST /pharmacy/medicines
Request: {
  "name": "Ibuprofen",
  "genericName": "Ibuprofen",
  "category": "NSAID",
  "dosageForm": "TABLET",
  "unitPrice": 3000,
  "stockQuantity": 1000,
  "reorderLevel": 200,
  "expiryDate": "2025-06-30"
}
Response: {
  "medicineId": "med_002",
  "message": "Medicine added successfully"
}
```

---

### 8.3 Prescriptions Management Screen
- **Purpose:** View and process patient prescriptions
- **UI Elements:**
  - Tab navigation:
    * **"Pending Prescriptions" tab (default):**
      - Prescriptions awaiting dispensing
      - Table showing: Date, patient, doctor, status
      - "View" button → Opens prescription detail
    * **"Completed Prescriptions" tab:**
      - Already dispensed prescriptions
      - Filter options: Date range, patient
  - Search bar (patient name, prescription ID)
  - Pagination

**API Endpoint:**
```
GET /pharmacy/prescriptions?status=PENDING
Response: [
  {
    "prescriptionId": "rx_001",
    "patientName": "John Doe",
    "doctorName": "Dr. A",
    "dateIssued": "2024-03-20",
    "status": "PENDING"
  }
]
```

---

### 8.4 Prescription Detail & Dispensing Screen
- **Purpose:** View prescription details and dispense medicines
- **UI Elements:**
  - Prescription header: Prescription ID, date, patient, doctor
  - Medicines table (from prescription):
    * Columns: Medicine name, generic name, dosage, frequency, duration, quantity
    * Row per medicine
  - Doctor's instructions (if any)
  - Dispensing section:
    * Pharmacist checks each medicine's availability
    * Status for each medicine: "Available", "Out of Stock", "Waiting for Restock"
    * Pharmacist marks items as "picked" or verifies
  - "Dispense & Complete" button (once all medicines confirmed available)
  - "Partial Dispense" option (if some medicines unavailable, with reason)
  - "Print Prescription" button
  - Medicine preparation checklist (optional)

**API Endpoint:**
```
GET /pharmacy/prescriptions/{prescriptionId}
Response: {
  "prescriptionId": "rx_001",
  "patientId": "patient_001",
  "doctorName": "Dr. A",
  "medicines": [
    {
      "medicineId": "med_001",
      "name": "Paracetamol",
      "dosage": "500mg",
      "frequency": "3 times daily",
      "duration": "7 days",
      "quantity": 21
    }
  ],
  "status": "PENDING"
}

POST /pharmacy/prescriptions/{prescriptionId}/dispense
Request: {
  "dispensedMedicines": ["med_001", "med_002"],
  "dispensedBy": "pharmacist@hospital.com",
  "dispensedDate": "2024-03-21"
}
Response: {
  "prescriptionId": "rx_001",
  "status": "DISPENSED",
  "message": "Prescription dispensed successfully"
}
```

---

## 9. BILLING & FINANCIAL MANAGEMENT
**Service:** Billing Service  
**Primary User:** Admin / Billing Staff

### 9.1 Billing Accounts Management Screen
- **Purpose:** Manage patient billing accounts and wallets
- **UI Elements:**
  - Search bar (patient name, email)
  - Filter options:
    * Account status: Active/Inactive
    * Balance range
    * Creation date range
  - Billing accounts table with columns:
    * Patient name
    * Email
    * Current balance
    * Account status
    * Created date
    * Last transaction date
    * Actions dropdown:
      - "View Account Details"
      - "Recharge/Add Funds"
      - "Adjust Balance" (admin-only, with reason)
      - "Activate/Deactivate Account"
      - "View Transactions"
      - "Delete Account"
  - "Create New Billing Account" button (for new patient)
  - Pagination

**API Endpoints:**
```
GET /billing/accounts?status=ACTIVE&limit=20
Response: [
  {
    "accountId": "acc_001",
    "patientName": "John Doe",
    "patientEmail": "john@example.com",
    "currentBalance": 500000,
    "status": "ACTIVE",
    "createdDate": "2024-01-15",
    "lastTransactionDate": "2024-04-06"
  }
]
```

---

### 9.2 Create/Edit Billing Account Screen
- **Purpose:** Set up or modify patient billing account
- **UI Elements:**
  - Patient selector (search/autocomplete)
  - Initial balance input (for new account)
  - Account configuration:
    * Credit limit (optional)
    * Account status (Active/Inactive toggle)
    * Special notes (text area)
  - "Create Account" or "Save Changes" button
  - "Cancel" button

**API Endpoint:**
```
POST /billing/accounts
Request: {
  "patientId": "patient_123",
  "initialBalance": 1000000,
  "status": "ACTIVE"
}
Response: {
  "accountId": "acc_002",
  "message": "Billing account created successfully"
}
```

---

### 9.3 Recharge / Add Funds Screen
- **Purpose:** Top-up patient's account balance (admin recharges on behalf of patient)
- **UI Elements:**
  - Patient info display (read-only):
    * Name, current balance
  - Amount input:
    * Amount to add (currency input)
    * Quick buttons: "100K", "500K", "1M", "5M", "Custom"
  - Payment method:
    * Dropdown: Cash, Bank Transfer, Card, E-wallet
  - Transaction reference (optional text field for reference number)
  - "Process Recharge" button
  - "Cancel" button

**API Endpoint:**
```
PATCH /billing/accounts/{accountId}/recharge
Request: {
  "amount": 500000,
  "paymentMethod": "CASH",
  "reference": "Received cash from patient",
  "adminId": "admin_001"
}
Response: {
  "transactionId": "txn_001",
  "newBalance": 1000000,
  "message": "Recharge processed successfully"
}
```

---

### 9.4 Manage Account Status Screen
- **Purpose:** Activate, deactivate, or manage billing account status
- **UI Elements:**
  - Account selector
  - Current account status display (Active/Inactive)
  - Reason selector or input (text area):
    * Pre-defined reasons: "Payment overdue", "Account suspended", "Requested by patient", "Other"
    * Custom reason input
  - Status toggle buttons:
    * "Activate Account"
    * "Deactivate Account"
    * "Suspend Account"
  - "Save Changes" button
  - Status change history (timeline of previous status changes)

**API Endpoint:**
```
PATCH /billing/accounts/{accountId}/status
Request: {
  "status": "INACTIVE",
  "reason": "Account suspended due to payment overdue"
}
Response: {
  "accountId": "acc_001",
  "status": "INACTIVE",
  "message": "Account status updated"
}
```

---

### 9.5 Transactions Management Screen
- **Purpose:** View and manage all system transactions
- **UI Elements:**
  - Filter section:
    * Date range picker
    * Transaction type: All / Payment / Refund / Recharge / Adjustment
    * Status: All / Pending / Success / Failed
    * Patient search
    * Amount range filter
  - Transactions table with columns:
    * Transaction ID
    * Date & Time
    * Patient name
    * Type (Payment/Refund/etc.)
    * Description / Related entity
    * Amount
    * Status badge (Success/Pending/Failed)
    * Actions: "View Details", "Retry" (if failed), "Cancel" (if pending)
  - Pagination
  - Export CSV/PDF option
  - Summary section (total successful, pending, failed amounts in period)

**API Endpoints:**
```
GET /billing/accounts/{accountId}/transactions?startDate=2024-01-01&endDate=2024-04-06&type=ALL&status=ALL&page=1
Response: {
  "transactions": [
    {
      "transactionId": "txn_001",
      "date": "2024-03-20",
      "patientName": "John Doe",
      "type": "PAYMENT",
      "description": "Appointment with Dr. A",
      "amount": -500000,
      "status": "SUCCESS",
      "newBalance": 500000
    }
  ],
  "totalCount": 120,
  "page": 1
}

PATCH /billing/transactions/{transactionId}/status
Request: {
  "status": "SUCCESS",
  "adminNotes": "Verified against bank transfer"
}
Response: {
  "transactionId": "txn_pending_001",
  "status": "SUCCESS",
  "message": "Transaction status updated"
}
```

---

### 9.6 Delete Billing Account Screen
- **Purpose:** Remove a billing account from system
- **UI Elements:**
  - Account selector
  - Warning message: "Are you sure you want to delete this account?"
  - Account details summary (read-only):
    * Current balance
    * Number of transactions
    * Last transaction date
  - Reason for deletion (dropdown):
    * "Patient requested"
    * "Duplicate account"
    * "Other"
  - Confirmation checkbox: "I understand this action cannot be undone"
  - "Delete Account" button (red, disabled until confirmation checked)
  - "Cancel" button

**API Endpoint:**
```
DELETE /billing/{accountId}
Request: {
  "reason": "Duplicate account",
  "approvedBy": "admin_001"
}
Response: {
  "accountId": "acc_001",
  "message": "Billing account deleted successfully"
}
```

---

## 10. ANALYTICS & REPORTING
**Service:** Analytics Service  
**Primary User:** Admin

### 10.1 Patient Analytics Screen
- **Purpose:** View patient acquisition and demographics
- **UI Elements:**
  - KPI cards:
    * Total registered patients
    * New patients this month
    * New patients today
  - Date range selector (calendar picker or predefined: Today/Week/Month/Year/Custom)
  - Charts:
    * **Patient Growth Line Chart:** Show patient count cumulative over time
    * **Daily New Patients Bar Chart:** Show new patient registration per day
    * **Patient Demographics Pie Chart:** Distribution by age group, gender, etc.
  - Patient list (option to breakdown by):
    * Newly registered patients (new this period)
    * Table columns: Registration date, name, email, phone
  - Export options: Download report as PDF/CSV

**API Endpoints:**
```
GET /analytics/patients/count?startDate=2024-01-01&endDate=2024-04-06
Response: {
  "totalPatients": 1250,
  "newPatientsThisPeriod": 89,
  "trend": "UP",
  "percentageChange": 8.5
}

GET /analytics/patients?startDate=2024-03-07&endDate=2024-04-06&limit=100
Response: [
  {
    "patientId": "patient_001",
    "fullName": "John Doe",
    "registrationDate": "2024-03-20",
    "email": "john@example.com"
  }
]

GET /analytics/growth-rate?startDate=2024-03-01&endDate=2024-04-06
Response: {
  "data": [
    {"date": "2024-03-01", "count": 1100, "growth": null},
    {"date": "2024-03-02", "count": 1105, "growth": 0.45},
    ...
  ]
}
```

---

### 10.2 Revenue Analytics Screen
- **Purpose:** View financial performance and revenue trends
- **UI Elements:**
  - KPI cards:
    * Total revenue (configurable period)
    * Monthly average
    * Revenue trend (up/down percentage)
  - Date range & period selector:
    * Date range picker
    * Period: Daily / Weekly / Monthly / Yearly
  - Charts:
    * **Revenue Trend Line Chart:** Total revenue over time
    * **Breakdown by Revenue Source Pie/Donut Chart:**
      - Appointment revenue
      - Pharmacy revenue
      - Other sources
  - Details tab:
    * Revenue by doctor (sortable table)
    * Revenue by service type
    * Revenue by patient (top spenders)
  - Booking/Confirmation rate metrics
  - Export options: PDF, CSV, Excel

**API Endpoints:**
```
GET /analytics/revenue?startDate=2024-03-01&endDate=2024-04-06
Response: {
  "totalRevenue": 50000000,
  "averageMonthlyRevenue": 12500000,
  "trend": "UP",
  "percentageChange": 5.2,
  "data": [
    {"date": "2024-03-01", "revenue": 1500000},
    {"date": "2024-03-02", "revenue": 1650000}
  ]
}

GET /analytics/revenue/patient/{patientId}
Response: {
  "patientId": "patient_001",
  "totalSpent": 2500000,
  "transactionCount": 5,
  "averageTransactionValue": 500000
}
```

---

### 10.3 Performance Analytics Screen
- **Purpose:** View system performance metrics and insights
- **UI Elements:**
  - KPI cards:
    * Top doctor (highest revenue/appointments)
    * Most booked time slot
    * Average appointment duration
    * Cancellation rate
  - Charts:
    * **Top Patients by Spending Bar Chart:** High-value patients
    * **Completed Transactions Count Line Chart:** Transaction success rate over time
  - Metrics:
    * Total successful transactions
    * Failed transactions (with reasons breakdown)
    * Pending transactions count
    * Average transaction amount
  - Sorting & filtering options
  - Export capability

**API Endpoints:**
```
GET /analytics/top-patient?limit=10&startDate=2024-01-01&endDate=2024-04-06
Response: [
  {
    "rank": 1,
    "patientName": "Patient A",
    "totalSpent": 5000000,
    "appointmentCount": 10,
    "avgSpendPerAppointment": 500000
  }
]

GET /analytics/completed/count?startDate=2024-03-01&endDate=2024-04-06
Response: {
  "totalCompleted": 1250,
  "totalFailed": 15,
  "totalPending": 8,
  "successRate": 98.8,
  "dailyData": [
    {"date": "2024-03-01", "completed": 45, "failed": 1}
  ]
}
```

---

---

# PART 3: COMPLETE ENDPOINT REFERENCE

## Summary of All Endpoints by Service

### Auth Service (8 endpoints)
| Endpoint | Method | Access | Purpose |
|----------|--------|--------|---------|
| `/login` | POST | Public | Patient/Admin login |
| `/signup` | POST | Public | Patient registration |
| `/validate` | GET | Public | Validate token |
| `/refresh` | POST | Public | Refresh access token |
| `/logout` | DELETE | Public | Logout single session |
| `/logout/all` | DELETE | Public | Logout all sessions |
| `/reset` | POST | Public | Reset password |
| `/user` | GET | ADMIN | List all users |

---

### Doctor Service (13 endpoints)
| Endpoint | Method | Access | Purpose |
|----------|--------|--------|---------|
| `/doctors` | GET | USER, ADMIN | List all doctors |
| `/doctors` | POST | ADMIN | Create doctor |
| `/doctors/{id}` | GET | USER, ADMIN | Get doctor details |
| `/doctors/{id}` | PUT | ADMIN | Update doctor |
| `/doctors/{id}/image` | PATCH | USER, ADMIN | Update doctor image |
| `/doctors/{id}/schedules` | POST | ADMIN | Create doctor schedules |
| `/doctors/search` | GET | USER, ADMIN | Advanced search doctors |
| `/doctors/{id}/details` | GET | USER, ADMIN | Get full doctor details |
| `/doctors/{id}/availability` | GET | USER, ADMIN | Get availability slots |
| `/doctors/top-rated` | GET | USER, ADMIN | Get top-rated doctors |
| `/doctors/{id}/reviews` | POST | USER, ADMIN | Submit review |
| `/doctors/{id}/reviews` | GET | USER, ADMIN | Get doctor reviews |
| `/doctors/reviews/{reviewId}/response` | POST | ADMIN | Respond to review |

### Internal Doctor Endpoints:
| `/internal/doctor/{id}` | GET | Internal | Verify doctor exists |
| `/internal/doctor/detail/{id}` | GET | Internal | Get doctor details |

---

### Appointment Service (6 endpoints)
| Endpoint | Method | Access | Purpose |
|----------|--------|--------|---------|
| `/appointment` | POST | USER, ADMIN | Create appointment |
| `/appointment/{id}` | GET | ADMIN | Get appointment details |
| `/appointment/{id}/confirm` | POST | ADMIN | Confirm appointment |
| `/appointment/{id}/reject` | POST | ADMIN | Reject appointment |
| `/appointment/{id}/cancel` | POST | USER, ADMIN | Cancel appointment |
| `/appointment/{id}/reschedule` | POST | USER, ADMIN | Reschedule appointment |

---

### Patient Service (7 endpoints)
| Endpoint | Method | Access | Purpose |
|----------|--------|--------|---------|
| `/patients` | GET | ADMIN | List all patients |
| `/patients` | POST | ADMIN | Create patient |
| `/patients/{id}` | GET | USER, ADMIN | Get patient profile |
| `/patients/{id}` | PUT | ADMIN | Update patient |
| `/patients/{id}` | DELETE | ADMIN | Delete patient |
| `/patients/{id}/image` | PATCH | USER, ADMIN | Update patient image |
| `/patients/pdf` | GET | USER, ADMIN | Export patient record PDF |

### Internal Patient Endpoints:
| `/internal/patient/{id}` | GET | Internal | Verify patient exists |
| `/internal/patient/detail/{id}` | GET | Internal | Get patient details |

---

### Clinical Service (4 endpoints)
| Endpoint | Method | Access | Purpose |
|----------|--------|--------|---------|
| `/medical-records` | POST | ADMIN | Create medical record |
| `/medical-records/patient/{patientId}` | GET | USER, ADMIN | Get patient medical records |
| `/medical-records/{id}` | GET | USER, ADMIN | Get medical record details |
| `/medical-records/{id}` | PUT | ADMIN | Update medical record |

### Internal Clinical Endpoints:
| `/internal/medical-record/{id}` | GET | Internal | Verify record exists |
| `/internal/medical-record/detail/{id}` | GET | Internal | Get record details |

---

### Pharmacy Service (5 endpoints)
| Endpoint | Method | Access | Purpose |
|----------|--------|--------|---------|
| `/pharmacy/medicines` | GET | USER, ADMIN | List medicines |
| `/pharmacy/medicines` | POST | ADMIN | Add medicine |
| `/pharmacy/prescriptions` | POST | ADMIN | Create prescription |
| `/pharmacy/prescriptions/patient/{patientId}` | GET | USER, ADMIN | Get patient prescriptions |
| `/pharmacy/prescriptions/{id}/dispense` | POST | ADMIN | Dispense prescription |

---

### Billing Service (8 endpoints)
| Endpoint | Method | Access | Purpose |
|----------|--------|--------|---------|
| `/billing/accounts` | POST | USER, ADMIN | Create billing account |
| `/billing/accounts/{id}` | GET | USER, ADMIN | Get account details |
| `/billing/accounts/{id}/status` | PATCH | USER, ADMIN | Update account status |
| `/billing/accounts/{id}/recharge` | PATCH | USER, ADMIN | Recharge account |
| `/billing/accounts/{id}/transactions` | GET | USER, ADMIN | Get transactions |
| `/billing/accounts/{id}/transactions` | POST | USER, ADMIN | Create transaction |
| `/billing/transactions/{id}/status` | PATCH | ADMIN | Update transaction status |
| `/billing/{id}` | DELETE | ADMIN | Delete billing account |

---

### Analytics Service (7 endpoints)
| Endpoint | Method | Access | Purpose |
|----------|--------|--------|---------|
| `/analytics/patients/count` | GET | ADMIN | Patient count analytics |
| `/analytics/patients` | GET | ADMIN | Get new patients list |
| `/analytics/growth-rate` | GET | ADMIN | Patient growth rate |
| `/analytics/revenue` | GET | ADMIN | Revenue analytics |
| `/analytics/revenue/patient/{patientId}` | GET | ADMIN | Revenue by patient |
| `/analytics/top-patient` | GET | ADMIN | Top spending patients |
| `/analytics/completed/count` | GET | ADMIN | Completed transactions count |

---

---

# PART 4: DATA FLOW & ARCHITECTURE

## User Journey Map

### Patient User Journey

```
1. AUTHENTICATION PHASE
   ├─ Splash Screen
   ├─ Sign Up → Auth Service (/signup)
   ├─ Login → Auth Service (/login)
   ├─ Token Validation → Auth Service (/validate)
   └─ Auto Refresh → Auth Service (/refresh)

2. DISCOVERY PHASE
   ├─ Dashboard Home → Doctor Service (/doctors/top-rated)
   ├─ Doctor Search → Doctor Service (/doctors/search)
   ├─ Doctor Details → Doctor Service (/doctors/{id}/details)
   ├─ Availability Check → Doctor Service (/doctors/{id}/availability)
   └─ Reviews View → Doctor Service (/doctors/{id}/reviews)

3. BOOKING PHASE
   ├─ Create Appointment → Appointment Service (/appointment POST)
   ├─ Appointment List → Appointment Service (/appointment GET)
   ├─ Appointment Details → Appointment Service (/appointment/{id})
   ├─ Reschedule → Appointment Service (/appointment/{id}/reschedule)
   └─ Cancel → Appointment Service (/appointment/{id}/cancel)

4. HEALTH RECORDS PHASE
   ├─ View Profile → Patient Service (/patients/{id})
   ├─ Medical Records → Clinical Service (/medical-records/patient/{id})
   ├─ Prescriptions → Pharmacy Service (/pharmacy/prescriptions/patient/{id})
   └─ Export PDF → Patient Service (/patients/pdf)

5. PAYMENT PHASE
   ├─ Check Balance → Billing Service (/billing/accounts/{id})
   ├─ View Transactions → Billing Service (/billing/accounts/{id}/transactions GET)
   ├─ Add Funds → Billing Service (/billing/accounts/{id}/recharge)
   └─ Create Transaction → Billing Service (/billing/accounts/{id}/transactions POST)

6. FEEDBACK PHASE
   └─ Write Review → Doctor Service (/doctors/{id}/reviews POST)
```

### Admin User Journey

```
1. LOGIN & DASHBOARD
   ├─ Admin Login → Auth Service (/login)
   ├─ Token Validation → Auth Service (/validate)
   └─ View Dashboard → Analytics Service (multiple endpoints)

2. USER & ACCOUNT MANAGEMENT
   ├─ View Users → Auth Service (/user)
   ├─ Search Users →Auth Service (/user with filters)
   ├─ Logout User → Auth Service (/logout/all)
   └─ Reset Password → Auth Service (/reset)

3. DOCTOR MANAGEMENT
   ├─ List Doctors → Doctor Service (/doctors)
   ├─ Add Doctor → Doctor Service (/doctors POST)
   ├─ Edit Doctor → Doctor Service (/doctors/{id} PUT)
   ├─ Manage Schedules → Doctor Service (/doctors/{id}/schedules)
   ├─ View Reviews → Doctor Service (/doctors/{id}/reviews)
   └─ Respond to Reviews → Doctor Service (/doctors/reviews/{id}/response)

4. PATIENT MANAGEMENT
   ├─ List Patients → Patient Service (/patients)
   ├─ Create Patient → Patient Service (/patients POST)
   ├─ Edit Patient → Patient Service (/patients/{id} PUT)
   ├─ View Medical Records → Clinical Service (/medical-records/patient/{id})
   ├─ Check Billing → Billing Service (/billing/accounts/{id})
   └─ Delete Patient → Patient Service (/patients/{id} DELETE)

5. APPOINTMENT ORCHESTRATION
   ├─ View Appointments → Appointment Service (/appointment GET)
   ├─ Confirm Appointment → Appointment Service (/appointment/{id}/confirm)
   ├─ Reject Appointment → Appointment Service (/appointment/{id}/reject)
   ├─ Reschedule Appointment → Appointment Service (/appointment/{id}/reschedule)
   └─ Cancel Appointment → Appointment Service (/appointment/{id}/cancel)

6. CLINICAL OPERATIONS
   ├─ Create Medical Record → Clinical Service (/medical-records POST)
   ├─ Update Medical Record → Clinical Service (/medical-records/{id} PUT)
   ├─ View Medical Records → Clinical Service (/medical-records/patient/{id})
   └─ Create Prescription → Pharmacy Service (/pharmacy/prescriptions POST)

7. PHARMACY OPERATIONS
   ├─ Manage Medicines → Pharmacy Service (/pharmacy/medicines)
   ├─ Add Medicine → Pharmacy Service (/pharmacy/medicines POST)
   ├─ View Prescriptions → Pharmacy Service (/pharmacy/prescriptions)
   └─ Dispense Medicine → Pharmacy Service (/pharmacy/prescriptions/{id}/dispense)

8. BILLING & FINANCIAL
   ├─ Manage Accounts → Billing Service (/billing/accounts)
   ├─ Create Account → Billing Service (/billing/accounts POST)
   ├─ Recharge Account → Billing Service (/billing/accounts/{id}/recharge)
   ├─ View Transactions → Billing Service (/billing/accounts/{id}/transactions)
   ├─ Update Transaction → Billing Service (/billing/transactions/{id}/status)
   └─ Delete Account → Billing Service (/billing/{id} DELETE)

9. ANALYTICS & REPORTING
   ├─ Patient Analytics → Analytics Service (/analytics/patients/count, /analytics/patients)
   ├─ Growth Analysis → Analytics Service (/analytics/growth-rate)
   ├─ Revenue Analysis → Analytics Service (/analytics/revenue)
   ├─ Top Patients → Analytics Service (/analytics/top-patient)
   └─ Transaction Stats → Analytics Service (/analytics/completed/count)
```

---

## Microservices Communication Pattern

```
API Gateway
    │
    ├─ → Auth Service
    │       └─ /login, /signup, /logout, /reset, /validate, /refresh, /user, /logout/all
    │
    ├─ → Doctor Service
    │       ├─ Public: /doctors/*, /doctors/reviews, /doctors/search, /doctors/top-rated, /doctors/{id}/availability
    │       ├─ Admin: /doctors POST, PUT, PATCH (/images), /doctors/{id}/schedules, /doctors/reviews/{id}/response
    │       └─ Internal: /internal/doctor/*
    │
    ├─ → Appointment Service
    │       ├─ Public: /appointment POST, /appointment/{id}/cancel, /appointment/{id}/reschedule
    │       ├─ Admin: /appointment GET, /appointment/{id}, /appointment/{id}/confirm, /appointment/{id}/reject
    │       └─ Uses: Doctor Service (verify doctor), Patient Service (verify patient)
    │
    ├─ → Patient Service
    │       ├─ Public: /patients/{id}, /patients/{id}/image, /patients/pdf
    │       ├─ Admin: /patients GET/POST/PUT/DELETE, /patients/{id}/image
    │       └─ Internal: /internal/patient/*
    │
    ├─ → Clinical Service
    │       ├─ Public: /medical-records/patient/{id}, /medical-records/{id}
    │       ├─ Admin: /medical-records POST, PUT
    │       ├─ Uses: Patient Service (verify patient), Doctor Service (verify doctor)
    │       └─ Internal: /internal/medical-record/*
    │
    ├─ → Pharmacy Service
    │       ├─ Public: /pharmacy/medicines GET, /pharmacy/prescriptions/patient/{id}
    │       ├─ Admin: /pharmacy/medicines POST, /pharmacy/prescriptions POST, /pharmacy/prescriptions/{id}/dispense
    │       └─ Uses: Clinical Service (fetch prescription data), Patient Service (verify patient)
    │
    ├─ → Billing Service
    │       ├─ Public: /billing/accounts POST, GET, /billing/accounts/{id}/status, /billing/accounts/{id}/recharge
    │       ├─ Public: /billing/accounts/{id}/transactions GET/POST
    │       ├─ Admin: /billing/transactions/{id}/status, /billing/{id} DELETE
    │       └─ Uses: Patient Service (verify patient), Appointment Service (publish payment events)
    │
    ├─ → Analytics Service
    │       ├─ Admin: /analytics/patients/count, /analytics/patients, /analytics/growth-rate
    │       ├─ Admin: /analytics/revenue, /analytics/revenue/patient/{id}, /analytics/top-patient, /analytics/completed/count
    │       └─ Aggregates data from: Appointment Service, Patient Service, Billing Service, Clinical Service
    │
    └─ → Eureka Server (Service Registry)
            └─ Service discovery and registration


Key Internal Communication Flows:
═════════════════════════════════

Appointment Creation:
  Appointment Service
      ├─ Calls → Doctor Service: /internal/doctor/{id} (validate doctor)
      ├─ Calls → Patient Service: /internal/patient/{id} (validate patient)
      └─ Publishes Event → For Billing Service to prepare transaction

Medical Record Creation:
  Clinical Service
      ├─ Calls → Doctor Service: /internal/doctor/{id} (validate doctor)
      ├─ Calls → Patient Service: /internal/patient/{id} (validate patient)
      └─ Links → Appointment Service: (get appointment details if applicable)

Prescription Dispensing:
  Pharmacy Service
      ├─ Calls → Clinical Service: /internal/medical-record/detail/{id} (get prescription)
      ├─ Calls → Patient Service: /internal/patient/{id} (validate patient)
      └─ Updates Inventory: (decrements medicine stock)

Transaction Processing:
  Billing Service
      ├─ Listens to Events from → Appointment Service (when appointment confirmed)
      ├─ Calls → Patient Service: /internal/patient/{id} (link patient)
      ├─ Updates Balance: (credits/debits wallet)
      └─ Publishes Event for → Analytics Service (transaction completed)
```

---

## Screen Hierarchy Map

### Patient Application Sitemap

```
app-root/
├── unauthenticated/
│   ├── splash-screen/
│   ├── signup/
│   ├── login/
│   ├── forgot-password/
│   └── reset-password/
│
└── authenticated (USER role)/
    ├── dashboard/
    │   ├── home/
    │   │   ├── top-doctors (carousel)
    │   │   ├── specialties (grid)
    │   │   └── upcoming-appointments (snippet)
    │   └── quick-actions
    │
    ├── doctors/
    │   ├── discovery/
    │   │   ├── search/
    │   │   ├── filter/
    │   │   ├── results-list/
    │   │   └── doctor-card (navigation to detail)
    │   │
    │   ├── detail/{doctorId}/
    │   │   ├── profile-header/
    │   │   ├── about/
    │   │   ├── calendar-availability/
    │   │   ├── reviews-list/
    │   │   │   └── review-write (modal/screen)
    │   │   └── book-btn (navigation to booking-flow)
    │   │
    │   └── reviews/
    │       └── write-review/
    │
    ├── appointments/
    │   ├── list/
    │   │   ├── upcoming-tab/
    │   │   │   └── appointment-card (status: awaiting/confirmed)
    │   │   ├── history-tab/
    │   │   │   └── appointment-card (status: completed/cancelled)
    │   │   └── book-new-btn
    │   │
    │   ├── detail/{appointmentId}/
    │   │   ├── doctor-info/
    │   │   ├── appointment-details/
    │   │   ├── fee-section/
    │   │   └── actions (reschedule / cancel / view-record)
    │   │
    │   ├── booking-flow/ (multi-step)
    │   │   ├── step-1-doctor-time/
    │   │   ├── step-2-patient-profile/
    │   │   └── step-3-confirm-pay/
    │   │
    │   ├── reschedule/{appointmentId}/
    │   └── cancel/{appointmentId}/
    │
    ├── health-records/
    │   ├── my-profile/
    │   │   ├── personal-info (editable)
    │   │   ├── medical-info (editable)
    │   │   ├── image-upload/
    │   │   └── export-pdf-btn/
    │   │
    │   ├── medical-records/
    │   │   ├── filter/
    │   │   └── records-list/
    │   │       └── record-card (click to detail)
    │   │
    │   ├── record-detail/{recordId}/
    │   │   ├── doctor-info/
    │   │   ├── vital-signs/
    │   │   ├── diagnosis/
    │   │   ├── treatment-plan/
    │   │   ├── prescriptions-link/
    │   │   └── actions (download / print)
    │   │
    │   └── prescriptions/
    │       ├── active-tab/
    │       ├── past-tab/
    │       └── prescription-card
    │           └── detail/{prescriptionId}/
    │
    ├── billing/
    │   ├── wallet/
    │   │   ├── balance-display/
    │   │   ├── recent-transactions/
    │   │   ├── add-money-btn
    │   │   └── view-all-transactions-link/
    │   │
    │   ├── add-funds/
    │   │   ├── amount-input/
    │   │   ├── payment-method-selector/
    │   │   └── process-btn/
    │   │
    │   └── transaction-history/
    │       ├── filter/
    │       ├── transactions-table/
    │       └── export-btn/
    │
    └── account/
        ├── profile-overview/
        ├── edit-profile/
        ├── settings/
        ├── logout-btn/
        └── session-history/
```

### Admin Dashboard Sitemap

```
admin-dashboard/
├── login/
│
└── authenticated (ADMIN role)/
    ├── dashboard/
    │   ├── main-overview/
    │   │   ├── kpi-cards (patients, appointments, revenue, doctors)
    │   │   ├── growth-chart/
    │   │   ├── revenue-chart/
    │   │   ├── recent-pending-appointments/
    │   │   └── quick-actions/
    │   │
    │   └── navigation-sidebar (always visible)
    │
    ├── system/
    │   └── users-management/
    │       ├── users-list/
    │       │   ├── filter/
    │       │   ├── search/
    │       │   └── user-row (actions)
    │       │
    │       └── user-detail/
    │           ├── profile-view/
    │           └── actions (lock / reset-password / logout-all)
    │
    ├── doctors/
    │   ├── doctors-list/
    │   │   ├── search/
    │   │   ├── filter/
    │   │   ├── doctor-table/
    │   │   ├── add-new-btn
    │   │   └── pagination/
    │   │
    │   ├── add-doctor/
    │   │   └── doctor-form/
    │   │
    │   ├── edit-doctor/{doctorId}/
    │   │   ├── doctor-form/
    │   │   └── image-upload/
    │   │
    │   ├── schedule-manager/{doctorId}/
    │   │   ├── calendar-view/
    │   │   ├── time-slot-toggle/
    │   │   └── save-btn/
    │   │
    │   └── reviews-management/
    │       ├── filter/
    │       ├── reviews-list/
    │       └── review-detail/{reviewId}/
    │           └── add-response/
    │
    ├── patients/
    │   ├── patients-list/
    │   │   ├── search/
    │   │   ├── filter/
    │   │   ├── patient-table/
    │   │   ├── add-new-btn
    │   │   └── pagination/
    │   │
    │   ├── add-patient/
    │   │   └── patient-form/
    │   │
    │   ├── edit-patient/{patientId}/
    │   │   ├── patient-form/
    │   │   ├── medical-info/
    │   │   ├── image-upload/
    │   │   └── delete-btn/
    │   │
    │   ├── patient-detail/{patientId}/
    │   │   ├── personal-info/
    │   │   ├── medical-records-tab/
    │   │   ├── billing-tab/
    │   │   ├── appointments-tab/
    │   │   └── actions/
    │   │
    │   └── medical-records/
    │       ├── records-list/
    │       └── record-detail/{recordId}/
    │
    ├── appointments/
    │   ├── master-view/
    │   │   ├── calendar-grid/
    │   │   ├── filter/
    │   │   ├── date-range-selector/
    │   │   ├── doctor-filter/
    │   │   ├── status-filter/
    │   │   └── appointment-card (click to detail)
    │   │
    │   └── appointment-detail/{appointmentId}/
    │       ├── summary-card/
    │       ├── appointment-details/
    │       ├── status-history/
    │       ├── action-buttons (context-sensitive)
    │       └── notes-section/
    │
    ├── clinical/
    │   ├── create-medical-record/
    │   │   ├── patient-selector/
    │   │   ├── vital-signs-form/
    │   │   ├── diagnosis-form/
    │   │   ├── treatment-form/
    │   │   ├── prescriptions-section/
    │   │   └── save-btn/
    │   │
    │   ├── edit-medical-record/{recordId}/
    │   │   └── medical-record-form/
    │   │
    │   └── lookup-records/
    │       ├── search-criteria/
    │       └── records-list/
    │
    ├── pharmacy/
    │   ├── medicines-inventory/
    │   │   ├── search/
    │   │   ├── filter/
    │   │   ├── medicines-table/
    │   │   ├── add-medicine-btn
    │   │   └── pagination/
    │   │
    │   ├── add-medicine/
    │   │   └── medicine-form/
    │   │
    │   ├── edit-medicine/{medicineId}/
    │   │   └── medicine-form/
    │   │
    │   ├── prescriptions-management/
    │   │   ├── pending-tab/
    │   │   ├── completed-tab/
    │   │   ├── search/
    │   │   └── prescription-card
    │   │       └── prescription-detail/{prescriptionId}/
    │   │               └── dispense-section/
    │   │                   └── dispense-btn/
    │   │
    │   └── dispense-medicine/
    │       ├── medicines-checklist/
    │       ├── availability-check/
    │       └── complete-btn/
    │
    ├── billing/
    │   ├── accounts-management/
    │   │   ├── search/
    │   │   ├── filter/
    │   │   ├── accounts-table/
    │   │   ├── create-account-btn
    │   │   └── pagination/
    │   │
    │   ├── create-account/
    │   │   └── account-form/
    │   │
    │   ├── account-detail/{accountId}/
    │   │   ├── balance-info/
    │   │   └── actions (recharge / status / adjust / delete)
    │   │
    │   ├── recharge-account/{accountId}/
    │   │   ├── amount-input/
    │   │   ├── payment-method-selector/
    │   │   └── process-btn/
    │   │
    │   ├── manage-account-status/{accountId}/
    │   │   ├── current-status/
    │   │   ├── reason-selector/
    │   │   ├── status-toggle/
    │   │   ├── status-history/
    │   │   └── save-btn/
    │   │
    │   ├── transactions-management/
    │   │   ├── filter/
    │   │   ├── transactions-table/
    │   │   ├── summary-section/
    │   │   └── export-btn/
    │   │
    │   └── delete-account/{accountId}/
    │       ├── confirmation-dialog/
    │       └── delete-btn/
    │
    └── analytics/
        ├── patient-analytics/
        │   ├── kpi-cards/
        │   ├── growth-chart/
        │   ├── demographics-chart/
        │   ├── new-patients-list/
        │   └── export-btn/
        │
        ├── revenue-analytics/
        │   ├── kpi-cards/
        │   ├── revenue-trend-chart/
        │   ├── breakdown-chart/
        │   ├── details-tab (by doctor / service / patient)
        │   └── export-btn/
        │
        └── performance-analytics/
            ├── kpi-cards/
            ├── top-patients-chart/
            ├── transactions-chart/
            ├── performance-metrics/
            └── export-btn/
```

---

This comprehensive Information Architecture provides a complete blueprint for building both the Patient and Admin interfaces for your Patient Management System. All endpoints have been mapped to specific screens and user workflows, making it easy for frontend developers to understand which APIs to call and when.

The document is saved to: [SITEMAP_IA.md](SITEMAP_IA.md)
