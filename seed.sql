-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create Dialects Table
create table public.dialects (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Categories Table
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Entries Table
create table public.entries (
  id uuid default uuid_generate_v4() primary key,
  term text not null,
  transliteration text,
  translation text not null,
  dialect text not null, -- Storing name directly for simplicity, or could be FK
  category text not null, -- Storing name directly for simplicity, or could be FK
  type text not null default 'word',
  tags text[] default '{}',
  notes text,
  has_ai_insights boolean default false,
  ai_enrichment jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.dialects enable row level security;
alter table public.categories enable row level security;
alter table public.entries enable row level security;

-- Create Policies (Allow public access for now as per "anon" usage)
create policy "Allow public read access" on public.dialects for select using (true);
create policy "Allow public insert access" on public.dialects for insert with check (true);
create policy "Allow public delete access" on public.dialects for delete using (true);

create policy "Allow public read access" on public.categories for select using (true);
create policy "Allow public insert access" on public.categories for insert with check (true);
create policy "Allow public delete access" on public.categories for delete using (true);

create policy "Allow public read access" on public.entries for select using (true);
create policy "Allow public insert access" on public.entries for insert with check (true);
create policy "Allow public update access" on public.entries for update using (true);
create policy "Allow public delete access" on public.entries for delete using (true);

-- Seed Initial Data

-- Dialects
insert into public.dialects (name) values
('Levantine'), ('Egyptian'), ('Gulf'), ('Maghrebi'), ('Iraqi'), ('Yemeni'), ('Sudanese'), ('MSA');

-- Categories
insert into public.categories (name) values
('Greeting'), ('Food'), ('Travel'), ('Family'), ('Work'), ('Emotions'), ('Nature'), ('Time'), ('Other');

-- Fake Entries
insert into public.entries (term, transliteration, translation, dialect, category, type, tags, notes, has_ai_insights, ai_enrichment) values
('مرحبا', 'Marhaba', 'Hello', 'Levantine', 'Greeting', 'word', ARRAY['common', 'basic'], 'Standard greeting', true, '{"synonyms": ["Ahlan"], "culturalContext": "Used anytime", "exampleUsage": "Marhaba kifak?", "grammaticalNotes": "Fixed form"}'),
('كيف حالك', 'Kif halak', 'How are you?', 'Levantine', 'Greeting', 'phrase', ARRAY['question'], 'Addressed to male', false, '{}'),
('خبز', 'Khobz', 'Bread', 'Egyptian', 'Food', 'word', ARRAY['staple'], 'Aish in Egyptian', true, '{"synonyms": ["Aish"], "culturalContext": "Life", "exampleUsage": "Aish baladi", "grammaticalNotes": "Masculine noun"}'),
('سيارة', 'Sayyara', 'Car', 'Gulf', 'Travel', 'word', ARRAY['transport'], '', false, '{}'),
('عمل', 'Amal', 'Work', 'MSA', 'Work', 'word', ARRAY['formal'], '', false, '{}'),
('سعيد', 'Saeed', 'Happy', 'Maghrebi', 'Emotions', 'word', ARRAY['feeling'], '', false, '{}'),
('شجرة', 'Shajara', 'Tree', 'Iraqi', 'Nature', 'word', ARRAY['plant'], '', false, '{}'),
('اليوم', 'Al-yawm', 'Today', 'Yemeni', 'Time', 'word', ARRAY['time'], '', false, '{}'),
('شكرا', 'Shukran', 'Thank you', 'Sudanese', 'Greeting', 'word', ARRAY['polite'], '', true, '{"synonyms": ["Mashkoor"], "culturalContext": "Universal thanks", "exampleUsage": "Shukran jazilan", "grammaticalNotes": "Fixed form"}'),
('يلا', 'Yalla', 'Let''s go / Come on', 'Levantine', 'Other', 'slang', ARRAY['common', 'versatile'], 'Very common word', true, '{"synonyms": ["Mashi"], "culturalContext": "Used for encouragement or hurrying", "exampleUsage": "Yalla bye", "grammaticalNotes": "Imperative-like"}');
