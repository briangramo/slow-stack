"use client";

import { useState } from "react";
import { PRO_CLASSES, PRO_MOVE_COUNT, assetLabel } from "@/lib/exercises";
import { SLOT_META } from "@/lib/muscles";
import { goTo } from "@/lib/nav";
import { GUMROAD_BUY_URL, tryUnlockPro } from "@/lib/pro";
import { useStore } from "@/lib/store";
import { ROTATION_ORDER } from "@/lib/types";
import { StackHistory } from "./StackHistory";

const HAS_GUMROAD = Boolean(
  (process.env.NEXT_PUBLIC_GUMROAD_PRODUCT_ID ?? "").trim()
);

function BackLink() {
  return (
    <button
      type="button"
      onClick={() => goTo("today")}
      className="btn-touch -ml-2 mb-2 rounded-full px-2 text-sm font-bold text-[var(--ink-muted)] hover:bg-white/60"
    >
      ← Back to Today
    </button>
  );
}

function UnlockForm() {
  const { unlockPro } = useStore();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const result = await tryUnlockPro(code);
    setBusy(false);
    if (result.ok) {
      unlockPro();
      window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "instant" }));
      setCode("");
    } else {
      setError(result.error);
    }
  }

  return (
    <form onSubmit={submit} className="card">
      <label
        htmlFor="pro-code"
        className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--terracotta)]"
      >
        Already bought it?
      </label>
      <p className="mt-1 text-xs text-[var(--ink-muted)]">
        {HAS_GUMROAD
          ? "Paste the license key or unlock code from your Gumroad receipt."
          : "Paste the unlock code from your Gumroad receipt."}
      </p>
      <input
        id="pro-code"
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        placeholder={HAS_GUMROAD ? "XXXXXXXX-XXXXXXXX-..." : "Unlock code"}
        className="mt-3 w-full rounded-2xl border-2 border-[var(--peach)] bg-white px-4 py-3 font-mono text-sm text-[var(--ink)] outline-none focus:border-[var(--coral)]"
      />
      {error && (
        <p role="alert" className="mt-2 text-xs font-semibold text-[var(--terracotta)]">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="btn-primary mt-4 w-full"
        disabled={busy || !code.trim()}
      >
        {busy ? "Checking..." : "Unlock Pro"}
      </button>
      <p className="mt-3 text-center text-[11px] text-[var(--ink-muted)]">
        Checked right here in your browser. Pro is saved on this device only.
      </p>
    </form>
  );
}

function ReminderSettings() {
  const { state, setReminder } = useStore();
  const supported =
    typeof window !== "undefined" && "Notification" in window;
  const [perm, setPerm] = useState<NotificationPermission | "unsupported">(
    () => (supported ? Notification.permission : "unsupported")
  );

  async function askPermission() {
    if (!supported) return;
    try {
      const result = await Notification.requestPermission();
      setPerm(result);
    } catch {
      /* ignore */
    }
  }

  return (
    <section className="card">
      <h2 className="text-lg font-extrabold text-[var(--ink)]">
        Daily reminder
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-[var(--ink-muted)]">
        Pick a time. When it comes around, you get a nudge banner on Today and
        a notification if you allow them. Heads up: reminders fire while Slow
        Stack is open in a tab or running as an installed app. There is no push
        server, so a fully closed app stays quiet.
      </p>

      <div className="mt-4 flex items-center gap-3">
        <input
          type="time"
          aria-label="Reminder time"
          value={state.reminderTime ?? "10:30"}
          onChange={(e) =>
            setReminder({ time: e.target.value || null, enabled: true })
          }
          className="min-h-[44px] flex-1 rounded-2xl border-2 border-[var(--peach)] bg-white px-4 font-bold text-[var(--ink)] outline-none focus:border-[var(--coral)]"
        />
        <button
          type="button"
          onClick={() =>
            setReminder({
              enabled: !state.reminderEnabled,
              time: state.reminderTime ?? "10:30",
            })
          }
          className={`btn-touch rounded-full px-4 text-sm font-extrabold ${
            state.reminderEnabled
              ? "bg-[var(--terracotta)] text-white"
              : "bg-[var(--cream-deep)] text-[var(--ink-muted)]"
          }`}
          aria-pressed={state.reminderEnabled}
        >
          {state.reminderEnabled ? "On" : "Off"}
        </button>
      </div>

      {perm === "default" && (
        <button
          type="button"
          onClick={askPermission}
          className="btn-ghost mt-2 ring-1 ring-[var(--peach)]"
        >
          Allow notifications too
        </button>
      )}
      {perm === "denied" && (
        <p className="mt-3 text-xs text-[var(--ink-muted)]">
          Notifications are blocked in your browser settings, so you will get
          the in-app banner only.
        </p>
      )}
      {perm === "unsupported" && (
        <p className="mt-3 text-xs text-[var(--ink-muted)]">
          This browser does not support notifications, so you will get the
          in-app banner only. On iPhone, add Slow Stack to your Home Screen
          first.
        </p>
      )}
    </section>
  );
}

