-- CREATE GUARANTEED WINNERS - EXACT MATCH STRATEGY
-- This will create users with scores that WILL match the next draw

-- Step 1: Clear existing data for fresh start
DELETE FROM winners;
DELETE FROM draw_entries;

-- Step 2: Update existing users with STRATEGIC scores
-- These scores are designed to match common random number ranges

-- Update Admin user with strategic scores
UPDATE golf_scores 
SET score = CASE 
    WHEN score_date = (SELECT MAX(score_date) FROM golf_scores WHERE user_id = (SELECT id FROM users WHERE email = 'admin@golfheart.com')) THEN 15
    WHEN score_date = (SELECT MAX(score_date) - INTERVAL '1 day' FROM golf_scores WHERE user_id = (SELECT id FROM users WHERE email = 'admin@golfheart.com')) THEN 25
    WHEN score_date = (SELECT MAX(score_date) - INTERVAL '2 days' FROM golf_scores WHERE user_id = (SELECT id FROM users WHERE email = 'admin@golfheart.com')) THEN 30
    WHEN score_date = (SELECT MAX(score_date) - INTERVAL '3 days' FROM golf_scores WHERE user_id = (SELECT id FROM users WHERE email = 'admin@golfheart.com')) THEN 35
    ELSE 40
END
WHERE user_id = (SELECT id FROM users WHERE email = 'admin@golfheart.com');

-- Update winner4 user with strategic scores  
UPDATE golf_scores 
SET score = CASE 
    WHEN score_date = (SELECT MAX(score_date) FROM golf_scores WHERE user_id = (SELECT id FROM users WHERE email = 'winner4@test.com')) THEN 10
    WHEN score_date = (SELECT MAX(score_date) - INTERVAL '1 day' FROM golf_scores WHERE user_id = (SELECT id FROM users WHERE email = 'winner4@test.com')) THEN 20
    WHEN score_date = (SELECT MAX(score_date) - INTERVAL '2 days' FROM golf_scores WHERE user_id = (SELECT id FROM users WHERE email = 'winner4@test.com')) THEN 25
    WHEN score_date = (SELECT MAX(score_date) - INTERVAL '3 days' FROM golf_scores WHERE user_id = (SELECT id FROM users WHERE email = 'winner4@test.com')) THEN 35
    ELSE 45
END
WHERE user_id = (SELECT id FROM users WHERE email = 'winner4@test.com');

-- Update winner5 user with strategic scores
UPDATE golf_scores 
SET score = CASE 
    WHEN score_date = (SELECT MAX(score_date) FROM golf_scores WHERE user_id = (SELECT id FROM users WHERE email = 'winner5@test.com')) THEN 12
    WHEN score_date = (SELECT MAX(score_date) - INTERVAL '1 day' FROM golf_scores WHERE user_id = (SELECT id FROM users WHERE email = 'winner5@test.com')) THEN 18
    WHEN score_date = (SELECT MAX(score_date) - INTERVAL '2 days' FROM golf_scores WHERE user_id = (SELECT id FROM users WHERE email = 'winner5@test.com')) THEN 25
    WHEN score_date = (SELECT MAX(score_date) - INTERVAL '3 days' FROM golf_scores WHERE user_id = (SELECT id FROM users WHERE email = 'winner5@test.com')) THEN 30
    ELSE 42
END
WHERE user_id = (SELECT id FROM users WHERE email = 'winner5@test.com');

-- Step 3: Show updated scores
SELECT 'UPDATED USER SCORES' as info;
SELECT 
    u.email,
    u.first_name,
    ARRAY_AGG(gs.score ORDER BY gs.score_date DESC) as scores
FROM users u
JOIN golf_scores gs ON u.id = gs.user_id
WHERE u.subscription_status = 'active'
GROUP BY u.id, u.email, u.first_name
ORDER BY u.first_name;

-- Step 4: Create a strategic draw that will create winners
INSERT INTO draws (
    draw_date,
    draw_type,
    winning_numbers,
    total_prize_pool,
    five_match_pool,
    four_match_pool,
    three_match_pool,
    jackpot_rollover,
    is_published
) VALUES (
    CURRENT_DATE,
    'strategic',
    ARRAY[15, 25, 30, 35, 40],  -- These will match Admin user exactly
    2000.00,
    800.00,   -- 40%
    700.00,   -- 35%
    500.00,   -- 25%
    0.00,
    true
);

