"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import ElectricBorder from "@/components/ElectricBorder";

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto py-10 space-y-12">
      <div className="text-center space-y-4">
        <span className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold tracking-widest uppercase">
          Pricing
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          Choose the Perfect Plan for You
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
          Unlock the full potential of your AI StudyBuddy. Upgrade to Pro for unlimited power.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
        {/* Free Plan */}
        <Card className="rounded-[32px] border-slate-200 shadow-xl bg-white relative overflow-hidden h-full flex flex-col">
          <CardHeader className="p-8 pb-0">
             <div className="mb-4">
                <h3 className="text-2xl font-black text-slate-900">Free</h3>
                <p className="text-slate-500 font-medium mt-1">Best for personal use.</p>
             </div>
             <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-slate-900 tracking-tight">Free</span>
             </div>
          </CardHeader>
          <CardContent className="p-8 flex-1">
             <Button className="w-full rounded-full h-12 font-bold text-lg bg-slate-900 hover:bg-slate-800 mb-8 shadow-lg shadow-slate-200">
                Get Started
             </Button>
             
             <div className="space-y-4">
                <p className="font-bold text-slate-900">What you will get</p>
                <ul className="space-y-3">
                   {[
                      "Access to core AI features",
                      "3 Study Buddies",
                      "Standard processing speed",
                      "Basic flashcards & quizzes",
                      "Email support"
                   ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-600 font-medium">
                         <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-slate-600 stroke-[3]" />
                         </div>
                         {item}
                      </li>
                   ))}
                </ul>
             </div>
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <div className="relative h-full">
           <ElectricBorder color="#6366f1" speed={2} chaos={0.15} borderRadius={32}>
              <Card className="rounded-[32px] border-0 shadow-2xl bg-[#0f172a] text-white h-full flex flex-col relative z-10">
                
                {/* Glow effect similar to design */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none" />
                
                <CardHeader className="p-8 pb-0 relative">
                   <div className="mb-4">
                      <h3 className="text-2xl font-black text-white">Pro</h3>
                      <p className="text-slate-400 font-medium mt-1">For serious students & power users.</p>
                   </div>
                   <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black text-white tracking-tight">$9</span>
                      <span className="text-slate-400 font-medium">/per month</span>
                   </div>
                </CardHeader>
                <CardContent className="p-8 flex-1 relative">
                   <Button className="w-full rounded-full h-12 font-bold text-lg bg-indigo-500 hover:bg-indigo-400 text-white mb-8 shadow-lg shadow-indigo-500/25 border border-indigo-400/20">
                      Get Started
                   </Button>
                   
                   <div className="space-y-4">
                      <p className="font-bold text-white">What you will get</p>
                      <ul className="space-y-3">
                         {[
                            "Everything in Free",
                            "Unlimited Study Buddies",
                            "Priority AI processing",
                            "Advanced reasoning models",
                            "Bulk document uploads",
                            "Early access to new features"
                         ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                               <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                                  <Check className="w-3 h-3 text-indigo-400 stroke-[3]" />
                               </div>
                               {item}
                            </li>
                         ))}
                      </ul>
                   </div>
                </CardContent>
              </Card>
           </ElectricBorder>
        </div>
      </div>
    </div>
  );
}
