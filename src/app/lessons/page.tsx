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
        {/* Method Intro */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-6 h-6 text-purple-600" />
            <h1 className="text-2xl font-extrabold text-gray-900">Your DMV Study Plan</h1>
          </div>

          {/* The Autopilot Promise */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-xl p-5 mb-4">
            <p className="text-base font-bold text-gray-900 mb-2">Forget the boring 100-page handbook.</p>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Other sites make you read the handbook over and over. We don&apos;t.
              Read each lesson <strong>once</strong>, then switch to autopilot &mdash; our system quizzes you on what you learned,
              brings back anything you forgot, and tells you exactly when you&apos;re ready to pass.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white rounded-lg p-3 border border-purple-100">
                <div className="text-lg font-extrabold text-purple-600 mb-0.5">Step 1</div>
                <div className="text-sm font-semibold text-gray-900">Read the lessons</div>
                <div className="text-xs text-gray-500 mt-0.5">~15 min. One read is all you need.</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <div className="text-lg font-extrabold text-blue-600 mb-0.5">Step 2</div>
                <div className="text-sm font-semibold text-gray-900">Practice right after</div>
                <div className="text-xs text-gray-500 mt-0.5">20 questions after reading. Then 20 more tomorrow.</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-green-100">
                <div className="text-lg font-extrabold text-green-600 mb-0.5">Step 3</div>
                <div className="text-sm font-semibold text-gray-900">Autopilot mode</div>
                <div className="text-xs text-gray-500 mt-0.5">We handle the rest. Just show up daily.</div>
              </div>
            </div>
          </div>

          {/* Progress tracker */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Your lesson progress</p>
              <p className="text-xs text-gray-500 mt-0.5">Open each lesson below to read it. One read-through is enough.</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold text-purple-600">{loading ? "..." : filtered.length}</p>
              <p className="text-xs text-gray-500">lessons available</p>
            </div>
          </div>

          {!isPaid && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-900">Free preview: {FREE_LIMIT} of {loading ? "..." : lessons.length} lessons</p>
                <p className="text-xs text-blue-600 mt-0.5">Unlock all lessons to complete your study plan</p>
              </div>
              <Link href="/pricing" className="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1">
                <Zap className="w-4 h-4" /> Unlock All
              </Link>
            </div>
          )}
        </div>

        {/* State selector */}
        <div className="mb-6 bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">Your state:</span>
              <select
                value={userState}
                onChange={(e) => {
                  const val = e.target.value;
                  setUserState(val);
                  setLoading(true);
                  if (val) {
                    localStorage.setItem("selectedState", val);
                    fetch(`/api/lessons?state=${val}`).then(r=>r.json()).then(d=>{setLessons(d.lessons||[]);setLoading(false);});
                  } else {
                    localStorage.removeItem("selectedState");
                    fetch("/api/lessons").then(r=>r.json()).then(d=>{setLessons(d.lessons||[]);setLoading(false);});
                  }
                }}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-800 bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All States</option>
                {["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"].map(code => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

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
          <div className="text-center py-20">
            <Brain className="w-10 h-10 text-purple-400 mx-auto mb-3 animate-pulse" />
            <p className="text-gray-400">Loading lessons...</p>
          </div>
        ) : lessons.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium mb-2">No lessons found</p>
            <p className="text-gray-400 text-sm">Try selecting a different topic or state.</p>
          </div>
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
                            <img src={lesson.imageUrl} alt={lesson.title} className="max-w-[200px] mx-auto rounded-lg mb-3" />
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
