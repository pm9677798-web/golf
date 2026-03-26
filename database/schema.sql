-- Golf Charity Platform Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    subscription_status VARCHAR(20) DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'cancelled')),
    subscription_plan VARCHAR(20) CHECK (subscription_plan IN ('monthly', 'yearly')),
    subscription_start_date TIMESTAMP WITH TIME ZONE,
    subscription_end_date TIMESTAMP WITH TIME ZONE,
    stripe_customer_id VARCHAR(255),
    selected_charity_id UUID,
    charity_contribution_percentage INTEGER DEFAULT 10 CHECK (charity_contribution_percentage >= 10 AND charity_contribution_percentage <= 50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Golf scores table
CREATE TABLE golf_scores (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 1 AND score <= 45),
    score_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Charities table
CREATE TABLE charities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    website_url VARCHAR(500),
    is_featured BOOLEAN DEFAULT FALSE,
    upcoming_events TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Draws table
CREATE TABLE draws (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    draw_date DATE NOT NULL,
    draw_type VARCHAR(20) NOT NULL CHECK (draw_type IN ('random', 'algorithmic')),
    winning_numbers INTEGER[] NOT NULL,
    total_prize_pool DECIMAL(10,2) NOT NULL,
    five_match_pool DECIMAL(10,2) NOT NULL,
    four_match_pool DECIMAL(10,2) NOT NULL,
    three_match_pool DECIMAL(10,2) NOT NULL,
    jackpot_rollover DECIMAL(10,2) DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Draw entries table
CREATE TABLE draw_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    draw_id UUID NOT NULL REFERENCES draws(id) ON DELETE CASCADE,
    user_numbers INTEGER[] NOT NULL,
    matches INTEGER DEFAULT 0,
    prize_amount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Winners table
CREATE TABLE winners (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    draw_id UUID NOT NULL REFERENCES draws(id) ON DELETE CASCADE,
    match_type VARCHAR(20) NOT NULL CHECK (match_type IN ('3-match', '4-match', '5-match')),
    prize_amount DECIMAL(10,2) NOT NULL,
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
    proof_screenshot_url VARCHAR(500),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Charity contributions table
CREATE TABLE charity_contributions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    charity_id UUID NOT NULL REFERENCES charities(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    contribution_date DATE NOT NULL,
    subscription_related BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint for selected_charity_id
ALTER TABLE users ADD CONSTRAINT fk_users_charity 
    FOREIGN KEY (selected_charity_id) REFERENCES charities(id);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription_status ON users(subscription_status);
CREATE INDEX idx_golf_scores_user_id ON golf_scores(user_id);
CREATE INDEX idx_golf_scores_date ON golf_scores(score_date);
CREATE INDEX idx_draw_entries_user_id ON draw_entries(user_id);
CREATE INDEX idx_draw_entries_draw_id ON draw_entries(draw_id);
CREATE INDEX idx_winners_user_id ON winners(user_id);
CREATE INDEX idx_winners_verification_status ON winners(verification_status);
CREATE INDEX idx_charity_contributions_user_id ON charity_contributions(user_id);
CREATE INDEX idx_charity_contributions_charity_id ON charity_contributions(charity_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_charities_updated_at BEFORE UPDATE ON charities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_winners_updated_at BEFORE UPDATE ON winners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample charities
INSERT INTO charities (name, description, image_url, is_featured) VALUES
('Children''s Hospital Foundation', 'Supporting sick children and their families with medical care, research, and family support services.', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400', true),
('Environmental Conservation Trust', 'Protecting our planet for future generations through conservation efforts, renewable energy projects, and environmental education.', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400', true),
('Local Food Bank Network', 'Fighting hunger in our communities by providing nutritious meals to families in need and supporting food security programs.', 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400', false),
('Education for All Initiative', 'Providing education opportunities worldwide, building schools, training teachers, and supplying educational materials to underserved communities.', 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400', false),
('Senior Care Support', 'Enhancing the quality of life for elderly community members through companionship programs, healthcare assistance, and social activities.', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400', false);

-- Insert demo users (passwords are hashed versions of 'password123' and 'admin123')
INSERT INTO users (email, password_hash, first_name, last_name, subscription_status, subscription_plan, subscription_start_date, subscription_end_date, selected_charity_id, charity_contribution_percentage) 
SELECT 
    'demo@golfheart.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9S2', -- password123
    'Demo',
    'User',
    'active',
    'monthly',
    NOW(),
    NOW() + INTERVAL '1 month',
    c.id,
    15
FROM charities c WHERE c.name = 'Children''s Hospital Foundation' LIMIT 1;

INSERT INTO users (email, password_hash, first_name, last_name, subscription_status, subscription_plan, subscription_start_date, subscription_end_date, selected_charity_id, charity_contribution_percentage) 
SELECT 
    'admin@golfheart.com',
    '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- admin123
    'Admin',
    'User',
    'active',
    'yearly',
    NOW(),
    NOW() + INTERVAL '1 year',
    c.id,
    20
FROM charities c WHERE c.name = 'Environmental Conservation Trust' LIMIT 1;

-- Insert sample golf scores for demo user
INSERT INTO golf_scores (user_id, score, score_date)
SELECT 
    u.id,
    score,
    date
FROM users u,
(VALUES 
    (32, CURRENT_DATE - INTERVAL '1 day'),
    (28, CURRENT_DATE - INTERVAL '3 days'),
    (35, CURRENT_DATE - INTERVAL '7 days'),
    (30, CURRENT_DATE - INTERVAL '10 days'),
    (27, CURRENT_DATE - INTERVAL '14 days')
) AS scores(score, date)
WHERE u.email = 'demo@golfheart.com';

-- Insert a sample draw
INSERT INTO draws (draw_date, draw_type, winning_numbers, total_prize_pool, five_match_pool, four_match_pool, three_match_pool, is_published)
VALUES (
    CURRENT_DATE - INTERVAL '1 month',
    'random',
    ARRAY[15, 23, 31, 38, 42],
    15000.00,
    6000.00,
    5250.00,
    3750.00,
    true
);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE golf_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE draw_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE charity_contributions ENABLE ROW LEVEL SECURITY;

-- Users can only see/edit their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Users can only see/manage their own scores
CREATE POLICY "Users can view own scores" ON golf_scores FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own scores" ON golf_scores FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own scores" ON golf_scores FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own scores" ON golf_scores FOR DELETE USING (auth.uid()::text = user_id::text);

-- Similar policies for other user-specific tables
CREATE POLICY "Users can view own draw entries" ON draw_entries FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can view own winnings" ON winners FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can view own contributions" ON charity_contributions FOR SELECT USING (auth.uid()::text = user_id::text);

-- Public read access for charities and published draws
CREATE POLICY "Anyone can view charities" ON charities FOR SELECT USING (true);
CREATE POLICY "Anyone can view published draws" ON draws FOR SELECT USING (is_published = true);