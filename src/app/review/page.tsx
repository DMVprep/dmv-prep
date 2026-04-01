"use client";
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle, XCircle, ArrowRight, Brain, RefreshCw, TrendingUp } from "lucide-react";

interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  text: string;
  explanation: string;
  choices: Choice[];
  topic?: { name: string };
  _type?: string;
  _confidence?: number;
}

export default function ReviewPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [totalDue, setTotalDue] = useState(0);

  useEffect(() => {
    fetch("/api/review")
      .then(r => r.json())
      .then(data => {
        const all = [...(data.dueForReview || []), ...(data.weakQuestions || [])];
        setQuestions(all);
        setTotalDue(data.totalDue || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const question = questions[current];

  const handleAnswer = async (choiceId: string, isCorrect: boolean) => {
    if (selected) return;
    setSelected(choiceId);
    setShowExplanation(true);

    if (isCorrect) {
      setScore(s => ({ ...s, correct: s.correct + 1 }));
    } else {
      setScore(s => ({ ...s, wrong: s.wrong + 1 }));
    }

    // Update spaced repetition progress
    await fetch("/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: question.id, isCorrect }),
    });
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setDone(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowExplanation(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Brain className="w-12 h-12 text-purple-600 mx-auto mb-4 animate-pulse" />
        <p className="text-gray-600">Loading your review session...</p>
      </div>
    </div>
  );

  if (questions.length === 0) return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">All caught up!</h1>
        <p className="text-gray-500 mb-6">You have no questions due for review right now. Come back later!</p>
        <a href="/dashboard" className="btn-primary">Back to Dashboard</a>
      </main>
      <Footer />
    </div>
  );

  if (done) {
    const reviewPct = questions.length > 0 ? Math.round((score.correct / questions.length) * 100) : 0;
    const estimatedBoost = Math.max(1, Math.round(score.correct * 2));
    return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <Brain className="w-16 h-16 text-purple-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Review Complete!</h1>
        {score.correct > 0 && (
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 font-bold text-sm px-4 py-2 rounded-full mb-4">
            <TrendingUp className="w-4 h-4" />
            +{estimatedBoost}% readiness boost
          </div>
        )}
        <div className="flex justify-center gap-8 my-6">
          <div className="text-center">
            <p className="text-3xl font-extrabold text-green-600">{score.correct}</p>
            <p className="text-sm text-gray-500">Correct</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-red-500">{score.wrong}</p>
            <p className="text-sm text-gray-500">Wrong</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-purple-600">
              {reviewPct}%
            </p>
            <p className="text-sm text-gray-500">Score</p>
          </div>
        </div>
        {score.correct > 0 && (
          <p className="text-sm text-green-600 font-medium mb-2">
            {score.correct} {score.correct === 1 ? "question" : "questions"} strengthened in your memory
          </p>
        )}
        {score.wrong > 0 && (
          <p className="text-sm text-gray-500 mb-6">
            {score.wrong} {score.wrong === 1 ? "question" : "questions"} rescheduled — you'll see {score.wrong === 1 ? "it" : "them"} again in 10 minutes
          </p>
        )}
        {score.wrong === 0 && (
          <p className="text-sm text-gray-500 mb-6">Perfect session — all answers locked in!</p>
        )}
        <div className="flex gap-3 justify-center">
          <a href="/dashboard" className="btn-secondary">Back to Dashboard</a>
          <a href="/review" className="btn-primary">Review Again</a>
        </div>
      </main>
      <Footer />
    </div>
  );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-10">
        {/* Progress bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">
              Review Session — {current + 1} of {questions.length}
            </span>
          </div>
          <span className="text-sm text-gray-400">
            {question?._type === "review" ? "📅 Due for review" :
             question?._type === "weak" ? "⚠️ Weak area" : "✨ New"}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          {question?.topic && (
            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full mb-4 uppercase tracking-wide">
              {question.topic.name}
            </span>
          )}
          <h2 className="text-xl font-bold text-gray-900">{question?.text}</h2>
        </div>

        {/* Choices */}
        <div className="space-y-3 mb-6">
          {question?.choices.map((choice) => {
            let style = "bg-white border-gray-200 hover:border-blue-400 cursor-pointer";
            if (selected) {
              if (choice.isCorrect) style = "bg-green-50 border-green-500";
              else if (choice.id === selected && !choice.isCorrect) style = "bg-red-50 border-red-400";
              else style = "bg-white border-gray-200 opacity-50";
            }
            return (
              <button
                key={choice.id}
                onClick={() => handleAnswer(choice.id, choice.isCorrect)}
                disabled={!!selected}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${style}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-800">{choice.text}</span>
                  {selected && choice.isCorrect && <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />}
                  {selected && choice.id === selected && !choice.isCorrect && <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-2">Explanation</p>
            <p className="text-gray-800 leading-relaxed">{question?.explanation}</p>
          </div>
        )}

        {/* Next button */}
        {selected && (
          <button
            onClick={handleNext}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            {current + 1 >= questions.length ? "See Results" : "Next Question"}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </main>
      <Footer />
    </div>
  );
}
