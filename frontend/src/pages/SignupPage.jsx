import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import { register } from '../services/authService';

const SignupPage = ({ theme = 'light' }) => {
  const [organizationName, setOrganizationName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register({
        email,
        password,
        tenantName: organizationName.trim(),
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    const googleAuthUrl = process.env.REACT_APP_GOOGLE_AUTH_URL;

    if (!googleAuthUrl) {
      setError('Google signup is not configured yet. Set REACT_APP_GOOGLE_AUTH_URL to enable it.');
      return;
    }

    window.location.href = googleAuthUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white px-4 py-10 flex items-center justify-center dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-black">
      <div className="w-full max-w-5xl grid lg:grid-cols-[1.05fr_0.95fr] overflow-hidden rounded-[2rem] border border-blue-100 bg-white/95 shadow-[0_25px_80px_rgba(15,23,42,0.18)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <div className="hidden lg:flex flex-col justify-between p-10 text-white bg-gradient-to-br from-slate-900 via-slate-950 to-black relative">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_white,_transparent_35%)]" />
          <div className="relative">
            <img src={theme === 'light' ? '/blue_logo.png' : '/pink_logo.png'} alt="Pinkora Nexus" className="h-16 w-auto max-w-[16rem] object-contain" onError={(e)=>{e.currentTarget.onerror=null; e.currentTarget.src='data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect rx="6" width="100%" height="100%" fill="%23d946ef"/><text x="50%" y="50%" dy="6" font-size="14" text-anchor="middle" fill="white" font-family="Arial">PN</text></svg>';}} />
            <h1 className="mt-8 text-5xl font-black leading-tight">
              Create a workspace in minutes.
            </h1>
            <p className="mt-4 max-w-md text-lg text-slate-300">
              Register your account, set up your organization, and start managing your dashboard from one place.
            </p>
          </div>

          <div className="relative space-y-3 text-sm text-slate-300/90">
            <p className="font-semibold uppercase tracking-[0.2em] text-slate-200">What you get</p>
            <p>Secure account creation</p>
            <p>Optional organization setup during signup</p>
            <p>Google authentication entry point for faster onboarding</p>
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10 bg-white dark:bg-slate-900">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Sign up</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Create your account</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Use email and password, or continue with Google if it is configured.</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Home
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleSignup}
            className="mb-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <FaGoogle className="text-[#DB4437]" />
            Sign up with Google
          </button>

          <div className="relative mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
            <span className="h-px flex-1 bg-slate-200" />
            or use email
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Organization name</label>
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-900 dark:focus:ring-slate-800"
                placeholder="Acme Inc."
              />
              <p className="mt-2 text-xs text-slate-500">Optional. If you enter one, a tenant will be created for your account.</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-900 dark:focus:ring-slate-800"
                placeholder="you@company.com"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-900 dark:focus:ring-slate-800"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Confirm password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-900 dark:focus:ring-slate-800"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:translate-y-[-1px] hover:shadow-xl hover:shadow-blue-600/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Need admin or tenant login?{' '}
            <button type="button" onClick={() => navigate('/')} className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200">
              Go to home
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;