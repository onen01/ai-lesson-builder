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
      className={`rounded-2xl border p-6 mb-6 animate-fadeIn
        ${
          isCorrect
            ? "border-success bg-success/5"
            : "border-error bg-error/5 animate-shake"
        }`}
    >
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl flex-shrink-0">
          {isCorrect ? "✓" : "✗"}
        </span>
        <div>
          <p
            className={`font-sans font-semibold mb-2 ${
              isCorrect ? "text-success" : "text-error"
            }`}
          >
            {isCorrect ? "Correct!" : "Not quite — give it another try!"}
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
        <button onClick={onNext} disabled={isLoading} className="btn-primary">
          {isLoading ? "Loading next question..." : "Next Question →"}
        </button>
      ) : (
        <button onClick={onRetry} className="btn-secondary">
          Try Again
        </button>
      )}
    </div>
  );
}
