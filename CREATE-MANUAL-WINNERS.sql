-- MANUAL WINNER CREATION SCRIPT
-- Use this to create test winners for your 7 users

-- STEP 1: Get your latest draw ID and winning numbers
SELECT 
    id as draw_id,
    winning_numbers,
    total_prize_pool,
    five_match_pool,
    four_match_pool,
    three_match_pool
FROM draws 
ORDER BY created_at DESC 
LIMIT 1;

-- STEP 2: Get your active user IDs
SELECT 
    id as user_id,
    first_name,
    email
FROM users 
WHERE subscription_status = 'active'
ORDER BY first_name;

-- STEP 3: Add strategic scores for testing
-- Replace USER_ID_1, USER_ID_2, etc. with actual IDs from Step 2
-- Replace WINNING_NUMBERS with actual numbers from Step 1

-- Example: If winning numbers are [5, 12, 23, 34, 41]

-- User 1: Perfect 5-match (Jackpot Winner)
INSERT INTO golf_scores (user_id, score, score_date) VALUES 
('USER_ID_1', 5, '2024-03-25'),
('USER_ID_1', 12, '2024-03-24'),
('USER_ID_1', 23, '2024-03-23'),
('USER_ID_1', 34, '2024-03-22'),
('USER_ID_1', 41, '2024-03-21');

-- User 2: 4-match winner
INSERT INTO golf_scores (user_id, score, score_date) VALUES 
('USER_ID_2', 5, '2024-03-25'),
('USER_ID_2', 12, '2024-03-24'),
('USER_ID_2', 23, '2024-03-23'),
('USER_ID_2', 34, '2024-03-22'),
('USER_ID_2', 15, '2024-03-21');  -- Different number

-- User 3: 3-match winner
INSERT INTO golf_scores (user_id, score, score_date) VALUES 
('USER_ID_3', 5, '2024-03-25'),
('USER_ID_3', 12, '2024-03-24'),
('USER_ID_3', 23, '2024-03-23'),
('USER_ID_3', 18, '2024-03-22'),  -- Different number
('USER_ID_3', 20, '2024-03-21');  -- Different number

-- STEP 4: Create winners manually
-- Replace DRAW_ID with ID from Step 1
-- Replace USER_IDs with actual IDs from Step 2

-- 5-match winner (User 1) - Gets 40% of prize pool
INSERT INTO winners (user_id, draw_id, match_type, prize_amount, verification_status, payment_status)
VALUES ('USER_ID_1', 'DRAW_ID', '5-match', 400.00, 'pending', 'pending');

-- 4-match winner (User 2) - Gets 35% of prize pool
INSERT INTO winners (user_id, draw_id, match_type, prize_amount, verification_status, payment_status)
VALUES ('USER_ID_2', 'DRAW_ID', '4-match', 350.00, 'pending', 'pending');

-- 3-match winner (User 3) - Gets 25% of prize pool
INSERT INTO winners (user_id, draw_id, match_type, prize_amount, verification_status, payment_status)
VALUES ('USER_ID_3', 'DRAW_ID', '3-match', 250.00, 'pending', 'pending');

-- STEP 5: Verify winners were created
SELECT 
    w.id,
    w.match_type,
    w.prize_amount,
    w.verification_status,
    u.first_name,
    u.email,
    d.winning_numbers
FROM winners w
JOIN users u ON w.user_id = u.id
JOIN draws d ON w.draw_id = d.id
ORDER BY w.prize_amount DESC;