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
import { getDashboardStats } from '../services/analyticsService';
import { getTenantUsers } from '../services/userService';

const DEMO_TENANT = {
  id: 'tenant-1',
  name: 'Blue Harbor Logistics',
  logoUrl: '🚛',
  plan: 'Premium',
  renewalDate: '2026-06-21',
};

const DEMO_STAFF = [
  {
    id: 'staff-1',
    name: 'Maria Chen',
    email: 'maria@blueharbor.io',
    role: 'manager',
    status: 'active',
    lastLogin: '2026-05-27 09:15',
    permissions: ['view_reports', 'manage_staff', 'view_inventory'],
  },
  {
    id: 'staff-2',
    name: 'James Rodriguez',
    email: 'james@blueharbor.io',
    role: 'cashier',
    status: 'active',
    lastLogin: '2026-05-27 08:45',
    permissions: ['process_transactions', 'view_sales'],
  },
  {
    id: 'staff-3',
    name: 'Sarah Williams',
    email: 'sarah@blueharbor.io',
    role: 'auditor',
    status: 'active',
    lastLogin: '2026-05-26 14:30',
    permissions: ['view_reports', 'audit_logs', 'view_inventory'],
  },
  {
    id: 'staff-4',
    name: 'David Kim',
    email: 'david@blueharbor.io',
    role: 'cashier',
    status: 'inactive',
    lastLogin: '2026-05-20 16:00',
    permissions: ['process_transactions'],
  },
];

const REVENUE_DATA = [
  { date: 'Mon', revenue: 3200, target: 3500 },
  { date: 'Tue', revenue: 3800, target: 3500 },
  { date: 'Wed', revenue: 3100, target: 3500 },
  { date: 'Thu', revenue: 4200, target: 3500 },
  { date: 'Fri', revenue: 4800, target: 3500 },
  { date: 'Sat', revenue: 5200, target: 3500 },
  { date: 'Sun', revenue: 4100, target: 3500 },
];

const TOP_PRODUCTS = [
  { name: 'Standard Shipping', sales: 2400, revenue: 24000 },
  { name: 'Express Shipping', sales: 1221, revenue: 18315 },
  { name: 'Regional Delivery', sales: 929, revenue: 11688 },
  { name: 'International Freight', sales: 200, revenue: 8000 },
];

const LOYALTY_DATA = [
  { month: 'Jan', points: 4200, redemptions: 2400 },
  { month: 'Feb', points: 3800, redemptions: 2210 },
  { month: 'Mar', points: 5200, redemptions: 2290 },
  { month: 'Apr', points: 4780, redemptions: 2000 },
  { month: 'May', points: 5890, redemptions: 2181 },
];

const STAFF_PRODUCTIVITY = [
  { name: 'Maria', tasksCompleted: 142, efficiency: 94 },
  { name: 'James', tasksCompleted: 118, efficiency: 88 },
  { name: 'Sarah', tasksCompleted: 95, efficiency: 92 },
  { name: 'David', tasksCompleted: 72, efficiency: 85 },
];

const TRANSACTIONS = [
  { id: 'txn-001', timestamp: '2026-05-27 14:32', type: 'Sale', amount: 450.00, staff: 'James', status: 'completed' },
  { id: 'txn-002', timestamp: '2026-05-27 13:15', type: 'Refund', amount: -75.50, staff: 'Maria', status: 'completed' },
  { id: 'txn-003', timestamp: '2026-05-27 12:47', type: 'Sale', amount: 320.00, staff: 'James', status: 'completed' },
  { id: 'txn-004', timestamp: '2026-05-27 11:22', type: 'Sale', amount: 890.50, staff: 'James', status: 'completed' },
  { id: 'txn-005', timestamp: '2026-05-27 10:05', type: 'Adjustment', amount: 50.00, staff: 'Maria', status: 'completed' },
];

