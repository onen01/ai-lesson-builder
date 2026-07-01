"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export function LandingPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleFile(file: File) {
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed. Please try again.");
        setIsUploading(false);
        return;
      }

      sessionStorage.setItem("pdfContent", data.content);
      sessionStorage.setItem("pdfFilename", data.filename);
      router.push("/lesson");
    } catch {
      setError("Something went wrong. Please try again.");
      setIsUploading(false);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Navbar */}
      <nav className="border-b border-border-subtle bg-bg px-8 py-5 flex items-center justify-between">
        <span className="font-serif text-xl font-medium text-primary">
          AI Lesson Builder
        </span>
        <span className="font-sans text-sm text-muted">by Memorang</span>
      </nav>

      {/* Hero */}
      <div className="max-w-2xl mx-auto px-6 pt-20 pb-16 text-center">
        <p className="label-tag mb-5">AI-POWERED LEARNING</p>

        <h1 className="font-serif text-5xl md:text-6xl font-medium text-primary leading-tight mb-6">
          Turn any PDF into<br />an interactive lesson.
        </h1>

        <p className="font-sans text-secondary text-lg leading-relaxed mb-4">
          Upload a document and get a structured lesson plan, AI-generated quiz questions, real-time feedback, and a personalized performance summary.
        </p>

        <div className="flex items-center justify-center gap-6 mb-14 font-sans text-sm text-muted">
          <span>✓ Lesson plan with objectives</span>
          <span>✓ MCQ quiz from your content</span>
          <span>✓ AI tutor for hints</span>
        </div>

        {/* Upload Area */}
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-2xl p-14 cursor-pointer transition-all duration-200 mb-3
            ${isUploading ? "border-border bg-surface cursor-default" : ""}
            ${isDragging ? "border-accent bg-accent/5" : ""}
            ${!isUploading && !isDragging ? "border-border hover:border-accent/50 hover:bg-surface" : ""}
          `}
        >
          {isUploading ? (
            <div className="text-center">
              <div className="text-3xl mb-3">⏳</div>
              <p className="font-sans font-medium text-primary mb-1">
                Parsing your PDF...
              </p>
              <p className="font-sans text-muted text-sm">This takes a few seconds</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-4xl mb-3">📄</div>
              <p className="font-sans font-medium text-primary mb-1">
                Drop your PDF here
              </p>
              <p className="font-sans text-muted text-sm">
                or click to browse — max 25MB
              </p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={onFileChange}
        />

        {error && (
          <p className="font-sans text-error text-sm mt-3 animate-fadeIn">
            {error}
          </p>
        )}

        <p className="font-sans text-muted text-xs mt-6">
          Works with textbooks, lecture notes, research papers, and study guides.
          No account required.
        </p>
      </div>
    </div>
  );
}
