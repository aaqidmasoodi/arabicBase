-- Create Profiles Table
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  is_pro boolean default false,
  stripe_customer_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Update handle_new_user function to create profile
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- 1. Create Profile
  insert into public.profiles (id, email, is_pro)
  values (new.id, new.email, false);

  -- 2. Copy Default Dialects
  insert into public.dialects (name, user_id)
  select name, new.id from public.dialects where user_id is null;

  -- 3. Copy Default Categories
  insert into public.categories (name, user_id)
  select name, new.id from public.categories where user_id is null;

  -- 4. Copy Default Entries
  insert into public.entries (term, transliteration, translation, dialect, category, type, tags, notes, has_ai_insights, ai_enrichment, user_id)
  select term, transliteration, translation, dialect, category, type, tags, notes, has_ai_insights, ai_enrichment, new.id
  from public.entries where user_id is null;

  return new;
end;
$$ language plpgsql security definer;
