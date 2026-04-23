import axios from 'axios';

const API_GATEWAY_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4004';
const USE_MOCK_FALLBACK = import.meta.env.VITE_ENABLE_API_MOCK === 'true'; // Default is now false if env is not set to 'true'

const api = axios.create({
  baseURL: API_GATEWAY_URL,
  headers: { 'Content-Type': 'application/json' },
});

// --- MOCK DATA ---
const MOCKS = {
  // Auth
  'auth/validate': { email: 'hauanh@hospital.vn', role: 'PATIENT', fullName: 'Nguyễn Hậu Anh' },
  'auth/login': { token: 'mock-token-123', role: 'PATIENT' },
  'auth/signup': { success: true },
  'auth/refresh': { token: 'mock-token-123-refreshed', role: 'PATIENT' },
  'auth/reset': { success: true, message: 'Password reset successfully' },
  'auth/user': [
    { id: 'user_1', email: 'hauanh@hospital.vn', fullName: 'Nguyễn Hậu Anh', role: 'PATIENT' }
  ],

  // Doctors
  'api/doctors/top-rated': [
    { id: 'doc_1', name: 'BS. Nguyễn Minh', specialization: 'Tim mạch', rating: 4.9, reviewCount: 150, yearsOfExperience: 12, consultationFee: 500000, profileImage: '/images/doctors/1.png', location: 'Cơ sở 1 - Hà Nội' },
    { id: 'doc_2', name: 'BS. Lê Thu Lan', specialization: 'Nhi khoa', rating: 4.8, reviewCount: 95, yearsOfExperience: 8, consultationFee: 400000, profileImage: '/images/doctors/2.png', location: 'Cơ sở 1 - Hà Nội' },
    { id: 'doc_3', name: 'BS. Phạm Thành', specialization: 'Ngoại khoa', rating: 4.7, reviewCount: 60, yearsOfExperience: 15, consultationFee: 600000, profileImage: '/images/doctors/3.png', location: 'Cơ sở 2 - TP.HCM' },
  ],
  'api/doctors/search': [
    { id: 'doc_1', name: 'BS. Nguyễn Minh', specialization: 'Tim mạch', rating: 4.9, consultationFee: 500000, location: 'Hà Nội', profileImage: '/images/doctors/1.png' },
    { id: 'doc_2', name: 'BS. Lê Thu Lan', specialization: 'Nhi khoa', rating: 4.8, consultationFee: 400000, location: 'Hà Nội', profileImage: '/images/doctors/2.png' },
  ],
  'api/doctors': [
    { id: '1f2e3d4c-5b61-4c32-b1a0-d9e8f7a6b5c4', name: 'BS. Nguyễn Văn A', specialization: 'Nội tổng quát', email: 'doctorA@example.com', phone: '0123456789', rating: 4.9, reviewCount: 150, yearsOfExperience: 10, consultationFee: 300000, profileImage: '/images/doctors/1.png', location: 'Cơ sở 1 - Hà Nội' },
  ],
  'reviews': [
    { id: 'rev_1', patientId: 'Nguyễn Hậu Anh', rating: 5, reviewText: 'Bác sĩ rất nhiệt tình và chu đáo.', date: '2026-06-01' },
    { id: 'rev_2', patientId: 'Trần Văn B', rating: 4, reviewText: 'Khám kỹ nhưng chờ hơi lâu.', date: '2026-05-20' }
  ],

  // Appointments
  'api/appointment': [
    { appointmentId: 'apt_001', appointmentDate: '2026-06-20', appointmentTime: '08:30', doctorName: 'Nguyễn Minh', chiefComplaint: 'Tái khám định kỳ tim mạch', status: 'CONFIRMED' },
    { appointmentId: 'apt_002', appointmentDate: '2026-05-10', appointmentTime: '15:00', doctorName: 'Lê Thu Lan', chiefComplaint: 'Sốt cao, ho', status: 'COMPLETED' },
  ],
  // Thêm vào MOCKS, ngay sau 'medical-records/patient'
  'api/medical-records': [
    {
      id: 'mr_001',
      medicalRecordId: 'mr_001',
      patientId: 'patient_123',
      patientName: 'Nguyễn Hậu Anh',
      visitDate: '2026-05-10',
      appointmentDate: '2026-05-10',
      doctorName: 'BS. Lê Thu Lan',
      doctorId: 'doc_2',
      diagnosis: 'Sốt xuất huyết, đã điều trị ổn định',
      symptoms: 'Sốt cao, đau đầu, phát ban',
      notes: 'Theo dõi tiểu cầu sau 3 ngày',
    },
    {
      id: 'mr_002',
      medicalRecordId: 'mr_002',
      patientId: 'patient_123',
      patientName: 'Nguyễn Hậu Anh',
      visitDate: '2025-12-20',
      appointmentDate: '2025-12-20',
      doctorName: 'BS. Nguyễn Minh',
      doctorId: 'doc_1',
      diagnosis: 'Theo dõi hở van tim nhẹ',
      symptoms: 'Đau tức ngực, khó thở khi gắng sức',
      notes: 'Tái khám sau 6 tháng, siêu âm tim định kỳ',
    },
    {
      id: 'mr_003',
      medicalRecordId: 'mr_003',
      patientId: '7f9e8d7c-6b5a-4e3d-2c1b-0a0b0c0d0e0f',
      patientName: 'Trần Thị B',
      visitDate: '2026-04-05',
      appointmentDate: '2026-04-05',
      doctorName: 'BS. Phạm Thành',
      doctorId: 'doc_3',
      diagnosis: 'Viêm amidan cấp',
      symptoms: 'Đau họng, sốt nhẹ, khó nuốt',
      notes: 'Kháng sinh 7 ngày, tái khám nếu không đỡ',
    },
  ],

  // Patients & Health
  'api/patients': [
    { id: '7f9e8d7c-6b5a-4e3d-2c1b-0a0b0c0d0e0f', fullName: 'Trần Thị B', gender: 'Nữ', email: 'patientB@example.com', phone: '0988888888', dateOfBirth: '1990-01-01', address: '123 Đường ABC, Hà Nội', bloodType: 'AB', allergies: 'Không', vitals: { bp: '115/75', hr: '68' } },
    { id: 'patient_123', fullName: 'Nguyễn Hậu Anh', gender: 'Nam', email: 'hauanh@hospital.vn', phone: '0901234567', dateOfBirth: '1995-05-10', address: '456 Đường XYZ, Hà Nội', bloodType: 'O', allergies: 'Mạt bụi', vitals: { bp: '120/80', hr: '72' } }
  ],
  'medical-records/patient': [
    { medicalRecordId: 'mr_1', patientId: 'patient_123', patientName: 'Nguyễn Hậu Anh', appointmentDate: '2026-05-10', doctorName: 'BS. Lê Thu Lan', chiefComplaint: 'Sốt xuất huyết', diagnosis: 'Dương tính SXH, đã điều trị ổn định' },
    { medicalRecordId: 'mr_2', patientId: 'patient_123', patientName: 'Nguyễn Hậu Anh', appointmentDate: '2025-12-20', doctorName: 'BS. Nguyễn Minh', chiefComplaint: 'Đau tức ngực', diagnosis: 'Theo dõi hở van tim nhẹ' },
  ],
  'ai-clinical/diagnosis-template': {
    patientId: 'patient_123',
    patientName: 'Nguyễn Hậu Anh',
    doctorId: '1f2e3d4c-5b61-4c32-b1a0-d9e8f7a6b5c4',
    doctorName: 'BS. Nguyễn Văn A',
    specialty: 'Nội tổng quát',
    clinicalSummary: 'Bệnh nhân có biểu hiện sốt, mệt và đau họng trong bối cảnh tiền sử không quá lý.',
    suggestedDiagnosis: 'Theo dõi nhiễm khuẩn hô hấp trên, cân nhắc phân biệt viêm họng do virus/vi khuẩn.',
    riskLevel: 'trung_binh',
    recommendedActions: [
      'Khám hô hấp và tai mũi họng',
      'Đánh giá dấu hiệu sinh tồn và SpO2',
      'Cân nhắc công thức máu hoặc test nhanh nếu có chỉ định',
    ],
    redFlags: [
      'Khó thở hoặc SpO2 giảm',
      'Sốt cao kéo dài trên 3 ngày',
      'Đau ngực hoặc lú lẫn',
    ],
    disclaimer: 'AI chỉ hỗ trợ bản mẫu, bắt buộc bổ lĩnh bằng thăm khám và chỉ định của bác sĩ.',
    historicalRecordCount: 2,
    aiGenerated: true,
  },
  'prescriptions/patient': [
    { prescriptionId: 'pr_1', dateIssued: '2026-05-10', doctorName: 'Lê Thu Lan', hospital: 'Bệnh viện Hậu Anh', status: 'Đã cấp thuốc', medicines: [{ name: 'Paracetamol', dosage: '500mg', frequency: '2 viên/ngày', duration: '5 ngày' }] },
  ],

  // Billing
  'transactions': [
    { transactionId: 'tx_1', description: 'Nạp tiền QR Hậu Anh Pay', date: '2026-06-01', amount: 3000000, type: 'IN' },
    { transactionId: 'tx_2', description: 'Thanh toán phí khám', date: '2026-06-15', amount: -500000, type: 'OUT' },
  ],
  'billing/accounts': { accountId: 'acc_001', currentBalance: 2500000 },

  // Analytics
  'analytics/patients/count': 5670,
  'analytics/revenue': 450000000,
  'analytics/growth-rate': { rate: 12.5 },
  'analytics/top-patient': [
    { id: 'patient_123', name: 'Nguyễn Hậu Anh', totalSpent: 12000000 }
  ],
  'analytics/completed/count': 1250,

  // Pharmacy
  'api/pharmacy/medicines': [
    { id: 'med_1', name: 'Paracetamol 500mg', manufacturer: 'Hãng dược Pharmacity', quantity: 500, price: 2000, description: 'Giảm đau, hạ sốt' },
    { id: 'med_2', name: 'Amoxicillin 500mg', manufacturer: 'Dược Hậu Giang', quantity: 50, price: 5000, description: 'Kháng sinh' },
    { id: 'med_3', name: 'Vitamin C 1000mg', manufacturer: 'Domesco', quantity: 0, price: 15000, description: 'Tăng cường đề kháng' },
    { id: 'med_4', name: 'Panadol Extra', manufacturer: 'GSK', quantity: 120, price: 3500, description: 'Giảm đau đầu' },
  ]

};

