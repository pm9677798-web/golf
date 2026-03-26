-- DEBUG WINNERS - Check what's in database
-- Run these queries in Supabase SQL Editor to debug

-- 1. Check if any winners exist at all
SELECT COUNT(*) as total_winners FROM winners;

-- 2. Check all winners with user details
SELECT 
    w.id,
    w.match_type,
    w.prize_amount,
    w.verification_status,
    w.payment_status,
    w.created_at,
    u.first_name,
    u.last_name,
    u.email,
    d.winning_numbers,
    d.draw_date
FROM winners w
LEFT JOIN users u ON w.user_id = u.id
LEFT JOIN draws d ON w.draw_id = d.id
ORDER BY w.created_at DESC;

-- 3. Check recent draws
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
LIMIT 5;

-- 4. Check draw entries (intermediate step)
SELECT 
    de.id,
    de.matches,
    de.user_numbers,
    u.first_name,
    u.email,
    d.winning_numbers
FROM draw_entries de
LEFT JOIN users u ON de.user_id = u.id
LEFT JOIN draws d ON de.draw_id = d.id
ORDER BY de.created_at DESC;

-- 5. Check users with scores
SELECT 
    u.id,
    u.first_name,
    u.email,
    u.subscription_status,
    COUNT(gs.id) as score_count,
    ARRAY_AGG(gs.score ORDER BY gs.score_date DESC) as latest_scores
FROM users u
LEFT JOIN golf_scores gs ON u.id = gs.user_id
WHERE u.subscription_status = 'active'
GROUP BY u.id, u.first_name, u.email, u.subscription_status
ORDER BY u.first_name;

-- 6. Check if admin dashboard API is working
-- This simulates the winners query from admin dashboard
SELECT 
    w.*,
    u.first_name,
    u.last_name
FROM winners w
JOIN users u ON w.user_id = u.id
ORDER BY w.created_at DESC;