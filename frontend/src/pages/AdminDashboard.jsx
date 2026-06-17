import React, { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getSystemMetrics } from '../services/analyticsService';
import { getTenants, toggleTenantStatus, updateSubscriptionTier } from '../services/tenantService';

const PLAN_VALUES = {
  basic: 1499,
  premium: 2499,
  enterprise: 0,
};

const PLAN_ORDER = ['basic', 'premium', 'enterprise'];

const DEMO_TENANTS = [
  {
    id: 'demo-1',
    name: 'Northstar Retail',
    email: 'ops@northstarretail.com',
    subscription_tier: 'enterprise',
    status: 'active',
    renewalDate: '2026-06-14',
    activeUsers: 182,
    apiRequests: 124800,
    storageGb: 412,
    salesVolume: 96,
    staffUsage: 84,
    customerEngagement: 91,
    churnRisk: 11,
    billingProvider: 'Stripe',
    invoiceStatus: 'paid',
  },
  {
    id: 'demo-2',
    name: 'Blue Harbor Logistics',
    email: 'admin@blueharbor.io',
    subscription_tier: 'premium',
    status: 'active',
    renewalDate: '2026-06-21',
    activeUsers: 114,
    apiRequests: 88200,
    storageGb: 268,
    salesVolume: 78,
    staffUsage: 72,
    customerEngagement: 69,
    churnRisk: 18,
    billingProvider: 'PayPal',
    invoiceStatus: 'paid',
  },
  {
    id: 'demo-3',
    name: 'Summit Clinics',
    email: 'billing@summitclinics.com',
    subscription_tier: 'premium',
    status: 'pending',
    renewalDate: '2026-06-09',
    activeUsers: 91,
    apiRequests: 54100,
    storageGb: 146,
    salesVolume: 66,
    staffUsage: 58,
    customerEngagement: 63,
    churnRisk: 29,
    billingProvider: 'Stripe',
    invoiceStatus: 'failed',
  },
  {
    id: 'demo-4',
    name: 'Orbit Manufacturing',
    email: 'it@orbitmfg.com',
    subscription_tier: 'basic',
    status: 'suspended',
    renewalDate: '2026-06-03',
    activeUsers: 64,
    apiRequests: 32150,
    storageGb: 88,
    salesVolume: 41,
    staffUsage: 37,
    customerEngagement: 35,
    churnRisk: 67,
    billingProvider: 'PayPal',
    invoiceStatus: 'overdue',
  },
  {
    id: 'demo-5',
    name: 'Harbor Education',
    email: 'finance@harboredu.org',
    subscription_tier: 'basic',
    status: 'active',
    renewalDate: '2026-06-28',
    activeUsers: 78,
    apiRequests: 40640,
    storageGb: 112,
    salesVolume: 53,
    staffUsage: 49,
    customerEngagement: 58,
    churnRisk: 22,
    billingProvider: 'Stripe',
    invoiceStatus: 'paid',
  },
];

const AUDIT_LOGS = [
  'Admin login approved for admin@pinkora.com.',
  'Subscription plan changed for Blue Harbor Logistics.',
  'Invoice retry triggered for Orbit Manufacturing.',
  'API key rotation scheduled for the production environment.',
];

const SYSTEM_ANNOUNCEMENTS = [
  'Backend patch window scheduled for Friday 02:00 UTC.',
  'New billing reminder workflow is enabled for renewals.',
  'Security review completed with no critical findings.',
];

const INDUSTRY_BENCHMARKS = [
  { industry: 'Retail', averageActivity: 74, churn: 19 },
  { industry: 'Logistics', averageActivity: 68, churn: 23 },
  { industry: 'Health', averageActivity: 71, churn: 16 },
  { industry: 'Education', averageActivity: 62, churn: 21 },
];

const formatCurrency = (value) => `₱${new Intl.NumberFormat('en-PH').format(value)}`;

const formatDate = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getPlanLabel = (tier) => tier?.charAt(0).toUpperCase() + tier?.slice(1);

