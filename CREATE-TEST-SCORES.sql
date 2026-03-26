-- CREATE TEST SCORES FOR WINNER TESTING
-- This will add 5 scores for each active user so they can participate in draws

-- First, let's see which users need scores
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.email,
    COUNT(gs.id) as current_scores
FROM users u
LEFT JOIN golf_scores gs ON u.id = gs.user_id
WHERE u.subscription_status = 'active'
GROUP BY u.id, u.first_name, u.last_name, u.email
HAVING COUNT(gs.id) < 5;

-- Add 5 test scores for demo user (replace with actual user ID)
-- Get the demo user ID first
DO $$
DECLARE
    demo_user_id UUID;
    admin_user_id UUID;
BEGIN
    -- Get demo user ID
    SELECT id INTO demo_user_id FROM users WHERE email = 'demo@golfheart.com' LIMIT 1;
    
    -- Get admin user ID (in case admin wants to test)
    SELECT id INTO admin_user_id FROM users WHERE email = 'admin@golfheart.com' LIMIT 1;
    
    -- Add scores for demo user if exists
    IF demo_user_id IS NOT NULL THEN
        -- Delete existing scores first
        DELETE FROM golf_scores WHERE user_id = demo_user_id;
        
        -- Add 5 test scores with some matches to winning numbers
        INSERT INTO golf_scores (user_id, score, score_date) VALUES
        (demo_user_id, 12, CURRENT_DATE - INTERVAL '4 days'),
        (demo_user_id, 25, CURRENT_DATE - INTERVAL '3 days'),
        (demo_user_id, 30, CURRENT_DATE - INTERVAL '2 days'),
        (demo_user_id, 35, CURRENT_DATE - INTERVAL '1 day'),
        (demo_user_id, 42, CURRENT_DATE);
        
        RAISE NOTICE 'Added 5 test scores for demo user: %', demo_user_id;
    END IF;
    
    -- Add scores for admin user if exists (for testing)
    IF admin_user_id IS NOT NULL THEN
        -- Delete existing scores first
        DELETE FROM golf_scores WHERE user_id = admin_user_id;
        
        -- Add 5 test scores
        INSERT INTO golf_scores (user_id, score, score_date) VALUES
        (admin_user_id, 15, CURRENT_DATE - INTERVAL '4 days'),
        (admin_user_id, 28, CURRENT_DATE - INTERVAL '3 days'),
        (admin_user_id, 33, CURRENT_DATE - INTERVAL '2 days'),
        (admin_user_id, 38, CURRENT_DATE - INTERVAL '1 day'),
        (admin_user_id, 44, CURRENT_DATE);
        
        RAISE NOTICE 'Added 5 test scores for admin user: %', admin_user_id;
    END IF;
END $$;

-- Add scores for any other active users
DO $$
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN 
        SELECT u.id, u.first_name, u.email
        FROM users u
        LEFT JOIN golf_scores gs ON u.id = gs.user_id
        WHERE u.subscription_status = 'active' 
        AND u.email NOT IN ('demo@golfheart.com', 'admin@golfheart.com')
        GROUP BY u.id, u.first_name, u.email
        HAVING COUNT(gs.id) < 5
    LOOP
        -- Delete existing scores
        DELETE FROM golf_scores WHERE user_id = user_record.id;
        
        -- Add 5 random test scores
        INSERT INTO golf_scores (user_id, score, score_date) VALUES
        (user_record.id, (RANDOM() * 44 + 1)::INTEGER, CURRENT_DATE - INTERVAL '4 days'),
        (user_record.id, (RANDOM() * 44 + 1)::INTEGER, CURRENT_DATE - INTERVAL '3 days'),
        (user_record.id, (RANDOM() * 44 + 1)::INTEGER, CURRENT_DATE - INTERVAL '2 days'),
        (user_record.id, (RANDOM() * 44 + 1)::INTEGER, CURRENT_DATE - INTERVAL '1 day'),
        (user_record.id, (RANDOM() * 44 + 1)::INTEGER, CURRENT_DATE);
        
        RAISE NOTICE 'Added 5 test scores for user: % (%)', user_record.first_name, user_record.email;
    END LOOP;
END $$;

-- Verify scores were added
SELECT 
    u.first_name,
    u.last_name,
    u.email,
    COUNT(gs.id) as score_count,
    ARRAY_AGG(gs.score ORDER BY gs.score_date DESC) as latest_scores
FROM users u
LEFT JOIN golf_scores gs ON u.id = gs.user_id
WHERE u.subscription_status = 'active'
GROUP BY u.id, u.first_name, u.last_name, u.email
ORDER BY score_count DESC;