"use client";
import { useEffect, useState } from "react";
import { MCQuestion } from "@/lib/agent/state";

interface MCQWidgetProps {
  question: MCQuestion;
  objectiveTitle: string;
  objectiveIndex: number;
  totalObjectives: number;
  mcqIndex: number;
  totalMCQs: number;
  onAnswer: (selectedIndex: number) => void;
  isLoading: boolean;
  answerResult?: boolean | null;
}

export function MCQWidget({
  question,
  objectiveTitle,
  objectiveIndex,
  totalObjectives,
  mcqIndex,
  totalMCQs,
  onAnswer,
  isLoading,
  answerResult = null,
}: MCQWidgetProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    setSelected(null);
    setHasSubmitted(false);
  }, [question.id]);

  function handleSubmit() {
    if (selected === null || hasSubmitted || isLoading) return;
    setHasSubmitted(true);
    onAnswer(selected);
  }

  return (
    <div className="max-w-2xl mx-auto py-5 animate-fadeIn">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <p className="label-tag">
            OBJECTIVE {objectiveIndex + 1}/{totalObjectives}
          </p>
          <p className="font-sans text-muted text-xs">
            Question {mcqIndex + 1} of {totalMCQs}
          </p>
        </div>
        <p className="font-sans text-secondary text-[13px]">{objectiveTitle}</p>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-5 mb-4">
        <h3 className="font-serif text-xl font-medium text-primary leading-snug">
          {question.question}
        </h3>
      </div>

      <div className="space-y-2.5 mb-4">
        {question.options.map((option, i) => {
          const isSelected = selected === i;
          const isDisabled = hasSubmitted || isLoading;
          const hasAnswerResult = hasSubmitted && answerResult !== null;
          const isCorrectSelection = isSelected && hasAnswerResult && answerResult;
          const isWrongSelection = isSelected && hasAnswerResult && !answerResult;
          const isPendingSelection = isSelected && !hasAnswerResult;

          return (
            <button
              key={i}
              onClick={() => !isDisabled && setSelected(i)}
              disabled={isDisabled}
              className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-150
                ${isDisabled ? "cursor-default" : "cursor-pointer hover:bg-elevated hover:border-accent/40"}
                ${isCorrectSelection ? "border-success bg-success/10" : ""}
                ${isWrongSelection ? "border-error bg-error/10" : ""}
                ${isPendingSelection ? "border-accent bg-accent/5" : ""}
                ${!isSelected ? "border-border bg-surface" : ""}
              `}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 flex items-center justify-center transition-colors
                  ${isCorrectSelection ? "border-success bg-success" : ""}
                  ${isWrongSelection ? "border-error bg-error" : ""}
                  ${isPendingSelection ? "border-accent bg-accent" : ""}
                  ${!isSelected ? "border-border" : ""}
                `}
              >
                {isSelected && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
              <span
                className={`font-sans text-sm leading-relaxed
                  ${isCorrectSelection ? "text-success font-medium" : ""}
                  ${isWrongSelection ? "text-error font-medium" : ""}
                  ${isPendingSelection ? "text-accent font-medium" : ""}
                  ${!isSelected ? "text-primary" : ""}
                `}
              >
                {option}
              </span>
            </button>
          );
        })}
      </div>

      {!hasSubmitted && (
        <button
          onClick={handleSubmit}
          disabled={selected === null || isLoading}
          className="w-full bg-accent hover:bg-accent-hover text-white font-sans font-medium text-sm px-6 py-3 rounded-full transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? "Submitting..." : "Submit Answer"}
        </button>
      )}

      {hasSubmitted && isLoading && (
        <div className="text-center py-2">
          <p className="font-sans text-secondary text-sm">
            Checking your answer...
          </p>
        </div>
      )}
    </div>
  );
}
