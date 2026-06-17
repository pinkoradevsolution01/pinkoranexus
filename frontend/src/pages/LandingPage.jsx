import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = ({ theme = 'light', onToggleTheme }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const scrollToSection = (sectionId) => {
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
  };

  const enableVideoSound = async () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = false;
    video.volume = 1;
    setSoundEnabled(true);

    try {
      await video.play();
    } catch (error) {
      console.error('Unable to enable video sound:', error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-white via-blue-50 to-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Header Navigation */}
      <nav className="bg-gradient-to-r from-white via-blue-50 to-blue-100 text-slate-900 shadow-md sticky top-0 z-50 border-b border-blue-100 dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-950 dark:to-black dark:border-b dark:border-slate-800 dark:text-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                type="button"
                onClick={onToggleTheme}
                className="flex items-center gap-3"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                <img src={theme === 'light' ? '/blue_logo.png' : '/pink_logo.png'} alt="Pinkora Nexus" className="h-14 w-auto object-contain max-w-[18rem]" onError={(e)=>{e.currentTarget.onerror=null; e.currentTarget.src='data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect rx="8" width="100%" height="100%" fill="%23d946ef"/><text x="50%" y="50%" dy="8" font-size="20" text-anchor="middle" fill="white" font-family="Arial">PN</text></svg>';}} />
              </button>
            </div>
            <div className="hidden md:flex space-x-8">
              <button
                onClick={() => navigate('/systems')}
                className="text-slate-700 hover:text-blue-600 font-medium transition dark:text-white/85 dark:hover:text-blue-200"
              >
                Avail Systems
              </button>
              <button
                onClick={() => scrollToSection('benefits')}
                className="text-slate-700 hover:text-blue-600 font-medium transition dark:text-white/85 dark:hover:text-blue-200"
              >
                Plans
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="text-slate-700 hover:text-blue-600 font-medium transition dark:text-white/85 dark:hover:text-blue-200"
              >
                Features
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white via-blue-50 to-white py-16 px-4 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-black">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div className="text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4 dark:text-slate-100">
              Empower Your Business with Pinkora Nexus
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl dark:text-slate-300">
              Manage tenants, track analytics, and scale securely — all in one dashboard.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <button
                onClick={() => scrollToSection('benefits')}
                className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition font-semibold shadow galaxy-cta"
              >
                View Plans
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="inline-flex items-center justify-center border border-blue-600 text-blue-600 px-6 py-3 rounded-md hover:bg-white/70 transition font-semibold galaxy-outline"
              >
                Sign Up
              </button>
            </div>
          </div>

          <div className="order-first md:order-last">
            <div className="relative w-full h-56 sm:h-72 md:h-80 lg:h-96 bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-2xl shadow-lg overflow-hidden border border-blue-100 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-black dark:border-slate-800">
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                src="/header_intro.mp4"
                autoPlay
                loop
                muted
                playsInline
                controls={false}
              />
              <button
                type="button"
                onClick={enableVideoSound}
                className="absolute bottom-4 right-4 rounded-full bg-black/60 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-black/75"
              >
                {soundEnabled ? 'Sound On' : 'Tap for Sound'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Benefits Section */}
      <section id="benefits" className="py-20 px-4 bg-gradient-to-b from-white via-blue-50 to-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-950 dark:to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Subscription Plans
            </h2>
            <p className="text-xl text-gray-600">
              Choose the perfect plan for your business
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Basic Tier */}
            <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition transform hover:-translate-y-1 bg-white dark:border-slate-800 dark:bg-slate-900">
              <div className="text-5xl mb-4">💡</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 dark:text-white">Basic</h3>
              <p className="text-gray-600 mb-6 dark:text-slate-300">
                Perfect for getting started with essential features
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6 inline-block dark:bg-slate-950">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">₱1,499</div>
                <div className="text-sm text-gray-600 dark:text-slate-400">/month</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                  <span className="text-blue-600 font-bold dark:text-white">✓</span> Core analytics
                </li>
                <li className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                  <span className="text-blue-600 font-bold dark:text-white">✓</span> Staff management
                </li>
                <li className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                  <span className="text-blue-600 font-bold dark:text-white">✓</span> Secure login
                </li>
                <li className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                  <span className="text-blue-600 font-bold dark:text-white">✓</span> Up to 5 users
                </li>
              </ul>
              <button
                onClick={() => navigate('/signup')}
                className="w-full bg-gray-200 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-bold"
              >
                Sign Up
              </button>
            </div>

            {/* Premium Tier */}
            <div className="border border-blue-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition transform md:scale-105 bg-gradient-to-br from-white to-blue-50 dark:border-slate-700 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-black">
              <div className="text-5xl mb-4">🚀</div>
              <div className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold mb-4">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 dark:text-white">Premium</h3>
              <p className="text-gray-600 mb-6 dark:text-slate-300">
                For growing businesses that need advanced features
              </p>
              <div className="bg-white rounded-lg p-4 mb-6 inline-block dark:bg-slate-950">
                <div className="text-2xl font-bold text-blue-600 dark:text-white">₱2,499</div>
                <div className="text-sm text-gray-600 dark:text-slate-400">/month</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                  <span className="text-blue-600 font-bold dark:text-white">✓</span> Advanced metrics
                </li>
                <li className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                  <span className="text-blue-600 font-bold dark:text-white">✓</span> Custom branding
                </li>
                <li className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                  <span className="text-blue-600 font-bold dark:text-white">✓</span> Priority support
                </li>
                <li className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                  <span className="text-blue-600 font-bold dark:text-white">✓</span> Up to 50 users
                </li>
                <li className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                  <span className="text-blue-600 font-bold dark:text-white">✓</span> Real-time dashboards
                </li>
              </ul>
              <button
                onClick={() => navigate('/signup')}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-bold"
              >
                Sign Up
              </button>
            </div>

            {/* Enterprise Tier */}
            <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition bg-white dark:border-slate-800 dark:bg-slate-900">
              <div className="text-5xl mb-4">🏢</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 dark:text-white">Enterprise</h3>
              <p className="text-gray-600 mb-6 dark:text-slate-300">
                For large-scale operations with complete control
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6 inline-block dark:bg-slate-950">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">Customs</div>
                <div className="text-sm text-gray-600 dark:text-slate-400">Contact sales</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                  <span className="text-blue-600 font-bold dark:text-white">✓</span> Full feature access
                </li>
                <li className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                  <span className="text-blue-600 font-bold dark:text-white">✓</span> API access
                </li>
                <li className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                  <span className="text-blue-600 font-bold dark:text-white">✓</span> Dedicated monitoring
                </li>
                <li className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                  <span className="text-blue-600 font-bold dark:text-white">✓</span> Unlimited users
                </li>
                <li className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                  <span className="text-blue-600 font-bold dark:text-white">✓</span> 24/7 support
                </li>
              </ul>
              <button
                onClick={() => navigate('/signup')}
                className="w-full bg-gray-200 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-bold"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* Benefits of Subscribing Section */}
      <section id="benefits-details" className="py-16 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">Benefits of Subscribing to Pinkora Nexus</h2>
            <p className="text-gray-600 dark:text-slate-300">Secure, scalable, and feature-rich — everything your team needs.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">🔒 Secure & Isolated Access</h3>
                <ul className="list-inside list-disc text-gray-700 space-y-1">
                  <li>Each tenant’s data is fully isolated using tenant IDs — no cross-tenant leaks.</li>
                  <li>JWT authentication ensures safe login and session handling.</li>
                  <li>Passwords are encrypted with bcrypt hashing for maximum security.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">📊 Powerful Analytics Dashboard</h3>
                <ul className="list-inside list-disc text-gray-700 space-y-1">
                  <li>Real-time metrics on user activity, sales, and staff performance.</li>
                  <li>30-day login trends and usage charts for better decision-making.</li>
                  <li>Customizable dashboards with branding options for your business.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">👥 Role-Based Control</h3>
                <ul className="list-inside list-disc text-gray-700 space-y-1">
                  <li>Tenant Users: Access their own analytics and reports.</li>
                  <li>Admins: Manage tenants, subscriptions, and system-wide metrics.</li>
                  <li>Granular permissions prevent unauthorized access.</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">💼 Flexible Subscription Tiers</h3>
                <ul className="list-inside list-disc text-gray-700 space-y-1">
                  <li>Basic: Entry-level features for startups.</li>
                  <li>Premium: Advanced analytics, branding, and priority support.</li>
                  <li>Enterprise: Full suite with API integrations, monitoring, and scalability.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">⚡ Performance & Scalability</h3>
                <ul className="list-inside list-disc text-gray-700 space-y-1">
                  <li>Optimized PostgreSQL with indices and connection pooling.</li>
                  <li>React frontend with lazy loading and code splitting for speed.</li>
                  <li>Autoscaling and CDN support for production deployments.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">📩 Future Enhancements (Roadmap)</h3>
                <ul className="list-inside list-disc text-gray-700 space-y-1">
                  <li>Email notifications for tenant activities.</li>
                  <li>Payment integration (Stripe/PayPal).</li>
                  <li>Two-factor authentication for added security.</li>
                  <li>Webhook support and advanced analytics.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Pinkora Nexus Section */}
      <section id="features" className="py-20 px-4 bg-gray-50 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 dark:text-white">
              Why Choose Pinkora Nexus
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-300">
              Built for modern businesses that need security, scalability, and control
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Feature 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white dark:bg-slate-800 dark:text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 dark:text-white">
                  Multi-Tenant Isolation
                </h3>
                <p className="text-gray-600 dark:text-slate-300">
                  Complete data isolation for each tenant. Your data is secure and separate, with
                  row-level security ensuring no cross-tenant data leakage.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white dark:bg-slate-800 dark:text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 dark:text-white">
                  Role-Based Access Control
                </h3>
                <p className="text-gray-600 dark:text-slate-300">
                  Fine-grained permissions management. Assign Admin and Tenant User roles with
                  customizable access levels for complete control over your organization.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white dark:bg-slate-800 dark:text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 dark:text-white">
                  Real-Time Analytics & Insights
                </h3>
                <p className="text-gray-600 dark:text-slate-300">
                  Track your business metrics in real-time with beautiful dashboards. Make
                  data-driven decisions with comprehensive analytics and reporting tools.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white dark:bg-slate-800 dark:text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 dark:text-white">
                  Scalable PostgreSQL Backend
                </h3>
                <p className="text-gray-600 dark:text-slate-300">
                  Built on PostgreSQL with connection pooling and optimization. Grow from
                  startup to enterprise without infrastructure headaches.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 dark:bg-black dark:text-slate-400">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Pinkora Nexus</h3>
              <p className="text-sm">
                Empowering businesses with secure, scalable SaaS solutions.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button type="button" onClick={() => scrollToSection('features')} className="hover:text-white transition">
                    Documentation
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => navigate('/systems')} className="hover:text-white transition">
                    API Reference
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => scrollToSection('benefits')} className="hover:text-white transition">
                    Pricing
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button type="button" onClick={() => window.location.href = 'mailto:support@pinkora.com'} className="hover:text-white transition">
                    Contact Support
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => scrollToSection('benefits-details')} className="hover:text-white transition">
                    Status Page
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => navigate('/')} className="hover:text-white transition">
                    About Us
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-sm">
            <p>Copyright © Pinkora Nexus 2026. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
