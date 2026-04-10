# PATIENT MANAGEMENT SYSTEM - COMPLETE API ENDPOINTS
**All Endpoints with Ports for Frontend Integration**

---

## BASE URLs (Choose One)

### Local Development
```
API_GATEWAY_URL = http://localhost:4004
```

### Services Direct Access (If needed)
- **Auth Service**: `http://localhost:4005`
- **Appointment Service**: `http://localhost:4002`
- **Billing Service**: `http://localhost:4001`
- **Patient Service**: `http://localhost:4000`
- **Doctor Service**: `http://localhost:4003`
- **Clinical Service**: `http://localhost:4007`
- **Analytics Service**: `http://localhost:4006`
- **Pharmacy Service**: `http://localhost:4008`
- **Eureka Registry**: `http://localhost:8761`

---

## 1. AUTH SERVICE - Port 4005

### Base URL: `http://localhost:4005/auth`

| Endpoint | Method | URL | Purpose |
|----------|--------|-----|---------|
| Login | POST | `/auth/login` | User login |
| Sign Up | POST | `/auth/signup` | Patient registration |
| Validate Token | GET | `/auth/validate` | Validate access token |
| Refresh Token | POST | `/auth/refresh` | Refresh access token |
| Logout | DELETE | `/auth/logout` | Single session logout |
| Logout All | DELETE | `/auth/logout/all` | Logout all sessions |
| Reset Password | POST | `/auth/reset` | Reset password |
| Get All Users | GET | `/auth/user` | List all users (Admin) |

---

## 2. DOCTOR SERVICE - Port 4003

### Base URL: `http://localhost:4003/api/doctors`

| Endpoint | Method | URL | Purpose |
|----------|--------|-----|---------|
| Create Doctor | POST | `/api/doctors` | Add new doctor (Admin) |
| Get All Doctors | GET | `/api/doctors` | List all doctors |
| Get Doctor by ID | GET | `/api/doctors/{id}` | Get specific doctor |
| Get Doctor Details | GET | `/api/doctors/{id}/details` | Full doctor profile |
| Update Doctor | PUT | `/api/doctors/{id}` | Update doctor info (Admin) |
| Update Doctor Image | PATCH | `/api/doctors/{id}/image` | Update profile picture |
| Create Doctor Schedule | POST | `/api/doctors/{id}/schedules` | Set work schedule (Admin) |
| Get Doctor Availability | GET | `/api/doctors/{id}/availability` | Available time slots |
| Search Doctors | GET | `/api/doctors/search` | Advanced search |
| Get Top Rated Doctors | GET | `/api/doctors/top-rated` | Highest ratings |
| Submit Review | POST | `/api/doctors/{id}/reviews` | Write doctor review |
| Get Doctor Reviews | GET | `/api/doctors/{id}/reviews` | View reviews |
| Respond to Review | POST | `/api/doctors/reviews/{reviewId}/response` | Admin/Doctor reply |
| Check Doctor Exists (Internal) | GET | `/api/doctors/internal/doctor/{id}` | Internal check |
| Get Doctor Details (Internal) | GET | `/api/doctors/internal/doctor/detail/{id}` | Internal lookup |

---

## 3. APPOINTMENT SERVICE - Port 4002

### Base URL: `http://localhost:4002/api/appointment`

| Endpoint | Method | URL | Purpose |
|----------|--------|-----|---------|
| Create Appointment | POST | `/api/appointment` | Book appointment |
| Get Appointment | GET | `/api/appointment/{id}` | Get appointment details (Admin) |
| Get All Appointments | GET | `/api/appointment` | List appointments (with filters) |
| Confirm Appointment | POST | `/api/appointment/{id}/confirm` | Confirm booking (Admin) |
| Reject Appointment | POST | `/api/appointment/{id}/reject` | Reject booking (Admin) |
| Cancel Appointment | POST | `/api/appointment/{id}/cancel` | Cancel appointment |
| Reschedule Appointment | POST | `/api/appointment/{id}/reschedule` | Change date/time |

---

