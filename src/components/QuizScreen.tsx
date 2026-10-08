"use client";

import { QUIZ_SAMPLES } from "@/lib/exercises";
import { useStore } from "@/lib/store";
import type { QuizRating } from "@/lib/types";

const OPTIONS: { id: QuizRating; label: string; emoji: string }[] = [
  { id: "too_easy", label: "Too easy", emoji: "🥱" },
  { id: "my_speed", label: "That's my speed", emoji: "👌" },
  { id: "too_hard", label: "Too hard", emoji: "😅" },
];

export function QuizScreen() {
  const { state, setQuizRating, finishQuiz } = useStore();
  // Only count current samples (ignores ratings left from older, longer quizzes)
  const rated = QUIZ_SAMPLES.filter((s) => state.quizRatings[s.id]).length;
  const allDone = rated >= QUIZ_SAMPLES.length;

  return (
    <div className="page-shell pb-8">
      <p className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">
        Get to know you
      </p>
      <h1 className="mt-2 text-2xl font-extrabold text-[var(--ink)]">
        How would these feel?
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">
        Imagine you&apos;re trying to get a good little workout in, not just
        &quot;can I do it once.&quot; Rate each one so we serve your level
        first.
      </p>

      <ul className="mt-6 space-y-4">
        {QUIZ_SAMPLES.map((s) => {
          const current = state.quizRatings[s.id];
          return (
            <li key={s.id} className="card !p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{s.emoji}</span>
                <div>
                  <p className="font-extrabold text-[var(--ink)]">{s.name}</p>
                  <p className="text-xs text-[var(--ink-muted)]">{s.blurb}</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-1.5">
                {OPTIONS.map((o) => {
                  const on = current === o.id;
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setQuizRating(s.id, o.id)}
                      className={`btn-touch flex flex-col items-center justify-center gap-0.5 rounded-xl border-2 px-1 py-2.5 text-[10px] font-bold leading-tight transition ${
                        on
                          ? "border-[var(--coral)] bg-[var(--peach)]/60 text-[var(--ink)] shadow-sm"
                          : "border-[var(--peach)] bg-white text-[var(--ink-muted)] hover:border-[var(--coral)]"
                      }`}
                    >
                      <span className="text-lg">{o.emoji}</span>
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        className="btn-primary mt-8 w-full"
        disabled={!allDone}
        onClick={finishQuiz}
      >
        {allDone ? "Continue" : `Rate all ${QUIZ_SAMPLES.length} (${rated} done)`}
      </button>
    </div>
  );
}
