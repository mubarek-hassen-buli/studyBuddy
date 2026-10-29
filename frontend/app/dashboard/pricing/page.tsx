"use client";

import { Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-12">
      <div className="text-center space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E8F3EC] text-[#0D382B] text-xs font-bold tracking-widest uppercase border border-[#CDE3D5]">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Folio Membership</span>
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#11231B] tracking-tight">
          Fair, transparent pricing for students
        </h1>
        <p className="text-sm sm:text-base text-[#4A6858] max-w-2xl mx-auto font-medium leading-relaxed">
          Start studying for free, or elevate your academic journey with unlimited AI reasoning and collections.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
        {/* Free Plan */}
        <Card className="rounded-3xl border border-[#D5E0D8] shadow-2xs bg-white relative overflow-hidden h-full flex flex-col justify-between p-8">
          <div>
            <CardHeader className="p-0 pb-6 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#11231B]">The Apprentice</h3>
                  <p className="text-xs text-[#527363] mt-0.5">Best for everyday term study</p>
                </div>
                <span className="text-3xl font-serif font-bold text-[#11231B]">0 ETB</span>
              </div>
              <div className="h-px w-full bg-[#EDF2EE] pt-2" />
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Included in Apprentice</p>
              <ul className="space-y-3">
                {[
                  "Access to core AI StudyBuddy features",
                  "Up to 3 StudyBuddy collections",
                  "Standard generative processing speed",
                  "Interactive flashcards & practice quizzes",
                  "Grounded answers citing your lecture notes",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs sm:text-sm text-[#2C4A3C]">
                    <div className="w-5 h-5 rounded-full bg-[#E8F3EC] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-emerald-800 stroke-[2.5]" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </div>

          <div className="pt-8">
            <Button
              asChild
              variant="outline"
              className="w-full rounded-2xl h-12 font-bold text-xs sm:text-sm bg-[#FAFBF7] hover:bg-[#EEF5F0] text-[#0D382B] border-[#D5E0D8]"
            >
              <Link href="/dashboard">Current Active Plan</Link>
            </Button>
          </div>
        </Card>

        {/* Pro Plan */}
        <Card className="rounded-3xl border-2 border-[#0D382B] shadow-md bg-white text-[#11231B] h-full flex flex-col justify-between relative overflow-hidden p-8">
          <div className="absolute top-4 right-5 bg-[#0D382B] text-emerald-200 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
            RECOMMENDED
          </div>

          <div>
            <CardHeader className="p-0 pb-6 space-y-2">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#11231B]">The Master Scholar</h3>
                <p className="text-xs text-[#527363] mt-0.5">For intense term loads & power learners</p>
              </div>
              <div className="flex items-baseline gap-1.5 pt-1">
                <span className="text-4xl font-serif font-bold text-[#0D382B]">500 ETB</span>
                <span className="text-xs text-slate-500 font-medium">/ per month</span>
              </div>
              <div className="h-px w-full bg-[#EDF2EE] pt-2" />
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Master Scholar Perks</p>
              <ul className="space-y-3">
                {[
                  "Unlimited StudyBuddy subject collections",
                  "Priority Gemini reasoning & deep document grounding",
                  "Unlimited AI flashcard decks & custom quizzes",
                  "High-capacity PDF, DOCX, and slide processing",
                  "Early access to new study modes and features",
                  "Continuous revision analytics & streak protection",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs sm:text-sm text-[#2C4A3C]">
                    <div className="w-5 h-5 rounded-full bg-[#E8F3EC] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-emerald-800 stroke-[2.5]" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </div>

          <div className="pt-8">
            <Button
              className="w-full rounded-2xl h-12 font-bold text-xs sm:text-sm bg-[#0D382B] hover:bg-[#07251C] text-white shadow-sm hover:shadow transition-all active:scale-95"
            >
              Upgrade to Master Scholar
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
