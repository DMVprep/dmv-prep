// src/app/admin/upload/page.tsx
"use client";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Upload, CheckCircle, AlertCircle, FileText } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ imported: number; errors: string[] } | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload-questions", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
      toast.success(`Imported ${data.imported} questions!`);
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Upload Questions via CSV</h1>
        <p className="text-gray-500 mb-8">Bulk import questions using a CSV file.</p>

        {/* CSV format guide */}
        <div className="card p-5 mb-8 bg-blue-50 border-blue-100">
          <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            CSV Format Required
          </h3>
          <p className="text-sm text-blue-700 mb-2">Your CSV must have these columns (in order):</p>
          <code className="block text-xs bg-blue-100 text-blue-800 p-3 rounded-lg font-mono">
            state,topic,question,choice_a,choice_b,choice_c,choice_d,correct_answer,explanation,difficulty
          </code>
          <p className="text-xs text-blue-600 mt-2">
            correct_answer: A, B, C, or D ·
          </p>
        </div>

        {/* Upload area */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center mb-6 hover:border-blue-400 transition-colors cursor-pointer"
          onClick={() => document.getElementById("csv-input")?.click()}
        >
          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          {file ? (
            <div>
              <p className="font-semibold text-gray-800">{file.name}</p>
              <p className="text-sm text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          ) : (
            <div>
              <p className="font-semibold text-gray-700 mb-1">Click to upload CSV</p>
              <p className="text-sm text-gray-400">or drag and drop</p>
            </div>
          )}
          <input
            id="csv-input"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="btn-primary w-full py-3 text-base disabled:opacity-50"
        >
          {loading ? "Importing..." : "Import Questions"}
        </button>

        {/* Result */}
        {result && (
          <div className="mt-6 card p-5">
            <div className="flex items-center gap-2 font-bold text-green-700 mb-3">
              <CheckCircle className="w-5 h-5" />
              Import Complete
            </div>
            <p className="text-sm text-gray-600 mb-2">{result.imported} questions imported successfully.</p>
            {result.errors.length > 0 && (
              <div>
                <div className="flex items-center gap-1 text-orange-600 font-semibold text-sm mb-1">
                  <AlertCircle className="w-4 h-4" />
                  {result.errors.length} rows had errors:
                </div>
                <ul className="text-xs text-gray-500 space-y-1 max-h-32 overflow-y-auto">
                  {result.errors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
