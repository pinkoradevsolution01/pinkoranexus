import api from './api';

export const getTenants = (limit = 10, offset = 0) => 
  api.get('/tenants', { params: { limit, offset } });

export const getTenant = (id) => api.get(`/tenants/${id}`);

export const createTenant = (name, email, subscription_tier) =>
  api.post('/tenants', { name, email, subscription_tier });

export const updateSubscriptionTier = (id, tier) =>
  api.patch(`/tenants/${id}/subscription`, { tier });

export const toggleTenantStatus = (id, is_active) =>
  api.patch(`/tenants/${id}/status`, { is_active });

export const getTenantUsers = (limit = 20, offset = 0) =>
  api.get('/users', { params: { limit, offset } });
