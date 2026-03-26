-- CREATE TEST WINNER IMMEDIATELY
-- Run this in Supabase SQL Editor to create a test winner right now

-- Step 1: Get your latest draw ID
SELECT 
    id as draw_id,
    winning_numbers,
    total_prize_pool
FROM draws 
ORDER BY created_at DESC 
LIMIT 1;

-- Step 2: Get any active user ID
SELECT 
    id as user_id,
    first_name,
    email
FROM users 
WHERE subscription_status = 'active'
LIMIT 1;

-- Step 3: Create a test winner (replace IDs with actual values from above)
INSERT INTO winners (
    user_id, 
    draw_id, 
    match_type, 
    prize_amount, 
    verification_status, 
    payment_status,
    created_at
) VALUES (
    'REPLACE_WITH_USER_ID',  -- From Step 2
    'REPLACE_WITH_DRAW_ID',  -- From Step 1
    '5-match',
    500.00,
    'pending',
    'pending',
    NOW()
);

-- Step 4: Verify winner was created
SELECT 
    w.id,
    w.match_type,
    w.prize_amount,
    w.verification_status,
    u.first_name,
    u.email
FROM winners w
JOIN users u ON w.user_id = u.id
ORDER BY w.created_at DESC
LIMIT 1;

-- Step 5: Check if admin dashboard will show this winner
SELECT 
    w.*,
    u.first_name,
    u.last_name
FROM winners w
JOIN users u ON w.user_id = u.id
ORDER BY w.created_at DESC;