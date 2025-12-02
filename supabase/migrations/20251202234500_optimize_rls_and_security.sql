-- Secure functions by setting search_path
ALTER FUNCTION get_unique_global_entries() SET search_path = public;
ALTER FUNCTION update_entry_vote_counts() SET search_path = public;
ALTER FUNCTION handle_new_user() SET search_path = public;

-- Optimize RLS policies to use (select auth.uid()) for performance

-- Profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (id = (select auth.uid()));

-- User Dialects
DROP POLICY IF EXISTS "Users can select their own dialects" ON user_dialects;
CREATE POLICY "Users can select their own dialects" ON user_dialects FOR SELECT USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own dialects" ON user_dialects;
CREATE POLICY "Users can insert their own dialects" ON user_dialects FOR INSERT WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own dialects" ON user_dialects;
CREATE POLICY "Users can delete their own dialects" ON user_dialects FOR DELETE USING (user_id = (select auth.uid()));

-- User Categories
DROP POLICY IF EXISTS "Users can select their own categories" ON user_categories;
CREATE POLICY "Users can select their own categories" ON user_categories FOR SELECT USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own categories" ON user_categories;
CREATE POLICY "Users can insert their own categories" ON user_categories FOR INSERT WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own categories" ON user_categories;
CREATE POLICY "Users can delete their own categories" ON user_categories FOR DELETE USING (user_id = (select auth.uid()));

-- Dialects & Categories (Insert)
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON dialects;
CREATE POLICY "Enable insert for authenticated users" ON dialects FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable insert for authenticated users" ON categories;
CREATE POLICY "Enable insert for authenticated users" ON categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Entries
DROP POLICY IF EXISTS "Users can insert their own entries" ON entries;
CREATE POLICY "Users can insert their own entries" ON entries FOR INSERT WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update their own entries" ON entries;
CREATE POLICY "Users can update their own entries" ON entries FOR UPDATE USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own entries" ON entries;
CREATE POLICY "Users can delete their own entries" ON entries FOR DELETE USING (user_id = (select auth.uid()));

-- Concepts
DROP POLICY IF EXISTS "Authenticated users can insert concepts" ON concepts;
CREATE POLICY "Authenticated users can insert concepts" ON concepts FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Entry Votes
DROP POLICY IF EXISTS "Users can view their own votes" ON entry_votes;
CREATE POLICY "Users can view their own votes" ON entry_votes FOR SELECT USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can vote" ON entry_votes;
CREATE POLICY "Users can vote" ON entry_votes FOR INSERT WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update their own votes" ON entry_votes;
CREATE POLICY "Users can update their own votes" ON entry_votes FOR UPDATE USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can remove their votes" ON entry_votes;
CREATE POLICY "Users can remove their votes" ON entry_votes FOR DELETE USING (user_id = (select auth.uid()));
