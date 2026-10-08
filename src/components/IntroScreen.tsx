"use client";

import { INTRO_EXAMPLES } from "@/lib/exercises";
import { goTo } from "@/lib/nav";
import { useStore } from "@/lib/store";

export function IntroScreen() {
  const { setOnboardingPhase } = useStore();

  return (
    <div className="page-shell flex min-h-[100dvh] flex-col justify-center">
      <p className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">
        Slow Stack
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--ink)]">
        Motion snacks, not workouts
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--ink-muted)]">
        Hey, we&apos;re going to give you something simple to do whenever you
        have a minute. These aren&apos;t full workouts. We&apos;re just getting
        in repetitions over time. Tiny stacks that add up.
      </p>

      <p className="mt-8 text-xs font-bold uppercase tracking-wide text-[var(--ink-muted)]">
        Stuff like…
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {INTRO_EXAMPLES.map((ex) => (
          <div
            key={ex.name}
            className="flex min-h-[44px] items-center gap-2.5 rounded-2xl bg-white/80 px-3 py-3 ring-1 ring-[var(--peach)]"
          >
            <span className="text-2xl">{ex.emoji}</span>
            <span className="text-sm font-bold text-[var(--ink)]">
              {ex.name}
            </span>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="btn-primary mt-10 w-full"
        onClick={() => setOnboardingPhase("quiz")}
      >
        Continue
      </button>
      <button
        type="button"
        className="btn-ghost mt-2"
        onClick={() => goTo("about")}
      >
        What is Slow Stack?
      </button>
    </div>
  );
}
