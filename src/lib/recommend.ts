import { EXERCISE_CLASSES, classesForSlot, getClass } from "./exercises";
import { addLoad, emptyLoad } from "./muscles";
import type {
  AppState,
  Assets,
  CompletedMove,
  ExerciseClass,
  ExerciseVariant,
  MuscleLoadMap,
  RotationSlot,
  Tier,
} from "./types";
import { ROTATION_ORDER } from "./types";

const TIER_WEIGHT: Record<Tier, number> = {
  bareMinimum: 0.6,
  next: 1,
  spunky: 1.4,
};

export function loadFromHistory(
  history: CompletedMove[],
  since?: Date
): MuscleLoadMap {
  let load = emptyLoad();
  for (const move of history) {
    const at = new Date(move.completedAt);
    if (since && at < since) continue;
    const weight = TIER_WEIGHT[move.tier] ?? 1;
    load = addLoad(load, move.muscles, weight);
  }
  return load;
}

export function todayStart(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function weekStart(): Date {
  const d = todayStart();
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  return d;
}

export interface TierPick {
  tier: Tier;
  label: string;
  variant: ExerciseVariant;
}

export interface Nudge {
  slot: RotationSlot;
  class: ExerciseClass;
  bareMinimum: TierPick;
  next: TierPick;
  spunky: TierPick;
  reason: string;
}

function hoursAgo(n: number): Date {
  return new Date(Date.now() - n * 60 * 60 * 1000);
}

function applyRepBump(
  variant: ExerciseVariant,
  bump: number
): ExerciseVariant {
  if (!bump || bump <= 0) return variant;
  if (variant.reps != null) {
    return { ...variant, reps: variant.reps + bump };
  }
  if (variant.durationSec != null) {
    return {
      ...variant,
      durationSec: variant.durationSec + bump * 5,
    };
  }
  return variant;
}

/** Pick spunky variant: prefer options near calibration, else class.spunky */
function pickSpunky(
  cls: ExerciseClass,
  calibrationLevel: number
): ExerciseVariant {
  const options = cls.spunkyOptions ?? [];
  const pool = [cls.spunky, ...options];
  // Prefer variants at or just above calibration
  const sorted = [...pool].sort((a, b) => {
    const da = Math.abs(a.level - calibrationLevel);
    const db = Math.abs(b.level - calibrationLevel);
    if (da !== db) return da - db;
    // Prefer harder when frequency/spunky path, slight bias toward higher
    return b.level - a.level;
  });
  // If calibration is high (>=4), allow the hardest option
  if (calibrationLevel >= 4) {
    const hard = [...pool].sort((a, b) => b.level - a.level)[0];
    if (hard && hard.level <= calibrationLevel + 1) return hard;
  }
  // Mid calibration: pick closest that isn't wildly above
  for (const v of sorted) {
    if (v.level <= calibrationLevel + 1) return v;
  }
  return sorted[0] ?? cls.spunky;
}

/** Bodyweight-only classes for a slot (never unlock missing gear). */
function bodyweightClassesForSlot(slot: RotationSlot): ExerciseClass[] {
  return EXERCISE_CLASSES.filter(
    (c) => c.slot === slot && !c.requiredAsset && !c.proOnly
  );
}

/** True when this class is allowed for the user's current gear. */
function classAllowedForAssets(
  cls: ExerciseClass,
  assets: Assets,
  pro = false
): boolean {
  if (cls.proOnly && !pro) return false;
  if (!cls.requiredAsset) return true;
  return Boolean(assets[cls.requiredAsset]);
}

/** Choose a class matching calibration; prefer variety vs recent history */
function pickClass(
  slot: RotationSlot,
  assets: Assets,
  calibrationLevel: number,
  history: CompletedMove[],
  pro: boolean
): ExerciseClass {
  // Hard gate: only classes whose requiredAsset the user owns.
  // Never fall back to "all assets true". That leaked dumbbell/hang/stair moves.
  const pool = classesForSlot(slot, assets, pro);
  const candidates =
    pool.length > 0 ? pool : bodyweightClassesForSlot(slot);

  const recentClassIds = new Set(
    history
      .filter((h) => new Date(h.completedAt) >= hoursAgo(48))
      .map((h) => h.classId)
  );

  const scored = candidates.map((cls) => {
    let score = 0;
    // Prefer next-variant level near calibration
    const dist = Math.abs(cls.next.level - calibrationLevel);
    score += Math.max(0, 5 - dist) * 3;

    // Variety: penalize recent classes
    if (recentClassIds.has(cls.classId)) score -= 8;

    // Prefer bodyweight when assets unknown / none
    if (!cls.requiredAsset) score += 1;

    // Slight prefer classes whose bare min is gentle for low cal
    if (calibrationLevel <= 2 && cls.bareMinimum.level <= 1) score += 2;

    // Pro library: small lift so new moves actually surface
    if (cls.proOnly) score += 2;

    return { cls, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const picked = scored[0]?.cls ?? candidates[0] ?? bodyweightClassesForSlot(slot)[0];
  // Belt-and-suspenders: never return a gear-gated class without the gear
  if (picked && classAllowedForAssets(picked, assets, pro)) return picked;
  const safe = bodyweightClassesForSlot(slot)[0];
  if (safe) return safe;
  // Absolute last resort, still never unlock missing gear
  const anyAllowed =
    candidates.find((c) => classAllowedForAssets(c, assets, pro)) ??
    EXERCISE_CLASSES.find(
      (c) => c.slot === slot && classAllowedForAssets(c, assets, pro)
    );
  if (anyAllowed) return anyAllowed;
  return (
    EXERCISE_CLASSES.find((c) => !c.requiredAsset && !c.proOnly) ??
    EXERCISE_CLASSES[0]
  );
}

function slotReason(slot: RotationSlot, history: CompletedMove[]): string {
  const meta: Record<RotationSlot, string> = {
    chest: "Chest turn in the rotation",
    legs: "Legs get a turn",
    back: "Back & posture check-in",
    abs: "Abs join the stack",
    mobility: "Mobility / stretch snack",
  };
  if (history.length === 0) {
    return `Fresh start, ${meta[slot].toLowerCase()}.`;
  }
  return meta[slot];
}

export function recommendNudge(state: AppState): Nudge {
  const slot =
    ROTATION_ORDER[state.rotationIndex % ROTATION_ORDER.length] ?? "chest";
  let cls = pickClass(
    slot,
    state.assets,
    state.calibrationLevel,
    state.history,
    state.pro
  );
  // Final gate: equipment / Pro classes must not appear without access
  if (!classAllowedForAssets(cls, state.assets, state.pro)) {
    cls =
      bodyweightClassesForSlot(slot)[0] ??
      classesForSlot(slot, state.assets, state.pro)[0] ??
      cls;
  }
  const bump = state.repBump;

  const bare = applyRepBump(cls.bareMinimum, Math.floor(bump / 2));
  const next = applyRepBump(cls.next, bump);
  let spunkyBase = pickSpunky(cls, state.calibrationLevel);
  // Hard guarantee: Bare min & Spunky must be different exercises (not just reps).
  if (spunkyBase.id === bare.id || spunkyBase.id === next.id) {
    spunkyBase = cls.spunky.id !== bare.id && cls.spunky.id !== next.id
      ? cls.spunky
      : (cls.spunkyOptions ?? []).find(
          (v) => v.id !== bare.id && v.id !== next.id
        ) ?? cls.spunky;
  }
  const spunky = applyRepBump(spunkyBase, bump);

  return {
    slot,
    class: cls,
    bareMinimum: {
      tier: "bareMinimum",
      label: "Bare minimum",
      variant: bare,
    },
    next: {
      tier: "next",
      label: "Next exercise",
      variant: next,
    },
    spunky: {
      tier: "spunky",
      label: "Feeling spunky",
      variant: spunky,
    },
    reason: slotReason(slot, state.history),
  };
}

/** Advance rotation index (next slot in cadence) */
export function nextRotationIndex(current: number): number {
  return (current + 1) % ROTATION_ORDER.length;
}

export function estimateMinutes(variant: {
  reps?: number;
  durationSec?: number;
}): number {
  if (variant.durationSec) {
    return Math.max(1, Math.round(variant.durationSec / 60));
  }
  const reps = variant.reps ?? 10;
  const secs = reps * 3 + 20;
  return Math.max(1, Math.round(secs / 60));
}

/** Derive calibration 1–5 from quiz ratings */
export function deriveCalibration(
  ratings: Record<string, "too_easy" | "my_speed" | "too_hard">,
  samples: { id: string; level: number }[]
): number {
  if (Object.keys(ratings).length === 0) return 2;

  let weighted = 0;
  let weightSum = 0;

  for (const s of samples) {
    const r = ratings[s.id];
    if (!r) continue;
    // If too_easy on a hard move → high cal; too_hard on easy → low
    let implied = s.level;
    if (r === "too_easy") implied = Math.min(5, s.level + 1.5);
    else if (r === "too_hard") implied = Math.max(1, s.level - 1.5);
    // my_speed → that level
    const w = 1 + s.level * 0.15;
    weighted += implied * w;
    weightSum += w;
  }

  if (weightSum === 0) return 2;
  return Math.min(5, Math.max(1, Math.round(weighted / weightSum)));
}

export function resolveVariantName(
  classId: string,
  variantId: string,
  fallback: string
): string {
  const cls = getClass(classId);
  if (!cls) return fallback;
  const all = [
    cls.bareMinimum,
    cls.next,
    cls.spunky,
    ...(cls.spunkyOptions ?? []),
  ];
  return all.find((v) => v.id === variantId)?.name ?? fallback;
}
