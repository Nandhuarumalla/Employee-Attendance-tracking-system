import api from './authApi'; // Use the same Axios instance with token

// ======================= Employee APIs =======================
export const checkIn = () => api.post('/attendance/checkin');
export const checkOut = () => api.post('/attendance/checkout');
export const getMyHistory = () => api.get('/attendance/my-history');
export const getMySummary = () => api.get('/attendance/my-summary');
export const getTodayStatus = () => api.get('/attendance/today');

// ======================= Manager APIs =======================
export const getAllAttendance = () => api.get('/attendance/all');
export const getEmployeeAttendance = (id) => api.get(`/attendance/employee/${id}`);
export const exportAttendanceCSV = () =>
  api.get('/attendance/export', { responseType: 'blob' });
export const getTodayAttendanceStatus = () => api.get('/attendance/today-status');

// ======================= New: Get attendance by date =======================
export const getAttendanceByDate = (date) =>
  api.get(`/attendance/date/${date}`);

// ======================= New: Get attendance by date range =======================
export const getAttendanceByDateRange = (startDate, endDate) =>
  api.get(`/attendance/date-range`, { params: { startDate, endDate } });

// ======================= New: Get all employees =======================
export const getAllEmployees = () =>
  api.get(`/attendance/employees`);

