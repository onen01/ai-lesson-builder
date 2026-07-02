"use client";

interface FeedbackDisplayProps {
  isCorrect: boolean;
  explanation?: string;
  hint?: string;
  onNext: () => void;
  onRetry: () => void;
  isLoading: boolean;
}

export function FeedbackDisplay({
  isCorrect,
  explanation,
  hint,
  onNext,
  onRetry,
  isLoading,
}: FeedbackDisplayProps) {
  return (
    <div
      className={`max-w-2xl mx-auto rounded-2xl border p-4 mb-4 animate-fadeIn
        ${
          isCorrect
            ? "border-success bg-success/5"
            : "border-error bg-error/5 animate-shake"
        }`}
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-xl flex-shrink-0">
          {isCorrect ? "✓" : "✕"}
        </span>
        <div>
          <p
            className={`font-sans font-semibold mb-1.5 ${
              isCorrect ? "text-success" : "text-error"
            }`}
          >
            {isCorrect ? "Correct!" : "Not quite - give it another try!"}
          </p>
          {isCorrect && explanation && (
            <p className="font-sans text-secondary text-sm leading-relaxed">
              {explanation}
            </p>
          )}
          {!isCorrect && hint && (
            <p className="font-sans text-secondary text-sm leading-relaxed">
              <span className="font-medium text-primary">Hint: </span>
              {hint}
            </p>
          )}
        </div>
      </div>

      {isCorrect ? (
        <button
          onClick={onNext}
          disabled={isLoading}
          className="bg-accent hover:bg-accent-hover text-white font-sans font-medium text-sm px-6 py-2.5 rounded-full transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? "Loading next question..." : "Next Question →"}
        </button>
      ) : (
        <button
          onClick={onRetry}
          className="border border-border bg-surface hover:bg-elevated text-primary font-sans font-medium text-sm px-6 py-2.5 rounded-full transition-colors duration-150 cursor-pointer"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
