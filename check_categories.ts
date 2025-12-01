import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCategories() {
    console.log('Checking categories table...');
    const { data, error } = await supabase
        .from('categories')
        .select('name')
        .order('name');

    if (error) {
        console.error('Error fetching categories:', error);
    } else {
        console.log('Categories found:', data.map(c => c.name));
    }
}

checkCategories();
