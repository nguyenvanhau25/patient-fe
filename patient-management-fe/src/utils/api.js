import axios from 'axios';



export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4004',
  headers: { 'Content-Type': 'application/json' },
});

// Auto-Refresh Interceptor
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
  delete: (id) => api.delete(`/api/doctors/${id}`),
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
