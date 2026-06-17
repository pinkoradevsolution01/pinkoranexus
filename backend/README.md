# Pinkora Multi-Tenant SaaS Dashboard - Backend README

## Backend Setup

This is the Node.js/Express backend for the Pinkora SaaS platform.

### Installation

```bash
npm install
cp .env.example .env
npm run dev
```

### Environment Variables

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

### Project Structure

```
src/
├── config/
│   └── database.js         # PostgreSQL connection pool
├── controllers/
│   ├── authController.js   # Authentication logic
│   ├── tenantController.js # Tenant management
│   └── analyticsController.js
├── middleware/
│   ├── auth.js             # JWT verification
│   ├── tenant.js           # Tenant isolation
│   └── role.js             # Role-based access control
├── models/
│   ├── User.js
│   ├── Tenant.js
│   ├── Subscription.js
│   └── Analytics.js
├── routes/
│   ├── auth.js
│   ├── tenants.js
│   ├── users.js
│   ├── subscriptions.js
│   └── analytics.js
├── utils/
│   └── helpers.js
└── index.js                # Express app setup
```

### Key Features

- **JWT Authentication**: Secure token-based authentication
- **Multi-Tenant Isolation**: Database-level tenant separation
- **Role-Based Access Control**: Admin vs Tenant User roles
- **PostgreSQL**: Robust relational database
- **Security**: Helmet, CORS, Rate limiting, Bcrypt

### API Endpoints

See [API_DOCUMENTATION.md](../API_DOCUMENTATION.md) for full API reference.

### Running the Server

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

### Database Management

Initialize database:
```bash
psql -U postgres -d saas_platform -f ../database/migrations/001_initial_schema.sql
```

For Supabase, run the SQL from `database/migrations/` in the Supabase SQL editor or point `DATABASE_URL` at the project connection string before starting the backend.

Seed data:
```bash
psql -U postgres -d saas_platform -f ../database/seeds/001_initial_data.sql
```

### Adding New Features

1. Create model in `src/models/`
2. Create controller in `src/controllers/`
3. Add route in `src/routes/`
4. Apply middleware as needed (auth, tenant, role)
