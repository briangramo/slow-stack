import { APP_VERSION, type AppState } from "./types";

export const STORAGE_KEY = "slow-stack-v3";

export function buildInitialState(): AppState {
  return {
    version: APP_VERSION,
    onboardingComplete: false,
    onboardingPhase: "intro",
    quizRatings: {},
    calibrationLevel: 2,
    assets: {
      hangBar: false,
      dumbbells: false,
      stairs: false,
    },
    notificationsAsked: false,
    notificationsGranted: false,
    rotationIndex: 0,
    repBump: 0,
    history: [],
    streak: 0,
    lastActiveDate: null,
    pro: false,
    reminderTime: null,
    reminderEnabled: false,
    reminderLastFired: null,
  };
}
