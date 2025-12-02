-- Allow all authenticated users to view all entries
DROP POLICY IF EXISTS "Users can view their own entries" ON public.entries;

CREATE POLICY "Users can view all entries" ON public.entries
  FOR SELECT USING (auth.role() = 'authenticated');

-- Keep other policies strict (only owner can modify)
-- "Users can insert their own entries" (Already exists)
-- "Users can update their own entries" (Already exists)
-- "Users can delete their own entries" (Already exists)
