"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrainCircuit, BookOpen, GraduationCap, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-transparent text-white font-sans selection:bg-primary/20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/5 backdrop-blur-md border-b border-white/5 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <BrainCircuit className="w-8 h-8 text-primary" />
          <span className="text-primary" style={{ fontFamily: 'var(--font-grezia)' }}>MyBuddy</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-primary transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/sign-in">
            <Button variant="ghost" className="text-slate-300 hover:text-primary">Log In</Button>
          </Link>
          <Link href="/sign-up">
            <Button className="rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Sparkles className="w-3 h-3" />
            <span>AI-Powered Learning has evolved</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl tracking-tight text-white mb-6 max-w-4xl text-balance leading-[1.1]" style={{ fontFamily: 'var(--font-grezia)' }}>
            Unlock <span className="text-primary italic">Peak</span> Academic Performance With AI
          </h1>
          
          <p className="text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed">
            Create custom StudyBuddies that learn strictly from your materials. 
            Automate notes, generate flashcards, and master any subject with grounded AI.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
            <Link href="/sign-up">
              <Button size="lg" className="rounded-full px-8 py-7 text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
                Get Started — For Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="rounded-full px-8 py-7 text-lg border-white/20 text-white hover:bg-white/10">
              See How It Works
            </Button>
          </div>

          {/* Feature Mockup Illustration */}
          <div className="relative w-full max-w-5xl aspect-video bg-slate-50/10 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/5 opacity-50" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center">
                {/* Abstract UI representation */}
                <div className="w-[80%] h-[70%] bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-slate-100 relative overflow-hidden p-6 text-left">
                    <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                        <div className="h-3 w-3 rounded-full bg-red-400" />
                        <div className="h-3 w-3 rounded-full bg-yellow-400" />
                        <div className="h-3 w-3 rounded-full bg-green-400" />
                    </div>
                    <div className="space-y-4">
                        <div className="h-4 w-[60%] bg-slate-100 rounded" />
                        <div className="h-4 w-[40%] bg-primary/10 rounded" />
                        <div className="h-32 w-full bg-slate-50 rounded border border-dashed border-slate-200 flex items-center justify-center">
                            <BookOpen className="w-12 h-12 text-slate-300" />
                        </div>
                    </div>
                    
                    {/* Floating elements */}
                    <div className="absolute right-10 bottom-10 w-48 bg-white p-4 rounded-lg shadow-xl border border-slate-100 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Quiz Generated</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded mb-2" />
                        <div className="h-2 w-[80%] bg-slate-100 rounded" />
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-10">Trusted by students across the globe</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 grayscale group hover:opacity-100 hover:grayscale-0 transition-all duration-500">
            <span className="text-xl font-bold font-serif italic text-white tracking-tighter">Nietzsche</span>
            <span className="text-xl font-bold italic text-white tracking-tighter">Epicurious</span>
            <span className="text-xl font-bold text-white tracking-tighter uppercase">CloudWatch</span>
            <span className="text-xl font-bold text-white tracking-tighter italic">Acme Corp</span>
            <span className="text-xl font-bold text-white tracking-tighter">Polymath</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-white mb-4">Scalable Tools for Autonomous Intelligence</h2>
            <p className="text-slate-300 max-w-xl mx-auto">Master complex subjects using our purpose-built AI study modes.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:-translate-y-2 transition-transform duration-300">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <BrainCircuit className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Isolated Knowledge</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Create specific StudyBuddies for each subject. Your Math Buddy won't hallucinate about History.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:-translate-y-2 transition-transform duration-300">
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Grounded Grounding</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Dual-layer protection ensures AI only answers using your uploaded PDFs, DOCX, and PPTs.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:-translate-y-2 transition-transform duration-300">
              <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center mb-6">
                <GraduationCap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Mastery Modes</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Toggle between Summarize, Flashcards, and Quizzes to transform raw material into active knowledge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 px-6 bg-white/5 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">What are you waiting for?</h2>
          <p className="text-slate-300 mb-10 text-xl font-medium">Automate your learning, master your exams, and focus with AI by your side.</p>
          <Link href="/sign-up">
            <Button size="lg" className="rounded-full px-12 py-8 text-xl font-bold bg-primary hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 hover:scale-105 active:scale-95">
              Get Started — For Free
            </Button>
          </Link>
          <p className="mt-10 text-xs font-bold text-slate-400 uppercase tracking-widest">No credit card required. Cancel anytime.</p>
        </div>
      </section>
      
      <footer className="py-12 bg-transparent text-center text-slate-400 text-sm">
        <p>&copy; 2026 MyBuddy AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
