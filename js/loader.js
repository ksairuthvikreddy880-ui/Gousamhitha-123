// Global Loader — skip on shop page (has its own skeleton loader)
(function () {
    'use strict';

    var isShop = window.location.pathname.includes('shop');
    if (isShop) return;

    // ── Inject HTML ───────────────────────────────────────────────────────────
    var el = document.createElement('div');
    el.id = 'global-loader';
    el.innerHTML = '<svg viewBox="25 25 50 50"><circle r="20" cy="50" cx="50"></circle></svg>';
    document.body.appendChild(el);

    var _count = 0; // track concurrent requests

    function showLoader() {
        _count++;
        el.classList.add('active');
    }

    function hideLoader() {
        _count = Math.max(0, _count - 1);
        if (_count === 0) el.classList.remove('active');
    }

    // Expose globally
    window.showLoader = showLoader;
    window.hideLoader = hideLoader;

    // ── Wrap fetch ────────────────────────────────────────────────────────────
    var _origFetch = window.fetch;
    window.fetch = function (url, opts) {
        // Skip health/ping/track calls — don't show loader for background requests
        var urlStr = typeof url === 'string' ? url : (url && url.url) || '';
        var silent = urlStr.includes('/api/health') ||
                     urlStr.includes('/api/track-visit') ||
                     urlStr.includes('accounts.google.com');
        if (!silent) showLoader();

        return _origFetch.apply(this, arguments).then(function (res) {
            if (!silent) hideLoader();
            return res;
        }).catch(function (err) {
            if (!silent) hideLoader();
            throw err;
        });
    };

    // ── Page navigation ───────────────────────────────────────────────────────
    document.addEventListener('click', function (e) {
        var a = e.target.closest('a[href]');
        if (!a) return;
        var href = a.getAttribute('href');
        // Only internal .html links, not anchors or external
        if (!href || href.startsWith('#') || href.startsWith('http') ||
            href.startsWith('javascript') || href.startsWith('mailto')) return;
        if (href.includes('shop')) return; // skip shop page
        showLoader();
        // Safety: hide after 5s in case navigation stalls
        setTimeout(hideLoader, 5000);
    });

    // Hide on page fully loaded
    window.addEventListener('load', function () {
        _count = 0;
        el.classList.remove('active');
    });

})();
