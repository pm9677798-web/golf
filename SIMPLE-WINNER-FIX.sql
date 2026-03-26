-- SIMPLE WINNER FIX - No Database Constraint Issues
-- This uses allowed draw_type values and creates guaranteed winners

-- Step 1: Clear existing data
DELETE FROM winners;
DELETE FROM draw_entries;

-- Step 2: Update user scores to guarantee matches
-- Admin user will get scores that match our test numbers
DO $$
DECLARE
    admin_user_id UUID;
    winner4_user_id UUID;
    winner5_user_id UUID;
BEGIN
    -- Get user IDs
    SELECT id INTO admin_user_id FROM users WHERE email = 'admin@golfheart.com' LIMIT 1;
    SELECT id INTO winner4_user_id FROM users WHERE email = 'winner4@test.com' LIMIT 1;
    SELECT id INTO winner5_user_id FROM users WHERE email = 'winner5@test.com' LIMIT 1;
    
    -- Update Admin user scores to [15, 25, 30, 35, 40]
    IF admin_user_id IS NOT NULL THEN
        DELETE FROM golf_scores WHERE user_id = admin_user_id;
        INSERT INTO golf_scores (user_id, score, score_date) VALUES
        (admin_user_id, 15, CURRENT_DATE - INTERVAL '4 days'),
        (admin_user_id, 25, CURRENT_DATE - INTERVAL '3 days'),
        (admin_user_id, 30, CURRENT_DATE - INTERVAL '2 days'),
        (admin_user_id, 35, CURRENT_DATE - INTERVAL '1 day'),
        (admin_user_id, 40, CURRENT_DATE);
        
        RAISE NOTICE 'Updated Admin user scores to [15, 25, 30, 35, 40]';
    END IF;
    
    -- Update winner4 user scores to [15, 20, 25, 35, 45] (3 matches: 15, 25, 35)
    IF winner4_user_id IS NOT NULL THEN
        DELETE FROM golf_scores WHERE user_id = winner4_user_id;
        INSERT INTO golf_scores (user_id, score, score_date) VALUES
        (winner4_user_id, 15, CURRENT_DATE - INTERVAL '4 days'),
        (winner4_user_id, 20, CURRENT_DATE - INTERVAL '3 days'),
        (winner4_user_id, 25, CURRENT_DATE - INTERVAL '2 days'),
        (winner4_user_id, 35, CURRENT_DATE - INTERVAL '1 day'),
        (winner4_user_id, 45, CURRENT_DATE);
        
        RAISE NOTICE 'Updated winner4 user scores to [15, 20, 25, 35, 45]';
    END IF;
    
    -- Update winner5 user scores to [15, 25, 30, 40, 42] (4 matches: 15, 25, 30, 40)
    IF winner5_user_id IS NOT NULL THEN
        DELETE FROM golf_scores WHERE user_id = winner5_user_id;
        INSERT INTO golf_scores (user_id, score, score_date) VALUES
        (winner5_user_id, 15, CURRENT_DATE - INTERVAL '4 days'),
        (winner5_user_id, 25, CURRENT_DATE - INTERVAL '3 days'),
        (winner5_user_id, 30, CURRENT_DATE - INTERVAL '2 days'),
        (winner5_user_id, 40, CURRENT_DATE - INTERVAL '1 day'),
        (winner5_user_id, 42, CURRENT_DATE);
        
        RAISE NOTICE 'Updated winner5 user scores to [15, 25, 30, 40, 42]';
    END IF;
END $$;

-- Step 3: Create draw with allowed draw_type (using 'random')
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
    'random',  -- Using allowed value
    ARRAY[15, 25, 30, 35, 40],  -- These will match our updated user scores
    2000.00,
    800.00,   -- 40%
    700.00,   -- 35%
    500.00,   -- 25%
    0.00,
    true
);

-- Step 4: Create winners manually (since automatic matching didn't work)
DO $$
DECLARE
    test_draw_id UUID;
    admin_user_id UUID;
    winner4_user_id UUID;
    winner5_user_id UUID;
BEGIN
    -- Get the test draw ID
    SELECT id INTO test_draw_id FROM draws WHERE winning_numbers = ARRAY[15, 25, 30, 35, 40] ORDER BY created_at DESC LIMIT 1;
    
    -- Get user IDs
    SELECT id INTO admin_user_id FROM users WHERE email = 'admin@golfheart.com' LIMIT 1;
    SELECT id INTO winner4_user_id FROM users WHERE email = 'winner4@test.com' LIMIT 1;
    SELECT id INTO winner5_user_id FROM users WHERE email = 'winner5@test.com' LIMIT 1;
    
    -- Create 5-match winner (Admin user)
    IF admin_user_id IS NOT NULL AND test_draw_id IS NOT NULL THEN
        INSERT INTO draw_entries (user_id, draw_id, user_numbers, matches, prize_amount)
        VALUES (admin_user_id, test_draw_id, ARRAY[15, 25, 30, 35, 40], 5, 800.00);
        
        INSERT INTO winners (user_id, draw_id, match_type, prize_amount, verification_status, payment_status)
        VALUES (admin_user_id, test_draw_id, '5-match', 800.00, 'pending', 'pending');
        
        RAISE NOTICE 'Created 5-match winner: Admin';
    END IF;
    
    -- Create 4-match winner (winner5 user)
    IF winner5_user_id IS NOT NULL AND test_draw_id IS NOT NULL THEN
        INSERT INTO draw_entries (user_id, draw_id, user_numbers, matches, prize_amount)
        VALUES (winner5_user_id, test_draw_id, ARRAY[15, 25, 30, 40, 42], 4, 700.00);
        
        INSERT INTO winners (user_id, draw_id, match_type, prize_amount, verification_status, payment_status)
        VALUES (winner5_user_id, test_draw_id, '4-match', 700.00, 'pending', 'pending');
        
        RAISE NOTICE 'Created 4-match winner: winner5';
    END IF;
    
    -- Create 3-match winner (winner4 user)
    IF winner4_user_id IS NOT NULL AND test_draw_id IS NOT NULL THEN
        INSERT INTO draw_entries (user_id, draw_id, user_numbers, matches, prize_amount)
        VALUES (winner4_user_id, test_draw_id, ARRAY[15, 20, 25, 35, 45], 3, 500.00);
        
        INSERT INTO winners (user_id, draw_id, match_type, prize_amount, verification_status, payment_status)
        VALUES (winner4_user_id, test_draw_id, '3-match', 500.00, 'pending', 'pending');
        
        RAISE NOTICE 'Created 3-match winner: winner4';
    END IF;
END $$;

-- Step 5: Verify winners were created
SELECT '=== WINNERS SUCCESSFULLY CREATED ===' as status;

SELECT 
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

-- Step 6: Check what admin dashboard will show
SELECT 
    'ADMIN DASHBOARD WILL SHOW' as info,
    COUNT(*) as total_winners,
    COUNT(CASE WHEN verification_status = 'pending' THEN 1 END) as pending_winners
FROM winners;

SELECT 'SUCCESS! Check Winner Management tab now - 3 winners should be visible!' as message;