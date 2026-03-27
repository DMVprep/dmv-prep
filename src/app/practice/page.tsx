// src/app/practice/page.tsx
"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { US_STATES } from "@/data/states";
import { cn } from "@/lib/utils";
import {
  CheckCircle, XCircle, ChevronRight, RotateCcw, Trophy, Clock,
  Target, BookOpen, Zap, AlertTriangle, Lock, Loader2, Globe,
  BarChart2, ArrowRight
} from "lucide-react";
import Link from "next/link";

type AppMode = "select" | "test" | "results";
type TestMode = "PRACTICE" | "EXAM_SIMULATION" | "WEAK_AREAS";

interface Question {
  id: string;
  text: string;
  explanation: string;
  topic: { name: string; slug: string };
  choices: { id: string; text: string; isCorrect: boolean }[];
  translations?: { language: string; text: string; explanation: string; choices: string[] }[];
}

interface ExamConfig {
  totalQuestions: number;
  passingScore: number;
  timeLimit: number;
  maxWrong: number;
  autoFail: boolean;
  autoPass: boolean;
  skipAllowed: boolean;
  maxSkips: number;
}

const LANGUAGES = [
  { code: "es", label: "Español" },
  { code: "zh", label: "中文" },
  { code: "pt", label: "Português" },
  { code: "fr", label: "Français" },
];

const TOPICS = [
  { slug: "traffic-signs", label: "Traffic Signs" },
  { slug: "right-of-way", label: "Right of Way" },
  { slug: "speed-limits", label: "Speed Limits" },
  { slug: "safe-driving", label: "Safe Driving" },
];

