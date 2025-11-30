import api from './authApi'; // Axios instance with token

// Employee dashboard
export const getEmployeeDashboard = () => api.get('/dashboard/employee');

// Manager dashboard
export const getManagerDashboard = () => api.get('/dashboard/manager');
