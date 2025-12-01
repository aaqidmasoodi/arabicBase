-- 1. Clean up duplicates in dialects (keep the one with the smallest ID)
DELETE FROM dialects a USING dialects b WHERE a.id > b.id AND a.name = b.name;

-- 2. Clean up duplicates in categories (keep the one with the smallest ID)
DELETE FROM categories a USING categories b WHERE a.id > b.id AND a.name = b.name;

-- 3. Add UNIQUE constraints and remove user_id
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'dialects_name_key') THEN
        ALTER TABLE dialects ADD CONSTRAINT dialects_name_key UNIQUE (name);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'categories_name_key') THEN
        ALTER TABLE categories ADD CONSTRAINT categories_name_key UNIQUE (name);
    END IF;
END $$;

-- Drop old policies that depend on user_id
DROP POLICY IF EXISTS "Users can only access their own dialects" ON dialects;
DROP POLICY IF EXISTS "Users can only access their own categories" ON categories;

ALTER TABLE dialects DROP COLUMN IF EXISTS user_id;
ALTER TABLE categories DROP COLUMN IF EXISTS user_id;

-- 4. Create join tables
CREATE TABLE IF NOT EXISTS user_dialects (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    dialect_id UUID REFERENCES dialects(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (user_id, dialect_id)
);

CREATE TABLE IF NOT EXISTS user_categories (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (user_id, category_id)
);

-- 5. Enable RLS
ALTER TABLE user_dialects ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_categories ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies
-- User Dialects
DROP POLICY IF EXISTS "Users can select their own dialects" ON user_dialects;
CREATE POLICY "Users can select their own dialects" ON user_dialects FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own dialects" ON user_dialects;
CREATE POLICY "Users can insert their own dialects" ON user_dialects FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own dialects" ON user_dialects;
CREATE POLICY "Users can delete their own dialects" ON user_dialects FOR DELETE USING (auth.uid() = user_id);

-- User Categories
DROP POLICY IF EXISTS "Users can select their own categories" ON user_categories;
CREATE POLICY "Users can select their own categories" ON user_categories FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own categories" ON user_categories;
CREATE POLICY "Users can insert their own categories" ON user_categories FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own categories" ON user_categories;
CREATE POLICY "Users can delete their own categories" ON user_categories FOR DELETE USING (auth.uid() = user_id);

-- 7. Backfill: Subscribe all existing users to all existing unique dialects/categories
-- This mimics the current state where everyone sees everything.
INSERT INTO user_dialects (user_id, dialect_id)
SELECT p.id, d.id FROM profiles p CROSS JOIN dialects d
ON CONFLICT DO NOTHING;

INSERT INTO user_categories (user_id, category_id)
SELECT p.id, c.id FROM profiles p CROSS JOIN categories c
ON CONFLICT DO NOTHING;
