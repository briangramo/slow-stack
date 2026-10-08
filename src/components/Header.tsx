"use client";

import { useStore } from "@/lib/store";

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  const { state } = useStore();

  return (
    <header className="mb-6">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">
          Slow Stack
        </p>
        {state.streak > 0 && (
          <span className="text-xs font-semibold text-[var(--ink-muted)]">
            🔥 {state.streak}d
          </span>
        )}
      </div>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[var(--ink)]">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1.5 text-sm text-[var(--ink-muted)]">{subtitle}</p>
      )}
    </header>
  );
}
