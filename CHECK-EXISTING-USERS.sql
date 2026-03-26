-- SIMPLE CHECK FOR EXISTING USERS AND SCORES
-- Run each section separately to avoid subquery issues

-- Step 1: All Users
SELECT 
    u.first_name,
    u.last_name,
    u.email,
    u.subscription_status,
    u.subscription_plan,
    u.created_at
FROM users u
ORDER BY u.created_at DESC;