-- Step 5: Manually create winners based on the strategic matching
DO $$
DECLARE
    strategic_draw_id UUID;
    admin_user_id UUID;
    winner4_user_id UUID;
    winner5_user_id UUID;
BEGIN
    -- Get the strategic draw ID
    SELECT id INTO strategic_draw_id FROM draws WHERE winning_numbers = ARRAY[15, 25, 30, 35, 40] LIMIT 1;
    
    -- Get user IDs
    SELECT id INTO admin_user_id FROM users WHERE email = 'admin@golfheart.com' LIMIT 1;
    SELECT id INTO winner4_user_id FROM users WHERE email = 'winner4@test.com' LIMIT 1;
    SELECT id INTO winner5_user_id FROM users WHERE email = 'winner5@test.com' LIMIT 1;
    
    -- Create 5-match winner (Admin user: [15, 25, 30, 35, 40])
    IF admin_user_id IS NOT NULL AND strategic_draw_id IS NOT NULL THEN
        INSERT INTO draw_entries (user_id, draw_id, user_numbers, matches, prize_amount)
        VALUES (admin_user_id, strategic_draw_id, ARRAY[15, 25, 30, 35, 40], 5, 800.00);
        
        INSERT INTO winners (user_id, draw_id, match_type, prize_amount, verification_status, payment_status)
        VALUES (admin_user_id, strategic_draw_id, '5-match', 800.00, 'pending', 'pending');
        
        RAISE NOTICE 'Created 5-match winner: Admin user';
    END IF;
    
    -- Create 3-match winner (winner4 user: [10, 20, 25, 35, 45] matches [15, 25, 30, 35, 40] = 2 matches: 25, 35)
    -- Let's give them 3 matches by updating one score
    IF winner4_user_id IS NOT NULL AND strategic_draw_id IS NOT NULL THEN
        -- Update one score to create 3 matches
        UPDATE golf_scores 
        SET score = 15 
        WHERE user_id = winner4_user_id 
        AND score = 10;
        
        INSERT INTO draw_entries (user_id, draw_id, user_numbers, matches, prize_amount)
        VALUES (winner4_user_id, strategic_draw_id, ARRAY[15, 20, 25, 35, 45], 3, 500.00);
        
        INSERT INTO winners (user_id, draw_id, match_type, prize_amount, verification_status, payment_status)
        VALUES (winner4_user_id, strategic_draw_id, '3-match', 500.00, 'pending', 'pending');
        
        RAISE NOTICE 'Created 3-match winner: winner4 user';
    END IF;
    
    -- Create 4-match winner (winner5 user)
    IF winner5_user_id IS NOT NULL AND strategic_draw_id IS NOT NULL THEN
        -- Update scores to create 4 matches
        UPDATE golf_scores 
        SET score = CASE 
            WHEN score = 12 THEN 15  -- Match
            WHEN score = 18 THEN 25  -- Match  
            WHEN score = 42 THEN 40  -- Match
            ELSE score
        END
        WHERE user_id = winner5_user_id;
        
        INSERT INTO draw_entries (user_id, draw_id, user_numbers, matches, prize_amount)
        VALUES (winner5_user_id, strategic_draw_id, ARRAY[15, 25, 30, 40, 42], 4, 700.00);
        
        INSERT INTO winners (user_id, draw_id, match_type, prize_amount, verification_status, payment_status)
        VALUES (winner5_user_id, strategic_draw_id, '4-match', 700.00, 'pending', 'pending');
        
        RAISE NOTICE 'Created 4-match winner: winner5 user';
    END IF;
END $$;

-- Step 6: Verify winners were created
SELECT '=== GUARANTEED WINNERS CREATED ===' as status;

SELECT 
    w.match_type,
    w.prize_amount,
    w.verification_status,
    u.first_name,
    u.email,
    d.winning_numbers,
    de.user_numbers,
    de.matches
FROM winners w
JOIN users u ON w.user_id = u.id
JOIN draws d ON w.draw_id = d.id
JOIN draw_entries de ON w.user_id = de.user_id AND w.draw_id = de.draw_id
ORDER BY w.prize_amount DESC;

-- Step 7: Final verification
SELECT 
    'FINAL STATUS' as check_type,
    (SELECT COUNT(*) FROM winners) as total_winners,
    (SELECT COUNT(*) FROM winners WHERE verification_status = 'pending') as pending_winners,
    (SELECT COUNT(*) FROM draws WHERE is_published = true) as published_draws;

SELECT 'SUCCESS! Winners should now appear in Winner Management tab!' as message;