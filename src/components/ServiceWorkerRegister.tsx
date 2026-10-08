"use client";

import { useEffect } from "react";
import { withBase } from "@/lib/site";

/** Registers sw.js under the base path for offline app-shell caching (production builds only). */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    const register = () => {
      navigator.serviceWorker
        .register(withBase("/sw.js"), { scope: withBase("/") })
        .catch(() => {
          /* offline caching is a nice-to-have */
        });
    };
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);
  return null;
}
