-- SIMPLE WINNER TEST - Create winner manually to test display
-- Copy and paste these queries one by one in Supabase SQL Editor

-- Step 1: Check your draws (copy the latest draw ID)
SELECT 
    id,
    draw_date,
    winning_numbers,
    total_prize_pool,
    created_at
FROM draws 
ORDER BY created_at DESC 
LIMIT 3;

-- Step 2: Check your users (copy any user ID)
SELECT 
    id,
    first_name,
    last_name,
    email,
    subscription_status
FROM users 
WHERE subscription_status = 'active'
ORDER BY first_name
LIMIT 5;

-- Step 3: Create a test winner (REPLACE THE IDs WITH ACTUAL VALUES FROM ABOVE)
INSERT INTO winners (
    user_id,
    draw_id,
    match_type,
    prize_amount,
    verification_status,
    payment_status,
    created_at,
    updated_at
) VALUES (
    'PASTE_USER_ID_HERE',     -- From Step 2
    'PASTE_DRAW_ID_HERE',     -- From Step 1  
    '5-match',
    500.00,
    'pending',
    'pending',
    NOW(),
    NOW()
);

-- Step 4: Verify winner was created
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
ORDER BY w.created_at DESC;

-- Step 5: If successful, you should see 1 winner in the winners table
SELECT COUNT(*) as total_winners FROM winners;