// Auto-Refresh & Mock Interceptor
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 and attempt refresh
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const res = await authApi.refresh({ refreshToken });
          if (res.status === 200) {
            const { accessToken } = res.data;
            localStorage.setItem('token', accessToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    // Pass-through if not 401 or refresh failed but we want to try mock
    if (((!error.response || error.code === 'ERR_NETWORK') || (error.response && error.response.status === 500)) && USE_MOCK_FALLBACK) {
      const fullUrl = error.config.url;
      const url = fullUrl.split('?')[0];

      // Handle specific cases first to avoid partial keyword matches messing it up
      if (url.includes('/transactions')) {
        return Promise.resolve({ data: MOCKS['transactions'], status: 200 });
      }
      if (url.includes('/reviews')) {
        return Promise.resolve({ data: MOCKS['reviews'], status: 200 });
      }
      if (url.includes('/details') || url.includes('/availability')) {
        return Promise.resolve({ data: { id: 'mock_doc', name: 'BS. Hậu Anh', specialization: 'Đa khoa', biography: 'Giám đốc chuyên môn Bệnh viện Hậu Anh. Tốt nghiệp loại giỏi tại Đại học Y Hà Nội, với 20 năm kinh nghiệm khám chữa bệnh.', rating: 5.0, consultationFee: 1000000, profileImage: '/images/doctors/2.png', availableSlots: [{ date: '2026-06-20', slots: [{ time: '08:00', available: true }] }] }, status: 200 });
      }

      // Match dynamic keys precisely by sorting from longest to shortest key
      const mockKey = Object.keys(MOCKS).sort((a, b) => b.length - a.length).find(key => url.includes(key));

      if (mockKey) {
        console.warn(`[MOCK SERVER] Backend down at ${API_GATEWAY_URL}. Serving fake data for: ${mockKey}`);
        return Promise.resolve({ data: MOCKS[mockKey], status: 200 });
      }

      return Promise.resolve({ data: [], status: 200 });
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Endpoints
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
  validate: () => api.get('/auth/validate'),
  refresh: (data) => api.post('/auth/refresh', data),
  logout: (refreshToken) => api.delete('/auth/logout', { params: { refreshToken } }),
  logoutAll: (email) => api.delete('/auth/logout/all', { params: { email } }),
  resetPassword: (data) => api.post('/auth/reset', data),
  getAllUsers: () => api.get('/auth/user'),
};

export const doctorApi = {
  create: (data) => api.post('/api/doctors', data),
  getAll: (params) => api.get('/api/doctors', { params }),
  getById: (id) => api.get(`/api/doctors/${id}`),
  getDetails: (id) => api.get(`/api/doctors/${id}/details`),
  update: (id, data) => api.put(`/api/doctors/${id}`, data),
  updateImage: (id, data) => api.patch(`/api/doctors/${id}/image`, data),
  createSchedule: (id, data) => api.post(`/api/doctors/${id}/schedules`, data),
  getAvailability: (id) => api.get(`/api/doctors/${id}/availability`),
  getTopRated: () => api.get('/api/doctors/top-rated'),
  search: (params) => api.get('/api/doctors/search', { params }),
  getReviews: (id) => api.get(`/api/doctors/${id}/reviews`),
  submitReview: (id, data) => api.post(`/api/doctors/${id}/reviews`, data),
  respondToReview: (reviewId, data) => api.post(`/api/doctors/reviews/${reviewId}/response`, data),
  /** Tải lên ảnh bác sĩ (file vật lý) */
  uploadImage: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/api/doctors/${id}/upload-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const appointmentApi = {
  create: (data) => api.post('/api/appointment', data),
  getById: (id) => api.get(`/api/appointment/${id}`),
  getAll: (params) => api.get('/api/appointment', { params }),
  confirm: (id) => api.post(`/api/appointment/${id}/confirm`),
  reject: (id) => api.post(`/api/appointment/${id}/reject`),
  cancel: (id, data) => api.post(`/api/appointment/${id}/cancel`, data),
  reschedule: (id, data) => api.post(`/api/appointment/${id}/reschedule`, data),
};

export const patientApi = {
  create: (data) => api.post('/api/patients', data),
  getAll: (params) => api.get('/api/patients', { params }),
  getProfile: (id) => api.get(`/api/patients/${id}`),
  updateProfile: (id, data) => api.put(`/api/patients/${id}`, data),
  delete: (id) => api.delete(`/api/patients/${id}`),
  updateImage: (id, data) => api.patch(`/api/patients/${id}/image`, data),
  exportPdf: (id) => api.get(`/api/patients/pdf?id=${id}`, { responseType: 'blob' }),
  /** Tải lên ảnh bệnh nhân (file vật lý) */
  uploadImage: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/api/patients/${id}/upload-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const clinicalApi = {
  createRecord: (data) => api.post('/api/medical-records', data),
  getAllRecords: () => api.get('/api/medical-records'),
  getPatientRecords: (id) => api.get(`/api/medical-records/patient/${id}`),
  getRecordById: (id) => api.get(`/api/medical-records/${id}`),
  updateRecord: (id, data) => api.put(`/api/medical-records/${id}`, data),
  generateDiagnosisTemplate: (data) => api.post('/api/ai-clinical/diagnosis-template', data),
  chatWithAI: (data) => api.post('/api/ai-clinical/chat', data),
};

export const pharmacyApi = {
  getMedicines: (params) => api.get('/api/pharmacy/medicines', { params }),
  addMedicine: (data) => api.post('/api/pharmacy/medicines', data),
  createPrescription: (data) => api.post('/api/pharmacy/prescriptions', data),
  getPatientPrescriptions: (id) => api.get(`/api/pharmacy/prescriptions/patient/${id}`),
  dispensePrescription: (id) => api.post(`/api/pharmacy/prescriptions/${id}/dispense`),
  /** Tải lên ảnh thuốc (file vật lý) */
  uploadImage: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/api/pharmacy/medicines/${id}/upload-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const billingApi = {
  createAccount: (data) => api.post('/api/billing/accounts', data),
  getAccount: (id) => api.get(`/api/billing/accounts/${id}`),
  getAccountByPatientId: (patientId) => api.get(`/api/billing/accounts/patient/${patientId}`),
  updateStatus: (id, data) => api.patch(`/api/billing/accounts/${id}/status`, data),
  recharge: (id, amount) => api.patch(`/api/billing/accounts/${id}/recharge`, { amount }),
  getTransactions: (accountId) => api.get(`/api/billing/accounts/${accountId}/transactions`),
  createTransaction: (accountId, data) => api.post(`/api/billing/accounts/${accountId}/transactions`, data),
  updateTransactionStatus: (id, data) => api.patch(`/api/billing/transactions/${id}/status`, data),
  deleteAccount: (id) => api.delete(`/api/billing/${id}`),
};

export const analyticsApi = {
  getPatientCount: (params) => api.get('/api/analytics/patients/count', { params }),
  getNewPatients: (params) => api.get('/api/analytics/patients', { params }),
  getGrowthRate: () => api.get('/api/analytics/growth-rate'),
  getRevenue: (params) => api.get('/api/analytics/revenue', { params }),
  getRevenuePerPatient: (patientId) => api.get(`/api/analytics/revenue/patient/${patientId}`),
  getTopPatients: (params) => api.get('/api/analytics/top-patient', { params }),
  getCompletedTransactions: () => api.get('/api/analytics/completed/count'),
};

export default api;
