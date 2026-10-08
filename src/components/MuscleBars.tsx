"use client";

import { MUSCLE_GROUPS, MUSCLE_META } from "@/lib/muscles";
import type { MuscleLoadMap } from "@/lib/types";

/** Light load read: region bars only, no body-map / RPG chrome. */
export function MuscleBars({
  load,
  title,
}: {
  load: MuscleLoadMap;
  title: string;
}) {
  const max = Math.max(1, ...MUSCLE_GROUPS.map((g) => load[g]));
  const lit = MUSCLE_GROUPS.filter((g) => (load[g] ?? 0) > 0);

  return (
    <section>
      <h2 className="mb-1 text-lg font-extrabold text-[var(--ink)]">{title}</h2>
      <p className="mb-3 text-xs text-[var(--ink-muted)]">
        Soft read on where today&apos;s snacks landed.
      </p>
      {lit.length === 0 ? (
        <p className="rounded-2xl bg-[var(--cream-deep)] px-4 py-5 text-center text-sm text-[var(--ink-muted)]">
          Quiet so far, first move lights these up.
        </p>
      ) : (
        <ul className="space-y-2">
          {lit.map((g) => {
            const meta = MUSCLE_META[g];
            const val = load[g] ?? 0;
            const pct = Math.round((val / max) * 100);
            return (
              <li key={g}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-semibold text-[var(--ink)]">
                    {meta.emoji} {meta.label}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--cream-deep)]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(8, pct)}%`,
                      background: meta.color,
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
