-- CREATE MANUAL WINNER FOR TESTING
-- This will create a test winner to verify the winner display works

DO $$
DECLARE
    demo_user_id UUID;
    latest_draw_id UUID;
BEGIN
    -- Get demo user ID
    SELECT id INTO demo_user_id FROM users WHERE email = 'demo@golfheart.com' LIMIT 1;
    
    -- Get the latest draw ID
    SELECT id INTO latest_draw_id FROM draws ORDER BY created_at DESC LIMIT 1;
    
    -- Check if we have both user and draw
    IF demo_user_id IS NOT NULL AND latest_draw_id IS NOT NULL THEN
        -- Delete any existing winner record for this user/draw
        DELETE FROM winners WHERE user_id = demo_user_id AND draw_id = latest_draw_id;
        
        -- Create a test winner
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
            '4-match',
            250.00,
            'pending',
            'pending',
            NOW()
        );
        
        RAISE NOTICE 'Created test winner for demo user in latest draw';
        
        -- Also create a draw entry
        DELETE FROM draw_entries WHERE user_id = demo_user_id AND draw_id = latest_draw_id;
        
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
            4,
            250.00
        );
        
        RAISE NOTICE 'Created test draw entry for demo user';
        
    ELSE
        RAISE NOTICE 'Could not find demo user or latest draw. User ID: %, Draw ID: %', demo_user_id, latest_draw_id;
    END IF;
END $$;

-- Verify the winner was created
SELECT 
    w.id,
    w.match_type,
    w.prize_amount,
    w.verification_status,
    w.payment_status,
    u.first_name,
    u.last_name,
    u.email,
    d.winning_numbers,
    d.draw_date
FROM winners w
JOIN users u ON w.user_id = u.id
JOIN draws d ON w.draw_id = d.id
ORDER BY w.created_at DESC
LIMIT 5;