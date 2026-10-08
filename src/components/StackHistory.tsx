"use client";

import { goTo } from "@/lib/nav";
import { useStore } from "@/lib/store";

/** Pro: last 14 days of stack counts as a simple bar row. */
export function StackHistory() {
  const { state, history14 } = useStore();

  if (!state.pro) {
    return (
      <section>
        <h2 className="mb-1 text-lg font-extrabold text-[var(--ink)]">
          Stack history
        </h2>
        <button
          type="button"
          onClick={() => goTo("pro")}
          className="btn-touch relative block w-full overflow-hidden rounded-2xl bg-white/70 px-4 py-4 text-left ring-1 ring-[var(--peach)]"
        >
          <div className="flex h-14 items-end gap-1 opacity-30" aria-hidden>
            {[2, 3, 1, 4, 2, 0, 3, 5, 2, 3, 1, 4, 3, 2].map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-md bg-[var(--coral)]"
                style={{ height: `${Math.max(6, v * 20)}%` }}
              />
            ))}
          </div>
          <p className="mt-3 text-xs font-semibold text-[var(--ink-muted)]">
            🔒 See your last 14 days at a glance with Pro.
          </p>
        </button>
      </section>
    );
  }

  const max = Math.max(1, ...history14.map((d) => d.count));
  const total = history14.reduce((s, d) => s + d.count, 0);
  const activeDays = history14.filter((d) => d.count > 0).length;

  return (
    <section>
      <h2 className="mb-1 text-lg font-extrabold text-[var(--ink)]">
        Stack history
      </h2>
      <p className="mb-3 text-xs text-[var(--ink-muted)]">
        Last 14 days: {total} {total === 1 ? "snack" : "snacks"} across{" "}
        {activeDays} {activeDays === 1 ? "day" : "days"}.
      </p>
      <div className="rounded-2xl bg-white/70 px-3 pb-2 pt-4 ring-1 ring-[var(--peach)]">
        <div className="flex h-24 items-end gap-1">
          {history14.map((d) => (
            <div
              key={d.key}
              className="flex h-full flex-1 flex-col items-center justify-end"
              title={`${d.key}: ${d.count}`}
            >
              {d.count > 0 && (
                <span className="mb-0.5 text-[9px] font-bold text-[var(--ink-muted)]">
                  {d.count}
                </span>
              )}
              <div
                className={`w-full rounded-t-md ${
                  d.count === 0
                    ? "bg-[var(--cream-deep)]"
                    : d.isToday
                      ? "bg-[var(--terracotta)]"
                      : "bg-[var(--coral)]"
                }`}
                style={{
                  height:
                    d.count === 0
                      ? "4px"
                      : `${Math.max(10, (d.count / max) * 80)}%`,
                }}
              />
            </div>
          ))}
        </div>
        <div className="mt-1 flex gap-1">
          {history14.map((d) => (
            <span
              key={d.key}
              className={`flex-1 text-center text-[9px] font-bold ${
                d.isToday ? "text-[var(--terracotta)]" : "text-[var(--ink-muted)]/70"
              }`}
            >
              {d.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