const NOTIFICATIONS = [
  { id: 'notif-1', type: 'low_stock', title: 'Low Stock Alert', message: '3 items below reorder threshold', date: '2026-05-27 08:00', read: false },
  { id: 'notif-2', type: 'renewal', title: 'Subscription Renewal Coming', message: 'Your Premium plan renews on Jun 21, 2026', date: '2026-05-25 12:00', read: false },
  { id: 'notif-3', type: 'system', title: 'New Feature Available', message: 'Advanced analytics dashboard is now available', date: '2026-05-24 09:30', read: true },
  { id: 'notif-4', type: 'system', title: 'System Maintenance', message: 'Scheduled maintenance completed successfully', date: '2026-05-23 22:00', read: true },
];

const THEME_COLORS = [
  { name: 'Dark Blue', primary: '#0c4a6e', secondary: '#0ea5e9', accent: '#fb7185' },
  { name: 'Forest Green', primary: '#15803d', secondary: '#22c55e', accent: '#fb7185' },
  { name: 'Deep Purple', primary: '#6b21a8', secondary: '#a855f7', accent: '#fb7185' },
  { name: 'Slate', primary: '#1e293b', secondary: '#64748b', accent: '#fb7185' },
];

const TenantDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [staff, setStaff] = useState(DEMO_STAFF);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [dateRange, setDateRange] = useState('week');

  useEffect(() => {
    const load = async () => {
      try {
        const [analyticsResponse, usersResponse] = await Promise.all([
          getDashboardStats(),
          getTenantUsers(),
        ]);

        setAnalytics(analyticsResponse.data);
        setStaff(usersResponse.data.data || DEMO_STAFF);
      } catch (err) {
        setError('Live dashboard data is unavailable, showing demo data.');
        setStaff(DEMO_STAFF);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const summaryCards = useMemo(() => [
    {
      title: 'Sales Today',
      value: '₱4,850',
      subtext: '+12% from yesterday',
      icon: '📊',
      color: 'from-secondary-50 to-secondary-100',
      borderColor: 'border-secondary-600',
    },
    {
      title: 'Inventory Status',
      value: '847 units',
      subtext: '12 items low stock',
      icon: '📦',
      color: 'from-amber-50 to-amber-100',
      borderColor: 'border-amber-600',
    },
    {
      title: 'Active Staff Users',
      value: staff.filter((s) => s.status === 'active').length,
      subtext: `${staff.length} total team members`,
      icon: '👥',
      color: 'from-green-50 to-green-100',
      borderColor: 'border-green-600',
    },
    {
      title: 'Subscription Plan',
      value: DEMO_TENANT.plan,
      subtext: `Renews ${new Date(DEMO_TENANT.renewalDate).toLocaleDateString()}`,
      icon: '💰',
      color: 'from-rose-50 to-rose-100',
      borderColor: 'border-rose-600',
    },
  ], [staff]);

  const unreadNotifications = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const handleAddStaff = () => {
    setNotice('New staff member form would open here.');
    setShowStaffForm(false);
  };

  const handleDeactivateStaff = (staffName) => {
    setNotice(`${staffName} has been deactivated.`);
  };

  const handleMarkNotificationRead = (notificationId) => {
    setNotifications((current) =>
      current.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const handleExportPDF = () => {
    setNotice('Exporting report as PDF...');
  };

  const handleExportCSV = () => {
    setNotice('Exporting data as CSV...');
  };

  const handleThemeChange = (index) => {
    setSelectedTheme(index);
    setNotice(`Theme changed to ${THEME_COLORS[index].name}.`);
  };

  if (loading) {
    return <div className="py-8 text-center text-dark-600">Loading tenant dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-br from-dark-900 via-secondary-900 to-primary-900 text-white p-8 shadow-2xl border-l-8 border-rose-500">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{DEMO_TENANT.logoUrl}</span>
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-rose-200">Welcome back</p>
                <h1 className="mt-1 text-4xl font-semibold tracking-tight sm:text-5xl">
                  {DEMO_TENANT.name}
                </h1>
              </div>
            </div>
            <p className="mt-4 max-w-2xl text-sm text-gray-200 sm:text-base">
              Monitor sales, manage staff, track analytics, and customize your workspace.
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur p-4">
            <div className="text-sm text-rose-100">{DEMO_TENANT.plan} Subscriber</div>
            <div className="mt-1 text-2xl font-bold text-white">Business Dashboard</div>
            <div className="mt-2 text-xs text-gray-200">{staff.length} staff members active</div>
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
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className={`rounded-2xl bg-gradient-to-br ${card.color} p-6 shadow-lg ring-2 border-t-4 ${card.borderColor}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-dark-700">{card.title}</p>
                <p className="mt-2 text-3xl font-bold text-dark-900">{card.value}</p>
                <p className="mt-2 text-xs text-dark-600">{card.subtext}</p>
              </div>
              <span className="text-3xl">{card.icon}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl bg-white p-6 shadow-lg ring-2 ring-primary-100 border-t-4 border-secondary-600">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-dark-900">Business Analytics</h2>
            <p className="mt-1 text-sm text-dark-600">Revenue trends, top products, loyalty performance, and staff productivity.</p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-dark-800 mb-3">Revenue Trends (Weekly)</h3>
              <div className="h-64 rounded-2xl border border-gray-200 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={REVENUE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="target" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-dark-800 mb-3">Top-Selling Services</h3>
              <div className="h-56 rounded-2xl border border-gray-200 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={TOP_PRODUCTS}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#0ea5e9" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-dark-800 mb-3">Customer Loyalty Program</h3>
                <div className="h-48 rounded-2xl border border-gray-200 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={LOYALTY_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Bar dataKey="points" fill="#fb7185" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-dark-800 mb-3">Staff Productivity</h3>
                <div className="space-y-2">
                  {STAFF_PRODUCTIVITY.map((member) => (
                    <div key={member.name} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-dark-800">{member.name}</span>
                        <span className="text-sm text-secondary-700 font-semibold">{member.efficiency}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-200">
                        <div className="h-2 rounded-full bg-gradient-to-r from-secondary-400 to-secondary-600" style={{ width: `${member.efficiency}%` }} />
                      </div>
                      <div className="mt-1 text-xs text-dark-600">{member.tasksCompleted} tasks completed</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-lg ring-2 ring-dark-200 border-t-4 border-dark-700 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-dark-900">Notifications</h2>
            <p className="mt-1 text-sm text-dark-600">Alerts and system updates.</p>
          </div>

          <div className="rounded-2xl bg-dark-900 text-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-rose-200">Unread</p>
                <p className="text-3xl font-bold mt-1">{unreadNotifications}</p>
              </div>
              <span className="text-4xl">🔔</span>
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`rounded-2xl p-4 cursor-pointer transition ${
                  notif.read ? 'border border-gray-200 bg-gray-50' : 'border-2 border-rose-200 bg-rose-50'
                }`}
                onClick={() => handleMarkNotificationRead(notif.id)}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-1">
                    {notif.type === 'low_stock' && '📉'}
                    {notif.type === 'renewal' && '🔄'}
                    {notif.type === 'system' && 'ℹ️'}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-dark-900">{notif.title}</p>
                    <p className="text-sm text-dark-700 mt-1">{notif.message}</p>
                    <p className="text-xs text-dark-500 mt-2">{notif.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-lg ring-2 ring-primary-100 border-t-4 border-secondary-600">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-dark-900">Staff Management</h2>
            <p className="mt-1 text-sm text-dark-600">Manage team accounts, roles, and permissions.</p>
          </div>
          <button
            type="button"
            onClick={handleAddStaff}
            className="rounded-lg bg-secondary-600 px-4 py-2 font-semibold text-white transition hover:bg-secondary-700 self-start lg:self-auto"
          >
            + Add Staff Member
          </button>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border-2 border-dark-200">
          <table className="min-w-full divide-y divide-dark-200">
            <thead className="bg-gradient-to-r from-primary-100 to-secondary-100 text-left text-xs uppercase tracking-wide text-dark-700 font-bold">
              <tr>
                <th className="px-5 py-3">Staff Member</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Last Login</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100 bg-white">
              {staff.map((member) => (
                <tr key={member.id} className="hover:bg-accent-50 transition">
                  <td className="px-5 py-4">
                    <div className="text-sm font-semibold text-dark-900">{member.name}</div>
                    <div className="text-xs text-dark-500">{member.email}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center rounded-full bg-secondary-100 px-3 py-1 text-xs font-medium text-secondary-700 capitalize">
                      {member.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        member.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-dark-600">{member.lastLogin}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="rounded-lg border border-secondary-300 bg-white px-3 py-1.5 text-sm font-semibold text-secondary-700 transition hover:bg-secondary-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeactivateStaff(member.name)}
                        className="rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
                      >
                        {member.status === 'active' ? 'Deactivate' : 'Reactivate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-lg ring-2 ring-secondary-100 border-t-4 border-secondary-600">
          <div>
            <h2 className="text-xl font-bold text-dark-900">Reports & Logs</h2>
            <p className="mt-1 text-sm text-dark-600">Exportable transaction logs and audit-ready reports.</p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-semibold text-dark-700 mb-2">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-dark-700"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={handleExportPDF}
                className="flex-1 rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white transition hover:bg-rose-700"
              >
                📄 Export PDF
              </button>
            </div>
            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={handleExportCSV}
                className="flex-1 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition hover:bg-green-700"
              >
                📊 Export CSV
              </button>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-dark-700 font-bold">
                <tr>
                  <th className="px-4 py-3">Transaction</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Staff</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {TRANSACTIONS.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="text-sm font-semibold text-dark-900">{txn.id}</div>
                      <div className="text-xs text-dark-500">{txn.timestamp}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-dark-600 capitalize">{txn.type}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-dark-900">${txn.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-dark-600">{txn.staff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-lg ring-2 ring-dark-200 border-t-4 border-dark-700">
          <div>
            <h2 className="text-xl font-bold text-dark-900">Customization</h2>
            <p className="mt-1 text-sm text-dark-600">Personalize your workspace and theme.</p>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold text-dark-700 mb-3">Dashboard Theme</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {THEME_COLORS.map((theme, index) => (
                <button
                  key={theme.name}
                  type="button"
                  onClick={() => handleThemeChange(index)}
                  className={`rounded-2xl p-4 border-2 transition ${
                    selectedTheme === index ? 'border-secondary-600 bg-secondary-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="h-6 w-6 rounded" style={{ backgroundColor: theme.primary }} />
                      <div className="h-6 w-6 rounded" style={{ backgroundColor: theme.secondary }} />
                      <div className="h-6 w-6 rounded" style={{ backgroundColor: theme.accent }} />
                    </div>
                    <span className="font-semibold text-dark-900">{theme.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm font-semibold text-dark-700 mb-3">Dashboard Layout</p>
            <div className="space-y-2">
              <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 cursor-pointer hover:bg-gray-50 transition">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm text-dark-700">Show revenue chart</span>
              </label>
              <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 cursor-pointer hover:bg-gray-50 transition">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm text-dark-700">Show staff productivity</span>
              </label>
              <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 cursor-pointer hover:bg-gray-50 transition">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm text-dark-700">Show notifications</span>
              </label>
              <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 cursor-pointer hover:bg-gray-50 transition">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm text-dark-700">Enable email notifications</span>
              </label>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-dark-900 text-white p-4">
            <p className="text-sm font-semibold mb-3">Quick Stats</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Revenue (May):</span>
                <span className="font-semibold">₱28,450</span>
              </div>
              <div className="flex justify-between">
                <span>Active Customers:</span>
                <span className="font-semibold">342</span>
              </div>
              <div className="flex justify-between">
                <span>Orders This Month:</span>
                <span className="font-semibold">1,247</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TenantDashboard;