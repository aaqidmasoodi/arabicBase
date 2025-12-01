-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create Dialects Table
create table public.dialects (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  user_id uuid references auth.users(id) default auth.uid(), -- NULL = System Template
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(name, user_id) -- Prevent duplicates for the same user
);

-- Create Categories Table
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  user_id uuid references auth.users(id) default auth.uid(), -- NULL = System Template
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(name, user_id)
);

-- Create Entries Table
create table public.entries (
  id uuid default uuid_generate_v4() primary key,
  term text not null,
  transliteration text,
  translation text not null,
  dialect text not null,
  category text not null,
  type text not null default 'word',
  tags text[] default '{}',
  notes text,
  has_ai_insights boolean default false,
  ai_enrichment jsonb default '{}'::jsonb,
  user_id uuid references auth.users(id) default auth.uid(), -- NULL = System Template
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.dialects enable row level security;
alter table public.categories enable row level security;
alter table public.entries enable row level security;

-- STRICT POLICIES: Users can ONLY see/edit their OWN data
-- (System Templates with user_id = NULL are hidden from the app view, used only by the trigger)

-- Dialects
create policy "Users can only access their own dialects" on public.dialects
  for all using (auth.uid() = user_id);

-- Categories
create policy "Users can only access their own categories" on public.categories
  for all using (auth.uid() = user_id);

-- Entries
create policy "Users can only access their own entries" on public.entries
  for all using (auth.uid() = user_id);


-- AUTOMATION: Copy System Templates to New Users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- 1. Copy Default Dialects
  insert into public.dialects (name, user_id)
  select name, new.id from public.dialects where user_id is null;

  -- 2. Copy Default Categories
  insert into public.categories (name, user_id)
  select name, new.id from public.categories where user_id is null;

  -- 3. Copy Default Entries
  insert into public.entries (term, transliteration, translation, dialect, category, type, tags, notes, has_ai_insights, ai_enrichment, user_id)
  select term, transliteration, translation, dialect, category, type, tags, notes, has_ai_insights, ai_enrichment, new.id
  from public.entries where user_id is null;

  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- SEED SYSTEM TEMPLATES (user_id = NULL)
-- These will be copied to every new user automatically

-- Dialects
insert into public.dialects (name, user_id) values
('MSA', null),
('Levantine', null)
on conflict do nothing;

-- Categories
insert into public.categories (name, user_id) values
('Greeting', null), ('Common', null), ('Travel', null), ('Work', null)
on conflict do nothing;

-- Fake Entries
insert into public.entries (term, transliteration, translation, dialect, category, type, tags, notes, has_ai_insights, ai_enrichment, user_id) values
-- MSA
('مرحباً', 'Marhaban', 'Hello', 'MSA', 'Greeting', 'word', ARRAY['basic'], 'Formal greeting', true, '{"synonyms": ["Ahlan"], "culturalContext": "Standard greeting across Arab world", "exampleUsage": "Marhaban ya sadiq", "grammaticalNotes": "Accusative case"}', null),
('كيف حالك؟', 'Kayfa haluka?', 'How are you?', 'MSA', 'Greeting', 'phrase', ARRAY['basic', 'question'], 'Addressed to a male', false, '{}', null),
('شكراً', 'Shukran', 'Thank you', 'MSA', 'Common', 'word', ARRAY['polite'], '', true, '{"synonyms": ["Ashkuruk"], "culturalContext": "Universal thanks", "exampleUsage": "Shukran jazeelan", "grammaticalNotes": "Indefinite accusative"}', null),
('أريد', 'Ureed', 'I want', 'MSA', 'Common', 'word', ARRAY['verb'], 'Root: r-w-d', false, '{}', null),

-- Levantine
('كيفك', 'Kifak', 'How are you?', 'Levantine', 'Greeting', 'phrase', ARRAY['common'], 'Addressed to a male (Kifik for female)', true, '{"synonyms": ["Shoo akhbarak"], "culturalContext": "Very common daily greeting", "exampleUsage": "Kifak el-yom?", "grammaticalNotes": "Shortened from Kayfa haluka"}', null),
('شو', 'Shoo', 'What?', 'Levantine', 'Common', 'word', ARRAY['question'], 'Very iconic Levantine word', false, '{}', null),
('بدّي', 'Baddi', 'I want', 'Levantine', 'Common', 'word', ARRAY['verb', 'pseudo-verb'], 'Equivalent to Ureed in MSA', true, '{"synonyms": ["Jay a balli"], "culturalContext": "Used constantly in daily life", "exampleUsage": "Baddi ahweh", "grammaticalNotes": "Acts like a prepositional phrase"}', null),
('وين', 'Wayn', 'Where?', 'Levantine', 'Common', 'word', ARRAY['question'], '', false, '{}', null);
