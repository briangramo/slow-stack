"use client";

import { useState } from "react";
import { assetLabel } from "@/lib/exercises";
import { useStore } from "@/lib/store";
import type { AssetKey, Assets } from "@/lib/types";

const KEYS: AssetKey[] = ["hangBar", "dumbbells", "stairs"];

export function AssetsScreen({
  mode = "onboarding",
  onSaved,
  onCancel,
}: {
  mode?: "onboarding" | "settings";
  onSaved?: () => void;
  onCancel?: () => void;
}) {
  const { state, finishAssets, updateAssets } = useStore();
  const [assets, setAssets] = useState<Assets>({ ...state.assets });

  function toggle(key: AssetKey) {
    setAssets((a) => ({ ...a, [key]: !a[key] }));
  }

  function save() {
    if (mode === "onboarding") {
      finishAssets(assets);
    } else {
      updateAssets(assets);
      onSaved?.();
    }
  }

  return (
    <div className="page-shell flex min-h-[100dvh] flex-col justify-center">
      <p className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">
        What&apos;s around?
      </p>
      <h1 className="mt-2 text-3xl font-extrabold text-[var(--ink)]">
        Any gear nearby?
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--ink-muted)]">
        We&apos;ll unlock moves that need these, or skip them if you
        don&apos;t. You can change this anytime from Today.
      </p>

      <ul className="mt-8 space-y-3">
        {KEYS.map((key) => {
          const on = assets[key];
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => toggle(key)}
                className={`btn-touch flex w-full items-center justify-between rounded-2xl border-2 px-4 py-4 text-left transition ${
                  on
                    ? "border-[var(--coral)] bg-[var(--peach)]/50"
                    : "border-[var(--peach)] bg-white/80 hover:border-[var(--coral)]"
                }`}
              >
                <span className="font-bold text-[var(--ink)]">
                  {assetLabel(key)}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                    on
                      ? "bg-[var(--terracotta)] text-white"
                      : "bg-[var(--cream-deep)] text-[var(--ink-muted)]"
                  }`}
                >
                  {on ? "Yes" : "No"}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-center text-xs text-[var(--ink-muted)]">
        No gear? Totally fine, plenty of bodyweight snacks.
      </p>

      <button type="button" className="btn-primary mt-8 w-full" onClick={save}>
        {mode === "onboarding" ? "Let's go" : "Save gear"}
      </button>

      {mode === "settings" && onCancel && (
        <button type="button" className="btn-ghost mt-2" onClick={onCancel}>
          Cancel
        </button>
      )}
    </div>
  );
}
