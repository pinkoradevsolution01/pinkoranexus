import api from './api';

export const getDashboardStats = () => api.get('/analytics/dashboard');

export const getSystemMetrics = () => api.get('/analytics/system/metrics');
