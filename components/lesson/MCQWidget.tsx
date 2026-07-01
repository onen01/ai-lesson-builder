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
    <div className="max-w-2xl mx-auto py-8 animate-fadeIn">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-1">
          <p className="label-tag">
            OBJECTIVE {objectiveIndex + 1}/{totalObjectives}
          </p>
          <p className="font-sans text-muted text-xs">
            Question {mcqIndex + 1} of {totalMCQs}
          </p>
        </div>
        <p className="font-sans text-secondary text-sm mb-3">
          {objectiveTitle}
        </p>
        <div className="w-full h-1.5 bg-surface border border-border rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{
              width: `${
                ((objectiveIndex * totalMCQs + mcqIndex) /
                  (totalObjectives * totalMCQs)) *
                100
              }%`,
            }}
          />
        </div>
      </div>

      <div className="card mb-6">
        <h3 className="font-serif text-2xl font-medium text-primary leading-snug">
          {question.question}
        </h3>
      </div>

      <div className="space-y-3 mb-6">
        {question.options.map((option, i) => {
          const isSelected = selected === i;
          const isDisabled = hasSubmitted || isLoading;

          return (
            <button
              key={i}
              onClick={() => !isDisabled && setSelected(i)}
              disabled={isDisabled}
              className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-150
                ${isDisabled ? "cursor-default" : "cursor-pointer hover:bg-elevated hover:border-accent/40"}
                ${isSelected && !hasSubmitted ? "border-accent bg-accent/5" : "border-border bg-surface"}
              `}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 mt-0.5 flex-shrink-0 flex items-center justify-center transition-colors
                  ${isSelected && !hasSubmitted ? "border-accent bg-accent" : "border-border"}
                `}
              >
                {isSelected && !hasSubmitted && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span
                className={`font-sans text-[15px] leading-relaxed
                  ${isSelected && !hasSubmitted ? "text-accent font-medium" : "text-primary"}
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
          className="btn-primary w-full"
        >
          {isLoading ? "Submitting..." : "Submit Answer"}
        </button>
      )}

      {hasSubmitted && isLoading && (
        <div className="text-center py-4">
          <p className="font-sans text-secondary text-sm">
            Checking your answer...
          </p>
        </div>
      )}
    </div>
  );
}
