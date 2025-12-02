-- Fix RLS policies for Entries
DROP POLICY IF EXISTS "Users can insert their own entries" ON entries;
DROP POLICY IF EXISTS "Users can update their own entries" ON entries;
DROP POLICY IF EXISTS "Users can delete their own entries" ON entries;

CREATE POLICY "Users can insert their own entries" 
ON entries FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries" 
ON entries FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries" 
ON entries FOR DELETE 
USING (auth.uid() = user_id);

-- Fix RLS policies for Votes (just in case)
DROP POLICY IF EXISTS "Users can view their own votes" ON entry_votes;
DROP POLICY IF EXISTS "Users can vote" ON entry_votes;
DROP POLICY IF EXISTS "Users can update their own votes" ON entry_votes;
DROP POLICY IF EXISTS "Users can remove their votes" ON entry_votes;

CREATE POLICY "Users can view their own votes" 
ON entry_votes FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can vote" 
ON entry_votes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes" 
ON entry_votes FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can remove their votes" 
ON entry_votes FOR DELETE 
USING (auth.uid() = user_id);
