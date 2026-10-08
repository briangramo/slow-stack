"use client";

import { goTo } from "@/lib/nav";
import { useStore } from "@/lib/store";

export function AboutPanel() {
  const { state } = useStore();
  const backLabel = state.onboardingComplete ? "← Back to Today" : "← Back";

  return (
    <div className="page-shell space-y-6">
      <div>
        <button
          type="button"
          onClick={() => goTo("today")}
          className="btn-touch -ml-2 mb-2 rounded-full px-2 text-sm font-bold text-[var(--ink-muted)] hover:bg-white/60"
        >
          {backLabel}
        </button>
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">
          About
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[var(--ink)]">
          Motion snacks for your workday
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink-muted)]">
          Slow Stack hands you one small exercise whenever you have a minute.
          Desk exercises, micro workouts at work, exercise snacks between
          meetings. Not full workouts, just repetitions that stack up over the
          day. It cycles chest, legs, back, abs, and mobility, and adjusts to
          your level as you go.
        </p>
      </div>

      <section className="card">
        <h2 className="text-lg font-extrabold text-[var(--ink)]">Free</h2>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          The whole Today loop: next exercise, bare minimum, feeling spunky,
          gear-aware moves, today&apos;s stack and load bars. No account, no
          ads, data stays on your device.
        </p>
        <h2 className="mt-5 text-lg font-extrabold text-[var(--ink)]">
          Pro, $4.99 once
        </h2>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          Extra move library, a daily reminder time, and 14-day stack history.
        </p>
        <button
          type="button"
          onClick={() => goTo("pro")}
          className="btn-ghost mt-3 ring-1 ring-[var(--peach)]"
        >
          {state.pro ? "Pro settings" : "See Pro"}
        </button>
      </section>

      <section className="card">
        <h2 className="text-lg font-extrabold text-[var(--ink)]">
          Put it on your home screen
        </h2>
        <ul className="mt-2 space-y-2 text-sm text-[var(--ink-muted)]">
          <li>
            <b className="text-[var(--ink)]">iPhone / iPad:</b> open in Safari,
            tap Share, then Add to Home Screen.
          </li>
          <li>
            <b className="text-[var(--ink)]">Android / Chrome:</b> tap the menu,
            then Install app or Add to Home screen.
          </li>
          <li>
            <b className="text-[var(--ink)]">Desktop:</b> use the install icon
            in the address bar.
          </li>
        </ul>
        <p className="mt-3 text-xs text-[var(--ink-muted)]">
          Once installed it opens like an app and works offline.
        </p>
      </section>
    </div>
  );
}
