"use client";

import { useSyncExternalStore } from "react";

export type View = "today" | "pro" | "about" | "gear";

const VIEWS: View[] = ["today", "pro", "about", "gear"];

function subscribe(cb: () => void): () => void {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
}

function readHash(): View {
  const h = window.location.hash.replace(/^#/, "") as View;
  return VIEWS.includes(h) ? h : "today";
}

/** Hash-based view routing: works on a static host with zero server config. */
export function useView(): View {
  return useSyncExternalStore(subscribe, readHash, () => "today");
}

export function goTo(view: View): void {
  if (view === "today") {
    // Drop the hash without adding a history entry for a clean URL
    if (window.location.hash) {
      history.pushState(null, "", window.location.pathname + window.location.search);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  } else {
    window.location.hash = view;
  }
  // Scroll after the new view renders
  window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "instant" }));
}
