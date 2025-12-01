-- Fix foreign key on entries table to cascade delete
DO $$
DECLARE
    r record;
BEGIN
    -- Find all foreign key constraints on entries table that reference auth.users
    FOR r IN 
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'public.entries'::regclass 
        AND confrelid = 'auth.users'::regclass
        AND contype = 'f'
    LOOP
        -- Drop the constraint
        EXECUTE 'ALTER TABLE public.entries DROP CONSTRAINT ' || quote_ident(r.conname);
    END LOOP;
END $$;

-- Re-add the constraint with ON DELETE CASCADE
ALTER TABLE public.entries
ADD CONSTRAINT entries_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;
