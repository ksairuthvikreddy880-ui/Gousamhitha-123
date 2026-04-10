/**
 * Main Entry Point for index.html (Home Page)
 * Minimal imports to get started
 */

// Set API base URL — config.js should have already set this via window.API_BASE_URL
if (!window.API_BASE_URL) {
    window.API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:4000/api'
        : 'https://gousamhitha-123.onrender.com/api';
}

// Don't import CSS here - let HTML link tags handle it for now
// We can add CSS imports later once JS is working

// Essential scripts only
import './toast.js';
import './api-client.js';
import './auth-handler.js';
import './cart-count-updater.js';
import './product-display-optimized-v2.js';

console.log('✅ Main entry point loaded - Home page initialized');

