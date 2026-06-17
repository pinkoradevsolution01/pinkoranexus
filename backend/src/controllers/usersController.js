const User = require('../models/User');

class UsersController {
  static async getUsers(req, res) {
    try {
      const limit = parseInt(req.query.limit, 10) || 20;
      const offset = parseInt(req.query.offset, 10) || 0;
      const users = await User.listByTenant(req.tenantId, limit, offset);

      res.json({
        data: users,
        pagination: { limit, offset },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createUser(req, res) {
    try {
      const { email, password, role = 'tenant_user' } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const user = await User.create(email, password, req.tenantId, role);

      res.status(201).json({
        message: 'User created successfully',
        user,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = UsersController;