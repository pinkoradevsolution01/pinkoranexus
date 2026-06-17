const pool = require('../config/database');

class Analytics {
  static async getUserCount(tenant_id) {
    const query = 'SELECT COUNT(*) as count FROM users WHERE tenant_id = $1';
    const result = await pool.query(query, [tenant_id]);
    return result.rows[0];
  }

  static async getLoginStats(tenant_id, days = 30) {
    const query = `
      SELECT DATE(login_at) as date, COUNT(*) as logins
      FROM user_sessions
      WHERE tenant_id = $1 AND login_at >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE(login_at)
      ORDER BY date;
    `;
    const result = await pool.query(query, [tenant_id]);
    return result.rows;
  }

  static async getActiveUsers(tenant_id) {
    const query = `
      SELECT COUNT(DISTINCT user_id) as active_users
      FROM user_sessions
      WHERE tenant_id = $1 AND logout_at IS NULL;
    `;
    const result = await pool.query(query, [tenant_id]);
    return result.rows[0];
  }

  static async getSystemMetrics() {
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM tenants) as total_tenants,
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM subscriptions) as active_subscriptions;
    `;
    const result = await pool.query(query);
    return result.rows[0];
  }
}

module.exports = Analytics;
