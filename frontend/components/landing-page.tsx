"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Check,
  RotateCcw,
  Layers,
  BrainCircuit,
  MessageSquare,
  FileText,
  Play,
  Flame,
  CheckCircle2,
  Smile,
  Compass,
  Feather,
  Sun,
  Coffee,
} from "lucide-react";

export default function LandingPage() {
  // Interactive Study Desk State
  const [activeTab, setActiveTab] = React.useState<"flashcards" | "quizzes" | "digest">("flashcards");
  const [cardFlipped, setCardFlipped] = React.useState(false);
  const [quizSelected, setQuizSelected] = React.useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#FAFBF7] text-[#11231B] font-sans selection:bg-[#E2EDE5] selection:text-[#0D382B] relative overflow-hidden">
      {/* Delicate Ghibli Atmosphere Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft sunlit warm amber haze top right */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#FCECD7]/60 blur-3xl" />
        {/* Soft pastel meadow sage haze top left */}
        <div className="absolute top-20 -left-32 w-[32rem] h-[32rem] rounded-full bg-[#E5F0E9]/70 blur-3xl" />
        {/* Warm cream breeze bottom */}
        <div className="absolute -bottom-20 right-1/4 w-[36rem] h-[36rem] rounded-full bg-[#F4F1E6]/60 blur-3xl" />
      </div>

      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 bg-[#FAFBF7]/85 backdrop-blur-md border-b border-[#E7EBE7]/80 px-6 sm:px-10 h-18 flex items-center justify-between transition-all">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-full bg-[#E8F3EC] border border-[#CDE3D5] flex items-center justify-center overflow-hidden shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
            <Image
              src="/images/folio.png"
              alt="Folio avatar"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#0D382B] leading-none">
              Folio
            </span>
            <span className="text-[10px] font-semibold text-[#4A7A66] tracking-widest uppercase mt-0.5">
              Academy & Study Desk
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-[#3B5448]">
          <a href="#how-it-works" className="hover:text-[#0D382B] transition-colors">
            How It Works
          </a>
          <a href="#desk-preview" className="hover:text-[#0D382B] transition-colors">
            Study Modes
          </a>
          <a href="#philosophy" className="hover:text-[#0D382B] transition-colors">
            The Folio Way
          </a>
          <a href="#pricing" className="hover:text-[#0D382B] transition-colors">
            Scholarship & Pricing
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="text-xs font-bold text-[#2A4B3C] hover:text-[#0D382B] px-3 py-2 rounded-xl hover:bg-[#EEF5F1] transition-all"
          >
            Log In
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#0D382B] hover:bg-[#07251C] text-white text-xs font-bold px-5 py-2.5 shadow-sm hover:shadow transition-all active:scale-95"
          >
            <span>Begin Studying</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-36 sm:pt-40 pb-20 px-6 sm:px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Whimsical Badge */}
            <div className="inline-flex items-center gap-2 py-1.5 px-3.5 rounded-full bg-[#E8F3EC] border border-[#CDE3D5] text-[#1B4B38] text-xs font-bold shadow-2xs">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>A quiet, sunlit sanctuary for your mind</span>
              <span className="text-amber-500 font-serif">✦</span>
            </div>

            {/* Main Storybook Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#11231B] leading-[1.12]">
              Turn tangled notes into{" "}
              <span className="italic text-[#0D382B] font-normal underline decoration-[#CDE3D5] decoration-wavy decoration-2 underline-offset-8">
                quiet, lifelong mastery.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-[#3E5C4E] font-medium leading-relaxed max-w-xl">
              Meet Folio — your personal academic companion. Upload lectures, slides, and
              handwritten notes. Folio crafts high-yield flashcards, quizzes, and grounded
              answers with zero hallucinations.
            </p>

            {/* Action Buttons & Note */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#0D382B] hover:bg-[#07251C] text-white text-sm font-bold px-7 py-4 shadow-md hover:shadow-lg transition-all active:scale-95 group"
              >
                <span>Take a Seat at the Desk — It&apos;s Free</span>
                <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#desk-preview"
                className="inline-flex items-center gap-2 rounded-2xl bg-white hover:bg-[#F2F6F3] border border-[#D5E0D8] text-[#1B4B38] text-sm font-bold px-6 py-4 shadow-2xs transition-all"
              >
                <Compass className="w-4 h-4 text-emerald-700" />
                <span>Explore the Study Desk</span>
              </a>
            </div>

            {/* Micro assurances */}
            <div className="pt-2 flex items-center gap-6 text-xs text-[#527363] font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>100% Grounded in your notes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>No credit card needed</span>
              </div>
            </div>
          </div>

          {/* Right Hero Column: Ghibli-Style Folio Showcase with Speech Bubble */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
            {/* Ambient warm aura */}
            <div className="absolute w-72 h-72 rounded-full bg-[#FEF6E6] border border-[#FDE8C7] -z-10 blur-xl" />

            {/* Speech bubble */}
            <div className="relative z-20 mb-4 bg-white border-2 border-[#CDE3D5] rounded-3xl p-4 shadow-sm max-w-xs animate-in fade-in duration-700">
              <p className="font-handwriting text-xl text-[#0D382B] font-bold leading-snug">
                &ldquo;Ah, a new learner! Bring me your heaviest textbooks — we shall turn them into
                tea-time revision!&rdquo;
              </p>
              <div className="flex items-center justify-between mt-1 text-[11px] font-bold text-[#4A7A66]">
                <span className="font-serif italic">— Folio, Academic Sage</span>
                <span className="text-amber-500">✦ ✦ ✦</span>
              </div>
              {/* Pointer arrow downwards */}
              <div className="absolute -bottom-3 left-12 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white" />
            </div>

            {/* Character & Floating Pill Artifacts */}
            <div className="relative w-64 sm:w-80 h-72 sm:h-88">
              <Image
                src="/images/folio.png"
                alt="Folio the scholar philosopher"
                fill
                priority
                className="object-contain object-bottom drop-shadow-md hover:scale-102 transition-transform duration-300"
              />

              {/* Floating Token 1: Spaced Repetition Pill */}
              <div className="absolute -top-2 -left-6 bg-white border border-[#E5EAE7] rounded-2xl p-2.5 shadow-md flex items-center gap-2.5 animate-bounce [animation-duration:4s]">
                <div className="w-8 h-8 rounded-xl bg-[#E8F3EC] text-[#0D382B] flex items-center justify-center font-bold text-xs">
                  <Flame className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex flex-col text-left pr-2">
                  <span className="text-[11px] font-bold text-[#11231B]">5-Day Study Streak</span>
                  <span className="text-[9px] text-[#4A7A66] font-semibold">Ready for review</span>
                </div>
              </div>

              {/* Floating Token 2: Mastered Pill */}
              <div className="absolute bottom-6 -right-6 bg-white border border-[#E5EAE7] rounded-2xl p-2.5 shadow-md flex items-center gap-2.5 animate-bounce [animation-duration:5s] [animation-delay:1s]">
                <div className="w-8 h-8 rounded-xl bg-[#FEF6E6] text-amber-700 flex items-center justify-center font-bold text-xs">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="flex flex-col text-left pr-2">
                  <span className="text-[11px] font-bold text-[#11231B]">Cellular Biology</span>
                  <span className="text-[9px] text-emerald-800 font-semibold">94% Mastery score</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social / Academic Warmth Ribbon */}
      <section className="relative z-10 py-8 border-y border-[#E5EAE7] bg-[#F2F6F2]/60">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <Coffee className="w-5 h-5 text-amber-700 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#2C4A3C]">
              Built for students, lifelong researchers & curious minds
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-serif italic text-[#4A6858]">
            <span>&ldquo;Finally, an AI that doesn&apos;t fabricate answers.&rdquo;</span>
            <span className="hidden sm:inline">·</span>
            <span>&ldquo;Turned 200 slides into 20 smart flashcards.&rdquo;</span>
            <span className="hidden sm:inline">·</span>
            <span>&ldquo;Passed my biology midterm with calm confidence.&rdquo;</span>
          </div>
        </div>
      </section>

      {/* Interactive Section: "Folio's Study Desk" */}
      <section id="desk-preview" className="relative z-10 py-24 px-6 sm:px-10 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold tracking-widest uppercase text-emerald-800 bg-[#E8F3EC] px-3 py-1 rounded-full border border-[#CDE3D5]">
            INTERACTIVE PREVIEW
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#11231B]">
            A peek inside Folio&apos;s workshop
          </h2>
          <p className="text-sm sm:text-base text-[#4A6858] font-medium leading-relaxed">
            Click the tabs below to try out Folio&apos;s interactive learning tools right here.
          </p>

          {/* Interactive Mode Tabs */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setActiveTab("flashcards")}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "flashcards"
                  ? "bg-[#0D382B] text-white shadow-xs"
                  : "bg-white border border-[#D5E0D8] text-[#3B5448] hover:bg-[#F2F6F2]"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>1. Spaced Flashcards</span>
            </button>
            <button
              onClick={() => setActiveTab("quizzes")}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "quizzes"
                  ? "bg-[#0D382B] text-white shadow-xs"
                  : "bg-white border border-[#D5E0D8] text-[#3B5448] hover:bg-[#F2F6F2]"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>2. Multiple-Choice Quizzes</span>
            </button>
            <button
              onClick={() => setActiveTab("digest")}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "digest"
                  ? "bg-[#0D382B] text-white shadow-xs"
                  : "bg-white border border-[#D5E0D8] text-[#3B5448] hover:bg-[#F2F6F2]"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>3. Grounded Chat</span>
            </button>
          </div>
        </div>

        {/* Desk Viewport Frame */}
        <div className="bg-white border-2 border-[#DCE4DE] rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden min-h-[380px] flex flex-col justify-center">
          {/* Subtle paper header */}
          <div className="flex items-center justify-between border-b border-[#EDF2EE] pb-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#E57373]/50" />
              <div className="w-3 h-3 rounded-full bg-[#FFD54F]/50" />
              <div className="w-3 h-3 rounded-full bg-[#81C784]/50" />
              <span className="text-xs font-mono font-semibold text-slate-400 ml-2">
                folio-study-session.deck
              </span>
            </div>
            <span className="text-xs font-handwriting text-emerald-800 text-lg font-bold">
              ✦ Practice Mode Active
            </span>
          </div>

          {/* TAB 1: Flashcards Interactive Demo */}
          {activeTab === "flashcards" && (
            <div className="max-w-md mx-auto w-full space-y-4">
              <div
                onClick={() => setCardFlipped(!cardFlipped)}
                className="cursor-pointer group relative bg-[#FAFBF8] border-2 border-dashed border-[#CFDDCF] hover:border-emerald-600 rounded-3xl p-8 min-h-[220px] flex flex-col items-center justify-center text-center transition-all shadow-2xs hover:shadow-sm"
              >
                <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-800 bg-[#E8F3EC] px-2.5 py-0.5 rounded-full mb-3">
                  {cardFlipped ? "ANSWER / EXPLANATION" : "QUESTION · CLICK TO FLIP"}
                </span>

                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#11231B] leading-snug">
                  {cardFlipped
                    ? "Mitochondria convert glucose into usable ATP through cellular respiration, supplying 90% of cellular energy."
                    : "Why are mitochondria universally referred to as the powerhouse of eukaryotic cells?"}
                </h3>

                <p className="text-[11px] font-handwriting text-[#3E5C4E] text-base mt-4">
                  {cardFlipped ? "✦ Click again to flip back" : "✦ Click card to reveal Folio's answer"}
                </p>
              </div>

              {/* Spaced repetition review rating pills */}
              <div className="flex items-center justify-center gap-2 pt-2">
                <span className="text-xs font-bold text-slate-400 mr-1">Grade recall:</span>
                <button className="px-3 py-1 rounded-xl bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200 hover:bg-rose-100 transition-colors">
                  Again (1d)
                </button>
                <button className="px-3 py-1 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 hover:bg-amber-100 transition-colors">
                  Hard (2d)
                </button>
                <button className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-900 text-xs font-bold border border-emerald-200 hover:bg-emerald-100 transition-colors">
                  Good (4d)
                </button>
                <button className="px-3 py-1 rounded-xl bg-[#0D382B] text-white text-xs font-bold hover:bg-[#07251C] transition-colors">
                  Easy (7d)
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Quizzes Interactive Demo */}
          {activeTab === "quizzes" && (
            <div className="max-w-lg mx-auto w-full space-y-4">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-800">
                  QUESTION 1 OF 5 · CELL BIOLOGY
                </span>
                <h3 className="font-serif text-lg font-bold text-[#11231B] mt-1">
                  Which molecule provides immediate, accessible energy for metabolic cellular processes?
                </h3>
              </div>

              <div className="space-y-2 pt-2">
                {[
                  { text: "Deoxyribonucleic Acid (DNA)", correct: false },
                  { text: "Adenosine Triphosphate (ATP)", correct: true },
                  { text: "Long-chain Triglycerides", correct: false },
                  { text: "Cellulose Polysaccharide", correct: false },
                ].map((opt, i) => {
                  const isSelected = quizSelected === i;
                  let style = "bg-white border-[#E0E5E1] text-[#2C4A3C] hover:border-emerald-400";
                  if (isSelected) {
                    style = opt.correct
                      ? "bg-emerald-50 border-emerald-600 text-emerald-950 font-bold"
                      : "bg-rose-50 border-rose-400 text-rose-900";
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => setQuizSelected(i)}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${style}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-full bg-black/5 text-[10px] font-bold flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                      {isSelected && opt.correct && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {quizSelected !== null && (
                <div className="bg-[#E8F3EC] rounded-2xl p-3.5 border border-[#CDE3D5] text-xs text-[#0D382B] flex items-center justify-between">
                  <span>
                    {quizSelected === 1
                      ? "✓ Exactly right! ATP powers virtually all cellular work."
                      : "Try again! Look for the standard energy currency of cells."}
                  </span>
                  <button
                    onClick={() => setQuizSelected(null)}
                    className="font-bold underline text-xs ml-2 shrink-0 hover:text-emerald-950"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Grounded Digest Interactive Demo */}
          {activeTab === "digest" && (
            <div className="max-w-xl mx-auto w-full space-y-4">
              {/* User Bubble */}
              <div className="flex justify-end">
                <div className="bg-[#EBF5EF] border border-[#D5EADB] rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-medium text-[#11231B] max-w-[85%]">
                  Can you summarize chapter 3 on Enzyme Kinetics from my uploaded biochem PDF?
                </div>
              </div>

              {/* Folio Assistant Bubble */}
              <div className="flex items-start gap-3">
                <div className="relative w-8 h-8 rounded-full bg-[#E8F3EC] border border-[#CDE3D5] overflow-hidden shrink-0 mt-1">
                  <Image src="/images/folio.png" alt="Folio" fill className="object-contain" />
                </div>
                <div className="bg-white border border-[#E5EAE7] rounded-2xl p-4 shadow-2xs space-y-2.5 text-xs sm:text-sm text-[#11231B] flex-1">
                  <div className="inline-flex items-center gap-1.5 bg-[#EEF6F1] border border-[#D0E5D7] rounded-md px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    <FileText className="w-3 h-3 text-emerald-700" />
                    <span>Grounded in: Biochemistry_Ch3_Lecture.pdf (Pages 12-18)</span>
                  </div>

                  <p className="leading-relaxed">
                    Here are the 3 core principles extracted directly from your notes:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700 text-xs">
                    <li>
                      <strong>Michaelis-Menten Model:</strong> Describes reaction rate as a function of substrate concentration.
                    </li>
                    <li>
                      <strong>Km (Affinity Constant):</strong> Lower Km indicates higher enzyme affinity for the substrate.
                    </li>
                    <li>
                      <strong>Competitive Inhibitors:</strong> Increase apparent Km without altering Vmax.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Philosophy Section: The 3 Core Pillars */}
      <section id="how-it-works" className="relative z-10 py-24 px-6 sm:px-10 bg-[#F4F7F2]/80 border-y border-[#E5EAE7]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold tracking-widest uppercase text-emerald-800">
              SIMPLE, CALM WORKFLOW
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#11231B]">
              How learning feels with Folio
            </h2>
            <p className="text-sm sm:text-base text-[#4A6858] font-medium leading-relaxed">
              No endless prompting or hallucinated guesses. Just your course materials turned into
              active memory.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-8 border border-[#E5EAE7] shadow-2xs hover:shadow-md transition-all space-y-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F3EC] text-[#0D382B] flex items-center justify-center font-serif text-2xl font-bold">
                1
              </div>
              <h3 className="font-serif text-xl font-bold text-[#11231B]">
                Gather Your Materials
              </h3>
              <p className="text-xs sm:text-sm text-[#4A6858] leading-relaxed">
                Drop your lecture PDFs, PowerPoint decks, syllabi, and note exports into dedicated
                StudyBuddy collections for each class.
              </p>
              <div className="pt-2 flex items-center gap-2 text-[11px] font-bold text-emerald-800">
                <FileText className="w-3.5 h-3.5" />
                <span>PDF, DOCX, PPTX & Notes supported</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-8 border border-[#E5EAE7] shadow-2xs hover:shadow-md transition-all space-y-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-[#FEF6E6] text-amber-800 flex items-center justify-center font-serif text-2xl font-bold">
                2
              </div>
              <h3 className="font-serif text-xl font-bold text-[#11231B]">
                Folio Reads & Grounding
              </h3>
              <p className="text-xs sm:text-sm text-[#4A6858] leading-relaxed">
                Vector search embeds your knowledge into isolated semantic notebooks. Every answer
                Folio speaks cites the exact document and page.
              </p>
              <div className="pt-2 flex items-center gap-2 text-[11px] font-bold text-amber-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Strict zero-hallucination policy</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-8 border border-[#E5EAE7] shadow-2xs hover:shadow-md transition-all space-y-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F3EC] text-[#0D382B] flex items-center justify-center font-serif text-2xl font-bold">
                3
              </div>
              <h3 className="font-serif text-xl font-bold text-[#11231B]">
                Practice Like Clockwork
              </h3>
              <p className="text-xs sm:text-sm text-[#4A6858] leading-relaxed">
                Revise spaced-repetition cards, challenge yourself with generative quizzes, and build
                unbreakable streaks that make exam week feel peaceful.
              </p>
              <div className="pt-2 flex items-center gap-2 text-[11px] font-bold text-emerald-800">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Automated daily goal tracking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison: The Old Way vs The Folio Way */}
      <section id="philosophy" className="relative z-10 py-24 px-6 sm:px-10 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold tracking-widest uppercase text-emerald-800">
            A BREATH OF FRESH AIR
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#11231B]">
            Why studying with Folio feels different
          </h2>
          <p className="text-sm sm:text-base text-[#4A6858] font-medium leading-relaxed">
            We built Folio to cure the late-night exam panic and replace it with calm, steady craft.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* The Old Stressful Way */}
          <div className="bg-[#FAF3F2] border border-[#F0D5D2] rounded-3xl p-7 sm:p-9 space-y-5">
            <div className="flex items-center justify-between">
              <span className="font-serif text-lg font-bold text-[#8A3329]">
                The Late-Night Cramming Storm
              </span>
              <span className="text-xs font-bold text-[#8A3329] bg-white/70 px-3 py-1 rounded-full">
                Exhausting
              </span>
            </div>
            <ul className="space-y-3.5 text-xs sm:text-sm text-[#6E352F]">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Staring at 140 unread PowerPoint slides at 2:00 AM.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Generic AI chatbots making up incorrect formulas and definitions.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Passive rereading that evaporates from memory the next morning.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Scattered notes across 5 different folders and notebooks.</span>
              </li>
            </ul>
          </div>

          {/* The Folio Ghibli Way */}
          <div className="bg-white border-2 border-[#CDE3D5] rounded-3xl p-7 sm:p-9 space-y-5 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8F3EC]/50 rounded-bl-full pointer-events-none" />
            <div className="flex items-center justify-between">
              <span className="font-serif text-lg font-bold text-[#0D382B]">
                The Folio Academic Sanctuary
              </span>
              <span className="text-xs font-bold text-[#0D382B] bg-[#E8F3EC] px-3 py-1 rounded-full">
                Calm & Lasting
              </span>
            </div>
            <ul className="space-y-3.5 text-xs sm:text-sm text-[#244737] font-medium">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>15 minutes of tea-time spaced revision each afternoon.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>AI that strictly answers from your actual syllabus and notes.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>Active recall through generative quizzes that test genuine comprehension.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>A warm, beautiful workspace that makes studying feel rewarding.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-24 px-6 sm:px-10 bg-[#F4F7F2]/80 border-t border-[#E5EAE7]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold tracking-widest uppercase text-emerald-800">
              HONEST SCHOLARSHIP
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#11231B]">
              Fair pricing for students
            </h2>
            <p className="text-sm sm:text-base text-[#4A6858] font-medium leading-relaxed">
              Start completely free. Upgrade only when you need unlimited power for heavy term loads.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-3xl border border-[#D5E0D8] p-8 shadow-2xs flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#11231B]">
                      The Apprentice
                    </h3>
                    <p className="text-xs text-[#527363] mt-0.5">
                      Perfect for everyday study sessions
                    </p>
                  </div>
                  <span className="text-3xl font-serif font-bold text-[#11231B]">0 ETB</span>
                </div>

                <div className="h-px w-full bg-[#EDF2EE]" />

                <ul className="space-y-3 text-xs sm:text-sm text-[#2C4A3C]">
                  {[
                    "Up to 3 StudyBuddy subject collections",
                    "Core AI flashcard generation",
                    "Multiple-choice practice quizzes",
                    "Interactive spaced repetition runner",
                    "Document & lecture slide uploads",
                  ].map((feat, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <Link
                  href="/sign-up"
                  className="w-full inline-flex items-center justify-center rounded-2xl bg-[#E8F3EC] hover:bg-[#D5EADB] text-[#0D382B] text-xs font-bold py-3.5 px-4 transition-all shadow-2xs"
                >
                  Start Studying Free
                </Link>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-3xl border-2 border-[#0D382B] p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-4 right-5 bg-[#0D382B] text-emerald-200 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                RECOMMENDED
              </div>

              <div className="space-y-5">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#11231B]">
                    The Master Scholar
                  </h3>
                  <p className="text-xs text-[#527363] mt-0.5">
                    For intense academic terms & power learners
                  </p>
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-serif font-bold text-[#0D382B]">500 ETB</span>
                  <span className="text-xs text-slate-500 font-medium">/ per month</span>
                </div>

                <div className="h-px w-full bg-[#EDF2EE]" />

                <ul className="space-y-3 text-xs sm:text-sm text-[#2C4A3C]">
                  {[
                    "Unlimited StudyBuddy collections",
                    "Unlimited AI flashcard decks & quizzes",
                    "Fast Gemini reasoning & deep document analysis",
                    "High-volume PDF & slide processing",
                    "Early access to new study modes",
                    "Priority continuous learning support",
                  ].map((feat, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-800 shrink-0 font-bold" />
                      <span className="font-medium">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <Link
                  href="/sign-up"
                  className="w-full inline-flex items-center justify-center rounded-2xl bg-[#0D382B] hover:bg-[#07251C] text-white text-xs font-bold py-3.5 px-4 shadow-sm hover:shadow transition-all active:scale-95"
                >
                  Join the Academy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Final Invitation */}
      <footer className="relative z-10 py-20 px-6 sm:px-10 border-t border-[#E5EAE7] bg-[#FAFBF7] text-center">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="relative w-16 h-16 mx-auto">
            <Image
              src="/images/folio.png"
              alt="Folio avatar"
              fill
              className="object-contain drop-shadow-xs"
            />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#11231B] leading-tight">
            Your desk is waiting.
            <br />
            Grab your notes and let&apos;s begin.
          </h2>

          <p className="text-xs sm:text-sm text-[#4A6858] font-medium leading-relaxed max-w-md mx-auto">
            Join hundreds of students turning chaotic semesters into calm, grounded comprehension.
          </p>

          <div>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#0D382B] hover:bg-[#07251C] text-white text-xs sm:text-sm font-bold px-8 py-4 shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <span>Begin Your First Study Session</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </Link>
          </div>

          <div className="pt-10 border-t border-[#E7EBE7] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6A8878] gap-4">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-[#0D382B]">Folio Academy</span>
              <span>· A tranquil home for your study materials</span>
            </div>
            <p>&copy; {new Date().getFullYear()} Folio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
