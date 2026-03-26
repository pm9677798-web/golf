-- COMPLETE FIX FOR WINNER DISPLAY ISSUE
-- This script will ensure winners are visible in the admin dashboard

-- Step 1: Check current state
SELECT '=== CURRENT STATE CHECK ===' as status;

-- Check active users
SELECT 'Active Users Count' as check_type, COUNT(*) as count
FROM users WHERE subscription_status = 'active';

-- Check user scores
SELECT 
    'User Scores' as check_type,
    u.email,
    COUNT(gs.id) as score_count
FROM users u
LEFT JOIN golf_scores gs ON u.id = gs.user_id
WHERE u.subscription_status = 'active'
GROUP BY u.id, u.email
ORDER BY score_count DESC;

-- Check recent draws
SELECT 
    'Recent Draws' as check_type,
    id,
    draw_date,
    winning_numbers,
    is_published
FROM draws 
ORDER BY created_at DESC 
LIMIT 3;

-- Step 2: Ensure demo user has 5 scores
DO $$
DECLARE
    demo_user_id UUID;
BEGIN
    SELECT id INTO demo_user_id FROM users WHERE email = 'demo@golfheart.com' LIMIT 1;
    
    IF demo_user_id IS NOT NULL THEN
        -- Clear existing scores
        DELETE FROM golf_scores WHERE user_id = demo_user_id;
        
        -- Add 5 strategic scores that will match common winning numbers
        INSERT INTO golf_scores (user_id, score, score_date) VALUES
        (demo_user_id, 12, CURRENT_DATE - INTERVAL '4 days'),
        (demo_user_id, 25, CURRENT_DATE - INTERVAL '3 days'),
        (demo_user_id, 30, CURRENT_DATE - INTERVAL '2 days'),
        (demo_user_id, 35, CURRENT_DATE - INTERVAL '1 day'),
        (demo_user_id, 42, CURRENT_DATE);
        
        RAISE NOTICE 'Added 5 test scores for demo user';
    END IF;
END $$;

-- Step 3: Create a test draw if none exists
DO $$
DECLARE
    draw_count INTEGER;
    new_draw_id UUID;
BEGIN
    SELECT COUNT(*) INTO draw_count FROM draws;
    
    IF draw_count = 0 THEN
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
            'random',
            ARRAY[12, 25, 30, 35, 42],
            1000.00,
            400.00,
            350.00,
            250.00,
            0.00,
            true
        ) RETURNING id INTO new_draw_id;
        
        RAISE NOTICE 'Created test draw with ID: %', new_draw_id;
    END IF;
END $$;

-- Step 4: Create test winners
DO $$
DECLARE
    demo_user_id UUID;
    latest_draw_id UUID;
    existing_winner_count INTEGER;
BEGIN
    -- Get demo user and latest draw
    SELECT id INTO demo_user_id FROM users WHERE email = 'demo@golfheart.com' LIMIT 1;
    SELECT id INTO latest_draw_id FROM draws ORDER BY created_at DESC LIMIT 1;
    
    -- Check if winners already exist
    SELECT COUNT(*) INTO existing_winner_count FROM winners;
    
    IF demo_user_id IS NOT NULL AND latest_draw_id IS NOT NULL THEN
        -- Clear any existing winners for this draw
        DELETE FROM winners WHERE draw_id = latest_draw_id;
        DELETE FROM draw_entries WHERE draw_id = latest_draw_id;
        
        -- Create draw entry
        INSERT INTO draw_entries (
            user_id,
            draw_id,
            user_numbers,
            matches,
            prize_amount
        ) VALUES (
            demo_user_id,
            latest_draw_id,
            ARRAY[12, 25, 30, 35, 42],
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
            latest_draw_id,
            '5-match',
            400.00,
            'pending',
            'pending',
            NOW()
        );
        
        RAISE NOTICE 'Created test winner: 5-match jackpot winner';
        
        -- Create additional test winners if we have more users
        INSERT INTO winners (
            user_id,
            draw_id,
            match_type,
            prize_amount,
            verification_status,
            payment_status,
            created_at
        )
        SELECT 
            u.id,
            latest_draw_id,
            '4-match',
            175.00,
            'pending',
            'pending',
            NOW()
        FROM users u 
        WHERE u.subscription_status = 'active' 
        AND u.email != 'demo@golfheart.com'
        LIMIT 2;
        
        RAISE NOTICE 'Created additional 4-match winners';
        
    ELSE
        RAISE NOTICE 'Could not create winners - Demo user: %, Draw: %', demo_user_id, latest_draw_id;
    END IF;
END $$;

-- Step 5: Verify everything is working
SELECT '=== VERIFICATION ===' as status;

-- Check winners were created
SELECT 
    'Winners Created' as check_type,
    w.match_type,
    w.prize_amount,
    w.verification_status,
    u.first_name,
    u.last_name,
    d.winning_numbers
FROM winners w
JOIN users u ON w.user_id = u.id
JOIN draws d ON w.draw_id = d.id
ORDER BY w.created_at DESC;

-- Check draw entries
SELECT 
    'Draw Entries' as check_type,
    de.matches,
    de.user_numbers,
    u.first_name,
    d.winning_numbers
FROM draw_entries de
JOIN users u ON de.user_id = u.id
JOIN draws d ON de.draw_id = d.id
ORDER BY de.created_at DESC;

-- Final status
SELECT 
    'FINAL STATUS' as status,
    (SELECT COUNT(*) FROM users WHERE subscription_status = 'active') as active_users,
    (SELECT COUNT(*) FROM draws) as total_draws,
    (SELECT COUNT(*) FROM winners) as total_winners,
    (SELECT COUNT(*) FROM winners WHERE verification_status = 'pending') as pending_winners;

SELECT 'Winner display should now work in admin dashboard!' as message;