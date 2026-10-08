import type { MuscleGroup, MuscleLoadMap, RotationSlot } from "./types";

export const MUSCLE_GROUPS: MuscleGroup[] = [
  "shoulders",
  "chest",
  "core",
  "back",
  "glutes",
  "legs",
  "arms",
  "cardio",
];

export const MUSCLE_META: Record<
  MuscleGroup,
  { label: string; emoji: string; color: string }
> = {
  shoulders: { label: "Shoulders", emoji: "💪", color: "#F97316" },
  chest: { label: "Chest", emoji: "🦁", color: "#EF4444" },
  core: { label: "Abs", emoji: "🔥", color: "#EAB308" },
  back: { label: "Back", emoji: "🧘", color: "#22C55E" },
  glutes: { label: "Glutes", emoji: "🍑", color: "#EC4899" },
  legs: { label: "Legs", emoji: "🦵", color: "#8B5CF6" },
  arms: { label: "Arms", emoji: "🦾", color: "#06B6D4" },
  cardio: { label: "Cardio", emoji: "❤️", color: "#F43F5E" },
};

export const SLOT_META: Record<
  RotationSlot,
  { label: string; emoji: string; color: string }
> = {
  chest: { label: "Chest", emoji: "🦁", color: "#EF4444" },
  legs: { label: "Legs", emoji: "🦵", color: "#8B5CF6" },
  back: { label: "Back", emoji: "🧘", color: "#22C55E" },
  abs: { label: "Abs", emoji: "🔥", color: "#EAB308" },
  mobility: { label: "Mobility", emoji: "🪷", color: "#06B6D4" },
};

export function emptyLoad(): MuscleLoadMap {
  return {
    shoulders: 0,
    chest: 0,
    core: 0,
    back: 0,
    glutes: 0,
    legs: 0,
    arms: 0,
    cardio: 0,
  };
}

export function addLoad(
  base: MuscleLoadMap,
  muscles: MuscleGroup[],
  amount = 1
): MuscleLoadMap {
  const next = { ...base };
  for (const m of muscles) {
    next[m] = (next[m] ?? 0) + amount;
  }
  return next;
}

export function sumLoad(load: MuscleLoadMap): number {
  return MUSCLE_GROUPS.reduce((s, g) => s + (load[g] ?? 0), 0);
}
