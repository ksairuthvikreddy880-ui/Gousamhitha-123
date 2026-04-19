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
    if (!isLocal) {
        var woken = false;
        function ping() {
            if (woken) return;
            fetch('https://gousamhitha-123.onrender.com/api/health')
                .then(function(r) {
                    if (r.ok) {
                        woken = true;
                        console.log('✅ Backend awake');
                        if (window.ProductOptimizer && window.ProductOptimizer.refresh) {
                            window.ProductOptimizer.refresh();
                        }
                    }
                })
                .catch(function() { setTimeout(ping, 8000); });
        }
        ping();
        setTimeout(ping, 10000);

        // Track visit — fire and forget, never blocks UI
        fetch('https://gousamhitha-123.onrender.com/api/track-visit', { method: 'POST' })
            .catch(function() {});
    }})();
