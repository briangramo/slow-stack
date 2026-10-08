"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { QUIZ_SAMPLES, getClass } from "./exercises";
import {
  deriveCalibration,
  estimateMinutes,
  loadFromHistory,
  nextRotationIndex,
  recommendNudge,
  todayStart,
  weekStart,
  type Nudge,
} from "./recommend";
import { loadState, resetState, saveState } from "./storage";
import type {
  AppState,
  Assets,
  CompletedMove,
  Feedback,
  MuscleLoadMap,
  OnboardingPhase,
  QuizRating,
  Tier,
} from "./types";

interface StoreValue {
  ready: boolean;
  state: AppState;
  todayLoad: MuscleLoadMap;
  weekLoad: MuscleLoadMap;
  minutesToday: number;
  movesToday: number;
  nudge: Nudge;
  completeMove: (
    classId: string,
    tier: Tier,
    variantId: string,
    variantName: string,
    feedback: Feedback
  ) => void;
  /** After "how about another?", advance rotation without logging */
  advanceRotation: () => void;
  setOnboardingPhase: (phase: OnboardingPhase) => void;
  setQuizRating: (sampleId: string, rating: QuizRating) => void;
  finishQuiz: () => void;
  finishNotify: (granted: boolean) => void;
  finishAssets: (assets: Assets) => void;
  updateAssets: (assets: Assets) => void;
  redoSetup: () => void;
  resetDemo: () => void;
  /** Last 14 local days, oldest first: { key, label, count } */
  history14: DayCount[];
  unlockPro: () => void;
  setReminder: (opts: { time?: string | null; enabled?: boolean }) => void;
  markReminderFired: (dayKey: string) => void;
}

export interface DayCount {
  key: string;
  label: string;
  count: number;
  isToday: boolean;
}

/** Local-time date key YYYY-MM-DD */
export function localDayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function buildHistory14(history: CompletedMove[]): DayCount[] {
  const counts = new Map<string, number>();
  for (const h of history) {
    const k = localDayKey(new Date(h.completedAt));
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  const out: DayCount[] = [];
  const base = todayStart();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(base.getDate() - i);
    const key = localDayKey(d);
    out.push({
      key,
      label: d.toLocaleDateString(undefined, { weekday: "narrow" }),
      count: counts.get(key) ?? 0,
      isToday: i === 0,
    });
  }
  return out;
}

const StoreContext = createContext<StoreValue | null>(null);

function dateKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function calcStreak(
  history: CompletedMove[],
  prevStreak: number,
  lastActive: string | null
): { streak: number; lastActiveDate: string } {
  const today = dateKey();
  const yesterday = dateKey(new Date(Date.now() - 86400000));
  const days = new Set(history.map((h) => h.completedAt.slice(0, 10)));
  if (!days.has(today)) {
    return { streak: prevStreak, lastActiveDate: lastActive ?? today };
  }
  if (lastActive === today) {
    return { streak: prevStreak, lastActiveDate: today };
  }
  if (lastActive === yesterday) {
    return { streak: prevStreak + 1, lastActiveDate: today };
  }
  return { streak: 1, lastActiveDate: today };
}

