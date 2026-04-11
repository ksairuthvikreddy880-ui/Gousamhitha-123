// API Configuration - Single Source of Truth
// Load this file FIRST before any other scripts

(function() {
    'use strict';

    var isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    window.API_BASE_URL = isLocal
        ? 'http://localhost:4000/api'
        : 'https://gousamhitha-123.onrender.com/api';

    console.log('⚙️ API Config loaded:', window.API_BASE_URL);

    window.getAPIBase = function() { return window.API_BASE_URL; };

    // Wake up Render backend immediately (free tier cold start fix)
    // Keep pinging every 10s until it responds
    if (!isLocal) {
        var woken = false;
        function ping() {
            if (woken) return;
            fetch('https://gousamhitha-123.onrender.com/api/health')
                .then(function(r) {
                    if (r.ok) {
                        woken = true;
                        console.log('✅ Backend awake');
                        // Trigger product reload if shop page is waiting
                        if (window.ProductOptimizer && window.ProductOptimizer.refresh) {
                            window.ProductOptimizer.refresh();
                        }
                    }
                })
                .catch(function() {
                    console.log('⏳ Backend waking up, retrying...');
                    setTimeout(ping, 8000);
                });
        }
        // Start pinging immediately
        ping();
        // Also ping after 10s in case first ping was too early
        setTimeout(ping, 10000);
    }

})();
