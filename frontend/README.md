# Pinkora Multi-Tenant SaaS Dashboard - Frontend README

## Frontend Setup

This is the React frontend for the Pinkora SaaS platform.

### Installation

```bash
npm install
cp .env.example .env
npm start
```

### Environment Variables

```
REACT_APP_API_URL=http://localhost:5000/api
```

### Project Structure

```
src/
├── pages/
│   ├── LoginPage.jsx       # Login/Registration
│   ├── Dashboard.jsx       # Tenant dashboard
│   └── TenantManagement.jsx # Admin tenant list
├── components/
│   ├── Navbar.jsx          # Navigation bar
│   └── PrivateRoute.jsx    # Protected routes
├── services/
│   ├── api.js              # Axios instance
│   ├── authService.js      # Auth API calls
│   ├── tenantService.js    # Tenant API calls
│   └── analyticsService.js # Analytics API calls
├── hooks/
│   └── useAuth.js          # Authentication hook
├── styles/
│   └── index.css           # Global styles
└── App.jsx                 # Main app component
```

### Key Features

- **React 18**: Modern React with hooks
- **React Router**: Client-side routing
- **Recharts**: Data visualization
- **Tailwind CSS**: Utility-first styling
- **Axios**: HTTP client with interceptors
- **JWT Authentication**: Secure token handling

### Running the Frontend

Development:
```bash
npm start
```

Build for production:
```bash
npm run build
```

### Page Components

- **LoginPage**: User authentication
- **Dashboard**: Tenant-specific analytics and metrics
- **TenantManagement**: Admin interface for managing tenants

### Services

- **api.js**: Configured Axios instance with JWT interceptor
- **authService.js**: Login, register, logout, profile
- **tenantService.js**: Tenant CRUD operations
- **analyticsService.js**: Dashboard and metrics data

### Adding New Pages

1. Create component in `src/pages/`
2. Create service in `src/services/` if needed
3. Add route in `src/App.jsx`
4. Link from navigation in `Navbar.jsx`

### Styling

Uses Tailwind CSS with utility classes. Add custom styles in `src/styles/index.css` as needed.

### Authentication Flow

1. User enters email/password on LoginPage
2. API call to `/auth/login` returns JWT token
3. Token stored in localStorage
4. Token sent with every API request via Axios interceptor
5. Protected routes use PrivateRoute wrapper
