-- Backfill Profiles for existing users
insert into public.profiles (id, email, is_pro)
select id, email, false from auth.users
on conflict (id) do nothing;
