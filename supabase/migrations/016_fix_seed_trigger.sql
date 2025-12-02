CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  msa_dialect_id UUID;
  greeting_category_id UUID;
  concept_id UUID;
BEGIN
  -- 1. Create Profile
  INSERT INTO public.profiles (id, email, is_pro)
  VALUES (new.id, new.email, false);

  -- 2. Get IDs for default Dialect (MSA) and Category (Greeting)
  -- We assume these exist globally. If not, we create them or skip.
  
  -- Find or Create MSA Dialect
  SELECT id INTO msa_dialect_id FROM public.dialects WHERE name = 'MSA' LIMIT 1;
  IF msa_dialect_id IS NULL THEN
    INSERT INTO public.dialects (name) VALUES ('MSA') RETURNING id INTO msa_dialect_id;
  END IF;

  -- Find or Create Greeting Category
  SELECT id INTO greeting_category_id FROM public.categories WHERE name = 'Greeting' LIMIT 1;
  IF greeting_category_id IS NULL THEN
    INSERT INTO public.categories (name) VALUES ('Greeting') RETURNING id INTO greeting_category_id;
  END IF;

  -- 3. Subscribe User to MSA and Greeting
  INSERT INTO public.user_dialects (user_id, dialect_id) VALUES (new.id, msa_dialect_id) ON CONFLICT DO NOTHING;
  INSERT INTO public.user_categories (user_id, category_id) VALUES (new.id, greeting_category_id) ON CONFLICT DO NOTHING;

  -- 4. Create the "Welcome" Entry (Hardcoded to avoid copying legacy data)
  -- We also try to link the concept "Hello" if it exists
  SELECT id INTO concept_id FROM public.concepts WHERE name = 'hello' LIMIT 1;

  INSERT INTO public.entries (
    term, 
    transliteration, 
    translation, 
    dialect, 
    category, 
    type, 
    tags, 
    notes, 
    has_ai_insights, 
    ai_enrichment, 
    user_id,
    concept_id
  ) VALUES (
    'مرحباً', 
    'Marhaban', 
    'Hello', 
    'MSA', 
    'Greeting', 
    'word', 
    ARRAY['basic'], 
    'Welcome to ArabicBase! This is your first entry.', 
    true, 
    '{"synonyms": ["Ahlan"], "culturalContext": "Standard greeting across Arab world", "exampleUsage": "Marhaban ya sadiq", "grammaticalNotes": "Accusative case"}', 
    new.id,
    concept_id
  );

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
