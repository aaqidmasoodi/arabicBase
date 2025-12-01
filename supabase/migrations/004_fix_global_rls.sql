-- Enable RLS on global tables
ALTER TABLE dialects ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policies for Dialects
DROP POLICY IF EXISTS "Enable read access for all users" ON dialects;
CREATE POLICY "Enable read access for all users" ON dialects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for authenticated users" ON dialects;
CREATE POLICY "Enable insert for authenticated users" ON dialects FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policies for Categories
DROP POLICY IF EXISTS "Enable read access for all users" ON categories;
CREATE POLICY "Enable read access for all users" ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for authenticated users" ON categories;
CREATE POLICY "Enable insert for authenticated users" ON categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
