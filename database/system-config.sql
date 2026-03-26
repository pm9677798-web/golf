-- System Configuration Table for Dynamic Settings
CREATE TABLE IF NOT EXISTS system_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  config_key VARCHAR(255) UNIQUE NOT NULL,
  config_value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default configuration values
INSERT INTO system_config (config_key, config_value, description) VALUES
('monthly_subscription_price', '29.99', 'Monthly subscription price in USD'),
('yearly_subscription_price', '299.99', 'Yearly subscription price in USD'),
('default_charity_percentage', '10', 'Default charity contribution percentage'),
('prize_distribution_1st', '40', 'First place prize percentage'),
('prize_distribution_2nd', '35', 'Second place prize percentage'),
('prize_distribution_3rd', '25', 'Third place prize percentage'),
('max_scores_kept', '5', 'Maximum number of scores to keep per user'),
('score_range_min', '1', 'Minimum valid Stableford score'),
('score_range_max', '45', 'Maximum valid Stableford score'),
('prize_pool_percentage', '60', 'Percentage of subscription going to prize pool'),
('draw_day_of_month', '1', 'Day of month when draws occur')
ON CONFLICT (config_key) DO NOTHING;

-- Create admin user (replace with actual admin email)
-- INSERT INTO admin_users (user_id) 
-- SELECT id FROM users WHERE email = 'your-admin@email.com';