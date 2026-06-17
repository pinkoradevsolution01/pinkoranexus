import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../services/authService';

const AdminLoginPage = ({ theme = 'light' }) => {
  const [email, setEmail] = useState('admin@pinkora.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(email, password);

      if (response.user?.role !== 'admin') {
        setError('This login is for admins only. Please use tenant login.');
        setLoading(false);
        return;
      }

      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="rounded-3xl bg-white p-8 shadow-2xl ring-2 ring-blue-100 dark:bg-slate-900 dark:text-white dark:ring-slate-800">
          <div className="text-center mb-8">
            <img src={theme === 'light' ? '/blue_logo.png' : '/pink_logo.png'} alt="Pinkora Nexus" className="mx-auto h-16 w-auto max-w-[18rem] object-contain" onError={(e)=>{e.currentTarget.onerror=null; e.currentTarget.src='data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect rx="8" width="100%" height="100%" fill="%23d946ef"/><text x="50%" y="50%" dy="8" font-size="24" text-anchor="middle" fill="white" font-family="Arial">PN</text></svg>';}} />
            <p className="text-secondary-700 font-semibold dark:text-slate-300">Admin Portal</p>
            <p className="text-sm text-secondary-600 mt-2 dark:text-slate-400">System Administration Dashboard</p>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border-2 border-rose-300 bg-rose-50 px-4 py-3 text-rose-700 font-medium dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-dark-900 mb-2 dark:text-slate-200">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-300 bg-gray-50 px-4 py-3 text-dark-900 focus:border-secondary-600 focus:outline-none focus:ring-2 focus:ring-secondary-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-slate-800"
                placeholder="admin@pinkora.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark-900 mb-2 dark:text-slate-200">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-300 bg-gray-50 px-4 py-3 text-dark-900 focus:border-secondary-600 focus:outline-none focus:ring-2 focus:ring-secondary-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-slate-800"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-secondary-600 to-secondary-700 px-4 py-3 font-semibold text-white transition hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Admin Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-sm text-secondary-600 hover:text-secondary-700 font-medium"
            >
              ← Back to Login Selection
            </button>
          </div>

          <div className="mt-8 rounded-2xl bg-secondary-50 p-4 dark:bg-slate-950 dark:border dark:border-slate-800">
            <p className="text-xs text-secondary-700 font-semibold mb-2 dark:text-slate-300">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-secondary-600 font-mono dark:text-slate-400">
              <p>Email: <span className="text-secondary-800 dark:text-white">admin@pinkora.com</span></p>
              <p>Password: <span className="text-secondary-800 dark:text-white">admin123</span></p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-rose-50 p-4 border border-rose-200 dark:bg-slate-950 dark:border-slate-800">
            <p className="text-xs text-rose-700 dark:text-slate-300">
              <span className="font-semibold">👤 Admin Access:</span> System-wide management, tenant oversight, billing, security controls, analytics across all tenants.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
