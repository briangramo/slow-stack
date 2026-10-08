"use client";

import { useEffect, useState } from "react";
import { localDayKey, useStore } from "@/lib/store";
import { withBase } from "@/lib/site";

const TICK_MS = 30_000;

function minutesOf(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

async function showSystemNotification(title: string, body: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  const opts: NotificationOptions = {
    body,
    icon: withBase("/icons/icon-192.png"),
    badge: withBase("/icons/icon-192.png"),
    tag: "slow-stack-daily",
  };
  try {
    // Installed apps (Android especially) need the SW to show notifications.
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) {
        await reg.showNotification(title, opts);
        return;
      }
    }
    new Notification(title, opts);
  } catch {
    /* banner still shows in-app */
  }
}

/**
 * Pro daily reminder. Checks the clock while the app is open (tab or
 * installed PWA). No push server, so a fully closed app stays quiet.
 */
export function ReminderManager({ showBanner }: { showBanner: boolean }) {
  const { state, markReminderFired } = useStore();
  const [now, setNow] = useState(() => Date.now());
  const [dismissedKey, setDismissedKey] = useState<string | null>(null);

  const active = state.pro && state.reminderEnabled && !!state.reminderTime;

  useEffect(() => {
    if (!active) return;
    const tick = () => setNow(Date.now());
    const id = window.setInterval(tick, TICK_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisible);
    const first = window.setTimeout(tick, 0);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(first);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [active]);

  const nowDate = new Date(now);
  const todayKey = localDayKey(nowDate);
  const nowMin = nowDate.getHours() * 60 + nowDate.getMinutes();
  const dueMin = state.reminderTime ? minutesOf(state.reminderTime) : 0;
  const pastTime = active && nowMin >= dueMin;

  // Moves logged today after the reminder time clear the nudge
  const stackedSinceReminder = state.history.some((h) => {
    const d = new Date(h.completedAt);
    return (
      localDayKey(d) === todayKey && d.getHours() * 60 + d.getMinutes() >= dueMin
    );
  });

  const shouldFire =
    pastTime && state.reminderLastFired !== todayKey && !stackedSinceReminder;

  useEffect(() => {
    if (!shouldFire) return;
    const id = window.setTimeout(() => {
      markReminderFired(todayKey);
      void showSystemNotification(
        "Motion snack time",
        "One small move, then back to it. Your next exercise is ready."
      );
    }, 0);
    return () => window.clearTimeout(id);
  }, [shouldFire, todayKey, markReminderFired]);

  const bannerVisible =
    showBanner &&
    pastTime &&
    state.reminderLastFired === todayKey &&
    !stackedSinceReminder &&
    dismissedKey !== todayKey;

  if (!bannerVisible) return null;

  return (
    <div
      role="status"
      className="mb-5 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[var(--sun)]/70 to-[var(--peach)] px-4 py-3 ring-1 ring-[var(--coral)]/40"
    >
      <span className="text-2xl" aria-hidden>
        ⏰
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-extrabold text-[var(--ink)]">
          Motion snack time
        </p>
        <p className="text-xs text-[var(--ink)]/75">
          Your daily nudge. One move below, then back to it.
        </p>
      </div>
      <button
        type="button"
        onClick={() => setDismissedKey(todayKey)}
        className="btn-touch rounded-full px-3 text-xs font-bold text-[var(--ink-muted)] hover:bg-white/60"
        aria-label="Dismiss reminder"
      >
        Later
      </button>
    </div>
  );
}
