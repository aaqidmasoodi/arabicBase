-- Allow public read access to entries
DROP POLICY IF EXISTS "Users can view all entries" ON public.entries;
CREATE POLICY "Public can view all entries" ON public.entries
  FOR SELECT USING (true);

-- Allow public read access to dialects
DROP POLICY IF EXISTS "Public can view dialects" ON public.dialects;
CREATE POLICY "Public can view dialects" ON public.dialects
  FOR SELECT USING (true);

-- Allow public read access to categories
DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
CREATE POLICY "Public can view categories" ON public.categories
  FOR SELECT USING (true);

-- Allow public read access to concepts
DROP POLICY IF EXISTS "Public can view concepts" ON public.concepts;
CREATE POLICY "Public can view concepts" ON public.concepts
  FOR SELECT USING (true);
