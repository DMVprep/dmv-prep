import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Page not found</h1>
          <p className="text-gray-500 mb-8">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-primary">
              Go Home
            </Link>
            <Link href="/states" className="btn-secondary">
              Practice by State
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
