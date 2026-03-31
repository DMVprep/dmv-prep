"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BookOpen, ChevronRight, Lock, Brain, Zap } from "lucide-react";
import Link from "next/link";

interface Lesson {
  id: string;
  slug: string;
  topic: string;
  title: string;
  simpleLine: string;
  explanation: string;
  imageUrl?: string;
}

const TOPIC_LABELS: Record<string, string> = {
  "right-of-way": "Right of Way",
  "traffic-signs": "Traffic Signs",
  "speed-limits": "Speed Limits",
  "alcohol-dui": "Alcohol & DUI",
  "safe-driving": "Safe Driving",
  "licensing-permits": "Licensing & Permits",
};

const TOPIC_COLORS: Record<string, string> = {
  "right-of-way": "bg-blue-100 text-blue-700 border-blue-200",
  "traffic-signs": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "speed-limits": "bg-green-100 text-green-700 border-green-200",
  "alcohol-dui": "bg-red-100 text-red-700 border-red-200",
  "safe-driving": "bg-purple-100 text-purple-700 border-purple-200",
  "licensing-permits": "bg-orange-100 text-orange-700 border-orange-200",
};

export default function LessonsPage() {
  const { data: session } = useSession();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTopic, setActiveTopic] = useState<string>("all");
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

  const [userState, setUserState] = useState<string>("");

  useEffect(() => {
    // Get state from localStorage if user has selected one
    const saved = typeof window !== "undefined" ? localStorage.getItem("selectedState") || "" : "";
    setUserState(saved);
    const url = saved ? `/api/lessons?state=${saved}` : "/api/lessons";
    fetch(url)
      .then(r => r.json())
      .then(data => {
        setLessons(data.lessons || []);
        setLoading(false);
      });
  }, []);

  const plan = (session?.user as any)?.plan;
  const isPaid = plan === "PREMIUM" || plan === "PASS";
  const FREE_LIMIT = 5;

  const topics = ["all", ...Object.keys(TOPIC_LABELS)];
  const filtered = activeTopic === "all" ? lessons : lessons.filter(l => l.topic === activeTopic);

  const grouped = filtered.reduce((acc, lesson) => {
    if (!acc[lesson.topic]) acc[lesson.topic] = [];
    acc[lesson.topic].push(lesson);
    return acc;
  }, {} as Record<string, Lesson[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10">
        {/* SmartRecall Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-6 h-6 text-purple-600" />
            <h1 className="text-2xl font-extrabold text-gray-900">SmartRecall Method</h1>
            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full">Science-Backed</span>
          </div>
          <p className="text-gray-600 mb-3">Short, focused lessons based on <strong>active recall</strong> — the scientifically proven method used by millions of students to retain information faster and longer.</p>
          {!isPaid && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-900">Free preview: {FREE_LIMIT} of {lessons.length} lessons</p>
                <p className="text-xs text-blue-600 mt-0.5">Unlock all lessons with Pass or Premium</p>
              </div>
              <Link href="/pricing" className="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1">
                <Zap className="w-4 h-4" /> Unlock All
              </Link>
            </div>
          )}
        </div>

        {/* State selector */}
        {userState && (
          <div className="mb-4 flex items-center gap-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
            <span>Showing lessons for <strong>{userState}</strong></span>
            <button onClick={() => { localStorage.removeItem("selectedState"); setUserState(""); fetch("/api/lessons").then(r=>r.json()).then(d=>{setLessons(d.lessons||[])}); }}
              className="ml-2 text-xs text-blue-500 hover:text-blue-700 underline">Show all states</button>
          </div>
        )}

        {/* Topic filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {topics.map(topic => (
            <button
              key={topic}
              onClick={() => setActiveTopic(topic)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                activeTopic === topic
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-purple-400"
              }`}
            >
              {topic === "all" ? "All Topics" : TOPIC_LABELS[topic]}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading lessons...</div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([topic, topicLessons]) => (
              <div key={topic}>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                  {TOPIC_LABELS[topic] || topic}
                </h2>
                <div className="space-y-3">
                  {topicLessons.map((lesson, lessonIndex) => {
                    const globalIndex = filtered.indexOf(lesson);
                    const isLocked = !isPaid && globalIndex >= FREE_LIMIT;
                    return (
                    <div
                      key={lesson.id}
                      className={`bg-white rounded-xl border shadow-sm overflow-hidden ${isLocked ? "border-gray-100 opacity-75" : "border-gray-200"}`}
                    >
                      <button
                        onClick={() => !isLocked && setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)}
                        className={`w-full text-left p-4 flex items-center justify-between transition-colors ${isLocked ? "cursor-not-allowed" : "hover:bg-gray-50"}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${isLocked ? "bg-gray-100 text-gray-400 border-gray-200" : TOPIC_COLORS[lesson.topic] || "bg-gray-100 text-gray-600"}`}>
                            {TOPIC_LABELS[lesson.topic] || lesson.topic}
                          </span>
                          <span className={`font-semibold ${isLocked ? "text-gray-400" : "text-gray-900"}`}>{lesson.title}</span>
                        </div>
                        {isLocked ? (
                          <Link href="/pricing" onClick={e => e.stopPropagation()}>
                            <Lock className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                          </Link>
                        ) : (
                          <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${expandedLesson === lesson.id ? "rotate-90" : ""}`} />
                        )}
                      </button>

                      {expandedLesson === lesson.id && !isLocked && (
                        <div className="px-4 pb-5 border-t border-gray-100">
                          <div className="bg-purple-50 rounded-lg p-4 my-3">
                            <p className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-1">Key Concept</p>
                            <p className="text-lg font-bold text-purple-900">{lesson.simpleLine}</p>
                          </div>
                          {lesson.imageUrl && (
                            <img src={lesson.imageUrl} alt={lesson.title} className="w-full rounded-lg mb-3" />
                          )}
                          <p className="text-gray-700 leading-relaxed text-sm">{lesson.explanation}</p>
                          <div className="mt-4">
                            <Link
                              href={`/practice?topic=${lesson.topic}`}
                              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                            >
                              Practice questions on this topic <ChevronRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
