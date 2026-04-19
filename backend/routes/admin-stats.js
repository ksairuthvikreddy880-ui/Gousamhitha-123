const router = require('express').Router();
const supabase = require('../config/supabase');

// GET /api/admin/stats — fast counts for dashboard
router.get('/stats', async (req, res) => {
    try {
        const [p, v, o, oos] = await Promise.all([
            supabase.from('products').select('id', { count: 'exact', head: true }),
            supabase.from('vendors').select('id', { count: 'exact', head: true }),
            supabase.from('orders').select('id', { count: 'exact', head: true }),
            supabase.from('products').select('id', { count: 'exact', head: true }).eq('stock', 0)
        ]);

        res.json({
            success: true,
            data: {
                totalProducts: p.count || 0,
                totalVendors:  v.count || 0,
                totalOrders:   o.count || 0,
                outOfStock:    oos.count || 0
            }
        });
    } catch (err) {
        console.error('Admin stats error:', err.message);
        res.json({ success: false, data: { totalProducts: 0, totalVendors: 0, totalOrders: 0, outOfStock: 0 } });
    }
});

module.exports = router;
