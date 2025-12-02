-- Function to get unique global entries
-- Deduplicates based on term, dialect, and translation, keeping the newest one.

CREATE OR REPLACE FUNCTION get_unique_global_entries()
RETURNS SETOF entries
LANGUAGE sql
STABLE
AS $$
  SELECT DISTINCT ON (term, dialect, translation) *
  FROM entries
  ORDER BY term, dialect, translation, created_at DESC
  LIMIT 100;
$$;
