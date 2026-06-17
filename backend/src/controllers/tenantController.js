const Tenant = require('../models/Tenant');

class TenantController {
  static async getAllTenants(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const offset = parseInt(req.query.offset) || 0;

      const tenants = await Tenant.findAll(limit, offset);
      res.json({
        data: tenants,
        pagination: { limit, offset },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getTenant(req, res) {
    try {
      const { id } = req.params;
      const tenant = await Tenant.findById(id);

      if (!tenant) {
        return res.status(404).json({ error: 'Tenant not found' });
      }

      res.json(tenant);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createTenant(req, res) {
    try {
      const { name, email, subscription_tier } = req.body;

      const tenant = await Tenant.create(name, email, subscription_tier);
      res.status(201).json({
        message: 'Tenant created successfully',
        tenant,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateSubscriptionTier(req, res) {
    try {
      const { id } = req.params;
      const { tier } = req.body;

      const tenant = await Tenant.updateSubscriptionTier(id, tier);
      res.json({
        message: 'Subscription tier updated',
        tenant,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async toggleStatus(req, res) {
    try {
      const { id } = req.params;
      const { is_active } = req.body;

      const tenant = await Tenant.toggleActive(id, is_active);
      res.json({
        message: 'Tenant status updated',
        tenant,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = TenantController;
