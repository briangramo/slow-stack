"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";

export function NotifyScreen() {
  const { finishNotify } = useStore();
  const [busy, setBusy] = useState(false);
  const supported =
    typeof window !== "undefined" && "Notification" in window;

  async function allow() {
    setBusy(true);
    try {
      if (!supported) {
        finishNotify(false);
        return;
      }
      const result = await Notification.requestPermission();
      finishNotify(result === "granted");
    } catch {
      finishNotify(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page-shell flex min-h-[100dvh] flex-col justify-center">
      <p className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">
        Stay in the groove
      </p>
      <h1 className="mt-2 text-3xl font-extrabold text-[var(--ink)]">
        Want a nudge now and then?
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--ink-muted)]">
        Turn on notifications and we&apos;ll remind you to sneak in a motion
        snack. Totally optional, you can always come back on your own.
      </p>

      {!supported && (
        <p className="mt-4 rounded-2xl bg-[var(--cream-deep)] px-4 py-3 text-sm text-[var(--ink-muted)]">
          This browser doesn&apos;t support notifications, no worries, continue
          ahead.
        </p>
      )}

      <div className="mt-10 flex flex-col gap-2">
        <button
          type="button"
          className="btn-primary w-full"
          disabled={busy}
          onClick={allow}
        >
          {supported ? "Allow notifications" : "Continue"}
        </button>
        {supported && (
          <button
            type="button"
            className="btn-ghost"
            disabled={busy}
            onClick={() => finishNotify(false)}
          >
            Not now, continue
          </button>
        )}
      </div>
    </div>
  );
}
