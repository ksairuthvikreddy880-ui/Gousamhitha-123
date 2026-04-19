const router = require('express').Router();
const supabase = require('../config/supabase');

// POST /api/track-visit — record a page visit
router.post('/track-visit', async (req, res) => {
    try {
        const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || 'unknown';
        const user_agent = req.headers['user-agent'] || 'unknown';

        await supabase.from('visitors').insert([{ ip, user_agent }]);

        res.json({ success: true });
    } catch (err) {
        // Silent fail — never block the user
        res.json({ success: false });
    }
});

// GET /api/visitors/stats — total + last 7 days (admin use)
router.get('/visitors/stats', async (req, res) => {
    try {
        const { count: total } = await supabase
            .from('visitors')
            .select('id', { count: 'exact', head: true });

        const since7days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const { count: last7days } = await supabase
            .from('visitors')
            .select('id', { count: 'exact', head: true })
            .gte('visited_at', since7days);

        res.json({ success: true, data: { total: total || 0, last7days: last7days || 0 } });
    } catch (err) {
        res.json({ success: false, data: { total: 0, last7days: 0 } });
    }
});

module.exports = router;
