-- DEBUG WINNER ISSUE
-- Let's check what's happening step by step

-- 1. Check if we have active users
SELECT 'Active Users' as check_type, COUNT(*) as count
FROM users 
WHERE subscription_status = 'active';

-- 2. Check if users have golf scores
SELECT 
    u.first_name,
    u.last_name,
    u.email,
    COUNT(gs.id) as score_count
FROM users u
LEFT JOIN golf_scores gs ON u.id = gs.user_id
WHERE u.subscription_status = 'active'
GROUP BY u.id, u.first_name, u.last_name, u.email
ORDER BY score_count DESC;

-- 3. Check recent draws
SELECT 
    id,
    draw_date,
    draw_type,
    winning_numbers,
    is_published,
    created_at
FROM draws 
ORDER BY created_at DESC 
LIMIT 5;

-- 4. Check if we have any winners
SELECT 
    w.*,
    u.first_name,
    u.last_name,
    d.winning_numbers
FROM winners w
JOIN users u ON w.user_id = u.id
JOIN draws d ON w.draw_id = d.id
ORDER BY w.created_at DESC;

-- 5. Check draw entries
SELECT 
    de.*,
    u.first_name,
    u.last_name,
    d.winning_numbers
FROM draw_entries de
JOIN users u ON de.user_id = u.id
JOIN draws d ON de.draw_id = d.id
ORDER BY de.created_at DESC;