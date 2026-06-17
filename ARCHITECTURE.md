npm# Project Architecture & Features Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (Port 3000)               │
│  - Login/Registration                                       │
│  - Tenant Dashboard (Analytics, Metrics)                   │
│  - Tenant Management (Admin only)                          │
│  - Role-based UI rendering                                 │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/HTTPS
                       │ JWT Bearer Token
                       ▼
┌─────────────────────────────────────────────────────────────┐
│             Node.js/Express API (Port 5000)                 │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Routes:                                              │  │
│  │ - /api/auth (login, register, profile)             │  │
│  │ - /api/tenants (CRUD, subscription management)     │  │
│  │ - /api/users (user management)                      │  │
│  │ - /api/subscriptions (subscription handling)        │  │
│  │ - /api/analytics (dashboard stats, metrics)        │  │
│  └──────────────────────────────────────────────────────┘  │
│                       │                                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Middleware Stack:                                   │  │
│  │ - Helmet (Security headers)                         │  │
│  │ - CORS (Cross-origin requests)                      │  │
│  │ - Rate Limiting (100 req/15 min)                   │  │
│  │ - Auth (JWT verification)                           │  │
│  │ - Tenant Isolation (tenant_id filtering)            │  │
│  │ - Role-Based Access Control                         │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ SQL Queries
                       │ Connection Pool
                       ▼
┌─────────────────────────────────────────────────────────────┐
│           PostgreSQL Database (Port 5432)                    │
│                                                              │
│  Tables:                                                     │
│  - tenants (organizations)                                  │
│  - users (user accounts with roles)                         │
│  - subscriptions (subscription records)                     │
│  - user_sessions (login tracking)                           │
│  - tenant_usage (analytics data)                            │
│                                                              │
│  Indices:                                                    │
│  - tenant_id (for multi-tenancy filtering)                 │
│  - user_id (for user lookups)                              │
│  - email (for unique constraints)                          │
└─────────────────────────────────────────────────────────────┘
```

## Multi-Tenant Data Flow

```
User Login
    │
    ▼
POST /api/auth/login
    │
    ├─ Validate email/password
    ├─ Create JWT: { id, email, tenant_id, role }
    └─ Return token
    │
    ▼
Subsequent Requests with Bearer Token
    │
    ├─ Extract token from header
    ├─ Verify JWT signature
    ├─ Extract tenant_id from token (req.tenantId)
    │
    ▼
Database Query
    │
    ├─ All queries: WHERE tenant_id = $1
    ├─ Complete data isolation
    └─ No cross-tenant data access
```

## Role-Based Access Control

### Admin Role
- Access to all tenants list
- Create/update tenants
- Manage subscription tiers
- View system metrics
- Activate/deactivate tenants

### Tenant User Role
- View own dashboard
- View own metrics
- Cannot access admin functions
- Cannot see other tenants' data

## Authentication Flow

```
User enters credentials
    │
    ▼
POST /api/auth/login
    │
    ├─ Hash password with bcrypt
    ├─ Compare with stored hash
    ├─ If valid:
    │  ├─ Create JWT with user details
    │  ├─ Store in localStorage
    │  └─ Redirect to dashboard
    │
    └─ If invalid: Show error
```

## Key Security Features

1. **JWT Authentication**
   - Signed tokens with expiration
   - Contains tenant_id for isolation
   - Verified on every protected route

2. **Password Security**
   - Bcrypt hashing with salt
   - Never stored in plain text
   - Compared using constant-time comparison

3. **Tenant Isolation**
   - Tenant ID in JWT token
   - Extracted by middleware
   - Enforced in all database queries
   - No cross-tenant queries possible

4. **HTTP Security**
   - Helmet for headers
   - CORS for domain validation
   - Rate limiting per IP
   - SQL parameterized queries

5. **Role-Based Middleware**
   - roleMiddleware checks role before executing
   - Admin-only routes protected
   - Graceful permission denial

## Database Design - Multi-Tenancy

### Tenant Filtering Pattern

```sql
-- All queries follow this pattern:
SELECT * FROM table_name 
WHERE tenant_id = $1  -- Enforced at query level
  AND other_conditions;

-- Example:
SELECT * FROM users 
WHERE tenant_id = $1 AND email = $2;
```

### Data Isolation Guarantee

- No global queries (no SELECT without WHERE tenant_id)
- Tenant ID always from authenticated JWT
- Impossible to query another tenant's data
- Row-level filtering at database layer

## Subscription Tiers

- **Basic**: Entry-level tier
- **Premium**: Mid-tier with enhanced features
- **Enterprise**: Full-featured tier

Each tier can have different API limits, features, and pricing.

## Analytics & Metrics

Dashboard provides:
- Total user count
- Active users count
- 30-day login trend chart
- System-wide metrics (admin only)

## Deployment Architecture

### Local Development Setup

```
Node.js apps + PostgreSQL

├─ Backend
│  ├─ Port: 5000
│  ├─ Environment variables
│  └─ Connects to PostgreSQL

└─ Frontend
   ├─ Port: 3000
   └─ Calls backend API
```

### Low-Storage Deployment Option

Use a managed PostgreSQL service and keep only the backend and frontend running locally. This avoids container images and local database volumes.

### Production Considerations

- Use separate database instances per region (if needed)
- Implement connection pooling (already configured)
- Enable PostgreSQL backups
- Set up monitoring and alerts
- Use environment-specific variables
- Implement CDN for static assets
- Configure autoscaling policies
- Set up log aggregation
- Implement rate limiting per tenant
- Add request/response compression

## Performance Optimizations

1. **Database**
   - Connection pooling with pg
   - Indices on frequently queried columns
   - Parameterized queries prevent SQL injection

2. **Frontend**
   - React lazy loading
   - Code splitting by routes
   - Tailwind CSS for minimal CSS
   - Recharts for efficient rendering

3. **API**
   - JWT caching in localStorage
   - Axios request interceptor
   - Error handling at service level

## Future Enhancements

1. Email notifications
2. Payment integration (Stripe/PayPal)
3. Audit logging
4. Two-factor authentication
5. API key management
6. Custom branding per tenant
7. Advanced analytics
8. Webhook support
9. API rate limiting per tenant
10. Automated backups
