import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './pages/LandingPage';
import AdminLoginPage from './pages/AdminLoginPage';
import TenantLoginPage from './pages/TenantLoginPage';
import SignupPage from './pages/SignupPage';
import AvailSystemsPage from './pages/AvailSystemsPage';
import Dashboard from './pages/Dashboard';
import TenantManagement from './pages/TenantManagement';

const AppContent = ({ user, theme, toggleTheme }) => {
  const location = useLocation();
  const showNavbar = Boolean(user) || location.pathname === '/systems';

  return (
    <>
      {showNavbar && <Navbar user={user} theme={theme} onToggleTheme={toggleTheme} />}
      <div className={user ? 'max-w-7xl mx-auto px-4 py-8' : ''}>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage theme={theme} onToggleTheme={toggleTheme} />} />
          <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <SignupPage theme={theme} />} />
          <Route path="/admin/login" element={user ? <Navigate to="/dashboard" /> : <AdminLoginPage theme={theme} />} />
          <Route path="/tenant/login" element={user ? <Navigate to="/dashboard" /> : <TenantLoginPage theme={theme} />} />
          <Route path="/systems" element={<AvailSystemsPage user={user} theme={theme} />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute user={user}>
                <Dashboard user={user} />
              </PrivateRoute>
            }
          />
          <Route
            path="/tenants"
            element={
              <PrivateRoute user={user}>
                {user?.role === 'admin' ? <TenantManagement /> : <Navigate to="/dashboard" />}
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
};

function App() {
  const { user, loading } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem('pinkora-theme') || 'light');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('pinkora-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <AppContent user={user} theme={theme} toggleTheme={toggleTheme} />
    </BrowserRouter>
  );
}

export default App;
