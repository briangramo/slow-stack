export type MuscleGroup =
  | "shoulders"
  | "chest"
  | "core"
  | "back"
  | "glutes"
  | "legs"
  | "arms"
  | "cardio";

/** Rotation cadence: chest → legs → back → abs → mobility */
export type RotationSlot = "chest" | "legs" | "back" | "abs" | "mobility";

/** Pick tiers: different exercises in the same class */
export type Tier = "bareMinimum" | "next" | "spunky";

export type Feedback = "too_easy" | "just_right" | "too_hard";

export type QuizRating = "too_easy" | "my_speed" | "too_hard";

export type AssetKey = "hangBar" | "dumbbells" | "stairs";

export type OnboardingPhase =
  | "intro"
  | "quiz"
  | "notify"
  | "assets"
  | "done";

export interface Assets {
  hangBar: boolean;
  dumbbells: boolean;
  stairs: boolean;
}

export interface ExerciseVariant {
  id: string;
  name: string;
  emoji: string;
  cues: string[];
  reps?: number;
  durationSec?: number;
  /** 1 = gentle … 5 = advanced */
  level: number;
  note: string;
}

export interface ExerciseClass {
  classId: string;
  slot: RotationSlot;
  name: string;
  emoji: string;
  muscles: MuscleGroup[];
  /** If set, class is hidden unless the asset is owned */
  requiredAsset?: AssetKey;
  /** Pro-only classes appear in rotation only when unlocked */
  proOnly?: boolean;
  bareMinimum: ExerciseVariant;
  next: ExerciseVariant;
  spunky: ExerciseVariant;
  /** Extra harder spunky options unlocked by calibration */
  spunkyOptions?: ExerciseVariant[];
}

export interface CompletedMove {
  id: string;
  classId: string;
  variantId: string;
  variantName: string;
  tier: Tier;
  slot: RotationSlot;
  feedback?: Feedback;
  completedAt: string;
  muscles: MuscleGroup[];
  minutes: number;
}

export type MuscleLoadMap = Record<MuscleGroup, number>;

export interface AppState {
  version: number;
  onboardingComplete: boolean;
  onboardingPhase: OnboardingPhase;
  quizRatings: Record<string, QuizRating>;
  /** 1–5 derived from quiz; drives which class / variant level we serve */
  calibrationLevel: number;
  assets: Assets;
  notificationsAsked: boolean;
  notificationsGranted: boolean;
  /** Index into ROTATION_ORDER */
  rotationIndex: number;
  /** Extra reps earned as frequency builds */
  repBump: number;
  history: CompletedMove[];
  streak: number;
  lastActiveDate: string | null;
  /** Slow Stack Pro one-time unlock */
  pro: boolean;
  /** Daily reminder time "HH:MM" local, Pro only */
  reminderTime: string | null;
  /** Whether in-app / Notification nudges are enabled (Pro) */
  reminderEnabled: boolean;
  /** Local date key (YYYY-MM-DD) of the last fired daily reminder */
  reminderLastFired: string | null;
}

export const ROTATION_ORDER: RotationSlot[] = [
  "chest",
  "legs",
  "back",
  "abs",
  "mobility",
];

export const APP_VERSION = 3;
