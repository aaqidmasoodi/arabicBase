-- Fix RLS policies for entries table to ensure deletion works
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists (using the name from seed.sql)
DROP POLICY IF EXISTS "Users can only access their own entries" ON public.entries;

-- Create explicit policies for each operation
CREATE POLICY "Users can view their own entries" ON public.entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own entries" ON public.entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries" ON public.entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries" ON public.entries
  FOR DELETE USING (auth.uid() = user_id);
