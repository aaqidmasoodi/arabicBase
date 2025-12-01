-- 1. Create Concepts Table
CREATE TABLE IF NOT EXISTS public.concepts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(name)
);

-- 2. Enable RLS on Concepts
ALTER TABLE public.concepts ENABLE ROW LEVEL SECURITY;

-- 3. Create Policies for Concepts
-- Everyone can view concepts (needed for auto-linking)
CREATE POLICY "Enable read access for all users" ON public.concepts
  FOR SELECT USING (true);

-- Authenticated users can create new concepts
CREATE POLICY "Enable insert for authenticated users" ON public.concepts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 4. Add concept_id to Entries
ALTER TABLE public.entries 
ADD COLUMN IF NOT EXISTS concept_id UUID REFERENCES public.concepts(id);

-- 5. Backfill Concepts from Existing Entries
-- Insert unique, normalized translations into concepts
INSERT INTO public.concepts (name)
SELECT DISTINCT LOWER(TRIM(translation))
FROM public.entries
WHERE translation IS NOT NULL
ON CONFLICT (name) DO NOTHING;

-- 6. Link Entries to Concepts
-- Update entries to point to the correct concept based on translation
UPDATE public.entries e
SET concept_id = c.id
FROM public.concepts c
WHERE LOWER(TRIM(e.translation)) = c.name
AND e.concept_id IS NULL;
