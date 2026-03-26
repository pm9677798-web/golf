-- TEST THE NEW SMART DRAW SYSTEM
-- This will show you exactly how the smart system works with your existing data

-- Step 1: Check current users and their scores
SELECT '=== CURRENT SYSTEM STATUS ===' as info;

WITH user_latest_scores AS (
    SELECT 
        u.id,
        u.first_name,
        u.email,
        u.subscription_status,
        gs.score,
        gs.score_date,
        ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY gs.score_date DESC) as rn
    FROM users u
    LEFT JOIN golf_scores gs ON u.id = gs.user_id
    WHERE u.subscription_status = 'active'
)
SELECT 
    first_name,
    email,
    subscription_status,
    COUNT(CASE WHEN score IS NOT NULL THEN 1 END) as score_count,
    ARRAY_AGG(score ORDER BY score_date DESC) FILTER (WHERE score IS NOT NULL AND rn <= 5) as latest_scores
FROM user_latest_scores
GROUP BY id, first_name, email, subscription_status
ORDER BY score_count DESC, first_name;

-- Step 2: Show score frequency analysis (what Smart Draw will use)
SELECT '=== SCORE FREQUENCY ANALYSIS ===' as info;

WITH user_latest_scores AS (
    SELECT 
        u.id as user_id,
        u.first_name,
        gs.score,
        ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY gs.score_date DESC) as rn
    FROM users u
    JOIN golf_scores gs ON u.id = gs.user_id
    WHERE u.subscription_status = 'active'
),
user_scores AS (
    SELECT DISTINCT
        user_id,
        first_name,
        score
    FROM user_latest_scores
    WHERE rn <= 5
)
SELECT 
    score,
    COUNT(*) as frequency,
    ARRAY_AGG(first_name) as users_with_this_score,
    CASE 
        WHEN COUNT(*) >= 3 THEN 'HIGH (Smart Draw will likely include)'
        WHEN COUNT(*) = 2 THEN 'MEDIUM (Smart Draw might include)'
        ELSE 'LOW (Smart Draw rarely includes)'
    END as selection_probability
FROM user_scores
GROUP BY score
ORDER BY frequency DESC, score;

-- Step 3: Simulate what Smart Draw would select
SELECT '=== SMART DRAW PREDICTION ===' as info;

WITH user_latest_scores AS (
    SELECT 
        u.id as user_id,
        u.first_name,
        gs.score,
        ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY gs.score_date DESC) as rn
    FROM users u
    JOIN golf_scores gs ON u.id = gs.user_id
    WHERE u.subscription_status = 'active'
),
user_scores AS (
    SELECT DISTINCT
        user_id,
        first_name,
        score
    FROM user_latest_scores
    WHERE rn <= 5
),
score_frequency AS (
    SELECT 
        score,
        COUNT(*) as frequency
    FROM user_scores
    GROUP BY score
),
most_common AS (
    SELECT score FROM score_frequency ORDER BY frequency DESC LIMIT 2
),
moderately_common AS (
    SELECT score FROM score_frequency ORDER BY frequency DESC OFFSET 2 LIMIT 2
),
less_common AS (
    SELECT score FROM score_frequency ORDER BY frequency ASC LIMIT 1
)
SELECT 
    'Smart Draw would likely select these scores:' as prediction,
    (SELECT ARRAY_AGG(score) FROM most_common) as most_common_scores,
    (SELECT ARRAY_AGG(score) FROM moderately_common) as moderate_scores,
    (SELECT ARRAY_AGG(score) FROM less_common) as challenging_scores;

-- Step 4: Show predicted winners if Smart Draw runs now
SELECT '=== PREDICTED WINNERS (Smart Draw) ===' as info;

WITH user_latest_scores AS (
    SELECT 
        u.id,
        u.first_name,
        u.email,
        gs.score,
        gs.score_date,
        ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY gs.score_date DESC) as rn
    FROM users u
    JOIN golf_scores gs ON u.id = gs.user_id
    WHERE u.subscription_status = 'active'
),
user_scores_array AS (
    SELECT 
        id,
        first_name,
        email,
        ARRAY_AGG(score ORDER BY score_date DESC) as scores
    FROM user_latest_scores
    WHERE rn <= 5
    GROUP BY id, first_name, email
    HAVING COUNT(*) >= 5
),
all_scores AS (
    SELECT unnest(scores) as score
    FROM user_scores_array
),
score_frequency AS (
    SELECT 
        score,
        COUNT(*) as frequency
    FROM all_scores
    GROUP BY score
),
likely_winning_numbers AS (
    -- Simulate Smart Draw selection (top 5 most common scores)
    SELECT ARRAY(
        SELECT score FROM score_frequency ORDER BY frequency DESC LIMIT 5
    ) as winning_numbers
)
SELECT 
    u.first_name,
    u.email,
    u.scores as user_scores,
    w.winning_numbers,
    (
        SELECT COUNT(*)
        FROM unnest(u.scores) as user_score
        WHERE user_score = ANY(w.winning_numbers)
    ) as matches,
    CASE 
        WHEN (
            SELECT COUNT(*)
            FROM unnest(u.scores) as user_score
            WHERE user_score = ANY(w.winning_numbers)
        ) >= 5 THEN '🏆 5-MATCH WINNER!'
        WHEN (
            SELECT COUNT(*)
            FROM unnest(u.scores) as user_score
            WHERE user_score = ANY(w.winning_numbers)
        ) >= 4 THEN '🥈 4-MATCH WINNER!'
        WHEN (
            SELECT COUNT(*)
            FROM unnest(u.scores) as user_score
            WHERE user_score = ANY(w.winning_numbers)
        ) >= 3 THEN '🥉 3-MATCH WINNER!'
        ELSE '❌ No Prize'
    END as result
FROM user_scores_array u
CROSS JOIN likely_winning_numbers w
ORDER BY matches DESC, u.first_name;

-- Step 5: Summary
SELECT '=== SYSTEM READINESS SUMMARY ===' as info;

SELECT 
    (SELECT COUNT(*) FROM users WHERE subscription_status = 'active') as active_users,
    (SELECT COUNT(DISTINCT u.id) 
     FROM users u 
     JOIN golf_scores gs ON u.id = gs.user_id 
     WHERE u.subscription_status = 'active' 
     GROUP BY u.id 
     HAVING COUNT(gs.id) >= 5) as eligible_users,
    CASE 
        WHEN (SELECT COUNT(DISTINCT u.id) 
              FROM users u 
              JOIN golf_scores gs ON u.id = gs.user_id 
              WHERE u.subscription_status = 'active' 
              GROUP BY u.id 
              HAVING COUNT(gs.id) >= 5) >= 3 
        THEN '✅ READY - Smart Draw will work perfectly!'
        WHEN (SELECT COUNT(DISTINCT u.id) 
              FROM users u 
              JOIN golf_scores gs ON u.id = gs.user_id 
              WHERE u.subscription_status = 'active' 
              GROUP BY u.id 
              HAVING COUNT(gs.id) >= 5) >= 1 
        THEN '⚠️ LIMITED - Smart Draw will work but few winners'
        ELSE '❌ NOT READY - Need users with 5+ scores'
    END as system_status;