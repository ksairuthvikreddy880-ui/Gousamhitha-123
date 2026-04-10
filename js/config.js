// API Configuration - Single Source of Truth
// Load this file FIRST before any other scripts

(function() {
    'use strict';

    // Auto-detect: use localhost in dev, production URL otherwise
    var isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    window.API_BASE_URL = isLocal
        ? 'http://localhost:4000/api'
        : 'https://gousamhitha-123.onrender.com/api';

    console.log('⚙️ API Config loaded:', window.API_BASE_URL);

    window.getAPIBase = function() {
        return window.API_BASE_URL;
    };

    // Wake up Render backend immediately on page load (free tier cold start fix)
    if (!isLocal) {
        fetch('https://gousamhitha-123.onrender.com/api/health', { method: 'GET' })
            .then(function() { console.log('✅ Backend is awake'); })
            .catch(function() { console.log('⏳ Backend waking up...'); });
    }

})();
