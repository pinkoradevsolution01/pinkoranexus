import React from 'react';
import AdminDashboard from './AdminDashboard';
import TenantDashboard from './TenantDashboard';

const Dashboard = ({ user }) => {
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  return <TenantDashboard />;
};

export default Dashboard;
