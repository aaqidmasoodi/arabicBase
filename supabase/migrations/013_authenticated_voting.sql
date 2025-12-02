-- Create entry_votes table
CREATE TABLE IF NOT EXISTS entry_votes (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_id UUID REFERENCES entries(id) ON DELETE CASCADE,
  vote_type TEXT CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, entry_id)
);

-- Enable RLS
ALTER TABLE entry_votes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own votes" 
ON entry_votes FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can vote" 
ON entry_votes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their votes" 
ON entry_votes FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can remove their votes" 
ON entry_votes FOR DELETE 
USING (auth.uid() = user_id);

-- Function to update counts
CREATE OR REPLACE FUNCTION update_entry_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    IF NEW.vote_type = 'up' THEN
      UPDATE entries SET upvotes = upvotes + 1 WHERE id = NEW.entry_id;
    ELSE
      UPDATE entries SET downvotes = downvotes + 1 WHERE id = NEW.entry_id;
    END IF;
  ELSIF (TG_OP = 'DELETE') THEN
    IF OLD.vote_type = 'up' THEN
      UPDATE entries SET upvotes = upvotes - 1 WHERE id = OLD.entry_id;
    ELSE
      UPDATE entries SET downvotes = downvotes - 1 WHERE id = OLD.entry_id;
    END IF;
  ELSIF (TG_OP = 'UPDATE') THEN
    -- If vote type changed
    IF OLD.vote_type != NEW.vote_type THEN
      IF NEW.vote_type = 'up' THEN
        UPDATE entries SET upvotes = upvotes + 1, downvotes = downvotes - 1 WHERE id = NEW.entry_id;
      ELSE
        UPDATE entries SET downvotes = downvotes + 1, upvotes = upvotes - 1 WHERE id = NEW.entry_id;
      END IF;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
DROP TRIGGER IF EXISTS on_vote_change ON entry_votes;
CREATE TRIGGER on_vote_change
AFTER INSERT OR UPDATE OR DELETE ON entry_votes
FOR EACH ROW EXECUTE FUNCTION update_entry_vote_counts();

-- Drop the old RPC function as it's no longer needed/safe
DROP FUNCTION IF EXISTS vote_entry(UUID, TEXT);