function PracticeContent() {
  const { data: session } = useSession();
  const IS_PREMIUM = (session?.user as any)?.plan === "PREMIUM";
  const searchParams = useSearchParams();
  const stateCode = searchParams.get("state") || "FL";
  const state = US_STATES.find(s => s.code === stateCode) || US_STATES.find(s => s.code === "FL")!;

  const [appMode, setAppMode] = useState<AppMode>("select");
  const [testMode, setTestMode] = useState<TestMode>("PRACTICE");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [selectedLang, setSelectedLang] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [examConfig, setExamConfig] = useState<ExamConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ questionId: string; choiceId: string; isCorrect: boolean }[]>([]);
  const [timer, setTimer] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [skippedQuestions, setSkippedQuestions] = useState<number[]>([]);
  const [examEnded, setExamEnded] = useState<"pass" | "fail" | null>(null);
  const [relatedLesson, setRelatedLesson] = useState<{ title: string; simpleLine: string; slug: string } | null>(null);


  // Auto-start quick mode from dashboard
  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "quick") {
      startTest("PRACTICE", 10);
    }
  }, []);
  // Timer for exam simulation
  useEffect(() => {

    if (testMode === "EXAM_SIMULATION" && timeLeft !== null) {
      if (timeLeft <= 0) { setAppMode("results"); return; }
      const interval = setInterval(() => setTimeLeft(t => (t ?? 0) - 1), 1000);
      return () => clearInterval(interval);
    } else {
      const interval = setInterval(() => setTimer(t => t + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [appMode, testMode, timeLeft]);

  const fetchQuestions = async (mode: TestMode, topic?: string, quickLimit?: number) => {
    setLoading(true);
    try {
      const apiMode = quickLimit ? "QUICK" : mode;
      const params = new URLSearchParams({ state: stateCode, mode: apiMode });
      if (topic) params.set("topic", topic);
      if (session?.user) params.set("userId", (session.user as any).id || "");
      const res = await fetch(`/api/questions?${params}`);
      const data = await res.json();
      setQuestions(data.questions || []);
      setExamConfig(data.examConfig || null);
      if (data.examConfig?.timeLimit) setTimeLeft(data.examConfig.timeLimit * 60);
    } catch (e) {
      console.error("Failed to fetch questions", e);
    } finally {
      setLoading(false);
    }
  };

  const saveSession = async (finalAnswers: typeof answers) => {
    if (!session?.user) return;
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stateCode,
          mode: testMode,
          answers: finalAnswers,
        }),
      });
    } catch (e) {
      console.error("Failed to save session", e);
    }
  };

  const startTest = async (mode: TestMode, quickLimit?: number) => {
    setTestMode(mode);
    setAnswers([]);
    setCurrent(0);
    setSelected(null);
    setTimer(0);
    setShowExplanation(false);
    setSkippedQuestions([]);
    setExamEnded(null);
    await fetchQuestions(mode, selectedTopic || undefined, quickLimit);
    setAppMode("test");
  };

  const handleAnswer = async (choiceId: string) => {
    if (selected !== null) return;
    setSelected(choiceId);
    if (testMode === "PRACTICE") {
      setShowExplanation(true);
      // Check if wrong — fetch related lesson
      const q = questions[current];
      const choice = q.choices.find(c => c.id === choiceId);
      if (!choice?.isCorrect && q.topic?.slug) {
        try {
          const res = await fetch(`/api/lessons?topic=${q.topic.slug}`);
          const data = await res.json();
          if (data.lessons?.length > 0) {
            const lesson = data.lessons[Math.floor(Math.random() * data.lessons.length)];
            setRelatedLesson(lesson);
          }
        } catch {}
      } else {
        setRelatedLesson(null);
      }
    }
  };

  const nextQuestion = async () => {
    if (!selected) return;
    const q = questions[current];
    const choice = q.choices.find(c => c.id === selected);
    const isCorrect = choice?.isCorrect ?? false;
    const newAnswers = [...answers, { questionId: q.id, choiceId: selected, isCorrect }];
    setAnswers(newAnswers);

    // Update memory engine only in PRACTICE mode, not EXAM_SIMULATION
    if (testMode === "PRACTICE") {
      fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: q.id, isCorrect }),
      }).catch(() => {});
    }

    // Exam simulation: check auto-fail and auto-pass
    if (testMode === "EXAM_SIMULATION" && examConfig) {
      const wrongCount = newAnswers.filter(a => !a.isCorrect).length;
      const correctCount = newAnswers.filter(a => a.isCorrect).length;
      const remaining = questions.length - newAnswers.length;

      // Auto-fail: exceeded max wrong answers
      if (examConfig.autoFail && wrongCount > examConfig.maxWrong) {
        setExamEnded("fail");
        await saveSession(newAnswers);
        setAnswers(newAnswers);
        setAppMode("results");
        return;
      }

      // Auto-pass: reached passing score and can't fail anymore
      const neededToPass = Math.ceil(questions.length * examConfig.passingScore / 100);
      if (examConfig.autoPass && correctCount >= neededToPass) {
        setExamEnded("pass");
        await saveSession(newAnswers);
        setAnswers(newAnswers);
        setAppMode("results");
        return;
      }
    }

    if (current + 1 >= questions.length) {
      await saveSession(newAnswers);
      setAppMode("results");
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowExplanation(false);
      setRelatedLesson(null);
    }
  };

  const skipQuestion = () => {
    if (!examConfig?.skipAllowed) return;
    if (skippedQuestions.length >= examConfig.maxSkips) return;
    setSkippedQuestions(s => [...s, current]);
    // Move to next question without answering
    if (current + 1 >= questions.length) {
      setAppMode("results");
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowExplanation(false);
      setRelatedLesson(null);
    }
  };

  const getTranslation = (q: Question) => {
    if (!selectedLang) return null;
    return q.translations?.find(t => t.language === selectedLang) || null;
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const score = answers.filter(a => a.isCorrect).length;
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const passed = examConfig ? pct >= examConfig.passingScore : pct >= 80;

  // ── SELECT MODE ─────────────────────────────────────────────────────────────
  if (appMode === "select") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{state.name} DMV Practice</h1>
        <p className="text-gray-500 text-sm mb-8">Choose your study mode below</p>

        {/* Mode Cards */}
        <div className="space-y-4 mb-8">
          {/* Practice Mode */}
          <div className="rounded-xl border-2 border-green-200 bg-green-50 p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-gray-900 text-lg">Practice Mode</h2>
                <p className="text-sm text-gray-600 mt-1 mb-3">Hints and explanations shown after each answer. No time limit. Perfect for learning.</p>

                {/* Topic filter */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <button onClick={() => setSelectedTopic("")} className={cn("px-3 py-1 rounded-full text-xs font-medium border transition-colors", selectedTopic === "" ? "bg-green-500 text-white border-green-500" : "bg-white text-gray-600 border-gray-300 hover:border-green-400")}>All Topics</button>
                  {TOPICS.map(t => (
                    <button key={t.slug} onClick={() => setSelectedTopic(t.slug)} className={cn("px-3 py-1 rounded-full text-xs font-medium border transition-colors", selectedTopic === t.slug ? "bg-green-500 text-white border-green-500" : "bg-white text-gray-600 border-gray-300 hover:border-green-400")}>{t.label}</button>
                  ))}
                </div>

                <button onClick={() => startTest("PRACTICE")} className="px-5 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors">
                  Start Practice
                </button>
              </div>
            </div>
          </div>

          {/* Exam Simulation */}
          <div className={cn("rounded-xl border-2 p-5", IS_PREMIUM ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-gray-50 opacity-75")}>
            <div className="flex items-start gap-4">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", IS_PREMIUM ? "bg-blue-500" : "bg-gray-400")}>
                {IS_PREMIUM ? <Target className="w-5 h-5 text-white" /> : <Lock className="w-5 h-5 text-white" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-gray-900 text-lg">Exam Simulation</h2>
                  {!IS_PREMIUM && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">PREMIUM</span>}
                </div>
                <p className="text-sm text-gray-600 mt-1 mb-3">
                  Real {state.name} DMV exam format. {examConfig ? `${examConfig.totalQuestions} questions, ${examConfig.timeLimit} min, ${examConfig.passingScore}% to pass.` : "Timed, no hints, real pass/fail result."}
                </p>
                {IS_PREMIUM ? (
                  <button onClick={() => startTest("EXAM_SIMULATION")} className="px-5 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors">
                    Start Exam Simulation
                  </button>
                ) : (
                  <Link href="/pricing" className="inline-flex items-center gap-1 px-5 py-2 bg-yellow-500 text-white rounded-lg text-sm font-semibold hover:bg-yellow-600 transition-colors">
                    Upgrade to Premium <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Weak Areas */}
          <div className={cn("rounded-xl border-2 p-5", IS_PREMIUM ? "border-orange-200 bg-orange-50" : "border-gray-200 bg-gray-50 opacity-75")}>
            <div className="flex items-start gap-4">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", IS_PREMIUM ? "bg-orange-500" : "bg-gray-400")}>
                {IS_PREMIUM ? <AlertTriangle className="w-5 h-5 text-white" /> : <Lock className="w-5 h-5 text-white" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-gray-900 text-lg">Weak Areas</h2>
                  {!IS_PREMIUM && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">PREMIUM</span>}
                </div>
                <p className="text-sm text-gray-600 mt-1 mb-3">Focuses only on questions you previously answered wrong. Best for targeted improvement.</p>
                {IS_PREMIUM ? (
                  <button onClick={() => startTest("WEAK_AREAS")} className="px-5 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors">
                    Study Weak Areas
                  </button>
                ) : (
                  <Link href="/pricing" className="inline-flex items-center gap-1 px-5 py-2 bg-yellow-500 text-white rounded-lg text-sm font-semibold hover:bg-yellow-600 transition-colors">
                    Upgrade to Premium <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>


      </div>
    );
  }

  // ── LOADING ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-gray-600">Loading questions...</p>
      </div>
    );
  }

  // ── TEST MODE ────────────────────────────────────────────────────────────────
  if (appMode === "test" && questions.length > 0) {
    const q = questions[current];
    const translation = getTranslation(q);
    const displayText = translation ? translation.text : q.text;
    const displayChoices = translation ? translation.choices : q.choices.map(c => c.text);
    const displayExplanation = translation ? translation.explanation : q.explanation;
    const correctIdx = q.choices.findIndex(c => c.isCorrect);

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setAppMode("select")} className="text-gray-400 hover:text-gray-600 text-sm">← Exit</button>
            <span className={cn("px-2 py-1 rounded-full text-xs font-bold", testMode === "PRACTICE" ? "bg-green-100 text-green-700" : testMode === "EXAM_SIMULATION" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700")}>
              {testMode === "PRACTICE" ? "Practice" : testMode === "EXAM_SIMULATION" ? "Exam Simulation" : "Weak Areas"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {testMode === "EXAM_SIMULATION" && timeLeft !== null && (
              <span className={cn("flex items-center gap-1 text-sm font-mono font-bold", timeLeft < 300 ? "text-red-600" : "text-gray-600")}>
                <Clock className="w-4 h-4" /> {formatTime(timeLeft)}
              </span>
            )}
            {testMode === "PRACTICE" && (
              <span className="text-sm text-gray-500 font-mono">{formatTime(timer)}</span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
          <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
        </div>

        {/* Question counter */}
        <p className="text-xs text-gray-400 mb-3">Question {current + 1} of {questions.length} · {q.topic.name}</p>

        {/* Question */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <p className="text-gray-900 font-medium text-lg leading-relaxed flex-1">{q.text}</p>
            {IS_PREMIUM && (
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                {selectedLang ? (
                  <button
                    onClick={() => setSelectedLang("")}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors border border-blue-200"
                  >
                    <Globe className="w-3 h-3" /> {LANGUAGES.find(l => l.code === selectedLang)?.label} ✕
                  </button>
                ) : (
                  <div className="relative group">
                    <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors border border-gray-200">
                      <Globe className="w-3 h-3" /> Translate
                    </button>
                    <div className="absolute right-0 top-7 bg-white border border-gray-200 rounded-xl shadow-lg p-2 z-10 hidden group-hover:flex flex-col gap-1 min-w-[120px]">
                      {LANGUAGES.map(l => (
                        <button key={l.code} onClick={() => setSelectedLang(l.code)}
                          className="text-left px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors">
                          {l.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {!IS_PREMIUM && (
              <a href="/pricing" className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-50 text-gray-400 border border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 hover:text-yellow-700 transition-colors flex-shrink-0">
                <Globe className="w-3 h-3" /> Translate
              </a>
            )}
          </div>
          {translation && (
            <div className="mt-3 pt-3 border-t border-blue-100">
              <p className="text-blue-700 font-medium text-lg leading-relaxed italic">{translation.text}</p>
              <p className="text-xs text-blue-400 mt-1">{LANGUAGES.find(l => l.code === selectedLang)?.label}</p>
            </div>
          )}
        </div>

        {/* Choices */}
        <div className="space-y-3 mb-6">
          {q.choices.map((choice, idx) => {
            const isSelected = selected === choice.id;
            const isCorrect = choice.isCorrect;
            const showResult = selected !== null;
            return (
              <button
                key={choice.id}
                onClick={() => handleAnswer(choice.id)}
                disabled={selected !== null}
                className={cn(
                  "w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all font-medium text-sm",
                  !showResult && "border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50",
                  showResult && isCorrect && "border-green-500 bg-green-50 text-green-800",
                  showResult && isSelected && !isCorrect && "border-red-500 bg-red-50 text-red-800",
                  showResult && !isSelected && !isCorrect && "border-gray-200 bg-white text-gray-400",
                )}
              >
                <span className="flex items-center gap-3">
                  <span className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0",
                    !showResult && "border-gray-300 text-gray-400",
                    showResult && isCorrect && "border-green-500 bg-green-500 text-white",
                    showResult && isSelected && !isCorrect && "border-red-500 bg-red-500 text-white",
                    showResult && !isSelected && !isCorrect && "border-gray-300 text-gray-400",
                  )}>
                    {showResult && isCorrect ? <CheckCircle className="w-3.5 h-3.5" /> : showResult && isSelected && !isCorrect ? <XCircle className="w-3.5 h-3.5" /> : String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">
                    {q.choices[idx]?.text}
                    {translation && translation.choices[idx] && (
                      <span className="block text-xs text-blue-500 italic mt-0.5">{translation.choices[idx]}</span>
                    )}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Explanation (Practice mode only) */}
        {showExplanation && testMode === "PRACTICE" && (
          <div className={cn("rounded-xl p-4 mb-4 border", selected && q.choices.find(c => c.id === selected)?.isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200")}>
            <p className="text-xs font-bold mb-1 uppercase tracking-wide text-gray-500">Explanation</p>
            <p className="text-sm text-gray-700">{displayExplanation}</p>
          </div>
        )}

        {/* Exam status bar */}
        {testMode === "EXAM_SIMULATION" && examConfig && (
          <div className="flex items-center justify-between text-xs mb-3 px-1">
            <span className="text-red-500 font-medium">
              ❌ Wrong: {answers.filter(a => !a.isCorrect).length} / {examConfig.maxWrong} max
            </span>
            <span className="text-green-600 font-medium">
              ✅ Correct: {answers.filter(a => a.isCorrect).length}
            </span>
            {examConfig.skipAllowed && (
              <span className="text-yellow-600 font-medium">
                ⏭ Skips: {skippedQuestions.length} / {examConfig.maxSkips}
              </span>
            )}
          </div>
        )}

        {/* Skip button - exam simulation only */}
        {testMode === "EXAM_SIMULATION" && examConfig?.skipAllowed && !selected && skippedQuestions.length < examConfig.maxSkips && (
          <button
            onClick={skipQuestion}
            className="w-full py-2.5 mb-2 border-2 border-yellow-400 text-yellow-700 rounded-xl font-semibold hover:bg-yellow-50 transition-colors text-sm"
          >
            ⏭ Skip Question ({examConfig.maxSkips - skippedQuestions.length} remaining)
          </button>
        )}

        {/* Related micro lesson after wrong answer */}
        {relatedLesson && testMode === "PRACTICE" && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-3">
            <p className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-1">📚 Quick Lesson</p>
            <p className="font-bold text-purple-900 mb-1">{relatedLesson.title}</p>
            <p className="text-sm text-purple-800">{relatedLesson.simpleLine}</p>
            <a href="/lessons" className="text-xs text-purple-600 font-semibold mt-2 inline-block hover:underline">
              See all lessons →
            </a>
          </div>
        )}

        {/* Next button */}
        {selected && (
          <button onClick={nextQuestion} className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            {current + 1 >= questions.length ? "See Results" : "Next Question"} <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  // ── RESULTS ──────────────────────────────────────────────────────────────────
  if (appMode === "results") {
    const wrongQuestions = questions.filter((q, i) => answers[i] && !answers[i].isCorrect);
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className={cn("rounded-2xl p-8 text-center mb-6", passed ? "bg-green-50 border-2 border-green-200" : "bg-red-50 border-2 border-red-200")}>
          {passed ? <Trophy className="w-12 h-12 text-green-500 mx-auto mb-3" /> : <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />}
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{passed ? "You Passed!" : "Keep Practicing"}</h2>
          {examEnded === "fail" && <p className="text-sm text-red-600 font-medium mb-1">⚠️ Test ended early — maximum wrong answers exceeded</p>}
          {examEnded === "pass" && <p className="text-sm text-green-600 font-medium mb-1">🎉 Test ended early — passing score reached!</p>}
          <p className="text-5xl font-bold mt-3 mb-1 {passed ? 'text-green-600' : 'text-red-500'}">{pct}%</p>
          <p className="text-gray-500 text-sm">{score} correct out of {questions.length} questions</p>
          {testMode === "EXAM_SIMULATION" && examConfig && (
            <p className="text-xs text-gray-400 mt-2">Passing score: {examConfig.passingScore}%</p>
          )}
        </div>

        {/* Topic breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><BarChart2 className="w-4 h-4" /> Topic Breakdown</h3>
          {TOPICS.map(topic => {
            const topicQs = questions.filter(q => q.topic.slug === topic.slug);
            const topicAnswers = answers.filter((_, i) => questions[i]?.topic.slug === topic.slug);
            const topicCorrect = topicAnswers.filter(a => a.isCorrect).length;
            const topicPct = topicQs.length > 0 ? Math.round((topicCorrect / topicQs.length) * 100) : null;
            if (topicPct === null) return null;
            return (
              <div key={topic.slug} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{topic.label}</span>
                  <span className="font-medium text-gray-900">{topicCorrect}/{topicQs.length}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={cn("h-2 rounded-full", topicPct >= 80 ? "bg-green-500" : topicPct >= 60 ? "bg-yellow-500" : "bg-red-500")} style={{ width: `${topicPct}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => { setAppMode("select"); setAnswers([]); }} className="py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:border-gray-400 transition-colors flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" /> New Test
          </button>
          {IS_PREMIUM && wrongQuestions.length > 0 ? (
            <button onClick={() => startTest("WEAK_AREAS")} className="py-3 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Study Weak Areas
            </button>
          ) : (
            <Link href={`/state/${state.name.toLowerCase().replace(/ /g, "-")}/dmv-practice-test`} className="py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4" /> Study Guide
            </Link>
          )}
        </div>
      </div>
    );
  }

  // Empty state
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <p className="text-gray-500">No questions available for this state yet.</p>
      <button onClick={() => setAppMode("select")} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Go Back</button>
    </div>
  );
}

export default function PracticePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>}>
          <PracticeContent />
        </Suspense>
      </main>
    </>
  );
}