function ProLibrary({ unlocked }: { unlocked: boolean }) {
  return (
    <section>
      <h2 className="mb-1 text-lg font-extrabold text-[var(--ink)]">
        Pro move library
      </h2>
      <p className="mb-3 text-xs text-[var(--ink-muted)]">
        {unlocked
          ? `${PRO_MOVE_COUNT} extra moves now mixed into your rotation. Gear moves only show if you have the gear.`
          : `${PRO_MOVE_COUNT} extra moves across chest, legs, back, abs, and mobility.`}
      </p>
      <ul className="space-y-2">
        {ROTATION_ORDER.flatMap((slot) =>
          PRO_CLASSES.filter((c) => c.slot === slot).map((c) => {
            const moves = [
              c.bareMinimum,
              c.next,
              c.spunky,
              ...(c.spunkyOptions ?? []),
            ];
            return (
              <li
                key={c.classId}
                className="rounded-2xl bg-white/70 px-4 py-3 ring-1 ring-[var(--peach)]"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-extrabold text-[var(--ink)]">
                    {c.emoji} {c.name}
                  </p>
                  <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--terracotta)]">
                    {SLOT_META[c.slot].label}
                  </span>
                </div>
                <p
                  className={`mt-1 text-xs text-[var(--ink-muted)] ${
                    unlocked ? "" : "select-none blur-[2px]"
                  }`}
                  aria-hidden={!unlocked}
                >
                  {moves.map((m) => m.name).join(" · ")}
                </p>
                {c.requiredAsset && (
                  <p className="mt-1 text-[10px] font-semibold text-[var(--ink-muted)]/80">
                    Needs: {assetLabel(c.requiredAsset)}
                  </p>
                )}
              </li>
            );
          })
        )}
      </ul>
    </section>
  );
}

export function ProScreen() {
  const { state } = useStore();

  if (state.pro) {
    return (
      <div className="page-shell space-y-8">
        <div>
          <BackLink />
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">
            Slow Stack Pro
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[var(--ink)]">
            Pro is on. Thank you!
          </h1>
          <p className="mt-2 text-sm text-[var(--ink-muted)]">
            Your support keeps Slow Stack simple and ad-free.
          </p>
        </div>
        <ReminderSettings />
        <StackHistory />
        <ProLibrary unlocked />
      </div>
    );
  }

  return (
    <div className="page-shell space-y-8">
      <div>
        <BackLink />
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">
          Slow Stack Pro
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[var(--ink)]">
          A little more, once.
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">
          The free Today loop stays free, forever. Pro adds a few extras for
          people who stack every day. $4.99, one time, no subscription.
        </p>
      </div>

      <section className="card !p-5 ring-2 ring-[var(--coral)]/40">
        <ul className="space-y-3 text-sm text-[var(--ink)]">
          <li className="flex gap-3">
            <span className="text-xl" aria-hidden>
              📚
            </span>
            <span>
              <b>{PRO_MOVE_COUNT} extra moves</b> mixed into your rotation,
              matched to your level and gear.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-xl" aria-hidden>
              ⏰
            </span>
            <span>
              <b>Daily reminder</b> at a time you pick, while the app is open
              or installed.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-xl" aria-hidden>
              📊
            </span>
            <span>
              <b>Stack history</b>, your last 14 days as a simple bar row.
            </span>
          </li>
        </ul>
        <a
          href={GUMROAD_BUY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-5 w-full"
        >
          Get Pro, $4.99 once
        </a>
        <p className="mt-2 text-center text-[11px] text-[var(--ink-muted)]">
          Opens Gumroad in a new tab. Your unlock code arrives with the receipt.
        </p>
      </section>

      <UnlockForm />
      <ProLibrary unlocked={false} />
    </div>
  );
}
