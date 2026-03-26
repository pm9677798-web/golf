-- SIMPLE DATA CHECK - RUN EACH QUERY SEPARATELY
-- Copy and paste each section one by one in Supabase

-- QUERY 1: Check all users
SELECT 
    first_name,
    last_name,
    email,
    subscription_status,
    subscription_plan
FROM users
ORDER BY created_at DESC;

-- QUERY 2: Count scores per user
SELECT 
    u.first_name,
    u.email,
    u.subscription_status,
    COUNT(gs.id) as total_scores
FROM users u
LEFT JOIN golf_scores gs ON u.id = gs.user_id
GROUP BY u.id, u.first_name, u.email, u.subscription_status
ORDER BY total_scores DESC;

-- QUERY 3: Users with 5+ scores (eligible for draws)
SELECT 
    u.first_name,
    u.email,
    COUNT(gs.id) as score_count
FROM users u
JOIN golf_scores gs ON u.id = gs.user_id
WHERE u.subscription_status = 'active'
GROUP BY u.id, u.first_name, u.email
HAVING COUNT(gs.id) >= 5
ORDER BY score_count DESC;

-- QUERY 4: All golf scores
SELECT 
    u.first_name,
    gs.score,
    gs.score_date
FROM users u
JOIN golf_scores gs ON u.id = gs.user_id
ORDER BY u.first_name, gs.score_date DESC;

-- QUERY 5: Recent draws
SELECT 
    draw_date,
    draw_type,
    winning_numbers,
    is_published
FROM draws
ORDER BY created_at DESC
LIMIT 5;

-- QUERY 6: Existing winners
SELECT 
    u.first_name,
    w.match_type,
    w.prize_amount,
    w.verification_status
FROM winners w
JOIN users u ON w.user_id = u.id
ORDER BY w.created_at DESC;

-- QUERY 7: System summary
SELECT 
    'Active Users' as metric,
    COUNT(*) as count
FROM users 
WHERE subscription_status = 'active'

UNION ALL

SELECT 
    'Total Scores' as metric,
    COUNT(*) as count
FROM golf_scores

UNION ALL

SELECT 
    'Total Draws' as metric,
    COUNT(*) as count
FROM draws

UNION ALL

SELECT 
    'Total Winners' as metric,
    COUNT(*) as count
FROM winners;