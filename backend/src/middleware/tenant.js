// Tenant isolation middleware
// Ensures users can only access their own tenant's data
const tenantMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  req.tenantId = req.user.tenant_id;
  next();
};

module.exports = tenantMiddleware;
