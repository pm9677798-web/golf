-- Update user passwords with correct hashes
-- Copy and paste this in Supabase SQL Editor

-- Update demo user password (password123)
UPDATE users 
SET password_hash = '$2b$12$sAQ5JvPqCOEMN8wj6WXWaO0P7p56ktqppIKzKgrUx5ojIWT/DAfby'
WHERE email = 'demo@golfheart.com';

-- Update admin user password (admin123)
UPDATE users 
SET password_hash = '$2b$12$PsBlXkg8nI77ClaJ6oUN0uVrn8YtpWvFUlkXUVvyefC1wsESU2DFy'
WHERE email = 'admin@golfheart.com';