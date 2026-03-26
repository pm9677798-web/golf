-- Check if winners were created after your draw
-- Run these queries in Supabase SQL Editor

-- 1. Check your recent draw
SELECT 
    id,
    draw_date,
    draw_type,
    winning_numbers,
    total_prize_pool,
    is_published,
    created_at
FROM draws 
ORDER BY created_at DESC 
LIMIT 3;

-- 2. Check if any winners exist
SELECT 
    w.*,
    u.first_name,
    u.email,
    d.winning_numbers
FROM winners w
JOIN users u ON w.user_id = u.id
JOIN draws d ON w.draw_id = d.id
ORDER BY w.created_at DESC;

-- 3. Check your users and their scores
SELECT 
    u.id,
    u.first_name,
    u.email,
    u.subscription_status,
    COUNT(gs.id) as score_count
FROM users u
LEFT JOIN golf_scores gs ON u.id = gs.user_id
WHERE u.subscription_status = 'active'
GROUP BY u.id, u.first_name, u.email, u.subscription_status
ORDER BY u.first_name;

-- 4. Check specific user's latest 5 scores (replace USER_ID)
SELECT 
    score,
    score_date,
    created_at
FROM golf_scores 
WHERE user_id = 'REPLACE_WITH_ACTUAL_USER_ID'
ORDER BY score_date DESC 
LIMIT 5;

-- 5. Check draw entries (if any were created)
SELECT 
    de.*,
    u.first_name,
    d.winning_numbers
FROM draw_entries de
JOIN users u ON de.user_id = u.id
JOIN draws d ON de.draw_id = d.id
ORDER BY de.created_at DESC;