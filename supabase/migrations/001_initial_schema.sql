-- ============================================
-- EduSync Database Schema
-- Minimal backend for demonstration purposes
-- ============================================

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES TABLE
-- Stores user information after authentication
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL CHECK (role IN ('student', 'lecturer')) DEFAULT 'student',
    avatar_url TEXT,
    phone TEXT,
    parent_phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies: Users can read/update/insert their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- 2. PERSONAL GOALS TABLE
-- For demonstrating real data persistence
-- ============================================
CREATE TABLE IF NOT EXISTS personal_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK (category IN ('academic', 'personal', 'health', 'career')) DEFAULT 'personal',
    target_date DATE,
    status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE personal_goals ENABLE ROW LEVEL SECURITY;

-- Goals policies: Users can only access their own goals
CREATE POLICY "Users can view own goals" ON personal_goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own goals" ON personal_goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" ON personal_goals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals" ON personal_goals
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 3. AI GRADING LOGS TABLE
-- Records real AI grading requests for demonstration
-- ============================================
CREATE TABLE IF NOT EXISTS ai_grading_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    assignment_title TEXT NOT NULL,
    student_answer TEXT NOT NULL,
    rubric_context TEXT,
    ai_score INTEGER CHECK (ai_score >= 0 AND ai_score <= 100),
    ai_feedback TEXT,
    model_used TEXT DEFAULT 'gpt-4o-mini',
    processing_time_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE ai_grading_logs ENABLE ROW LEVEL SECURITY;

-- Grading logs: Users can view their own grading history
CREATE POLICY "Users can view own grading logs" ON ai_grading_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create grading logs" ON ai_grading_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 4. HELPER FUNCTIONS
-- ============================================

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'student')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to tables
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at
    BEFORE UPDATE ON personal_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON personal_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON personal_goals(status);
CREATE INDEX IF NOT EXISTS idx_grading_logs_user_id ON ai_grading_logs(user_id);
