// src/app/admin/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import Link from "next/link";
import { Users, BookOpen, FileText, BarChart2, Upload, Settings } from "lucide-react";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") redirect("/");

  const [userCount, questionCount, sessionCount, subCount] = await Promise.all([
    prisma.user.count(),
    prisma.question.count(),
    prisma.testSession.count(),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage questions, users, and content.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Users, label: "Total Users", value: userCount, color: "text-blue-600 bg-blue-50" },
            { icon: BookOpen, label: "Questions", value: questionCount, color: "text-green-600 bg-green-50" },
            { icon: FileText, label: "Test Sessions", value: sessionCount, color: "text-purple-600 bg-purple-50" },
            { icon: BarChart2, label: "Active Subs", value: subCount, color: "text-yellow-600 bg-yellow-50" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="card p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-3xl font-extrabold text-gray-900">{value.toLocaleString()}</div>
              <div className="text-xs text-gray-400 mt-0.5 uppercase tracking-wide font-medium">{label}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            {
              href: "/admin/questions",
              icon: BookOpen,
              title: "Manage Questions",
              desc: "View, edit, or delete practice questions",
              color: "border-green-200 hover:bg-green-50",
            },
            {
              href: "/admin/upload",
              icon: Upload,
              title: "Upload Questions (CSV)",
              desc: "Bulk import questions via CSV file",
              color: "border-blue-200 hover:bg-blue-50",
            },
            {
              href: "/admin/users",
              icon: Users,
              title: "Manage Users",
              desc: "View user accounts and subscriptions",
              color: "border-purple-200 hover:bg-purple-50",
            },
            {
              href: "/admin/states",
              icon: Settings,
              title: "Manage States",
              desc: "Add or edit state information",
              color: "border-yellow-200 hover:bg-yellow-50",
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`card p-6 border-2 transition-all group ${item.color}`}
            >
              <item.icon className="w-8 h-8 text-gray-400 mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
