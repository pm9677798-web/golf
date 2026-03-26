-- FIX DRAW TYPE CONSTRAINT TO INCLUDE 'SMART'
-- Run this in Supabase SQL Editor

-- Drop the existing constraint
ALTER TABLE draws DROP CONSTRAINT IF EXISTS draws_draw_type_check;

-- Add new constraint that includes 'smart'
ALTER TABLE draws ADD CONSTRAINT draws_draw_type_check 
CHECK (draw_type IN ('random', 'algorithmic', 'smart'));

-- Verify the constraint is updated
SELECT conname, consrc 
FROM pg_constraint 
WHERE conrelid = 'draws'::regclass 
AND conname = 'draws_draw_type_check';