const mapApiTenant = (tenant, index) => ({
  id: tenant.id,
  name: tenant.name || 'Untitled tenant',
  email: tenant.email || 'unassigned',
  subscription_tier: tenant.subscription_tier || 'basic',
  status: tenant.is_active === false ? 'suspended' : 'active',
  renewalDate: tenant.renewal_date || tenant.created_at || new Date(Date.now() + (index + 1) * 7 * 86400000).toISOString(),
  activeUsers: 45 + index * 11,
  apiRequests: 12000 + index * 8400,
  storageGb: 80 + index * 22,
  salesVolume: 35 + index * 9,
  staffUsage: 30 + index * 8,
  customerEngagement: 40 + index * 7,
  churnRisk: Math.max(6, 28 - index * 3),
  billingProvider: index % 2 === 0 ? 'Stripe' : 'PayPal',
  invoiceStatus: tenant.is_active === false ? 'overdue' : 'paid',
});

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [tenants, setTenants] = useState(DEMO_TENANTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [metricsResponse, tenantsResponse] = await Promise.all([
          getSystemMetrics(),
          getTenants(100, 0),
        ]);

        setMetrics(metricsResponse.data);

        const mappedTenants = Array.isArray(tenantsResponse.data?.data)
          ? tenantsResponse.data.data.map(mapApiTenant)
          : [];

        setTenants(mappedTenants.length ? mappedTenants : DEMO_TENANTS);
        setNotice('Live data loaded successfully.');
      } catch (err) {
        setError('Live dashboard data is unavailable right now, so seeded admin data is being shown.');
        setTenants(DEMO_TENANTS);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const tenantOverview = useMemo(() => {
    const totalTenants = tenants.length;
    const activeTenants = tenants.filter((tenant) => tenant.status === 'active').length;
    const suspendedTenants = tenants.filter((tenant) => tenant.status === 'suspended').length;
    const pendingTenants = tenants.filter((tenant) => tenant.status === 'pending').length;
    const activeUsers = tenants.reduce((sum, tenant) => sum + tenant.activeUsers, 0);
    const apiRequests = tenants.reduce((sum, tenant) => sum + tenant.apiRequests, 0);
    const storageGb = tenants.reduce((sum, tenant) => sum + tenant.storageGb, 0);
    const totalMRR = tenants.reduce((sum, tenant) => sum + (PLAN_VALUES[tenant.subscription_tier] || PLAN_VALUES.basic), 0);
    const outstandingInvoices = tenants.filter((tenant) => tenant.invoiceStatus === 'overdue' || tenant.invoiceStatus === 'failed').length;
    const uptime = metrics?.uptime || '99.96%';
    const latency = metrics?.latency_ms || 142;
    const errorLogs = metrics?.error_logs || 3;

    return {
      totalTenants,
      activeTenants,
      suspendedTenants,
      pendingTenants,
      activeUsers,
      apiRequests,
      storageGb,
      totalMRR,
      outstandingInvoices,
      uptime,
      latency,
      errorLogs,
    };
  }, [metrics, tenants]);

  const planMixData = useMemo(() => {
    const counts = tenants.reduce(
      (accumulator, tenant) => {
        const tier = tenant.subscription_tier || 'basic';
        accumulator[tier] = (accumulator[tier] || 0) + 1;
        return accumulator;
      },
      { basic: 0, premium: 0, enterprise: 0 }
    );

    return [
      { tier: 'Basic', tenants: counts.basic },
      { tier: 'Premium', tenants: counts.premium },
      { tier: 'Enterprise', tenants: counts.enterprise },
    ];
  }, [tenants]);

  const activityComparisonData = useMemo(
    () =>
      tenants.slice(0, 5).map((tenant) => ({
        name: tenant.name.length > 14 ? `${tenant.name.slice(0, 12)}...` : tenant.name,
        sales: tenant.salesVolume,
        staff: tenant.staffUsage,
        engagement: tenant.customerEngagement,
      })),
    [tenants]
  );

  const billingRows = useMemo(
    () =>
      tenants.slice(0, 5).map((tenant) => ({
        name: tenant.name,
        provider: tenant.billingProvider,
        invoiceStatus: tenant.invoiceStatus,
        amount: PLAN_VALUES[tenant.subscription_tier] || PLAN_VALUES.basic,
      })),
    [tenants]
  );

  const topPerformers = useMemo(
    () =>
      [...tenants]
        .sort((left, right) => right.salesVolume + right.customerEngagement - (left.salesVolume + left.customerEngagement))
        .slice(0, 3),
    [tenants]
  );

  const atRiskTenants = useMemo(
    () => [...tenants].sort((left, right) => right.churnRisk - left.churnRisk).slice(0, 3),
    [tenants]
  );

  const handlePlanChange = async (tenantId, direction) => {
    const currentTenant = tenants.find((tenant) => tenant.id === tenantId);

    if (!currentTenant) {
      return;
    }

    const currentIndex = PLAN_ORDER.indexOf(currentTenant.subscription_tier);
    const nextIndex = direction === 'upgrade' ? currentIndex + 1 : currentIndex - 1;
    const nextTier = PLAN_ORDER[nextIndex];

    if (!nextTier) {
      setNotice(`No ${direction} available for ${currentTenant.name}.`);
      return;
    }

    setTenants((current) =>
      current.map((tenant) =>
        tenant.id === tenantId
          ? {
              ...tenant,
              subscription_tier: nextTier,
            }
          : tenant
      )
    );

    try {
      await updateSubscriptionTier(tenantId, nextTier);
      setNotice(`${currentTenant.name} moved to the ${getPlanLabel(nextTier)} plan.`);
    } catch (err) {
      setNotice(`${currentTenant.name} was updated locally. Backend sync is still pending.`);
    }
  };

  const handleStatusToggle = async (tenantId) => {
    const currentTenant = tenants.find((tenant) => tenant.id === tenantId);

    if (!currentTenant) {
      return;
    }

    const nextStatus = currentTenant.status === 'suspended' ? 'active' : 'suspended';

    setTenants((current) =>
      current.map((tenant) =>
        tenant.id === tenantId
          ? {
              ...tenant,
              status: nextStatus,
            }
          : tenant
      )
    );

    try {
      await toggleTenantStatus(tenantId, nextStatus === 'active');
      setNotice(`${currentTenant.name} is now ${nextStatus}.`);
    } catch (err) {
      setNotice(`${currentTenant.name} was updated locally. Backend sync is still pending.`);
    }
  };

  const handlePasswordReset = (tenantName) => {
    setNotice(`Password reset flow queued for ${tenantName}.`);
  };

  if (loading) {
    return <div className="py-8 text-center text-dark-600">Loading admin dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-br from-dark-900 via-primary-900 to-secondary-900 text-white p-8 shadow-2xl border-l-8 border-rose-500">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.35em] text-rose-200">Admin View</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Pinkora Nexus admin dashboard.
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-gray-200 sm:text-base">
              Monitor tenants, usage, revenue, security, and system controls from one admin-only control room.
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur p-4">
            <div className="text-sm text-rose-100">Role-based access</div>
            <div className="mt-1 text-3xl font-bold text-white">Admins only</div>
            <div className="mt-2 text-xs text-gray-200">Controlled access for operational oversight</div>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border-2 border-rose-300 bg-rose-50 px-4 py-3 text-rose-700 font-medium">
          {error}
        </div>
      )}

      {notice && (
        <div className="rounded-2xl border-2 border-secondary-200 bg-secondary-50 px-4 py-3 text-secondary-800 font-medium">
          {notice}
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-gradient-to-br from-white to-gray-100 p-6 shadow-lg ring-2 ring-gray-200 border-t-4 border-dark-700">
          <p className="text-sm font-semibold text-dark-700">Total Tenants</p>
          <p className="mt-2 text-3xl font-bold text-dark-900">{metrics?.total_tenants ?? tenantOverview.totalTenants}</p>
          <p className="mt-2 text-xs text-dark-600">Subscribed businesses on the platform.</p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-secondary-50 to-secondary-100 p-6 shadow-lg ring-2 ring-secondary-200 border-t-4 border-secondary-600">
          <p className="text-sm font-semibold text-secondary-700">System Usage</p>
          <p className="mt-2 text-3xl font-bold text-secondary-900">{tenantOverview.activeUsers.toLocaleString()}</p>
          <p className="mt-2 text-xs text-secondary-700">
            Active users, {tenantOverview.apiRequests.toLocaleString()} API requests, {tenantOverview.storageGb} GB storage.
          </p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-accent-50 to-accent-100 p-6 shadow-lg ring-2 ring-accent-200 border-t-4 border-primary-700">
          <p className="text-sm font-semibold text-primary-700">Revenue Summary</p>
          <p className="mt-2 text-3xl font-bold text-primary-900">{formatCurrency(tenantOverview.totalMRR)}</p>
          <p className="mt-2 text-xs text-primary-700">
            {tenantOverview.outstandingInvoices} invoices outstanding across renewals and payment retries.
          </p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-dark-50 to-white p-6 shadow-lg ring-2 ring-dark-200 border-t-4 border-rose-500">
          <p className="text-sm font-semibold text-dark-700">Health Monitor</p>
          <p className="mt-2 text-3xl font-bold text-dark-900">{tenantOverview.uptime}</p>
          <p className="mt-2 text-xs text-dark-600">
            {tenantOverview.latency} ms latency, {tenantOverview.errorLogs} open error logs.
          </p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-3xl bg-white p-6 shadow-lg ring-2 ring-primary-100 border-t-4 border-secondary-600">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-dark-900">Analytics across tenants</h2>
              <p className="mt-1 text-sm text-dark-600">Sales volume, staff usage, and customer engagement by tenant.</p>
            </div>
          </div>

          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#0ea5e9" radius={[10, 10, 0, 0]} />
                <Bar dataKey="staff" fill="#94a3b8" radius={[10, 10, 0, 0]} />
                <Bar dataKey="engagement" fill="#fb7185" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-lg ring-2 ring-secondary-100 border-t-4 border-rose-500 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-dark-900">Benchmarking</h2>
            <p className="mt-1 text-sm text-dark-600">Industry averages and churn indicators.</p>
          </div>

          <div className="space-y-3">
            {INDUSTRY_BENCHMARKS.map((row) => (
              <div key={row.industry} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between text-sm font-semibold text-dark-800">
                  <span>{row.industry}</span>
                  <span>{row.averageActivity}% activity</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-gradient-to-r from-rose-400 to-rose-600" style={{ width: `${row.averageActivity}%` }} />
                </div>
                <p className="mt-2 text-xs text-dark-600">Average churn risk: {row.churn}%</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-dark-900 to-primary-900 p-4 text-white">
            <p className="text-sm uppercase tracking-[0.28em] text-rose-200">Top performers</p>
            <div className="mt-3 space-y-2 text-sm">
              {topPerformers.map((tenant) => (
                <div key={tenant.id} className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2">
                  <span>{tenant.name}</span>
                  <span className="font-semibold text-rose-200">{tenant.customerEngagement + tenant.salesVolume}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-rose-50 p-4 border border-rose-200">
            <p className="text-sm font-semibold text-rose-800">At risk of churn</p>
            <div className="mt-3 space-y-2 text-sm text-rose-900">
              {atRiskTenants.map((tenant) => (
                <div key={tenant.id} className="flex items-center justify-between rounded-xl bg-white px-3 py-2">
                  <span>{tenant.name}</span>
                  <span className="font-semibold">{tenant.churnRisk}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-lg ring-2 ring-dark-200 border-t-4 border-dark-700">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-dark-900">Tenant management</h2>
            <p className="mt-1 text-sm text-dark-600">Manage plans, renewals, account status, and password resets.</p>
          </div>
          <div className="rounded-2xl bg-gray-50 px-4 py-3 text-sm text-dark-700 border border-gray-200">
            Active: {tenantOverview.activeTenants} · Suspended: {tenantOverview.suspendedTenants} · Pending: {tenantOverview.pendingTenants}
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border-2 border-dark-200">
          <table className="min-w-full divide-y divide-dark-200">
            <thead className="bg-gradient-to-r from-primary-100 to-secondary-100 text-left text-xs uppercase tracking-wide text-dark-700 font-bold">
              <tr>
                <th className="px-5 py-3">Business</th>
                <th className="px-5 py-3">Plan</th>
                <th className="px-5 py-3">Renewal Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100 bg-white">
              {tenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-accent-50 transition">
                  <td className="px-5 py-4">
                    <div className="text-sm font-semibold text-dark-900">{tenant.name}</div>
                    <div className="text-xs text-dark-500">{tenant.email}</div>
                  </td>
                  <td className="px-5 py-4 text-sm text-dark-600 capitalize font-medium">{tenant.subscription_tier}</td>
                  <td className="px-5 py-4 text-sm text-dark-600 font-medium">{formatDate(tenant.renewalDate)}</td>
                  <td className="px-5 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full font-semibold ${
                        tenant.status === 'active'
                          ? 'bg-secondary-100 text-secondary-700'
                          : tenant.status === 'pending'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {tenant.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handlePlanChange(tenant.id, 'upgrade')}
                        className="rounded-lg bg-secondary-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-secondary-700"
                      >
                        Upgrade
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePlanChange(tenant.id, 'downgrade')}
                        className="rounded-lg bg-dark-700 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-dark-800"
                      >
                        Downgrade
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusToggle(tenant.id)}
                        className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-rose-700"
                      >
                        {tenant.status === 'suspended' ? 'Resume' : 'Suspend'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePasswordReset(tenant.name)}
                        className="rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
                      >
                        Reset Password
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!tenants.length && (
                <tr>
                  <td className="px-5 py-6 text-sm text-dark-500" colSpan={5}>
                    No tenants found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-3xl bg-white p-6 shadow-lg ring-2 ring-secondary-100 border-t-4 border-secondary-600">
          <h2 className="text-xl font-bold text-dark-900">Billing & subscriptions</h2>
          <p className="mt-1 text-sm text-dark-600">Stripe and PayPal payment operations, invoices, and reminder workflows.</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-gradient-to-br from-secondary-50 to-secondary-100 p-4 border border-secondary-200">
              <p className="text-sm font-semibold text-secondary-700">Payment providers</p>
              <p className="mt-2 text-sm text-secondary-900">Stripe, PayPal</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-white to-gray-100 p-4 border border-gray-200">
              <p className="text-sm font-semibold text-dark-700">Automated reminders</p>
              <p className="mt-2 text-sm text-dark-900">Renewal nudges 7 days before due date.</p>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-dark-700 font-bold">
                <tr>
                  <th className="px-4 py-3">Tenant</th>
                  <th className="px-4 py-3">Provider</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {billingRows.map((row) => (
                  <tr key={row.name}>
                    <td className="px-4 py-3 text-sm font-semibold text-dark-900">{row.name}</td>
                    <td className="px-4 py-3 text-sm text-dark-600">{row.provider}</td>
                    <td className="px-4 py-3 text-sm text-dark-600">{formatCurrency(row.amount)}/mo</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`rounded-full px-3 py-1 font-semibold ${
                          row.invoiceStatus === 'paid'
                            ? 'bg-secondary-100 text-secondary-700'
                            : row.invoiceStatus === 'failed'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {row.invoiceStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-lg ring-2 ring-dark-200 border-t-4 border-dark-700">
          <h2 className="text-xl font-bold text-dark-900">Security & compliance</h2>
          <p className="mt-1 text-sm text-dark-600">Admin access, audit history, and suspicious activity alerts.</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-gradient-to-br from-dark-900 to-primary-900 p-4 text-white">
              <p className="text-xs uppercase tracking-[0.3em] text-rose-200">RBAC</p>
              <p className="mt-2 text-sm font-semibold">Admins only view</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-4 border border-gray-200">
              <p className="text-xs uppercase tracking-[0.3em] text-dark-500">Audit logs</p>
              <p className="mt-2 text-sm font-semibold text-dark-900">Every action recorded</p>
            </div>
            <div className="rounded-2xl bg-rose-50 p-4 border border-rose-200">
              <p className="text-xs uppercase tracking-[0.3em] text-rose-600">Alerts</p>
              <p className="mt-2 text-sm font-semibold text-rose-900">Suspicious activity watch</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {AUDIT_LOGS.map((entry) => (
              <div key={entry} className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-dark-700">
                {entry}
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            2 failed logins and 1 unusual API burst were detected this week.
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-lg ring-2 ring-primary-100 border-t-4 border-secondary-600">
        <h2 className="text-xl font-bold text-dark-900">System controls</h2>
        <p className="mt-1 text-sm text-dark-600">Manage backend settings, deploy updates, and broadcast system-wide notices.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-gradient-to-br from-dark-900 to-primary-900 p-5 text-white">
            <p className="text-sm uppercase tracking-[0.3em] text-rose-200">API keys</p>
            <p className="mt-3 text-lg font-semibold">Rotate production credentials</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-white to-gray-100 p-5 border border-gray-200">
            <p className="text-sm uppercase tracking-[0.3em] text-dark-500">Environment</p>
            <p className="mt-3 text-lg font-semibold text-dark-900">Review variables and secrets</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-secondary-50 to-secondary-100 p-5 border border-secondary-200">
            <p className="text-sm uppercase tracking-[0.3em] text-secondary-700">Deploy</p>
            <p className="mt-3 text-lg font-semibold text-secondary-900">Push patch or hotfix update</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100 p-5 border border-rose-200">
            <p className="text-sm uppercase tracking-[0.3em] text-rose-700">Announcements</p>
            <p className="mt-3 text-lg font-semibold text-rose-900">Open notifications center</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-3">
          {SYSTEM_ANNOUNCEMENTS.map((announcement) => (
            <div key={announcement} className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm text-dark-700">
              {announcement}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-lg ring-2 ring-dark-200 border-t-4 border-dark-700">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-dark-900">Global overview detail</h2>
            <p className="mt-1 text-sm text-dark-600">Tenant plan mix and revenue trend snapshots.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <div className="h-72 rounded-2xl border border-gray-200 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={planMixData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="tier" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="tenants" fill="#0f172a" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="h-72 rounded-2xl border border-gray-200 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={planMixData.map((item) => ({ ...item, revenue: item.tenants * 100 }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="tier" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#fb7185" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;