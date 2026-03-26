-- ADD SCORES FOR AUTOMATIC WINNER TESTING
-- Run this in Supabase SQL Editor to add scores to your users

-- STEP 1: Check your users
SELECT 
    id,
    first_name,
    email,
    subscription_status
FROM users 
WHERE subscription_status = 'active'
ORDER BY first_name;

-- STEP 2: Check current scores
SELECT 
    u.first_name,
    u.email,
    COUNT(gs.id) as score_count
FROM users u
LEFT JOIN golf_scores gs ON u.id = gs.user_id
WHERE u.subscription_status = 'active'
GROUP BY u.id, u.first_name, u.email
ORDER BY u.first_name;

-- STEP 3: Add strategic scores (replace USER_IDs with actual IDs from Step 1)
-- These scores are designed to create winners when draw numbers are [12, 25, 30, 35, 42]

-- User 1: Perfect 5-match (will win jackpot)
INSERT INTO golf_scores (user_id, score, score_date) VALUES 
('REPLACE_WITH_USER_1_ID', 12, '2024-03-25'),
('REPLACE_WITH_USER_1_ID', 25, '2024-03-24'),
('REPLACE_WITH_USER_1_ID', 30, '2024-03-23'),
('REPLACE_WITH_USER_1_ID', 35, '2024-03-22'),
('REPLACE_WITH_USER_1_ID', 42, '2024-03-21');

-- User 2: 4-match winner
INSERT INTO golf_scores (user_id, score, score_date) VALUES 
('REPLACE_WITH_USER_2_ID', 12, '2024-03-25'),
('REPLACE_WITH_USER_2_ID', 25, '2024-03-24'),
('REPLACE_WITH_USER_2_ID', 30, '2024-03-23'),
('REPLACE_WITH_USER_2_ID', 35, '2024-03-22'),
('REPLACE_WITH_USER_2_ID', 15, '2024-03-21');

-- User 3: 3-match winner
INSERT INTO golf_scores (user_id, score, score_date) VALUES 
('REPLACE_WITH_USER_3_ID', 12, '2024-03-25'),
('REPLACE_WITH_USER_3_ID', 25, '2024-03-24'),
('REPLACE_WITH_USER_3_ID', 30, '2024-03-23'),
('REPLACE_WITH_USER_3_ID', 18, '2024-03-22'),
('REPLACE_WITH_USER_3_ID', 20, '2024-03-21');

-- User 4: No match (no win)
INSERT INTO golf_scores (user_id, score, score_date) VALUES 
('REPLACE_WITH_USER_4_ID', 5, '2024-03-25'),
('REPLACE_WITH_USER_4_ID', 8, '2024-03-24'),
('REPLACE_WITH_USER_4_ID', 15, '2024-03-23'),
('REPLACE_WITH_USER_4_ID', 18, '2024-03-22'),
('REPLACE_WITH_USER_4_ID', 22, '2024-03-21');

-- STEP 4: Verify scores were added
SELECT 
    u.first_name,
    u.email,
    gs.score,
    gs.score_date
FROM users u
JOIN golf_scores gs ON u.id = gs.user_id
WHERE u.subscription_status = 'active'
ORDER BY u.first_name, gs.score_date DESC;