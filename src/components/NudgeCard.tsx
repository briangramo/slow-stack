"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { SLOT_META } from "@/lib/muscles";
import type { Feedback, Tier } from "@/lib/types";
import type { TierPick } from "@/lib/recommend";

const FEEDBACK_OPTS: { id: Feedback; label: string; emoji: string }[] = [
  { id: "too_easy", label: "Too easy", emoji: "🥱" },
  { id: "just_right", label: "Just right", emoji: "👌" },
  { id: "too_hard", label: "Too hard", emoji: "😅" },
];

function doseLabel(v: { reps?: number; durationSec?: number }): string {
  if (v.reps != null) return `${v.reps} reps`;
  if (v.durationSec != null) return `${v.durationSec}s`;
  return "";
}

function celebrateLine(stackCount: number): string {
  const lines = [
    stackCount <= 1 ? "First snack stacked." : `${stackCount} stacked today.`,
    "Nice, snack logged.",
    "Logged. Keep the groove going.",
  ];
  return lines[stackCount % lines.length] ?? lines[0];
}

export function NudgeCard() {
  const { nudge, completeMove, advanceRotation, movesToday } = useStore();
  const [phase, setPhase] = useState<
    "pick" | "feedback" | "another" | "resting"
  >("pick");
  const [pendingTier, setPendingTier] = useState<Tier>("next");
  const [pendingPick, setPendingPick] = useState<TierPick | null>(null);
  const [pendingClassId, setPendingClassId] = useState("");
  const [celebrate, setCelebrate] = useState("");
  const [doneCount, setDoneCount] = useState(movesToday);

  function startDone(tier: Tier) {
    const pick: TierPick =
      tier === "bareMinimum"
        ? nudge.bareMinimum
        : tier === "spunky"
          ? nudge.spunky
          : nudge.next;
    setPendingTier(tier);
    setPendingPick(pick);
    setPendingClassId(nudge.class.classId);
    setPhase("feedback");
  }

  function submitFeedback(fb: Feedback) {
    const pick = pendingPick ?? nudge.next;
    // completeMove advances rotation for the next check-in / "another"
    completeMove(
      pendingClassId || nudge.class.classId,
      pendingTier,
      pick.variant.id,
      pick.variant.name,
      fb
    );

    const count = movesToday + 1;
    setDoneCount(count);
    setCelebrate(celebrateLine(count));
    setPhase("another");
  }

  function doAnother() {
    setPendingPick(null);
    setCelebrate("");
    setPhase("pick");
  }

  function restForNow() {
    setPendingPick(null);
    setPhase("resting");
  }

  function showNextNudge() {
    setCelebrate("");
    setPhase("pick");
  }

  const slot = SLOT_META[nudge.slot];
  const primary = nudge.next;
  const alts = [nudge.bareMinimum, nudge.spunky];

  if (phase === "resting") {
    return (
      <section className="card bg-gradient-to-br from-[var(--mint)]/50 via-[var(--peach)]/40 to-[var(--sun)]/30 p-6 text-center">
        <p className="text-3xl" aria-hidden>
          ✓
        </p>
        <p className="mt-2 text-lg font-bold text-[var(--ink)]">{celebrate}</p>
        <p className="mt-2 text-sm font-semibold text-[var(--ink-muted)]">
          {doneCount === 1
            ? "One snack on today's stack."
            : `${doneCount} snacks on today's stack.`}
        </p>
        <p className="mt-3 text-sm text-[var(--ink-muted)]">
          You&apos;re good, next nudge is ready whenever you are.
        </p>
        <button
          type="button"
          className="btn-primary mt-5 w-full"
          onClick={showNextNudge}
        >
          Show next nudge
        </button>
      </section>
    );
  }

  if (phase === "another") {
    return (
      <section className="card bg-gradient-to-br from-[var(--sun)] via-[var(--peach)] to-[var(--coral)] p-6 text-center">
        <p className="text-3xl" aria-hidden>
          ✓
        </p>
        <p className="mt-2 text-lg font-bold text-[var(--ink)]">{celebrate}</p>
        <p className="mt-1 text-sm font-semibold text-[var(--ink)]/75">
          {doneCount === 1
            ? "Today's stack: 1"
            : `Today's stack: ${doneCount}`}
        </p>
        <p className="mt-4 text-sm text-[var(--ink)]/80">
          In the mood for another?
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            className="btn-primary w-full"
            onClick={doAnother}
          >
            How about another?
          </button>
          <button type="button" className="btn-ghost" onClick={restForNow}>
            I&apos;m good for now
          </button>
        </div>
      </section>
    );
  }

  if (phase === "feedback") {
    const doing = pendingPick?.variant.name ?? "that";
    return (
      <section className="card">
        <p className="text-center text-sm font-semibold text-[var(--ink)]">
          How did <span className="font-extrabold">{doing}</span> feel?
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {FEEDBACK_OPTS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => submitFeedback(f.id)}
              className="btn-touch flex flex-col items-center justify-center gap-1 rounded-2xl border-2 border-[var(--peach)] bg-white px-2 py-3 text-xs font-bold text-[var(--ink)] transition hover:border-[var(--coral)] hover:bg-[var(--peach)]/40"
            >
              <span className="text-2xl">{f.emoji}</span>
              {f.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => submitFeedback("just_right")}
          className="btn-ghost mt-2 text-xs"
        >
          Skip feedback
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <p className="text-xs font-bold uppercase tracking-wider text-[var(--terracotta)]">
        {slot.emoji} {slot.label} · {nudge.reason}
      </p>

      {/* MAIN: Next exercise, prominent on top */}
      <div className="card !p-5 ring-2 ring-[var(--coral)]/40">
        <p className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--terracotta)]">
          Next exercise
        </p>
        <div className="mt-2 flex items-start gap-3">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--peach)] text-3xl">
            {primary.variant.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-black leading-tight text-[var(--ink)]">
              {primary.variant.name}
            </h2>
            <p className="mt-1 text-sm font-semibold text-[var(--ink-muted)]">
              {doseLabel(primary.variant)}
              {primary.variant.note ? ` · ${primary.variant.note}` : ""}
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-[var(--ink-muted)]">
          {primary.variant.cues.slice(0, 2).join(" · ")}
        </p>
        <button
          type="button"
          onClick={() => startDone("next")}
          className="btn-primary mt-5 w-full"
        >
          Mark done · {doseLabel(primary.variant)}
        </button>
      </div>

      {/* Alternates: Bare minimum + Feeling spunky */}
      <p className="pt-1 text-[11px] font-bold uppercase tracking-wide text-[var(--ink-muted)]">
        Or pick an alternate
      </p>
      <div className="grid gap-2">
        {alts.map((pick) => {
          const isBare = pick.tier === "bareMinimum";
          return (
            <button
              key={pick.tier}
              type="button"
              onClick={() => startDone(pick.tier)}
              className={`btn-touch flex items-start gap-3 rounded-2xl border-2 px-3 py-3 text-left transition hover:shadow-md ${
                isBare
                  ? "border-emerald-200 bg-emerald-50/80 hover:border-emerald-400"
                  : "border-rose-200 bg-rose-50/80 hover:border-rose-400"
              }`}
            >
              <span className="text-2xl">{pick.variant.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-extrabold uppercase tracking-wide text-[var(--ink-muted)]">
                  {pick.label}
                </p>
                <p className="font-extrabold text-[var(--ink)]">
                  {pick.variant.name}
                </p>
                <p className="text-xs text-[var(--ink-muted)]">
                  {doseLabel(pick.variant)}
                  {pick.variant.note ? ` · ${pick.variant.note}` : ""}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => advanceRotation()}
        className="btn-ghost text-[11px] text-[var(--ink-muted)]/70 underline-offset-2 hover:underline"
      >
        Skip this slot
      </button>
    </section>
  );
}