function bumpFromHistory(history: CompletedMove[]): number {
  const week = history.filter((h) => new Date(h.completedAt) >= weekStart());
  const spunkyCount = week.filter((h) => h.tier === "spunky").length;
  const freq = week.length;
  // Bump reps as frequency builds; extra when spunky shows up
  let bump = Math.floor(freq / 4);
  if (freq >= 6 && spunkyCount >= 2) bump += 1;
  if (freq >= 10 && spunkyCount >= 4) bump += 1;
  return Math.min(6, bump);
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    let active = true;
    // Defer hydration so setState is not sync inside the effect body (React 19 lint).
    const id = window.setTimeout(() => {
      if (active) setState(loadState());
    }, 0);
    return () => {
      active = false;
      window.clearTimeout(id);
    };
  }, []);

  const persist = useCallback((next: AppState) => {
    setState(next);
    saveState(next);
  }, []);

  const completeMove = useCallback(
    (
      classId: string,
      tier: Tier,
      variantId: string,
      variantName: string,
      feedback: Feedback
    ) => {
      setState((prev) => {
        if (!prev) return prev;
        const cls = getClass(classId);
        if (!cls) return prev;

        const all = [
          cls.bareMinimum,
          cls.next,
          cls.spunky,
          ...(cls.spunkyOptions ?? []),
        ];
        const variant = all.find((v) => v.id === variantId) ?? cls.next;
        const minutes = estimateMinutes(variant);

        const move: CompletedMove = {
          id: `m-${Date.now()}`,
          classId,
          variantId,
          variantName,
          tier,
          slot: cls.slot,
          feedback,
          completedAt: new Date().toISOString(),
          muscles: [...cls.muscles],
          minutes,
        };
        const history = [...prev.history, move];
        const { streak, lastActiveDate } = calcStreak(
          history,
          prev.streak,
          prev.lastActiveDate
        );

        // Advance rotation after a completed pick
        let calibrationLevel = prev.calibrationLevel;
        if (feedback === "too_easy" && tier !== "bareMinimum") {
          calibrationLevel = Math.min(5, calibrationLevel + 0.25);
        } else if (feedback === "too_hard") {
          calibrationLevel = Math.max(1, calibrationLevel - 0.35);
        }
        // Frequency + spunky → nudge difficulty up slowly
        const week = history.filter(
          (h) => new Date(h.completedAt) >= weekStart()
        );
        const spunkyWeek = week.filter((h) => h.tier === "spunky").length;
        if (week.length >= 8 && spunkyWeek >= 3) {
          calibrationLevel = Math.min(5, calibrationLevel + 0.15);
        }

        const next: AppState = {
          ...prev,
          history,
          streak,
          lastActiveDate,
          rotationIndex: nextRotationIndex(prev.rotationIndex),
          repBump: bumpFromHistory(history),
          calibrationLevel: Math.round(calibrationLevel * 10) / 10,
        };
        saveState(next);
        return next;
      });
    },
    []
  );

  const advanceRotation = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev;
      const next = {
        ...prev,
        rotationIndex: nextRotationIndex(prev.rotationIndex),
      };
      saveState(next);
      return next;
    });
  }, []);

  const setOnboardingPhase = useCallback((phase: OnboardingPhase) => {
    setState((prev) => {
      if (!prev) return prev;
      const next: AppState = {
        ...prev,
        onboardingPhase: phase,
        onboardingComplete: phase === "done",
      };
      saveState(next);
      return next;
    });
  }, []);

  const setQuizRating = useCallback(
    (sampleId: string, rating: QuizRating) => {
      setState((prev) => {
        if (!prev) return prev;
        const next: AppState = {
          ...prev,
          quizRatings: { ...prev.quizRatings, [sampleId]: rating },
        };
        saveState(next);
        return next;
      });
    },
    []
  );

  const finishQuiz = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev;
      const level = deriveCalibration(prev.quizRatings, QUIZ_SAMPLES);
      const next: AppState = {
        ...prev,
        calibrationLevel: level,
        onboardingPhase: "notify",
      };
      saveState(next);
      return next;
    });
  }, []);

  const finishNotify = useCallback((granted: boolean) => {
    setState((prev) => {
      if (!prev) return prev;
      const next: AppState = {
        ...prev,
        notificationsAsked: true,
        notificationsGranted: granted,
        onboardingPhase: "assets",
      };
      saveState(next);
      return next;
    });
  }, []);

  const finishAssets = useCallback((assets: Assets) => {
    setState((prev) => {
      if (!prev) return prev;
      const next: AppState = {
        ...prev,
        assets,
        onboardingPhase: "done",
        onboardingComplete: true,
      };
      saveState(next);
      return next;
    });
  }, []);

  const updateAssets = useCallback((assets: Assets) => {
    setState((prev) => {
      if (!prev) return prev;
      const next = { ...prev, assets };
      saveState(next);
      return next;
    });
  }, []);

  const redoSetup = useCallback(() => {
    setState((prev) => {
      // Keep a paid Pro unlock (and reminder prefs) across a setup redo.
      const fresh = buildFreshKeepingNothing();
      const next: AppState = prev
        ? {
            ...fresh,
            pro: prev.pro,
            reminderTime: prev.reminderTime,
            reminderEnabled: prev.reminderEnabled,
          }
        : fresh;
      saveState(next);
      return next;
    });
  }, []);

  const unlockPro = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev;
      const next: AppState = { ...prev, pro: true };
      saveState(next);
      return next;
    });
  }, []);

  const setReminder = useCallback(
    (opts: { time?: string | null; enabled?: boolean }) => {
      setState((prev) => {
        if (!prev) return prev;
        const next: AppState = {
          ...prev,
          reminderTime:
            opts.time !== undefined ? opts.time : prev.reminderTime,
          reminderEnabled:
            opts.enabled !== undefined ? opts.enabled : prev.reminderEnabled,
          // Changing the schedule re-arms today's reminder
          reminderLastFired:
            opts.time !== undefined && opts.time !== prev.reminderTime
              ? null
              : prev.reminderLastFired,
        };
        saveState(next);
        return next;
      });
    },
    []
  );

  const markReminderFired = useCallback((dayKey: string) => {
    setState((prev) => {
      if (!prev || prev.reminderLastFired === dayKey) return prev;
      const next: AppState = { ...prev, reminderLastFired: dayKey };
      saveState(next);
      return next;
    });
  }, []);

  const resetDemo = useCallback(() => {
    persist(resetState());
  }, [persist]);

  const value = useMemo<StoreValue | null>(() => {
    if (!state) return null;
    const todayLoad = loadFromHistory(state.history, todayStart());
    const weekLoad = loadFromHistory(state.history, weekStart());
    const todayMoves = state.history.filter(
      (h) => new Date(h.completedAt) >= todayStart()
    );
    const minutesToday = todayMoves.reduce((s, m) => s + m.minutes, 0);
    const nudge = recommendNudge(state);
    const history14 = buildHistory14(state.history);

    return {
      ready: true,
      state,
      todayLoad,
      weekLoad,
      minutesToday,
      movesToday: todayMoves.length,
      nudge,
      completeMove,
      advanceRotation,
      setOnboardingPhase,
      setQuizRating,
      finishQuiz,
      finishNotify,
      finishAssets,
      updateAssets,
      redoSetup,
      resetDemo,
      history14,
      unlockPro,
      setReminder,
      markReminderFired,
    };
  }, [
    state,
    completeMove,
    advanceRotation,
    setOnboardingPhase,
    setQuizRating,
    finishQuiz,
    finishNotify,
    finishAssets,
    updateAssets,
    redoSetup,
    resetDemo,
    unlockPro,
    setReminder,
    markReminderFired,
  ]);

  if (!value) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--cream)] text-[var(--ink)]">
        <p className="animate-pulse text-lg font-medium">Stacking warmth…</p>
      </div>
    );
  }

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

function buildFreshKeepingNothing(): AppState {
  return resetState();
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
