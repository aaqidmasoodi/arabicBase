-- Ensure authenticated users can manage their own entries
-- Drop potential duplicates first to be safe
DROP POLICY IF EXISTS "Users can insert their own entries" ON entries;
DROP POLICY IF EXISTS "Users can update their own entries" ON entries;
DROP POLICY IF EXISTS "Users can delete their own entries" ON entries;

-- Re-create policies
CREATE POLICY "Users can insert their own entries" 
ON entries FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries" 
ON entries FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries" 
ON entries FOR DELETE 
USING (auth.uid() = user_id);
