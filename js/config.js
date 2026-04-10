// API Configuration - Single Source of Truth
// Load this file FIRST before any other scripts

(function() {
    'use strict';
    
    // Set global API base URL
    window.API_BASE_URL = 'https://gousamitha-1-g42x.onrender.com/api';
    
    console.log('⚙️ API Config loaded:', window.API_BASE_URL);
    
    // Helper to get API base (for backwards compatibility)
    window.getAPIBase = function() {
        return window.API_BASE_URL;
    };
    
})();
