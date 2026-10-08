/* Slow Stack service worker: hand-written, app-shell offline cache. */
const VERSION = "slow-stack-shell-v2";

// Base path the app is served under, derived from where this file lives:
// "/" at a domain root, "/slow-stack/" on GitHub Pages.
const BASE = new URL("./", self.location.href).pathname;

const SHELL = [
  BASE,
  BASE + "manifest.webmanifest",
  BASE + "icons/icon-192.png",
  BASE + "icons/icon-512.png",
  BASE + "apple-touch-icon.png",
  BASE + "favicon.ico",
];

const STATIC_PREFIX = BASE + "_next/static/";
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Pull hashed _next/static assets referenced by the HTML so the first
// install is enough to run offline.
async function precache() {
  const cache = await caches.open(VERSION);
  await cache.addAll(SHELL);
  try {
    const res = await cache.match(BASE);
    const html = res ? await res.text() : "";
    const assets = new Set();
    const re = new RegExp(
      "[\"'(](" + escapeRe(STATIC_PREFIX) + "[^\"'()\\s]+)[\"')]",
      "g"
    );
    let m;
    while ((m = re.exec(html))) assets.add(m[1]);
    await Promise.all(
      [...assets].map((url) => cache.add(url).catch(() => undefined))
    );
  } catch {
    /* best effort */
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // Gumroad etc. go straight to network

  // Navigations: network first so new deploys land, cached shell offline.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          if (res.ok) caches.open(VERSION).then((c) => c.put(BASE, copy));
          return res;
        })
        .catch(() => caches.match(BASE).then((r) => r || Response.error()))
    );
    return;
  }

  // Hashed build assets are immutable: cache first.
  if (url.pathname.startsWith(STATIC_PREFIX)) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(VERSION).then((c) => c.put(req, copy));
            }
            return res;
          })
      )
    );
    return;
  }

  // Everything else (icons, manifest): stale-while-revalidate.
  event.respondWith(
    caches.match(req).then((hit) => {
      const net = fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => hit);
      return hit || net;
    })
  );
});

// Tapping a reminder notification focuses the open app (or opens it).
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((list) => {
        for (const client of list) {
          if ("focus" in client) return client.focus();
        }
        return self.clients.openWindow(BASE);
      })
  );
});
