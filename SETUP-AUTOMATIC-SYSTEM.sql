-- SETUP AUTOMATIC WINNER SYSTEM
-- This creates real users with real scores for automatic matching

-- Step 1: Add real golf scores for existing users
DO $$
DECLARE
    demo_user_id UUID;
    admin_user_id UUID;
BEGIN
    -- Get user IDs
    SELECT id INTO demo_user_id FROM users WHERE email = 'demo@golfheart.com' LIMIT 1;
    SELECT id INTO admin_user_id FROM users WHERE email = 'admin@golfheart.com' LIMIT 1;
    
    -- Clear existing scores
    DELETE FROM golf_scores WHERE user_id IN (demo_user_id, admin_user_id);
    
    -- Add realistic golf scores for demo user (some will match draws)
    IF demo_user_id IS NOT NULL THEN
        INSERT INTO golf_scores (user_id, score, score_date) VALUES
        (demo_user_id, 15, CURRENT_DATE - INTERVAL '4 days'),  -- Good score
        (demo_user_id, 22, CURRENT_DATE - INTERVAL '3 days'),  -- Average score
        (demo_user_id, 28, CURRENT_DATE - INTERVAL '2 days'),  -- Good score
        (demo_user_id, 35, CURRENT_DATE - INTERVAL '1 day'),   -- Average score
        (demo_user_id, 42, CURRENT_DATE);                      -- Poor score
        
        RAISE NOTICE 'Added realistic scores for demo user: [15, 22, 28, 35, 42]';
    END IF;
    
    -- Add different scores for admin user
    IF admin_user_id IS NOT NULL THEN
        INSERT INTO golf_scores (user_id, score, score_date) VALUES
        (admin_user_id, 18, CURRENT_DATE - INTERVAL '4 days'),
        (admin_user_id, 25, CURRENT_DATE - INTERVAL '3 days'),
        (admin_user_id, 31, CURRENT_DATE - INTERVAL '2 days'),
        (admin_user_id, 38, CURRENT_DATE - INTERVAL '1 day'),
        (admin_user_id, 44, CURRENT_DATE);
        
        RAISE NOTICE 'Added realistic scores for admin user: [18, 25, 31, 38, 44]';
    END IF;
END $$;

-- Step 2: Create additional test users with scores (if needed)
DO $$
DECLARE
    user_count INTEGER;
    new_user_id UUID;
BEGIN
    SELECT COUNT(*) INTO user_count FROM users WHERE subscription_status = 'active';
    
    -- Create more users if we have less than 5
    IF user_count < 5 THEN
        -- Create User 1
        INSERT INTO users (
            email, first_name, last_name, password_hash,
            subscription_status, subscription_plan,
            subscription_start_date, subscription_end_date
        ) VALUES (
            'user1@golfheart.com', 'John', 'Smith', 'temp_hash',
            'active', 'monthly',
            CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days'
        ) RETURNING id INTO new_user_id;
        
        -- Add scores for User 1
        INSERT INTO golf_scores (user_id, score, score_date) VALUES
        (new_user_id, 12, CURRENT_DATE - INTERVAL '4 days'),
        (new_user_id, 20, CURRENT_DATE - INTERVAL '3 days'),
        (new_user_id, 27, CURRENT_DATE - INTERVAL '2 days'),
        (new_user_id, 33, CURRENT_DATE - INTERVAL '1 day'),
        (new_user_id, 41, CURRENT_DATE);
        
        -- Create User 2
        INSERT INTO users (
            email, first_name, last_name, password_hash,
            subscription_status, subscription_plan,
            subscription_start_date, subscription_end_date
        ) VALUES (
            'user2@golfheart.com', 'Sarah', 'Johnson', 'temp_hash',
            'active', 'yearly',
            CURRENT_DATE, CURRENT_DATE + INTERVAL '365 days'
        ) RETURNING id INTO new_user_id;
        
        -- Add scores for User 2
        INSERT INTO golf_scores (user_id, score, score_date) VALUES
        (new_user_id, 14, CURRENT_DATE - INTERVAL '4 days'),
        (new_user_id, 23, CURRENT_DATE - INTERVAL '3 days'),
        (new_user_id, 29, CURRENT_DATE - INTERVAL '2 days'),
        (new_user_id, 36, CURRENT_DATE - INTERVAL '1 day'),
        (new_user_id, 43, CURRENT_DATE);
        
        -- Create User 3
        INSERT INTO users (
            email, first_name, last_name, password_hash,
            subscription_status, subscription_plan,
            subscription_start_date, subscription_end_date
        ) VALUES (
            'user3@golfheart.com', 'Mike', 'Wilson', 'temp_hash',
            'active', 'monthly',
            CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days'
        ) RETURNING id INTO new_user_id;
        
        -- Add scores for User 3 (will have some matches)
        INSERT INTO golf_scores (user_id, score, score_date) VALUES
        (new_user_id, 15, CURRENT_DATE - INTERVAL '4 days'),
        (new_user_id, 25, CURRENT_DATE - INTERVAL '3 days'),  -- Will match
        (new_user_id, 30, CURRENT_DATE - INTERVAL '2 days'),
        (new_user_id, 35, CURRENT_DATE - INTERVAL '1 day'),   -- Will match
        (new_user_id, 40, CURRENT_DATE);
        
        RAISE NOTICE 'Created 3 additional test users with realistic scores';
    END IF;
END $$;

-- Step 3: Clear any existing draws and winners (fresh start)
DELETE FROM winners;
DELETE FROM draw_entries;
DELETE FROM draws;

-- Step 4: Show current setup
SELECT '=== AUTOMATIC SYSTEM READY ===' as status;

SELECT 
    'USERS WITH SCORES' as info,
    u.first_name,
    u.last_name,
    u.email,
    u.subscription_status,
    ARRAY_AGG(gs.score ORDER BY gs.score_date DESC) as scores
FROM users u
JOIN golf_scores gs ON u.id = gs.user_id
WHERE u.subscription_status = 'active'
GROUP BY u.id, u.first_name, u.last_name, u.email, u.subscription_status
ORDER BY u.first_name;

SELECT 'SYSTEM READY FOR AUTOMATIC DRAW!' as message;
SELECT 'Now admin can click "Run Random Draw" and winners will be created automatically!' as instruction;