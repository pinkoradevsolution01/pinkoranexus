import api from './api';

export const getTenantUsers = (limit = 20, offset = 0) =>
  api.get('/users', { params: { limit, offset } });

export const createTenantUser = (payload) => api.post('/users', payload);