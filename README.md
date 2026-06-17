# Pinkora Multi-Tenant SaaS Dashboard

A scalable, production-ready multi-tenant SaaS platform built with React, Node.js/Express, and PostgreSQL.

## Features

- **Multi-Tenant Architecture**: Complete data isolation between tenants using tenant IDs and PostgreSQL schemas
- **Role-Based Access Control**: Admin and Tenant User roles with granular permissions
- **Authentication & Authorization**: JWT-based authentication with secure password hashing
- **Subscription Management**: Support for multiple subscription tiers (Basic, Premium, Enterprise)
- **Analytics & Dashboards**: Real-time metrics, user activity tracking, and data visualization
- **Supabase Ready**: Can connect through a Supabase PostgreSQL connection string with SSL enabled
- **Lean Local Development**: Runs with plain Node.js and PostgreSQL without container overhead

## Stack

- **Frontend**: React 18 + React Router + Recharts + Tailwind CSS
- **Backend**: Node.js + Express + PostgreSQL
- **Database**: PostgreSQL 15
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting, Bcrypt

## Project Structure

```
.
├── backend/                    # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Authentication, tenant isolation, RBAC
│   │   ├── models/            # Database models
│   │   ├── routes/            # API routes
│   │   ├── config/            # Database configuration
│   │   └── utils/             # Helper functions
│   ├── package.json
│   └── .env.example
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── pages/             # Page components
│   │   ├── components/        # Reusable components
│   │   ├── services/          # API service clients
│   │   ├── hooks/             # Custom React hooks
│   │   └── styles/            # CSS styles
│   ├── public/
│   ├── package.json
│   └── .env.example
├── database/
│   ├── migrations/            # SQL migration scripts
│   └── seeds/                 # Seed data
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- PostgreSQL 15+ or a managed PostgreSQL free tier

### Local Development Setup

#### 1. Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

The backend will run on `http://localhost:5000`

#### 2. Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm start
```

The frontend will run on `http://localhost:3000`

#### 3. Database Setup

```bash
# Create PostgreSQL database
createdb saas_platform

# Run migrations
psql -U postgres -d saas_platform -f database/migrations/001_initial_schema.sql

# Seed initial data
psql -U postgres -d saas_platform -f database/seeds/001_initial_data.sql
```

## Low-Storage Option

If you want to keep SSD usage low, run the app locally with Node.js and use a managed PostgreSQL service instead of a local database container.

Recommended lightweight setup:

1. Install Node.js once.
2. Use the existing `backend/` and `frontend/` workspaces.
3. Set `DATABASE_URL` to the Supabase PostgreSQL connection string, or keep the local `DB_*` values for an on-machine database.

This avoids Docker image layers and large local database volumes while keeping the app cheap to run.

### Access the Application

- Frontend: http://localhost:3000
- API: http://localhost:5000/api
- Health Check: http://localhost:5000/health

## Default Credentials

- **Email**: admin@pinkora.com
- **Password**: admin123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile

### Tenants (Admin Only)
- `GET /api/tenants` - List all tenants
- `POST /api/tenants` - Create new tenant
- `GET /api/tenants/:id` - Get tenant details
- `PATCH /api/tenants/:id/subscription` - Update subscription tier
- `PATCH /api/tenants/:id/status` - Toggle tenant active status

### Users
- `GET /api/users` - List users for tenant
- `POST /api/users` - Create new user

### Subscriptions
- `GET /api/subscriptions` - Get subscriptions
- `POST /api/subscriptions` - Create subscription

### Analytics
- `GET /api/analytics/dashboard` - Get tenant dashboard stats
- `GET /api/analytics/system/metrics` - Get system metrics (Admin only)

## Tenant Isolation

The application ensures complete data isolation between tenants through:

1. **Middleware**: `tenantMiddleware` extracts tenant ID from JWT token
2. **Database Queries**: All queries include `WHERE tenant_id = $1` filter
3. **Role-Based Access**: `roleMiddleware` restricts admin-only operations
4. **Token Claims**: JWT contains tenant_id for verification

## Database Schema

### Key Tables

- `tenants` - Tenant organizations
- `users` - System users with role assignments
- `subscriptions` - Subscription records and tiers
- `user_sessions` - User login/logout tracking
- `tenant_usage` - Analytics and usage metrics

## Security Considerations

- **Authentication**: JWT with configurable expiration
- **Password Security**: Bcrypt with salt rounds
- **CORS**: Configured for frontend domain only
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Helmet**: HTTP headers security
- **SQL Injection**: Parameterized queries with PostgreSQL
- **Tenant Isolation**: Enforced at middleware and query levels

## Environment Variables

### Backend (.env)

```
DATABASE_URL=
SUPABASE_DATABASE_URL=
POSTGRES_URL=
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=saas_platform
DB_SSL=false
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Development Workflow

### Adding a New Feature

1. **Backend**:
   - Add database model in `src/models/`
   - Create controller in `src/controllers/`
   - Add routes in `src/routes/`
   - Use middleware for authentication/authorization

2. **Frontend**:
   - Create service in `src/services/`
   - Add page/component in `src/pages/` or `src/components/`
   - Use custom hooks for state management

3. **Database**:
   - Create migration in `database/migrations/`
   - Update schema incrementally

## Production Considerations

- Use environment-specific variables
- Enable HTTPS/TLS
- Configure proper database backups
- Implement monitoring and logging
- Use secrets management for sensitive data
- Set up CI/CD pipeline
- Configure auto-scaling for containers
- Implement rate limiting per tenant

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Test connection
psql -U postgres -h localhost -d saas_platform
```

### Backend Not Starting
```bash
# Check port 5000 is available
lsof -i :5000

# Verify environment variables
cat backend/.env
```

### Frontend Build Issues
```bash
# Clear cache and reinstall
rm -rf frontend/node_modules package-lock.json
npm install
```

## Contributing

1. Create feature branch
2. Make changes following code style
3. Test thoroughly
4. Submit pull request

## License

MIT

## Support

For issues and questions, please refer to the project documentation or contact the development team.
