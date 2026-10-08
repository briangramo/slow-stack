"use client";

import { AboutPanel } from "@/components/AboutPanel";
import { AssetsScreen } from "@/components/AssetsScreen";
import { Header } from "@/components/Header";
import { IntroScreen } from "@/components/IntroScreen";
import { MuscleBars } from "@/components/MuscleBars";
import { NotifyScreen } from "@/components/NotifyScreen";
import { NudgeCard } from "@/components/NudgeCard";
import { ProScreen } from "@/components/ProScreen";
import { QuizScreen } from "@/components/QuizScreen";
import { ReminderManager } from "@/components/ReminderManager";
import { StackHistory } from "@/components/StackHistory";
import { Timeline } from "@/components/Timeline";
import { goTo, useView } from "@/lib/nav";
import { useStore } from "@/lib/store";
import { todayStart } from "@/lib/recommend";
import { ROTATION_ORDER } from "@/lib/types";
import { SLOT_META } from "@/lib/muscles";

export default function HomePage() {
  const { state, movesToday, minutesToday, todayLoad, redoSetup } = useStore();
  const view = useView();

  if (view === "about") return <AboutPanel />;

  if (!state.onboardingComplete) {
    switch (state.onboardingPhase) {
      case "intro":
        return <IntroScreen />;
      case "quiz":
        return <QuizScreen />;
      case "notify":
        return <NotifyScreen />;
      case "assets":
        return <AssetsScreen mode="onboarding" />;
      default:
        return <IntroScreen />;
    }
  }

  if (view === "pro") {
    return (
      <>
        <ReminderManager showBanner={false} />
        <ProScreen />
      </>
    );
  }

  if (view === "gear") {
    return (
      <AssetsScreen
        mode="settings"
        onSaved={() => goTo("today")}
        onCancel={() => goTo("today")}
      />
    );
  }

  const todayMoves = state.history.filter(
    (h) => new Date(h.completedAt) >= todayStart()
  );

  const nextSlot = ROTATION_ORDER[state.rotationIndex % ROTATION_ORDER.length];
  const slotLabel = SLOT_META[nextSlot]?.label ?? nextSlot;

  function confirmRedoSetup() {
    const ok = window.confirm(
      "Redo setup from scratch? This clears your quiz, gear, and history."
    );
    if (ok) redoSetup();
  }

  const footerLink =
    "btn-touch rounded-full px-3 py-2 text-xs font-semibold text-[var(--ink-muted)]/70 underline-offset-2 hover:text-[var(--ink-muted)] hover:underline";

  return (
    <div className="page-shell">
      <Header
        title="Today"
        subtitle={`One motion snack. Up next in the cycle: ${slotLabel}.`}
      />

      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white/70 px-4 py-4 ring-1 ring-[var(--peach)]">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--ink-muted)]">
            Moves today
          </p>
          <p className="mt-1 text-3xl font-black text-[var(--ink)]">
            {movesToday}
          </p>
        </div>
        <div className="rounded-2xl bg-white/70 px-4 py-4 ring-1 ring-[var(--peach)]">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--ink-muted)]">
            Minutes
          </p>
          <p className="mt-1 text-3xl font-black text-[var(--ink)]">
            {minutesToday}
          </p>
        </div>
      </div>

      <ReminderManager showBanner />

      <NudgeCard />

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-extrabold text-[var(--ink)]">
          Today&apos;s stack
        </h2>
        <Timeline
          moves={todayMoves}
          emptyMessage="Nothing stacked yet, your nudge is waiting above."
        />
      </section>

      <section className="mt-10">
        <MuscleBars load={todayLoad} title="Today's load" />
      </section>

      <section className="mt-10">
        <StackHistory />
      </section>

      <footer className="mt-12 border-t border-[var(--peach)]/60 pt-6">
        <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-0">
          <button
            type="button"
            onClick={() => goTo("gear")}
            className={footerLink}
          >
            Update gear
          </button>
          <span className="text-[var(--ink-muted)]/30" aria-hidden>
            ·
          </span>
          <button
            type="button"
            onClick={confirmRedoSetup}
            className={footerLink}
          >
            Redo setup
          </button>
          <span className="text-[var(--ink-muted)]/30" aria-hidden>
            ·
          </span>
          <button
            type="button"
            onClick={() => goTo("about")}
            className={footerLink}
          >
            About
          </button>
        </div>
        <div className="mt-1 flex justify-center">
          <button
            type="button"
            onClick={() => goTo("pro")}
            className="btn-touch rounded-full px-3 py-2 text-xs font-bold text-[var(--terracotta)]/80 underline-offset-2 hover:text-[var(--terracotta)] hover:underline"
          >
            {state.pro ? "Pro settings" : "Go Pro, $4.99 once"}
          </button>
        </div>
      </footer>
    </div>
  );
}
