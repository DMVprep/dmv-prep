// src/app/blog/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getAllPosts } from "@/data/blog-posts";
import { BookOpen, Globe, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "DMV Blog — Tips, Guides & News for Your Driving Test",
  description: "Expert DMV test tips, state-by-state guides, English-only policy updates, and study strategies for non-native speakers. Free resources from DMVPrep Pro.",
  alternates: {
    canonical: "https://dmv-prep.com/blog",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  const featured = posts.filter(
    (p) => p.category === "english-only-policy" && p.language === "en"
  );
  const spanishPosts = posts.filter((p) => p.language === "es");
  const creolePosts = posts.filter((p) => p.language === "ht");
  const frenchPosts = posts.filter((p) => p.language === "fr");
  const guides = posts.filter(
    (p) => p.category === "dmv-guide" && p.language === "en"
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h1 className="text-3xl font-extrabold text-gray-900">
              DMV Blog
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Tips, guides, and the latest news to help you pass your DMV test —
            especially if English is not your first language.
          </p>
        </div>

        {/* English-Only Policy — Featured */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">
              NEW POLICY
            </span>
            <h2 className="text-xl font-bold text-gray-900">
              English-Only DMV Test Updates
            </h2>
          </div>
          <div className="grid gap-4">
            {featured.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block bg-red-50 border border-red-100 rounded-xl p-5 hover:border-red-300 transition-colors"
              >
                <h3 className="font-bold text-gray-900 mb-1">{post.title}</h3>
                <p className="text-gray-600 text-sm">{post.description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 mt-2">
                  Read more <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Spanish articles */}
        {spanishPosts.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-bold text-gray-900">En Español</h2>
            </div>
            <div className="grid gap-3">
              {spanishPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block bg-yellow-50 border border-yellow-100 rounded-xl p-4 hover:border-yellow-300 transition-colors"
                >
                  <h3 className="font-bold text-gray-900 mb-1 text-sm">{post.title}</h3>
                  <p className="text-gray-600 text-xs">{post.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Haitian Creole articles */}
        {creolePosts.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-bold text-gray-900">An Kreyòl Ayisyen</h2>
            </div>
            <div className="grid gap-3">
              {creolePosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block bg-blue-50 border border-blue-100 rounded-xl p-4 hover:border-blue-300 transition-colors"
                >
                  <h3 className="font-bold text-gray-900 mb-1 text-sm">{post.title}</h3>
                  <p className="text-gray-600 text-xs">{post.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* French articles */}
        {frenchPosts.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-bold text-gray-900">En Français</h2>
            </div>
            <div className="grid gap-3">
              {frenchPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block bg-purple-50 border border-purple-100 rounded-xl p-4 hover:border-purple-300 transition-colors"
                >
                  <h3 className="font-bold text-gray-900 mb-1 text-sm">{post.title}</h3>
                  <p className="text-gray-600 text-xs">{post.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* DMV Guides */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            DMV Study Guides
          </h2>
          <div className="grid gap-4">
            {guides.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block bg-gray-50 border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-colors"
              >
                <h3 className="font-bold text-gray-900 mb-1">{post.title}</h3>
                <p className="text-gray-600 text-sm">{post.description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 mt-2">
                  Read more <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
