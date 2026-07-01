"use client";
import { LessonPhase } from "@/lib/agent/state";

interface ProgressBarProps {
  currentObjective: number;
  totalObjectives: number;
  currentMCQ: number;
  totalMCQs: number;
  phase: LessonPhase;
}

export function ProgressBar({
  currentObjective,
  totalObjectives,
  currentMCQ,
  totalMCQs,
  phase,
}: ProgressBarProps) {
  const hiddenPhases: LessonPhase[] = ["idle", "extracting", "hitl", "complete"];
  if (hiddenPhases.includes(phase)) return null;

  const totalSteps = totalObjectives * (totalMCQs || 3);
  const completedSteps = currentObjective * (totalMCQs || 3) + currentMCQ;
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div className="px-8 py-3 border-b border-border bg-surface flex items-center gap-4">
      <span className="font-sans text-muted text-xs flex-shrink-0 w-28">
        Objective {currentObjective + 1}/{totalObjectives}
      </span>
      <div className="flex-1 h-1.5 bg-bg border border-border rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="font-sans text-muted text-xs flex-shrink-0 w-10 text-right">
        {Math.round(progress)}%
      </span>
    </div>
  );
}
