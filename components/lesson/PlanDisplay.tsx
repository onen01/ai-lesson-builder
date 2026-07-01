"use client";
import { LearningObjective } from "@/lib/agent/state";

interface PlanDisplayProps {
  plan: LearningObjective[];
  filename: string;
  onApprove: () => void;
  isLoading: boolean;
}

export function PlanDisplay({
  plan,
  filename,
  onApprove,
  isLoading,
}: PlanDisplayProps) {
  const difficultyStyles: Record<string, string> = {
    beginner: "bg-success/10 text-success border border-success/20",
    intermediate: "bg-accent/10 text-accent border border-accent/20",
    advanced: "bg-error/10 text-error border border-error/20",
  };

  return (
    <div className="max-w-2xl mx-auto py-12 animate-fadeIn">
      <p className="label-tag mb-3">YOUR LESSON PLAN</p>
      <h2 className="font-serif text-4xl font-medium text-primary mb-2">
        Here&apos;s what we&apos;ll cover.
      </h2>
      <p className="font-sans text-secondary mb-1">
        Based on: <span className="text-primary font-medium">{filename}</span>
      </p>
      <p className="font-sans text-muted text-sm mb-8">
        Review your personalized learning path and click Begin when ready.
      </p>

      <div className="space-y-3 mb-8">
        {plan.map((obj, i) => (
          <div key={i} className="card flex items-start gap-4">
            <span className="font-sans text-muted font-medium text-sm w-8 flex-shrink-0 pt-0.5">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-sans font-medium text-primary">
                  {obj.title}
                </h3>
                <span
                  className={`font-sans text-xs font-medium px-2.5 py-0.5 rounded-full ${difficultyStyles[obj.difficulty] || difficultyStyles.beginner}`}
                >
                  {obj.difficulty}
                </span>
              </div>
              <p className="font-sans text-secondary text-sm leading-relaxed">
                {obj.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onApprove}
        disabled={isLoading}
        className="btn-primary w-full"
      >
        {isLoading ? "Starting lesson..." : `Begin Lesson — ${plan.length} objectives →`}
      </button>
    </div>
  );
}