## 4. PATIENT SERVICE - Port 4000

### Base URL: `http://localhost:4000/api/patients`

| Endpoint | Method | URL | Purpose |
|----------|--------|-----|---------|
| Create Patient | POST | `/api/patients` | Add new patient (Admin) |
| Get All Patients | GET | `/api/patients` | List all patients (Admin) |
| Get Patient by ID | GET | `/api/patients/{id}` | Get patient profile |
| Get Patient Details | GET | `/api/patients/{id}` | Full patient info |
| Update Patient | PUT | `/api/patients/{id}` | Update patient info (Admin) |
| Delete Patient | DELETE | `/api/patients/{id}` | Delete patient (Admin) |
| Update Patient Image | PATCH | `/api/patients/{id}/image` | Change profile picture |
| Export Patient PDF | GET | `/api/patients/pdf` | Download health record |
| Check Patient Exists (Internal) | GET | `/api/patients/internal/patient/{id}` | Internal check |
| Get Patient Details (Internal) | GET | `/api/patients/internal/patient/detail/{id}` | Internal lookup |

---

## 5. CLINICAL SERVICE - Port 4007

### Base URL: `http://localhost:4007/api/medical-records`

| Endpoint | Method | URL | Purpose |
|----------|--------|-----|---------|
| Create Medical Record | POST | `/api/medical-records` | Create consultation note (Doctor) |
| Get Patient Records | GET | `/api/medical-records/patient/{patientId}` | List patient medical history |
| Get Record by ID | GET | `/api/medical-records/{id}` | Get specific record details |
| Update Medical Record | PUT | `/api/medical-records/{id}` | Edit record (Doctor) |
| Check Record Exists (Internal) | GET | `/api/clinical/internal/medical-record/{id}` | Internal check |
| Get Record Details (Internal) | GET | `/api/clinical/internal/medical-record/detail/{id}` | Internal lookup |

---

## 6. PHARMACY SERVICE - Port 4008

### Base URL: `http://localhost:4008/api/pharmacy`

| Endpoint | Method | URL | Purpose |
|----------|--------|-----|---------|
| Get All Medicines | GET | `/api/pharmacy/medicines` | List pharmacy stock |
| Add New Medicine | POST | `/api/pharmacy/medicines` | Add medicine (Admin) |
| Create Prescription | POST | `/api/pharmacy/prescriptions` | Create prescription (Doctor) |
| Get Patient Prescriptions | GET | `/api/pharmacy/prescriptions/patient/{patientId}` | List patient prescriptions |
| Dispense Prescription | POST | `/api/pharmacy/prescriptions/{id}/dispense` | Dispense medicine (Pharmacist) |

---

## 7. BILLING SERVICE - Port 4001

### Base URL: `http://localhost:4001/api/billing`

| Endpoint | Method | URL | Purpose |
|----------|--------|-----|---------|
| Create Billing Account | POST | `/api/billing/accounts` | Create wallet (User/Admin) |
| Get Account Details | GET | `/api/billing/accounts/{id}` | View balance |
| Update Account Status | PATCH | `/api/billing/accounts/{id}/status` | Activate/Deactivate (Admin) |
| Recharge Account | PATCH | `/api/billing/accounts/{id}/recharge` | Add funds |
| Get Transactions | GET | `/api/billing/accounts/{id}/transactions` | Transaction history |
| Create Transaction | POST | `/api/billing/accounts/{id}/transactions` | Record transaction |
| Update Transaction Status | PATCH | `/api/billing/transactions/{id}/status` | Confirm payment (Admin) |
| Delete Billing Account | DELETE | `/api/billing/{id}` | Remove account (Admin) |

### gRPC Port: 9001
(For inter-service communication, not for frontend)

---

## 8. ANALYTICS SERVICE - Port 4006

### Base URL: `http://localhost:4006/api/analytics`

