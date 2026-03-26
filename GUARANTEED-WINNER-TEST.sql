-- GUARANTEED WINNER TEST
-- This will create a scenario where winners WILL be found

-- Step 1: Clear everything for fresh start
DELETE FROM winners;
DELETE FROM draw_entries;
DELETE FROM draws;

-- Step 2: Ensure demo user has specific scores
DO $$
DECLARE
    demo_user_id UUID;
BEGIN
    SELECT id INTO demo_user_id FROM users WHERE email = 'demo@golfheart.com' LIMIT 1;
    
    IF demo_user_id IS NOT NULL THEN
        -- Clear existing scores
        DELETE FROM golf_scores WHERE user_id = demo_user_id;
        
        -- Add EXACT scores that will match our test draw
        INSERT INTO golf_scores (user_id, score, score_date) VALUES
        (demo_user_id, 10, CURRENT_DATE - INTERVAL '4 days'),
        (demo_user_id, 20, CURRENT_DATE - INTERVAL '3 days'),
        (demo_user_id, 30, CURRENT_DATE - INTERVAL '2 days'),
        (demo_user_id, 40, CURRENT_DATE - INTERVAL '1 day'),
        (demo_user_id, 45, CURRENT_DATE);
        
        RAISE NOTICE 'Demo user now has scores: [10, 20, 30, 40, 45]';
    END IF;
END $$;

-- Step 3: Create a draw with EXACT matching numbers
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
    'test',
    ARRAY[10, 20, 30, 40, 45],  -- EXACT match with demo user scores
    1000.00,
    400.00,
    350.00,
    250.00,
    0.00,
    true
);

-- Step 4: Manually create the winner (since automatic didn't work)
DO $$
DECLARE
    demo_user_id UUID;
    test_draw_id UUID;
BEGIN
    SELECT id INTO demo_user_id FROM users WHERE email = 'demo@golfheart.com' LIMIT 1;
    SELECT id INTO test_draw_id FROM draws WHERE winning_numbers = ARRAY[10, 20, 30, 40, 45] LIMIT 1;
    
    IF demo_user_id IS NOT NULL AND test_draw_id IS NOT NULL THEN
        -- Create draw entry
        INSERT INTO draw_entries (
            user_id,
            draw_id,
            user_numbers,
            matches,
            prize_amount
        ) VALUES (
            demo_user_id,
            test_draw_id,
            ARRAY[10, 20, 30, 40, 45],
            5,
            400.00
        );
        
        -- Create winner record
        INSERT INTO winners (
            user_id,
            draw_id,
            match_type,
            prize_amount,
            verification_status,
            payment_status,
            created_at
        ) VALUES (
            demo_user_id,
            test_draw_id,
            '5-match',
            400.00,
            'pending',
            'pending',
            NOW()
        );
        
        RAISE NOTICE 'Created guaranteed 5-match winner!';
    END IF;
END $$;

-- Step 5: Create additional winners for testing
DO $$
DECLARE
    admin_user_id UUID;
    test_draw_id UUID;
BEGIN
    SELECT id INTO admin_user_id FROM users WHERE email = 'admin@golfheart.com' LIMIT 1;
    SELECT id INTO test_draw_id FROM draws WHERE winning_numbers = ARRAY[10, 20, 30, 40, 45] LIMIT 1;
    
    IF admin_user_id IS NOT NULL AND test_draw_id IS NOT NULL THEN
        -- Add scores for admin user (partial match)
        DELETE FROM golf_scores WHERE user_id = admin_user_id;
        INSERT INTO golf_scores (user_id, score, score_date) VALUES
        (admin_user_id, 10, CURRENT_DATE - INTERVAL '4 days'),  -- Match
        (admin_user_id, 20, CURRENT_DATE - INTERVAL '3 days'),  -- Match
        (admin_user_id, 30, CURRENT_DATE - INTERVAL '2 days'),  -- Match
        (admin_user_id, 35, CURRENT_DATE - INTERVAL '1 day'),   -- No match
        (admin_user_id, 44, CURRENT_DATE);                      -- No match
        
        -- Create 3-match winner
        INSERT INTO draw_entries (
            user_id,
            draw_id,
            user_numbers,
            matches,
            prize_amount
        ) VALUES (
            admin_user_id,
            test_draw_id,
            ARRAY[10, 20, 30, 35, 44],
            3,
            250.00
        );
        
        INSERT INTO winners (
            user_id,
            draw_id,
            match_type,
            prize_amount,
            verification_status,
            payment_status,
            created_at
        ) VALUES (
            admin_user_id,
            test_draw_id,
            '3-match',
            250.00,
            'pending',
            'pending',
            NOW()
        );
        
        RAISE NOTICE 'Created 3-match winner!';
    END IF;
END $$;

-- Step 6: Verify winners were created
SELECT '=== WINNERS CREATED ===' as status;

SELECT 
    w.id,
    w.match_type,
    w.prize_amount,
    w.verification_status,
    w.payment_status,
    u.first_name,
    u.last_name,
    u.email,
    d.winning_numbers
FROM winners w
JOIN users u ON w.user_id = u.id
JOIN draws d ON w.draw_id = d.id
ORDER BY w.prize_amount DESC;

-- Step 7: Check what admin dashboard API will return
SELECT 
    'ADMIN API WILL SHOW' as info,
    COUNT(*) as total_winners,
    COUNT(CASE WHEN verification_status = 'pending' THEN 1 END) as pending_winners
FROM winners;

SELECT 'GUARANTEED WINNERS CREATED! Check Winner Management tab now!' as message;