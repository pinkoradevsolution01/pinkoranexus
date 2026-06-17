// Authentication endpoints
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "tenant_id": "tenant-uuid"
}

POST /api/auth/login
{
  "email": "admin@pinkora.com",
  "password": "admin123"
}
Response:
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user-uuid",
    "email": "admin@pinkora.com",
    "tenant_id": "tenant-uuid",
    "role": "admin"
  }
}

GET /api/auth/profile
Headers: Authorization: Bearer {token}

// Tenant Management (Admin only)
GET /api/tenants?limit=10&offset=0
Headers: Authorization: Bearer {token}

POST /api/tenants
Headers: Authorization: Bearer {token}
{
  "name": "Company Name",
  "email": "company@example.com",
  "subscription_tier": "basic"
}

GET /api/tenants/:id
Headers: Authorization: Bearer {token}

PATCH /api/tenants/:id/subscription
Headers: Authorization: Bearer {token}
{
  "tier": "premium"
}

PATCH /api/tenants/:id/status
Headers: Authorization: Bearer {token}
{
  "is_active": false
}

// Analytics
GET /api/analytics/dashboard
Headers: Authorization: Bearer {token}

GET /api/analytics/system/metrics
Headers: Authorization: Bearer {token}
