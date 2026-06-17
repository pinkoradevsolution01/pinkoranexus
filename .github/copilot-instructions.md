# Multi-Tenant SaaS Dashboard Development Guide

This is a comprehensive guide for developing and maintaining the Pinkora Multi-Tenant SaaS platform.

## Project Overview

This is a full-stack multi-tenant SaaS application that allows:
- Multiple organizations (tenants) to use the same platform
- Complete data isolation between tenants
- Role-based access control (Admin vs Tenant Users)
- Subscription management with different tiers
- Real-time analytics and dashboards

## Architecture

### Frontend (React)
- **Location**: `frontend/`
- **Key Pages**: LoginPage, Dashboard, TenantManagement
- **Components**: Navbar, PrivateRoute
- **Services**: API integration services
- **Styling**: Tailwind CSS
- **Charts**: Recharts for data visualization

### Backend (Node.js/Express)
- **Location**: `backend/`
- **Architecture Pattern**: MVC (Models, Controllers, Routes)
- **Database**: PostgreSQL with connection pooling
- **Security**: JWT authentication, role-based middleware

### Database (PostgreSQL)
- **Tables**: tenants, users, subscriptions, user_sessions, tenant_usage
- **Isolation**: Row-level security with tenant_id filtering

## Development Setup

### 1. Backend Development

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

**Key Files**:
- `src/index.js` - Express server setup
- `src/config/database.js` - Database connection
- `src/middleware/` - Authentication and authorization
- `src/models/` - Database models
- `src/controllers/` - Request handlers
- `src/routes/` - API endpoints

### 2. Frontend Development

```bash
cd frontend
npm install
cp .env.example .env
npm start
```

**Key Files**:
- `src/App.jsx` - Main application component
- `src/pages/` - Page components
- `src/components/` - Reusable components
- `src/services/` - API client services
- `src/hooks/` - Custom hooks

### 3. Database Setup

```bash
# Create database
createdb saas_platform

# Run migrations
psql -U postgres -d saas_platform -f database/migrations/001_initial_schema.sql

# Seed data
psql -U postgres -d saas_platform -f database/seeds/001_initial_data.sql
```

## Key Concepts

### Multi-Tenant Isolation

Every API request goes through tenant isolation:
1. User logs in with email/password
2. JWT token contains tenant_id
3. Middleware extracts tenant_id from token
4. All database queries filter by tenant_id

### Role-Based Access Control

- **Admin Role**: Access to tenant management, system metrics
- **Tenant User Role**: Access only to their own data

### JWT Authentication

- Tokens contain: id, email, tenant_id, role
- Token expiration: 7 days (configurable)
- Verified on every protected route

## Common Tasks

### Adding a New API Endpoint

1. Create model method in `backend/src/models/`
2. Create controller in `backend/src/controllers/`
3. Add route in `backend/src/routes/`
4. Add middleware for auth/role if needed

Example:
```javascript
// Model
static async getStats(tenant_id) {
  const result = await pool.query('SELECT * FROM tenant_usage WHERE tenant_id = $1', [tenant_id]);
  return result.rows;
}

// Controller
static async getStats(req, res) {
  const stats = await Model.getStats(req.tenantId);
  res.json(stats);
}

// Route
router.get('/stats', authMiddleware, tenantMiddleware, Controller.getStats);
```

### Adding a New Frontend Page

1. Create component in `frontend/src/pages/`
2. Create service in `frontend/src/services/` if needed
3. Add route in `frontend/src/App.jsx`
4. Link from navigation

### Running Database Migrations

Create a new migration file:
```bash
frontend/database/migrations/002_add_column.sql
```

Then run:
```bash
psql -U postgres -d saas_platform -f database/migrations/002_add_column.sql
```

## Deployment

### Low-Storage Option

If SSD usage matters, skip Docker and use a managed PostgreSQL free tier. Keep only the backend and frontend running locally.

### Environment Variables

Update `.env` files before deployment:
- Backend: `JWT_SECRET`, `DB_PASSWORD`, `FRONTEND_URL`
- Frontend: `REACT_APP_API_URL`

## Testing

### Backend Testing Ideas
- Test authentication endpoints
- Test tenant isolation
- Test role-based access
- Test subscription upgrades

### Frontend Testing Ideas
- Test login flow
- Test dashboard rendering
- Test navigation based on roles
- Test error handling

## Performance Optimization

### Backend
- Database indices created on tenant_id, user_id
- Connection pooling configured
- Rate limiting enabled

### Frontend
- React code splitting by routes
- Lazy loading of components
- Recharts for efficient chart rendering

## Troubleshooting

### Issue: "No token provided"
- Check Authorization header format: `Bearer {token}`
- Verify token is stored in localStorage

### Issue: "Tenant not found"
- Verify tenant_id in JWT token
- Check database has tenant record

### Issue: Database connection refused
- Ensure PostgreSQL is running
- Check connection string in .env
- Verify database exists

## Next Steps

1. **Add Email Notifications**: Send subscription updates
2. **Add Payment Integration**: Stripe/PayPal for subscriptions
3. **Add Audit Logging**: Track all tenant actions
4. **Add User Invitations**: Tenant admins invite team members
5. **Add API Rate Limiting**: Per-tenant rate limits
6. **Add Backups**: Automated database backups
7. **Add Monitoring**: Health checks and alerts
