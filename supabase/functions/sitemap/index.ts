// @ts-expect-error Deno imports are not supported in this context
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const createSlug = (text: string) => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-') // Allow Arabic chars
        .replace(/^-+|-+$/g, '');
};

serve(async (_req: Request) => {
    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? ''
        )

        const { data: entries, error } = await supabase
            .from('entries')
            .select('id, term, transliteration, dialect, updated_at')
            .order('created_at', { ascending: false })
            .limit(50000)

        if (error) {
            throw error
        }

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://arabicbase.org/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${entries?.map((entry: { id: string; term: string; transliteration: string; dialect: string; updated_at: string }) => {
            const slug = createSlug(entry.transliteration || entry.term);
            return `
  <url>
    <loc>https://arabicbase.org/dictionary/${entry.dialect}/${slug}?entry=${entry.id}</loc>
    <lastmod>${new Date(entry.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
        }).join('') ?? ''}
</urlset>`

        return new Response(sitemap, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600'
            },
        })
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error(err)
        return new Response(errorMessage, { status: 500 })
    }
})
