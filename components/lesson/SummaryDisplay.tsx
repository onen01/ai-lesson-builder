"use client";
import { SummaryReport } from "@/lib/agent/state";

interface SummaryDisplayProps {
  summary: SummaryReport;
  filename: string;
  onStartOver: () => void;
}

export function SummaryDisplay({
  summary,
  filename,
  onStartOver,
}: SummaryDisplayProps) {
  const scoreEmoji =
    summary.scorePercentage >= 80
      ? "🎉"
      : summary.scorePercentage >= 60
        ? "💪"
        : "📚";

  const scoreBarColor =
    summary.scorePercentage >= 80
      ? "bg-success"
      : summary.scorePercentage >= 60
        ? "bg-accent"
        : "bg-error";

  function handleStartOver() {
    sessionStorage.removeItem("pdfContent");
    sessionStorage.removeItem("pdfFilename");
    sessionStorage.removeItem("lessonThreadId");
    onStartOver();
  }

  return (
    <div className="max-w-2xl mx-auto py-12 animate-fadeIn">
      <p className="label-tag mb-3">LESSON COMPLETE</p>
      <h2 className="font-serif text-4xl font-medium text-primary mb-2">
        {scoreEmoji} Your Results
      </h2>
      <p className="font-sans text-secondary mb-1 leading-relaxed">
        {summary.encouragement}
      </p>
      <p className="font-sans text-muted text-sm mb-8">
        Based on: <span className="text-primary font-medium">{filename}</span>
      </p>

      <div className="card mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-sans text-secondary text-sm">Final Score</span>
          <span className="font-serif text-4xl font-medium text-primary">
            {summary.scorePercentage}%
          </span>
        </div>
        <div className="w-full h-2 bg-bg border border-border rounded-full overflow-hidden mb-2">
          <div
            className={`h-full rounded-full transition-all duration-700 ${scoreBarColor}`}
            style={{ width: `${summary.scorePercentage}%` }}
          />
        </div>
        <p className="font-sans text-muted text-sm">
          {summary.correctAnswers} of {summary.totalQuestions} questions correct
        </p>
      </div>

      <div className="card mb-4">
        <h3 className="font-sans font-medium text-primary mb-4">
          Objective Breakdown
        </h3>
        <div className="space-y-3">
          {summary.objectiveBreakdown.map((obj, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex-1">
                <p className="font-sans text-secondary text-sm">{obj.title}</p>
              </div>
              <span
                className={`font-sans text-sm font-medium flex-shrink-0 ${
                  obj.total === 0
                    ? "text-muted"
                    : obj.correct / obj.total >= 0.7
                      ? "text-success"
                      : "text-error"
                }`}
              >
                {obj.correct}/{obj.total}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card mb-8">
        <h3 className="font-sans font-medium text-primary mb-4">Study Tips</h3>
        <ul className="space-y-3">
          {summary.studyTips.map((tip, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-accent font-medium flex-shrink-0">→</span>
              <span className="font-sans text-secondary text-sm leading-relaxed">
                {tip}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={handleStartOver} className="btn-primary w-full">
        Start a New Lesson
      </button>
    </div>
  );
}
