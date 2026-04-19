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

    if (!isLocal) {
        // Wake up backend — max 3 attempts, stops once awake
        var pingAttempts = 0;
        var woken = false;
        function ping() {
            if (woken || pingAttempts >= 3) return;
            pingAttempts++;
            fetch('https://gousamhitha-123.onrender.com/api/health')
                .then(function(r) {
                    if (r.ok) {
                        woken = true;
                        console.log('✅ Backend awake after', pingAttempts, 'attempt(s)');
                    } else if (!woken && pingAttempts < 3) {
                        setTimeout(ping, 12000);
                    }
                })
                .catch(function() {
                    if (!woken && pingAttempts < 3) setTimeout(ping, 12000);
                });
        }
        ping();

        // Track visit once per page load
        fetch('https://gousamhitha-123.onrender.com/api/track-visit', { method: 'POST' })
            .catch(function() {});
    }

})();
