-- FULLY AUTOMATIC SYSTEM SETUP
-- This creates a realistic scenario where the system works automatically
-- No manual intervention needed - just like a real production system

-- Step 1: Create realistic users with varied golf scores
DO $$
DECLARE
    user_emails TEXT[] := ARRAY[
        'john.smith@gmail.com',
        'sarah.jones@yahoo.com', 
        'mike.wilson@hotmail.com',
        'lisa.brown@gmail.com',
        'david.taylor@outlook.com',
        'emma.davis@gmail.com',
        'james.miller@yahoo.com',
        'anna.garcia@hotmail.com'
    ];
    user_names TEXT[][] := ARRAY[
        ARRAY['John', 'Smith'],
        ARRAY['Sarah', 'Jones'],
        ARRAY['Mike', 'Wilson'], 
        ARRAY['Lisa', 'Brown'],
        ARRAY['David', 'Taylor'],
        ARRAY['Emma', 'Davis'],
        ARRAY['James', 'Miller'],
        ARRAY['Anna', 'Garcia']
    ];
    new_user_id UUID;
    i INTEGER;
    score_ranges INTEGER[][] := ARRAY[
        ARRAY[10, 15, 20, 25, 30],  -- Good golfer
        ARRAY[15, 20, 25, 30, 35],  -- Average golfer
        ARRAY[20, 25, 30, 35, 40],  -- Average golfer
        ARRAY[12, 18, 24, 32, 38],  -- Mixed scores
        ARRAY[8, 16, 22, 28, 36],   -- Good to average
        ARRAY[14, 21, 27, 33, 41],  -- Average to poor
        ARRAY[11, 19, 26, 34, 42],  -- Mixed range
        ARRAY[13, 17, 23, 29, 37]   -- Consistent average
    ];
BEGIN
    -- Create realistic users
    FOR i IN 1..array_length(user_emails, 1) LOOP
        -- Check if user already exists
        IF NOT EXISTS (SELECT 1 FROM users WHERE email = user_emails[i]) THEN
            INSERT INTO users (
                email, 
                first_name, 
                last_name, 
                password_hash,
                subscription_status, 
                subscription_plan,
                subscription_start_date, 
                subscription_end_date,
                selected_charity_id
            ) VALUES (
                user_emails[i],
                user_names[i][1],
                user_names[i][2], 
                '$2b$10$dummy.hash.for.testing.purposes.only',
                'active',
                CASE WHEN i % 2 = 0 THEN 'yearly' ELSE 'monthly' END,
                CURRENT_DATE - INTERVAL '30 days',
                CASE WHEN i % 2 = 0 THEN CURRENT_DATE + INTERVAL '335 days' ELSE CURRENT_DATE + INTERVAL '30 days' END,
                (SELECT id FROM charities LIMIT 1)
            ) RETURNING id INTO new_user_id;
            
            -- Add realistic golf scores for each user
            INSERT INTO golf_scores (user_id, score, score_date) VALUES
            (new_user_id, score_ranges[i][1], CURRENT_DATE - INTERVAL '4 days'),
            (new_user_id, score_ranges[i][2], CURRENT_DATE - INTERVAL '3 days'),
            (new_user_id, score_ranges[i][3], CURRENT_DATE - INTERVAL '2 days'),
            (new_user_id, score_ranges[i][4], CURRENT_DATE - INTERVAL '1 day'),
            (new_user_id, score_ranges[i][5], CURRENT_DATE);
            
            RAISE NOTICE 'Created user: % % with scores %', user_names[i][1], user_names[i][2], score_ranges[i];
        END IF;
    END LOOP;
END $$;

-- Step 2: Ensure demo and admin users also have realistic scores
DO $$
DECLARE
    demo_user_id UUID;
    admin_user_id UUID;
BEGIN
    -- Update demo user with realistic scores
    SELECT id INTO demo_user_id FROM users WHERE email = 'demo@golfheart.com' LIMIT 1;
    IF demo_user_id IS NOT NULL THEN
        DELETE FROM golf_scores WHERE user_id = demo_user_id;
        INSERT INTO golf_scores (user_id, score, score_date) VALUES
        (demo_user_id, 16, CURRENT_DATE - INTERVAL '4 days'),
        (demo_user_id, 22, CURRENT_DATE - INTERVAL '3 days'),
        (demo_user_id, 28, CURRENT_DATE - INTERVAL '2 days'),
        (demo_user_id, 34, CURRENT_DATE - INTERVAL '1 day'),
        (demo_user_id, 40, CURRENT_DATE);
        
        RAISE NOTICE 'Updated demo user with realistic scores: [16, 22, 28, 34, 40]';
    END IF;
    
    -- Update admin user with realistic scores
    SELECT id INTO admin_user_id FROM users WHERE email = 'admin@golfheart.com' LIMIT 1;
    IF admin_user_id IS NOT NULL THEN
        DELETE FROM golf_scores WHERE user_id = admin_user_id;
        INSERT INTO golf_scores (user_id, score, score_date) VALUES
        (admin_user_id, 14, CURRENT_DATE - INTERVAL '4 days'),
        (admin_user_id, 20, CURRENT_DATE - INTERVAL '3 days'),
        (admin_user_id, 26, CURRENT_DATE - INTERVAL '2 days'),
        (admin_user_id, 32, CURRENT_DATE - INTERVAL '1 day'),
        (admin_user_id, 38, CURRENT_DATE);
        
        RAISE NOTICE 'Updated admin user with realistic scores: [14, 20, 26, 32, 38]';
    END IF;
END $$;

-- Step 3: Clear any existing draws and winners for fresh start
DELETE FROM winners;
DELETE FROM draw_entries;
DELETE FROM draws;

-- Step 4: Show the realistic user base
SELECT '=== REALISTIC USER BASE CREATED ===' as status;

SELECT 
    u.first_name,
    u.last_name,
    u.email,
    u.subscription_plan,
    u.subscription_status,
    ARRAY_AGG(gs.score ORDER BY gs.score_date DESC) as golf_scores
FROM users u
JOIN golf_scores gs ON u.id = gs.user_id
WHERE u.subscription_status = 'active'
GROUP BY u.id, u.first_name, u.last_name, u.email, u.subscription_plan, u.subscription_status
ORDER BY u.first_name;

-- Step 5: Calculate what the automatic system will do
SELECT 
    'AUTOMATIC SYSTEM READY' as status,
    COUNT(DISTINCT u.id) as total_active_users,
    COUNT(DISTINCT u.id) as users_with_5_scores,
    SUM(CASE WHEN u.subscription_plan = 'monthly' THEN 29.99 ELSE 299.99/12 END) * 0.6 as estimated_prize_pool
FROM users u
JOIN golf_scores gs ON u.id = gs.user_id
WHERE u.subscription_status = 'active'
HAVING COUNT(gs.id) >= 5;

SELECT 'SYSTEM IS NOW FULLY AUTOMATIC!' as message;
SELECT 'Admin can now click "Run Random Draw" and the system will:' as instruction_1;
SELECT '1. Generate 5 random numbers (1-45)' as instruction_2;
SELECT '2. Check all users automatically' as instruction_3;  
SELECT '3. Find matches automatically' as instruction_4;
SELECT '4. Create winners automatically' as instruction_5;
SELECT '5. Display results automatically' as instruction_6;
SELECT 'NO MANUAL WORK NEEDED!' as final_message;