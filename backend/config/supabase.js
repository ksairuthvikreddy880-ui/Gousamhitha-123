const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY;

if (!url || !key) {
    console.error('⚠️  WARNING: Missing SUPABASE_URL or SUPABASE_SERVICE_KEY — DB calls will fail');
}

// Create client with fallback empty strings so server doesn't crash on startup
const supabase = createClient(url || 'https://placeholder.supabase.co', key || 'placeholder');

module.exports = supabase;