| Endpoint | Method | URL | Purpose |
|----------|--------|-----|---------|
| Patient Count Analytics | GET | `/api/analytics/patients/count` | Total patient stats |
| Get New Patients List | GET | `/api/analytics/patients` | New registrations |
| Patient Growth Rate | GET | `/api/analytics/growth-rate` | Growth trend |
| Revenue Analytics | GET | `/api/analytics/revenue` | Revenue by period |
| Revenue per Patient | GET | `/api/analytics/revenue/patient/{patientId}` | Patient spending |
| Top Spending Patients | GET | `/api/analytics/top-patient` | High-value patients |
| Completed Transactions | GET | `/api/analytics/completed/count` | Transaction stats |

---

## 9. API GATEWAY - Port 4004

### Base URL: `http://localhost:4004`

**The API Gateway routes all requests:**
- `/auth/**` → Auth Service (4005)
- `/api/doctors/**` → Doctor Service (4003)
- `/api/appointment/**` → Appointment Service (4002)
- `/api/patients/**` → Patient Service (4000)
- `/api/medical-records/**` → Clinical Service (4007)
- `/api/pharmacy/**` → Pharmacy Service (4008)
- `/api/billing/**` → Billing Service (4001)
- `/api/analytics/**` → Analytics Service (4006)

---

## QUICK REFERENCE - Copy/Paste URLs

### Patient App Endpoints
```
// Authentication
POST http://localhost:4005/auth/signup
POST http://localhost:4005/auth/login
GET http://localhost:4005/auth/validate
POST http://localhost:4005/auth/refresh
DELETE http://localhost:4005/auth/logout

// Doctors
GET http://localhost:4003/api/doctors
GET http://localhost:4003/api/doctors/{id}
GET http://localhost:4003/api/doctors/{id}/details
GET http://localhost:4003/api/doctors/search
GET http://localhost:4003/api/doctors/top-rated
GET http://localhost:4003/api/doctors/{id}/availability
GET http://localhost:4003/api/doctors/{id}/reviews
POST http://localhost:4003/api/doctors/{id}/reviews

// Appointments
POST http://localhost:4002/api/appointment
GET http://localhost:4002/api/appointment/{id}
POST http://localhost:4002/api/appointment/{id}/cancel
POST http://localhost:4002/api/appointment/{id}/reschedule

// Health Records
GET http://localhost:4000/api/patients/{id}
GET http://localhost:4000/api/patients/pdf
PATCH http://localhost:4000/api/patients/{id}/image
GET http://localhost:4007/api/medical-records/patient/{patientId}
GET http://localhost:4007/api/medical-records/{id}
GET http://localhost:4008/api/pharmacy/prescriptions/patient/{patientId}

// Billing
GET http://localhost:4001/api/billing/accounts/{id}
PATCH http://localhost:4001/api/billing/accounts/{id}/recharge
GET http://localhost:4001/api/billing/accounts/{id}/transactions
```

### Admin Dashboard Endpoints
```
// User Management
GET http://localhost:4005/auth/user
DELETE http://localhost:4005/auth/logout/all

// Doctors
POST http://localhost:4003/api/doctors
PUT http://localhost:4003/api/doctors/{id}
PATCH http://localhost:4003/api/doctors/{id}/image
POST http://localhost:4003/api/doctors/{id}/schedules
POST http://localhost:4003/api/doctors/reviews/{reviewId}/response

// Patients
POST http://localhost:4000/api/patients
PUT http://localhost:4000/api/patients/{id}
DELETE http://localhost:4000/api/patients/{id}

// Appointments
GET http://localhost:4002/api/appointment?filters
POST http://localhost:4002/api/appointment/{id}/confirm
POST http://localhost:4002/api/appointment/{id}/reject

// Clinical
POST http://localhost:4007/api/medical-records
PUT http://localhost:4007/api/medical-records/{id}

// Pharmacy
GET http://localhost:4008/api/pharmacy/medicines
POST http://localhost:4008/api/pharmacy/medicines
POST http://localhost:4008/api/pharmacy/prescriptions/{id}/dispense

// Billing
POST http://localhost:4001/api/billing/accounts
PATCH http://localhost:4001/api/billing/accounts/{id}/status
PATCH http://localhost:4001/api/billing/transactions/{id}/status
DELETE http://localhost:4001/api/billing/{id}

// Analytics
GET http://localhost:4006/api/analytics/patients/count
GET http://localhost:4006/api/analytics/revenue
GET http://localhost:4006/api/analytics/top-patient
```

