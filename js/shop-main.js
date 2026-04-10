/**
 * Entry Point for shop.html
 * Minimal imports to get started
 */

// Set API base URL first
window.API_BASE_URL = window.API_BASE_URL || 'https://gousamitha-1-g42x.onrender.com/api';

// Don't import CSS here - let HTML link tags handle it for now

// Essential scripts only
import './toast.js';
import './api-client.js';
import './auth-handler.js';
import './cart-count-updater.js';
import './product-display-optimized-v2.js';

console.log('✅ Shop page initialized');
