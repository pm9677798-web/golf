-- CREATE TEST WINNERS SCRIPT
-- This script creates strategic scores for your 5 test accounts to create winners

-- First, let's see your current users
-- SELECT id, email, first_name FROM users WHERE subscription_status = 'active';

-- STEP 1: Create strategic scores for Test Draw [12, 25, 30, 35, 42]

-- User 1: Perfect 5-match (Jackpot Winner)
-- Replace 'USER1_ID_HERE' with actual user ID from your database
INSERT INTO golf_scores (user_id, score, score_date) VALUES 
('USER1_ID_HERE', 12, '2024-03-25'),
('USER1_ID_HERE', 25, '2024-03-24'),
('USER1_ID_HERE', 30, '2024-03-23'),
('USER1_ID_HERE', 35, '2024-03-22'),
('USER1_ID_HERE', 42, '2024-03-21');

-- User 2: 4-match winner (Tier 2)
-- Replace 'USER2_ID_HERE' with actual user ID
INSERT INTO golf_scores (user_id, score, score_date) VALUES 
('USER2_ID_HERE', 12, '2024-03-25'),
('USER2_ID_HERE', 25, '2024-03-24'),
('USER2_ID_HERE', 30, '2024-03-23'),
('USER2_ID_HERE', 35, '2024-03-22'),
('USER2_ID_HERE', 15, '2024-03-21');  -- Different number

-- User 3: 3-match winner (Tier 3)
-- Replace 'USER3_ID_HERE' with actual user ID
INSERT INTO golf_scores (user_id, score, score_date) VALUES 
('USER3_ID_HERE', 12, '2024-03-25'),
('USER3_ID_HERE', 25, '2024-03-24'),
('USER3_ID_HERE', 30, '2024-03-23'),
('USER3_ID_HERE', 18, '2024-03-22'),  -- Different number
('USER3_ID_HERE', 20, '2024-03-21');  -- Different number

-- User 4: No match (No win)
-- Replace 'USER4_ID_HERE' with actual user ID
INSERT INTO golf_scores (user_id, score, score_date) VALUES 
('USER4_ID_HERE', 5, '2024-03-25'),
('USER4_ID_HERE', 8, '2024-03-24'),
('USER4_ID_HERE', 15, '2024-03-23'),
('USER4_ID_HERE', 18, '2024-03-22'),
('USER4_ID_HERE', 22, '2024-03-21');

-- User 5: 3-match winner (Another Tier 3)
-- Replace 'USER5_ID_HERE' with actual user ID
INSERT INTO golf_scores (user_id, score, score_date) VALUES 
('USER5_ID_HERE', 42, '2024-03-25'),
('USER5_ID_HERE', 35, '2024-03-24'),
('USER5_ID_HERE', 12, '2024-03-23'),
('USER5_ID_HERE', 28, '2024-03-22'),  -- Different number
('USER5_ID_HERE', 33, '2024-03-21');  -- Different number

-- STEP 2: Check your users and their IDs
-- Run this query first to get actual user IDs:
/*
SELECT 
    id,
    email,
    first_name,
    last_name,
    subscription_status
FROM users 
WHERE subscription_status = 'active'
ORDER BY created_at;
*/

-- STEP 3: After adding scores, run Test Draw
-- 1. Login as admin
-- 2. Click "Test Draw" button
-- 3. Enter: 12,25,30,35,42
-- 4. Check Winner Management tab

-- EXPECTED RESULTS:
-- User 1: 5-match winner (~$500-1000 jackpot)
-- User 2: 4-match winner (~$200-400)
-- User 3: 3-match winner (~$50-100)
-- User 4: No win
-- User 5: 3-match winner (~$50-100)

-- STEP 4: Verify winners in database
/*
SELECT 
    w.*,
    u.first_name,
    u.email,
    d.winning_numbers
FROM winners w
JOIN users u ON w.user_id = u.id
JOIN draws d ON w.draw_id = d.id
ORDER BY w.created_at DESC;
*/