-- Update handle_new_user function to respect the new Many-to-Many schema
-- AND only subscribe users to relevant dialects/categories from the default entries.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- 1. Create Profile
  INSERT INTO public.profiles (id, email, is_pro)
  VALUES (new.id, new.email, false);

  -- 2. Copy Default Entries (Clone entries for the user)
  INSERT INTO public.entries (term, transliteration, translation, dialect, category, type, tags, notes, has_ai_insights, ai_enrichment, user_id)
  SELECT term, transliteration, translation, dialect, category, type, tags, notes, has_ai_insights, ai_enrichment, new.id
  FROM public.entries WHERE user_id IS NULL;

  -- 3. Subscribe User to RELEVANT Dialects (Only those used in default entries)
  INSERT INTO public.user_dialects (user_id, dialect_id)
  SELECT DISTINCT new.id, d.id 
  FROM public.entries e
  JOIN public.dialects d ON e.dialect = d.name
  WHERE e.user_id IS NULL
  ON CONFLICT DO NOTHING;

  -- 4. Subscribe User to RELEVANT Categories (Only those used in default entries)
  INSERT INTO public.user_categories (user_id, category_id)
  SELECT DISTINCT new.id, c.id 
  FROM public.entries e
  JOIN public.categories c ON e.category = c.name
  WHERE e.user_id IS NULL
  ON CONFLICT DO NOTHING;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