---

## FRONTEND CONFIGURATION EXAMPLES

### React Environment Variables (.env)
```env
REACT_APP_AUTH_URL=http://localhost:4005/auth
REACT_APP_DOCTOR_URL=http://localhost:4003/api/doctors
REACT_APP_APPOINTMENT_URL=http://localhost:4002/api/appointment
REACT_APP_PATIENT_URL=http://localhost:4000/api/patients
REACT_APP_MEDICAL_URL=http://localhost:4007/api/medical-records
REACT_APP_PHARMACY_URL=http://localhost:4008/api/pharmacy
REACT_APP_BILLING_URL=http://localhost:4001/api/billing
REACT_APP_ANALYTICS_URL=http://localhost:4006/api/analytics
```

### Axios Instance Configuration
```javascript
// authAxios.js
import axios from 'axios';

export const authAxios = axios.create({
  baseURL: 'http://localhost:4005/auth'
});

// doctorAxios.js
export const doctorAxios = axios.create({
  baseURL: 'http://localhost:4003/api/doctors'
});

// appointmentAxios.js
export const appointmentAxios = axios.create({
  baseURL: 'http://localhost:4002/api/appointment'
});

// patientAxios.js
export const patientAxios = axios.create({
  baseURL: 'http://localhost:4000/api/patients'
});

// clinicalAxios.js
export const clinicalAxios = axios.create({
  baseURL: 'http://localhost:4007/api/medical-records'
});

// pharmacyAxios.js
export const pharmacyAxios = axios.create({
  baseURL: 'http://localhost:4008/api/pharmacy'
});

// billingAxios.js
export const billingAxios = axios.create({
  baseURL: 'http://localhost:4001/api/billing'
});

// analyticsAxios.js
export const analyticsAxios = axios.create({
  baseURL: 'http://localhost:4006/api/analytics'
});
```

### Common Request Headers
```javascript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${accessToken}`  // Add after login
};
```

---

## DATA TYPES & COMMON FIELDS

### User/Patient Object
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "fullName": "John Doe",
  "phone": "+84912345678",
  "dateOfBirth": "1990-01-15",
  "gender": "MALE",
  "role": "USER"
}
```

### Doctor Object
```json
{
  "id": "doctor_001",
  "name": "Dr. Nguyen Van A",
  "email": "doctor@example.com",
  "specialization": "Internal Medicine",
  "yearsOfExperience": 15,
  "rating": 4.8,
  "profileImage": "url",
  "consultationFee": 500000
}
```

### Appointment Object
```json
{
  "appointmentId": "appt_001",
  "patientId": "patient_001",
  "doctorId": "doctor_001",
  "appointmentDate": "2024-04-10",
  "appointmentTime": "09:00",
  "status": "CONFIRMED",
  "chiefComplaint": "Headache",
  "consultationFee": 500000
}
```

### Token Response
```json
{
  "token": "eyJhbGc...",
  "refreshToken": "xyz...",
  "role": "USER"
}
```

---

## TESTING WITHOUT FRONTEND

### Using cURL
```bash
# Login
curl -X POST http://localhost:4005/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"pass123"}'

# Get Doctors
curl -X GET http://localhost:4003/api/doctors

# Get Doctor by ID
curl -X GET http://localhost:4003/api/doctors/1

# Create Appointment
curl -X POST http://localhost:4002/api/appointment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"patientId":"1","doctorId":"1","appointmentDate":"2024-04-10","appointmentTime":"09:00","chiefComplaint":"Fever"}'
```

### Using Postman
1. Import these Base URLs as Collections
2. Set Authorization: Bearer Token
3. Use the endpoint structure above

---

## ERROR CODES

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

---

**Last Updated**: April 6, 2026
