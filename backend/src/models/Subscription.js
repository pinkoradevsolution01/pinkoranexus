const pool = require('../config/database');

class Subscription {
  static async create(tenant_id, tier, start_date, end_date) {
    const query = `
      INSERT INTO subscriptions (tenant_id, tier, start_date, end_date, is_active)
      VALUES ($1, $2, $3, $4, true)
      RETURNING *;
    `;
    const result = await pool.query(query, [tenant_id, tier, start_date, end_date]);
    return result.rows[0];
  }

  static async findByTenantId(tenant_id) {
    const query = 'SELECT * FROM subscriptions WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 1';
    const result = await pool.query(query, [tenant_id]);
    return result.rows[0];
  }

  static async updateTier(subscription_id, new_tier) {
    const query = `
      UPDATE subscriptions SET tier = $1 
      WHERE id = $2 
      RETURNING *;
    `;
    const result = await pool.query(query, [new_tier, subscription_id]);
    return result.rows[0];
  }

  static async cancel(subscription_id) {
    const query = `
      UPDATE subscriptions SET is_active = false, end_date = NOW()
      WHERE id = $1 
      RETURNING *;
    `;
    const result = await pool.query(query, [subscription_id]);
    return result.rows[0];
  }
}

module.exports = Subscription;
