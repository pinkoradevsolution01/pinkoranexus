const pool = require('../config/database');

class Tenant {
  static async create(name, email, subscription_tier = 'basic') {
    const query = `
      INSERT INTO tenants (name, email, subscription_tier, is_active)
      VALUES ($1, $2, $3, true)
      RETURNING id, name, email, subscription_tier, is_active, created_at;
    `;
    const result = await pool.query(query, [name, email, subscription_tier]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM tenants WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findAll(limit = 10, offset = 0) {
    const query = 'SELECT * FROM tenants LIMIT $1 OFFSET $2';
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }

  static async updateSubscriptionTier(tenant_id, tier) {
    const query = `
      UPDATE tenants SET subscription_tier = $1 
      WHERE id = $2 
      RETURNING *;
    `;
    const result = await pool.query(query, [tier, tenant_id]);
    return result.rows[0];
  }

  static async toggleActive(tenant_id, is_active) {
    const query = `
      UPDATE tenants SET is_active = $1 
      WHERE id = $2 
      RETURNING *;
    `;
    const result = await pool.query(query, [is_active, tenant_id]);
    return result.rows[0];
  }
}

module.exports = Tenant;
