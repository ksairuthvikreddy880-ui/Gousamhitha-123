// profile-supabase.js — REWRITTEN: API-only, no direct Supabase access
// All auth and data fetching goes through the backend API (/api/...)

(function () {
    'use strict';

    const API = window.API_BASE_URL || 'https://gousamitha-1-g42x.onrender.com/api';

    function getToken() {
        return localStorage.getItem('token') || localStorage.getItem('auth_token') || '';
    }

    function getUser() {
        try {
            const raw = localStorage.getItem('user') || localStorage.getItem('auth_user');
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    function showError(elementId, html) {
        const el = document.getElementById(elementId);
        if (el) el.innerHTML = html;
    }

    async function checkAndLoadProfile() {
        const user = getUser();
        const token = getToken();

        if (!user || !token) {
            showError('loading', `
                <div style="text-align: center; padding: 2rem; color: #666;">
                    <h3>Not Logged In</h3>
                    <p>Please log in to view your profile.</p>
                    <a href="index.html" style="display:inline-block;margin-top:1rem;padding:.5rem 1rem;background:#4a7c59;color:white;text-decoration:none;border-radius:5px;">
                        Go to Home &amp; Login
                    </a>
                </div>
            `);
            return;
        }

        await loadProfile(user, token);
    }

    async function loadProfile(user, token) {
        const loading = document.getElementById('loading');
        const content = document.getElementById('profile-content');

        try {
            const res = await fetch(`${API}/users/${user.id}`, {
                headers: { 'Authorization': 'Bearer ' + token }
            });

            if (res.status === 401) {
                showError('loading', `
                    <div style="text-align:center;padding:2rem;color:#d32f2f;">
                        <h3>Session Expired</h3>
                        <p>Your session has expired. Please log in again.</p>
                        <a href="index.html" style="display:inline-block;margin-top:1rem;padding:.5rem 1rem;background:#4a7c59;color:white;text-decoration:none;border-radius:5px;">
                            Go to Home
                        </a>
                    </div>
                `);
                return;
            }

            const json = await res.json();
            const userData = json.user || {};

            const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
            const displayName = fullName || user.email?.split('@')[0] || 'User';
            const initial = displayName.charAt(0).toUpperCase();

            const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

            set('profile-avatar', initial);
            set('profile-name', displayName);
            set('profile-email', user.email || 'No email');
            set('field-name', fullName || '-');
            set('field-email', user.email || '-');
            set('field-phone', userData.phone || '-');
            set('field-address', userData.address || '-');
            set('field-joined', user.created_at
                ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                : '-');

            // Orders count
            try {
                const oRes = await fetch(`${API}/orders/user/${user.id}`, { headers: { 'Authorization': 'Bearer ' + token } });
                const oJson = await oRes.json();
                set('field-orders', (oJson.orders || []).length);
            } catch (e) { set('field-orders', '0'); }

            // Cart count
            try {
                const cRes = await fetch(`${API}/cart/${user.id}`, { headers: { 'Authorization': 'Bearer ' + token } });
                const cJson = await cRes.json();
                const cartCount = (cJson.cart || cJson.data || []).reduce((s, i) => s + (i.quantity || 0), 0);
                set('field-cart', cartCount);
            } catch (e) { set('field-cart', '0'); }

            if (loading) loading.style.display = 'none';
            if (content) content.style.display = 'block';

        } catch (error) {
            console.error('Error loading profile:', error);
            showError('loading', `
                <div style="text-align:center;padding:2rem;color:#d32f2f;">
                    <h3>Profile Loading Error</h3>
                    <p>Unable to load your profile data.</p>
                    <button onclick="window.checkAndLoadProfile()" style="padding:.5rem 1rem;background:#4a7c59;color:white;border:none;border-radius:5px;cursor:pointer;margin:.5rem;">
                        Try Again
                    </button>
                    <a href="index.html" style="display:inline-block;margin-top:1rem;padding:.5rem 1rem;background:#666;color:white;text-decoration:none;border-radius:5px;">
                        Go to Home
                    </a>
                </div>
            `);
        }
    }

    async function logoutUser() {
        if (confirm('Are you sure you want to logout?')) {
            try {
                const token = getToken();
                if (token) {
                    await fetch(`${API}/auth/signout`, {
                        method: 'POST',
                        headers: { 'Authorization': 'Bearer ' + token }
                    }).catch(() => {});
                }
                localStorage.removeItem('token');
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');
                localStorage.removeItem('auth_user');
            } catch (e) { /* ignore */ }
            window.location.href = 'index.html';
        }
    }

    // Expose globally
    window.checkAndLoadProfile = checkAndLoadProfile;
    window.loadProfile = loadProfile;
    window.logoutUser = logoutUser;

    // Init on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAndLoadProfile);
    } else {
        checkAndLoadProfile();
    }
})();
