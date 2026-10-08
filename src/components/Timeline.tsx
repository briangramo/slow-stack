"use client";

import type { CompletedMove, Tier } from "@/lib/types";

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

const TIER_LABEL: Record<Tier, string> = {
  bareMinimum: "Bare min",
  next: "Next",
  spunky: "Spunky",
};

export function Timeline({
  moves,
  emptyMessage = "No moves yet, sneak one in!",
}: {
  moves: CompletedMove[];
  emptyMessage?: string;
}) {
  if (moves.length === 0) {
    return (
      <p className="rounded-2xl bg-[var(--cream-deep)] px-4 py-6 text-center text-sm text-[var(--ink-muted)]">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ol className="space-y-2">
      {[...moves].reverse().map((m) => (
        <li
          key={m.id}
          className="flex items-center gap-3 rounded-2xl bg-white/80 px-3 py-2.5 shadow-sm ring-1 ring-[var(--peach)]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--peach)] text-xs font-black uppercase text-[var(--terracotta)]">
            {m.slot.slice(0, 2)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold text-[var(--ink)]">
              {m.variantName}
            </p>
            <p className="text-xs text-[var(--ink-muted)]">
              {formatTime(m.completedAt)} · {TIER_LABEL[m.tier]} · {m.minutes}{" "}
              min
              {m.feedback ? ` · ${m.feedback.replace("_", " ")}` : ""}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
