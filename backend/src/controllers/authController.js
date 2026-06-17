const User = require('../models/User');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

class AuthController {
  static async register(req, res) {
    const client = await pool.connect();

    try {
      const { email, password, tenant_id, tenant_name } = req.body;

      // Check if user exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      await client.query('BEGIN');

      let resolvedTenantId = tenant_id || null;
      let tenant = null;

      if (!resolvedTenantId && tenant_name) {
        const tenantResult = await client.query(
          `
            INSERT INTO tenants (name, email, subscription_tier, is_active)
            VALUES ($1, $2, 'basic', true)
            RETURNING id, name, email, subscription_tier, is_active, created_at;
          `,
          [tenant_name, email]
        );

        tenant = tenantResult.rows[0];
        resolvedTenantId = tenant.id;
      }

      // Create new user
      const user = await User.create(email, password, resolvedTenantId, 'tenant_user', client);

      await client.query('COMMIT');
      const token = User.generateToken(user);

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          tenant_id: user.tenant_id,
        },
        tenant,
      });
    } catch (error) {
      await client.query('ROLLBACK');
      res.status(500).json({ error: error.message });
    } finally {
      client.release();
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Development mode - mock login for testing
      if (process.env.NODE_ENV === 'development' && email === 'admin@pinkora.com' && password === 'admin123') {
        const mockUser = {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: email,
          tenant_id: '550e8400-e29b-41d4-a716-446655440001',
          role: 'admin',
        };
        
        const token = jwt.sign(
          mockUser,
          process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production',
          { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        return res.json({
          message: 'Login successful',
          token,
          user: mockUser,
        });
      }

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await User.verifyPassword(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = User.generateToken(user);

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          tenant_id: user.tenant_id,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AuthController;
