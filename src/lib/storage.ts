import { buildInitialState, STORAGE_KEY } from "./seed";
import { APP_VERSION, type AppState, type Assets, type OnboardingPhase } from "./types";

const LEGACY_KEYS = ["slow-stack-v1", "slow-stack-v2"];

function isAssets(v: unknown): v is Assets {
  if (!v || typeof v !== "object") return false;
  const a = v as Record<string, unknown>;
  return (
    typeof a.hangBar === "boolean" &&
    typeof a.dumbbells === "boolean" &&
    typeof a.stairs === "boolean"
  );
}

function migrate(raw: unknown): AppState | null {
  if (!raw || typeof raw !== "object") return null;
  const p = raw as Partial<AppState> & { version?: number };

  // Incompatible old shapes (v1/v2 intensity model) → fresh start
  if (typeof p.version !== "number" || p.version < APP_VERSION) {
    return null;
  }

  if (!Array.isArray(p.history)) return null;

  const phase: OnboardingPhase =
    p.onboardingPhase === "intro" ||
    p.onboardingPhase === "quiz" ||
    p.onboardingPhase === "notify" ||
    p.onboardingPhase === "assets" ||
    p.onboardingPhase === "done"
      ? p.onboardingPhase
      : p.onboardingComplete
        ? "done"
        : "intro";

  return {
    version: APP_VERSION,
    onboardingComplete: Boolean(p.onboardingComplete) || phase === "done",
    onboardingPhase: phase,
    quizRatings:
      p.quizRatings && typeof p.quizRatings === "object" ? p.quizRatings : {},
    calibrationLevel:
      typeof p.calibrationLevel === "number"
        ? Math.min(5, Math.max(1, Math.round(p.calibrationLevel * 10) / 10))
        : 2,
    assets: isAssets(p.assets)
      ? p.assets
      : { hangBar: false, dumbbells: false, stairs: false },
    notificationsAsked: Boolean(p.notificationsAsked),
    notificationsGranted: Boolean(p.notificationsGranted),
    rotationIndex:
      typeof p.rotationIndex === "number"
        ? ((p.rotationIndex % 5) + 5) % 5
        : 0,
    repBump: typeof p.repBump === "number" ? Math.max(0, p.repBump) : 0,
    history: p.history,
    streak: typeof p.streak === "number" ? p.streak : 0,
    lastActiveDate:
      typeof p.lastActiveDate === "string" || p.lastActiveDate === null
        ? (p.lastActiveDate ?? null)
        : null,
    // Pro fields added compatibly: older v3 saves simply lack them.
    pro: p.pro === true,
    reminderTime:
      typeof p.reminderTime === "string" && /^\d{2}:\d{2}$/.test(p.reminderTime)
        ? p.reminderTime
        : null,
    reminderEnabled: p.reminderEnabled === true,
    reminderLastFired:
      typeof p.reminderLastFired === "string" ? p.reminderLastFired : null,
  };
}

export function loadState(): AppState {
  if (typeof window === "undefined") return buildInitialState();
  try {
    // Clear legacy keys so old Safety/Lazy shapes never leak in
    for (const k of LEGACY_KEYS) {
      try {
        localStorage.removeItem(k);
      } catch {
        /* ignore */
      }
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = buildInitialState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    const migrated = migrate(parsed);
    if (!migrated) {
      const initial = buildInitialState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return migrated;
  } catch {
    return buildInitialState();
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState(): AppState {
  const initial = buildInitialState();
  saveState(initial);
  return initial;
}
