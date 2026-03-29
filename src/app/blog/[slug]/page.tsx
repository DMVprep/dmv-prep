// src/app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BLOG_POSTS, getPostBySlug, getRelatedPosts, LANGUAGE_LABELS } from "@/data/blog-posts";
import { ArrowLeft, ArrowRight, Globe, Calendar } from "lucide-react";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `https://dmv-prep.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      url: `https://dmv-prep.com/blog/${post.slug}`,
      siteName: "DMVPrep Pro",
    },
  };
}

function renderMarkdown(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inTable = false;
  let tableRows: string[][] = [];
  let tableHeader: string[] = [];

  function flushTable() {
    if (tableHeader.length === 0) return null;
    const node = (
      <div key={`table-${elements.length}`} className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {tableHeader.map((h, i) => (
                <th key={i} className="text-left p-3 font-bold text-gray-700 border-b-2 border-gray-200">
                  {h.replace(/\*\*/g, "")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                {row.map((cell, ci) => (
                  <td key={ci} className="p-3 border-b border-gray-100 text-gray-700"
                    dangerouslySetInnerHTML={{ __html: cell.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableHeader = [];
    tableRows = [];
    inTable = false;
    return node;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Table row
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const cells = trimmed.split("|").filter(Boolean).map((c) => c.trim());
      if (!inTable) {
        inTable = true;
        tableHeader = cells;
        continue;
      }
      // Skip separator row
      if (cells.every((c) => /^[-:]+$/.test(c))) continue;
      tableRows.push(cells);
      continue;
    }

    // End of table
    if (inTable) {
      const tableNode = flushTable();
      if (tableNode) elements.push(tableNode);
    }

    // Headings
    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-2xl font-bold text-gray-900 mt-10 mb-4">
          {trimmed.slice(3)}
        </h2>
      );
      continue;
    }
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-lg font-bold text-gray-900 mt-8 mb-3">
          {trimmed.slice(4).replace(/\*\*/g, "")}
        </h3>
      );
      continue;
    }

    // Empty line
    if (trimmed === "") continue;

    // List items
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      elements.push(
        <li
          key={i}
          className="ml-5 text-gray-700 leading-relaxed list-disc"
          dangerouslySetInnerHTML={{
            __html: trimmed
              .slice(2)
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
              .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>'),
          }}
        />
      );
      continue;
    }

    // Numbered list
    if (/^\d+\.\s/.test(trimmed)) {
      elements.push(
        <li
          key={i}
          className="ml-5 text-gray-700 leading-relaxed list-decimal"
          dangerouslySetInnerHTML={{
            __html: trimmed
              .replace(/^\d+\.\s/, "")
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
              .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>'),
          }}
        />
      );
      continue;
    }

    // Regular paragraph
    elements.push(
      <p
        key={i}
        className="text-gray-700 leading-relaxed mb-4"
        dangerouslySetInnerHTML={{
          __html: trimmed
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>'),
        }}
      />
    );
  }

  // Flush any remaining table
  if (inTable) {
    const tableNode = flushTable();
    if (tableNode) elements.push(tableNode);
  }

  return elements;
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const related = getRelatedPosts(post);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://dmv-prep.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://dmv-prep.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://dmv-prep.com/blog/${post.slug}` },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    inLanguage: post.language,
    url: `https://dmv-prep.com/blog/${post.slug}`,
    publisher: {
      "@type": "Organization",
      name: "DMVPrep Pro",
      url: "https://dmv-prep.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://dmv-prep.com/blog/${post.slug}`,
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-blue-600">Blog</Link>
          <span>/</span>
          <span className="text-gray-700 truncate max-w-[200px]">{post.title}</span>
        </nav>

        {/* Language badge */}
        {post.language !== "en" && (
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-500">
              {LANGUAGE_LABELS[post.language]}
            </span>
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
          <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-xs font-medium">
            {post.category === "english-only-policy" ? "English-Only Policy" : "DMV Guide"}
          </span>
        </div>

        {/* Content */}
        <article className="prose-custom">
          {renderMarkdown(post.content)}
        </article>

        {/* CTA */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to start practicing?</h3>
          <p className="text-gray-600 text-sm mb-4">Free DMV practice tests for all 50 states with plain-English explanations.</p>
          <Link
            href="/states"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Find Your State <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <div className="mt-12">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Related Articles</h3>
            <div className="grid gap-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="block bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    {r.language !== "en" && (
                      <span className="text-xs text-gray-400">{LANGUAGE_LABELS[r.language]}</span>
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm">{r.title}</h4>
                  <p className="text-gray-500 text-xs mt-1">{r.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to blog */}
        <div className="mt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4" /> Back to all articles
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
