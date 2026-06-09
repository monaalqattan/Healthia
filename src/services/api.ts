import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://healthia-backend.vercel.app/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

// ── Auth ──────────────────────────────
export const authService = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  verifyOTP: (email: string, otp: string) =>
    api.post('/auth/verify-otp', { email, otp }),
  resetPassword: (email: string, otp: string, newPassword: string) =>
    api.post('/auth/reset-password', { email, otp, newPassword }),
  getMe: () => api.get('/auth/me'),
}

// ── Doctors ───────────────────────────
export const doctorService = {
  getAll: () => api.get('/doctors'),
  getById: (id: string) => api.get(`/doctors/${id}`),
  add: (data: any) => api.post('/doctors', data),
  update: (id: string, data: any) => api.put(`/doctors/${id}`, data),
  delete: (id: string) => api.delete(`/doctors/${id}`),
  getMyProfile:    () => api.get('/doctors/me'),
  updateMyProfile: (data: any) => api.put('/doctors/me', data),
  changePassword:  (currentPassword: string, newPassword: string) =>
    api.put('/doctors/me/password', { currentPassword, newPassword }),
  updateNotifications: (prefs: any) =>
    api.put('/doctors/me/notifications', prefs),
}

// ── Patients ──────────────────────────
export const patientService = {
  getMyPatients: () => api.get('/patients'),
  getAll: () => api.get('/patients/all'),
  getById: (id: string) => api.get(`/patients/${id}`),
  add: (data: any) => api.post('/patients', data),
  updateByDoctor: (id: string, data: any) => api.put(`/patients/${id}`, data),
  delete: (id: string) => api.delete(`/patients/${id}`),
  getMyProfile: () => api.get('/patients/me'),
  updateMyProfile: (data: any) => api.put('/patients/me/update', data),
  addNote:    (id: string, text: string) => api.post(`/patients/${id}/notes`, { text }),
  deleteNote: (id: string, noteId: string) => api.delete(`/patients/${id}/notes/${noteId}`),
  editNote:   (id: string, noteId: string, text: string) => api.put(`/patients/${id}/notes/${noteId}`, { text }),
}

// ── Plans ─────────────────────────────
export const planService = {
  add: (data: any) => api.post('/plans', data),
  getPatientPlans: (patientId: string) => api.get(`/plans/patient/${patientId}`),
  getById: (id: string) => api.get(`/plans/${id}`),
  update: (id: string, data: any) => api.put(`/plans/${id}`, data),
  delete: (id: string) => api.delete(`/plans/${id}`),
  getMyPlans: () => api.get('/plans/my'),
  updateMealStatus: (planId: string, mealId: string, completed: boolean) =>
    api.patch(`/plans/${planId}/meal-status`, { mealId, completed }),
  updateRitualStatus: (planId: string, ritualId: string, completed: boolean) =>
    api.patch(`/plans/${planId}/ritual-status`, { ritualId, completed }),
}

// ── Appointments ──────────────────────
export const appointmentService = {
  // للدكتور
  add: (data: any) => api.post('/appointments', data),
  getMyAppointments: () => api.get('/appointments'),
  getPatientAppointments: (patientId: string) =>
    api.get(`/appointments/patient/${patientId}`),
  update: (id: string, data: any) => api.put(`/appointments/${id}`, data),
  delete: (id: string) => api.delete(`/appointments/${id}`),
  // للـ Patient
  bookByPatient: (data: any) => api.post('/appointments/book', data),
  getMyAppointments_Patient: () => api.get('/appointments/my'),
  addReview: (id: string, rating: number, comment: string) =>
    api.post(`/appointments/${id}/review`, { rating, comment }),
}

// ── Availability ──────────────────────
export const availabilityService = {
  // للدكتور
  getMyAvailability: () => api.get('/availability'),
  updateMyAvailability: (schedule: any[]) => api.put('/availability', { schedule }),
  // للمريض
  getAvailableSlots: (date: string) =>
    api.get(`/availability/slots?date=${date}`),
  // للدكتور — المواعيد المحجوزة في يوم معين
  getBookedSlots: (date: string) =>
    api.get(`/availability/booked?date=${date}`),
}

// ── Analytics ─────────────────────────
export const analyticsService = {
  getDoctorAnalytics: () => api.get('/analytics'),
}

// ── Daily Logs ────────────────────────
export const dailyLogService = {
  // المريض يضيف log بنفسه
  addLog: (data: any) => api.post('/daily-logs', data),
  getMyLogs: () => api.get('/daily-logs/my'),
  // الدكتور
  getPatientLogs:   (patientId: string) => api.get(`/daily-logs/patient/${patientId}`),
  addLogForPatient: (patientId: string, data: any) => api.post(`/daily-logs/patient/${patientId}`, data),
}
// ── Slots (doctor sets specific date+time slots) ──────────────
export const slotService = {
  // الدكتور
  addSlots:    (date: string, times: string[]) => api.post('/slots', { date, times }),
  getMySlots:  (date?: string) => api.get(`/slots${date ? `?date=${date}` : ''}`),
  deleteSlot:  (id: string) => api.delete(`/slots/${id}`),
  // المريض
  getAvailableSlots: (date: string) => api.get(`/slots/available?date=${date}`),
  bookSlot: (slotId: string, type?: string, notes?: string) =>
    api.post('/slots/book', { slotId, type, notes }),
}

// ── Notifications ──────────────────────────────────────────────
export const notificationService = {
  getAll:      () => api.get('/notifications'),
  markAllRead: () => api.put('/notifications/read-all'),
  delete:      (id: string) => api.delete(`/notifications/${id}`),
}