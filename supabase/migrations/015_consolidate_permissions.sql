-- 1. Reset Entries Policies
DROP POLICY IF EXISTS "Users can view all entries" ON entries;
DROP POLICY IF EXISTS "Public can view all entries" ON entries;
DROP POLICY IF EXISTS "Users can insert their own entries" ON entries;
DROP POLICY IF EXISTS "Users can update their own entries" ON entries;
DROP POLICY IF EXISTS "Users can delete their own entries" ON entries;

-- Read: Public
CREATE POLICY "Public can view all entries" ON entries
FOR SELECT USING (true);

-- Write: Owner only
CREATE POLICY "Users can insert their own entries" ON entries
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries" ON entries
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries" ON entries
FOR DELETE USING (auth.uid() = user_id);


-- 2. Reset Concepts Policies
DROP POLICY IF EXISTS "Enable read access for all users" ON concepts;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON concepts;
DROP POLICY IF EXISTS "Public can view concepts" ON concepts;

-- Read: Public
CREATE POLICY "Public can view concepts" ON concepts
FOR SELECT USING (true);

-- Write: Authenticated users
CREATE POLICY "Authenticated users can insert concepts" ON concepts
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 3. Reset Entry Votes Policies (Just to be safe)
DROP POLICY IF EXISTS "Users can view their own votes" ON entry_votes;
DROP POLICY IF EXISTS "Users can vote" ON entry_votes;
DROP POLICY IF EXISTS "Users can update their own votes" ON entry_votes;
DROP POLICY IF EXISTS "Users can remove their votes" ON entry_votes;

CREATE POLICY "Users can view their own votes" ON entry_votes
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can vote" ON entry_votes
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes" ON entry_votes
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can remove their votes" ON entry_votes
FOR DELETE USING (auth.uid() = user_id);
