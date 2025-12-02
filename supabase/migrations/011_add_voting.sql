-- Add upvotes and downvotes columns to entries table
ALTER TABLE entries 
ADD COLUMN IF NOT EXISTS upvotes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS downvotes INTEGER DEFAULT 0;

-- Create a secure RPC function for voting
-- This allows public users to increment vote counts without having direct UPDATE access to the table
CREATE OR REPLACE FUNCTION vote_entry(entry_id UUID, vote_type TEXT)
RETURNS VOID AS $$
BEGIN
  IF vote_type = 'up' THEN
    UPDATE entries
    SET upvotes = upvotes + 1
    WHERE id = entry_id;
  ELSIF vote_type = 'down' THEN
    UPDATE entries
    SET downvotes = downvotes + 1
    WHERE id = entry_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to public (anon) and authenticated users
GRANT EXECUTE ON FUNCTION vote_entry(UUID, TEXT) TO anon, authenticated;
