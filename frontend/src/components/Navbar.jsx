import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../services/authService';

const Navbar = ({ user, theme = 'light', onToggleTheme }) => {
  const [open, setOpen] = useState(false);
  const logoSrc = theme === 'light' ? '/blue_logo.png' : '/pink_logo.png';

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <nav className={`sticky top-0 z-50 shadow backdrop-blur-sm ${theme === 'light' ? 'bg-gradient-to-r from-white via-blue-50 to-blue-100 text-slate-900 border-b border-blue-100' : 'bg-gradient-to-r from-slate-900 via-slate-950 to-black text-slate-100 dark:border-b dark:border-slate-800'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" onClick={onToggleTheme} className="flex items-center gap-3">
            <img src={logoSrc} alt="Pinkora Nexus" className="h-12 w-auto object-contain max-w-[10rem]" onError={(e)=>{e.currentTarget.onerror=null; e.currentTarget.src='data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect rx="8" width="100%" height="100%" fill="%23d946ef"/><text x="50%" y="50%" dy="8" font-size="28" text-anchor="middle" fill="white" font-family="Arial">PN</text></svg>';}} />
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <button
              type="button"
              onClick={onToggleTheme}
              className={`rounded-full border px-3 py-1 text-sm font-semibold ${theme === 'light' ? 'border-blue-200 text-slate-700 hover:border-blue-300 hover:text-blue-700' : 'border-white/20 text-white hover:border-slate-400 hover:text-white galaxy-outline'}`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            <Link to="/systems" className={`${theme === 'light' ? 'text-slate-700 hover:text-blue-600' : 'text-white/85 hover:text-white'} font-medium`}>
              Avail Systems
            </Link>
            <button onClick={() => (document.getElementById('benefits') || document.getElementById('benefits-details'))?.scrollIntoView({ behavior: 'smooth' })} className={`${theme === 'light' ? 'text-slate-700 hover:text-blue-600' : 'text-white/85 hover:text-white'} font-medium`}>
              Plans
            </button>
            <button onClick={() => (document.getElementById('features'))?.scrollIntoView({ behavior: 'smooth' })} className={`${theme === 'light' ? 'text-slate-700 hover:text-blue-600' : 'text-white/85 hover:text-white'} font-medium`}>
              Features
            </button>

            {user?.role === 'admin' && (
              <>
                <Link to="/dashboard" className={`${theme === 'light' ? 'text-slate-700 hover:text-blue-600' : 'text-white/85 hover:text-white'} font-medium`}>Dashboard</Link>
                <Link to="/tenants" className={`${theme === 'light' ? 'text-slate-700 hover:text-blue-600' : 'text-white/85 hover:text-white'} font-medium`}>Tenants</Link>
              </>
            )}

            {user?.role === 'tenant_user' && (
              <Link to="/dashboard" className={`${theme === 'light' ? 'text-slate-700 hover:text-blue-600' : 'text-white/85 hover:text-white'} font-medium`}>My Dashboard</Link>
            )}

            {user ? (
              <div className="flex items-center gap-3">
                <span className={`text-sm hidden sm:inline ${theme === 'light' ? 'text-slate-600' : 'text-white/70'}`}>{user?.email}</span>
                <button onClick={handleLogout} className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-semibold hover:bg-blue-700">Logout</button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/signup" className="bg-slate-700 text-white px-3 py-2 rounded-md text-sm font-semibold hover:bg-slate-600 galaxy-cta">Sign Up</Link>
                <Link to="/" className={`${theme === 'light' ? 'text-sm font-semibold text-slate-700 hover:text-blue-600' : 'text-sm font-semibold text-white/85 hover:text-white'}`}>Home</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setOpen(!open)} aria-label="Toggle menu" className={`p-2 rounded-md ${theme === 'light' ? 'text-slate-900 hover:bg-blue-50' : 'text-white hover:bg-white/10'}`}>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className={`md:hidden ${theme === 'light' ? 'bg-gradient-to-b from-white via-blue-50 to-blue-100 border-t border-blue-100 text-slate-900' : 'bg-gradient-to-b from-slate-900 via-slate-950 to-black border-t border-white/10 text-white'}`}>
          <div className="px-4 pt-4 pb-4 space-y-3">
            <button type="button" onClick={onToggleTheme} className={`block font-semibold ${theme === 'light' ? 'text-slate-700' : 'text-white'}`}>
              {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>
            <Link to="/systems" onClick={() => setOpen(false)} className={`block ${theme === 'light' ? 'text-slate-700' : 'text-white/85'}`}>
              Avail Systems
            </Link>
            <button onClick={() => { setOpen(false); (document.getElementById('benefits') || document.getElementById('benefits-details'))?.scrollIntoView({ behavior: 'smooth' }); }} className={`w-full text-left ${theme === 'light' ? 'text-slate-700' : 'text-white/85'}`}>Plans</button>
            <button onClick={() => { setOpen(false); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }} className={`w-full text-left ${theme === 'light' ? 'text-slate-700' : 'text-white/85'}`}>Features</button>
            {user?.role === 'admin' && (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className={`block ${theme === 'light' ? 'text-slate-700' : 'text-white/85'}`}>Dashboard</Link>
                <Link to="/tenants" onClick={() => setOpen(false)} className={`block ${theme === 'light' ? 'text-slate-700' : 'text-white/85'}`}>Tenants</Link>
              </>
            )}
            {user?.role === 'tenant_user' && (
              <Link to="/dashboard" onClick={() => setOpen(false)} className={`block ${theme === 'light' ? 'text-slate-700' : 'text-white/85'}`}>My Dashboard</Link>
            )}
            <div className={`pt-2 border-t ${theme === 'light' ? 'border-blue-100' : 'border-white/10'}`}>
              {user ? (
                <button onClick={() => { setOpen(false); handleLogout(); }} className="w-full text-left text-blue-600 font-semibold">Logout</button>
              ) : (
                <Link to="/signup" onClick={() => setOpen(false)} className="block text-blue-600 font-semibold">Sign Up</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
