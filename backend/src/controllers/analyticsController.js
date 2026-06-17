const Analytics = require('../models/Analytics');

class AnalyticsController {
  static async getDashboardStats(req, res) {
    try {
      const tenant_id = req.tenantId;

      const userCount = await Analytics.getUserCount(tenant_id);
      const activeUsers = await Analytics.getActiveUsers(tenant_id);
      const loginStats = await Analytics.getLoginStats(tenant_id, 30);

      res.json({
        userCount: userCount.count,
        activeUsers: activeUsers.active_users,
        loginStats,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSystemMetrics(req, res) {
    try {
      const metrics = await Analytics.getSystemMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AnalyticsController;
