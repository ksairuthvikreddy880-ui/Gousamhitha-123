// Simple in-memory cache with TTL
const store = new Map();

function get(key) {
    const item = store.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) { store.delete(key); return null; }
    return item.value;
}

function set(key, value, ttlSeconds = 60) {
    store.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
}

function del(key) { store.delete(key); }

function clear() { store.clear(); }

module.exports = { get, set, del, clear };
