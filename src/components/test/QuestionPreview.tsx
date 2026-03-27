// src/components/test/QuestionPreview.tsx
"use client";
import { useState } from "react";
import { CheckCircle, XCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  text: string;
  choices: string[];
  correct: number;
  explanation: string;
}

interface Props {
  question: Question;
  index: number;
}

export function QuestionPreview({ question, index }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const answered = selected !== null;
  const isCorrect = selected === question.correct;

  return (
    <div className="card p-6">
      <div className="flex items-start gap-3 mb-5">
        <span className="flex-shrink-0 w-7 h-7 bg-blue-100 text-blue-600 rounded-full text-sm font-bold flex items-center justify-center">
          {index + 1}
        </span>
        <p className="font-semibold text-gray-900 text-base leading-relaxed">{question.text}</p>
      </div>

      <div className="space-y-2 mb-4">
        {question.choices.map((choice, i) => (
          <button
            key={i}
            onClick={() => !answered && setSelected(i)}
            disabled={answered}
            className={cn(
              "w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all",
              !answered && "border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700",
              answered && i === question.correct && "border-green-400 bg-green-50 text-green-800",
              answered && i === selected && i !== question.correct && "border-red-400 bg-red-50 text-red-700",
              answered && i !== question.correct && i !== selected && "border-gray-100 bg-gray-50 text-gray-400"
            )}
          >
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 flex-shrink-0 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold">
                {String.fromCharCode(65 + i)}
              </span>
              {choice}
              {answered && i === question.correct && (
                <CheckCircle className="w-4 h-4 text-green-500 ml-auto flex-shrink-0" />
              )}
              {answered && i === selected && i !== question.correct && (
                <XCircle className="w-4 h-4 text-red-500 ml-auto flex-shrink-0" />
              )}
            </span>
          </button>
        ))}
      </div>

      {answered && (
        <div className={cn(
          "rounded-xl p-4 text-sm",
          isCorrect ? "bg-green-50 border border-green-200" : "bg-orange-50 border border-orange-200"
        )}>
          <div className={cn("font-semibold mb-1", isCorrect ? "text-green-700" : "text-orange-700")}>
            {isCorrect ? "✓ Correct!" : "✗ Not quite — here's why:"}
          </div>
          <p className={isCorrect ? "text-green-700" : "text-orange-700"}>
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
