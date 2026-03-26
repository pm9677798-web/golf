-- Add updated_at column to draws table
-- Run this in your Supabase SQL editor

ALTER TABLE draws 
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing records to have updated_at = created_at
UPDATE draws 
SET updated_at = created_at 
WHERE updated_at IS NULL;

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'draws' 
ORDER BY ordinal_position;