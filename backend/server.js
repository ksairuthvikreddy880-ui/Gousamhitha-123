require('dotenv').config();

// ── Catch uncaught errors so server never silently dies ───────────────────────
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err.message, err.stack);
});
process.on('unhandledRejection', (reason) => {
    console.error('❌ Unhandled Rejection:', reason);
});

const express = require('express');
const cors = require('cors');

// Import middleware
const { globalErrorHandler, notFound } = require('./middleware/errorHandler');
const { helmetConfig, xssProtection, sanitizeInput, corsOptions, apiLimiter } = require('./middleware/security');

// Import routes
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const vendorRoutes = require('./routes/vendors');
const deliveryRoutes = require('./routes/delivery');
const payoutRoutes = require('./routes/payouts');
const visitorRoutes = require('./routes/visitors');
const adminStatsRoutes = require('./routes/admin-stats');

const app = express();
const PORT = process.env.PORT || 4000;

// ── Security Middleware ───────────────────────────────────────────────────────
app.use(helmetConfig);
app.use(cors(corsOptions));

// ── Body Parsing & Sanitization ───────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(xssProtection);
app.use(sanitizeInput);

// ── Request Logging ───────────────────────────────────────────────────────────
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// ── Rate Limiting ─────────────────────────────────────────────────────────────
app.use('/api/', apiLimiter);

// ── Root & Health Routes ──────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.status(200).json({ success: true, message: 'Gousamhitha API is running 🚀', timestamp: Date.now() });
});

app.get('/api/health', (req, res) => {
    console.log('Health check ping at', new Date().toISOString());
    res.status(200).json({
        success: true,
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        env: process.env.NODE_ENV || 'development'
    });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/payouts', payoutRoutes);
app.use('/api', visitorRoutes);
app.use('/api/admin', adminStatsRoutes);

// ── 404 & Error Handlers ──────────────────────────────────────────────────────
app.use(notFound);
app.use(globalErrorHandler);

// ── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║         Gousamhitha API Server Started                    ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗄️  Supabase URL: ${process.env.SUPABASE_URL ? '✅ Set' : '❌ MISSING'}`);
    console.log(`🔑 Supabase Key: ${process.env.SUPABASE_SERVICE_KEY ? '✅ Set' : '❌ MISSING'}`);
    console.log(`🔐 JWT Secret:   ${process.env.JWT_SECRET ? '✅ Set' : '❌ MISSING'}`);

    // ── Keep-alive self-ping (Render free tier cold start prevention) ─────────
    if (process.env.NODE_ENV === 'production') {
        const SELF_URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
        setInterval(() => {
            const http = require('http');
            const https = require('https');
            const url = SELF_URL + '/api/health';
            const client = url.startsWith('https') ? https : http;
            client.get(url, (res) => {
                console.log(`🏓 Keep-alive ping → ${res.statusCode}`);
            }).on('error', (e) => {
                console.warn('⚠️ Keep-alive ping failed:', e.message);
            });
        }, 14 * 60 * 1000); // every 14 minutes
        console.log(`🏓 Keep-alive ping enabled → ${SELF_URL}/api/health`);
    }
});
