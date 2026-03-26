-- Create demo users only
-- Copy and paste this in Supabase SQL Editor

-- Insert demo users (passwords are hashed versions of 'password123' and 'admin123')
INSERT INTO users (email, password_hash, first_name, last_name, subscription_status, subscription_plan, subscription_start_date, subscription_end_date, selected_charity_id, charity_contribution_percentage) 
SELECT 
    'demo@golfheart.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9S2', -- password123
    'Demo',
    'User',
    'active',
    'monthly',
    NOW(),
    NOW() + INTERVAL '1 month',
    c.id,
    15
FROM charities c WHERE c.name = 'Children''s Hospital Foundation' LIMIT 1;

INSERT INTO users (email, password_hash, first_name, last_name, subscription_status, subscription_plan, subscription_start_date, subscription_end_date, selected_charity_id, charity_contribution_percentage) 
SELECT 
    'admin@golfheart.com',
    '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- admin123
    'Admin',
    'User',
    'active',
    'yearly',
    NOW(),
    NOW() + INTERVAL '1 year',
    c.id,
    20
FROM charities c WHERE c.name = 'Environmental Conservation Trust' LIMIT 1;

-- Insert sample golf scores for demo user
INSERT INTO golf_scores (user_id, score, score_date)
SELECT 
    u.id,
    score,
    date
FROM users u,
(VALUES 
    (32, CURRENT_DATE - INTERVAL '1 day'),
    (28, CURRENT_DATE - INTERVAL '3 days'),
    (35, CURRENT_DATE - INTERVAL '7 days'),
    (30, CURRENT_DATE - INTERVAL '10 days'),
    (27, CURRENT_DATE - INTERVAL '14 days')
) AS scores(score, date)
WHERE u.email = 'demo@golfheart.com';

-- Insert sample golf scores for admin user
INSERT INTO golf_scores (user_id, score, score_date)
SELECT 
    u.id,
    score,
    date
FROM users u,
(VALUES 
    (38, CURRENT_DATE - INTERVAL '2 days'),
    (42, CURRENT_DATE - INTERVAL '5 days'),
    (35, CURRENT_DATE - INTERVAL '8 days'),
    (40, CURRENT_DATE - INTERVAL '12 days'),
    (37, CURRENT_DATE - INTERVAL '15 days')
) AS scores(score, date)
WHERE u.email = 'admin@golfheart.com';