-- Seed admin user and tenant
INSERT INTO tenants (name, email, subscription_tier) VALUES
('System Admin', 'admin@pinkora.com', 'enterprise'),
('Demo Tenant 1', 'tenant1@example.com', 'basic'),
('Demo Tenant 2', 'tenant2@example.com', 'premium');

-- Get the first tenant ID for admin
DO $$
DECLARE
  admin_tenant_id UUID;
BEGIN
  SELECT id INTO admin_tenant_id FROM tenants WHERE email = 'admin@pinkora.com' LIMIT 1;
  
  -- Insert admin user (password: admin123)
  INSERT INTO users (email, password_hash, tenant_id, role) VALUES
  ('admin@pinkora.com', '$2a$10$Vy5PfPqmJ9RL7pYuXWVZ4.5p9.L.9gJ.9gJ.9gJ.9gJ.9gJ.9gJ.i', admin_tenant_id, 'admin');
END $$;
