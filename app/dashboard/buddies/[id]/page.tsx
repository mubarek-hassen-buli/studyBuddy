"use client";

import { useParams, useRouter } from "next/navigation";
import { useBuddy } from "@/hooks/use-buddies";
import { DocumentList } from "@/components/dashboard/document-list";
import { FileUpload } from "@/components/dashboard/file-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit, GraduationCap, ChevronLeft, MessageSquare, BookOpen, Brain, MoreHorizontal, Settings, Clock, FileText, Zap } from "lucide-react";
import Link from "next/link";

export default function BuddyDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: buddy, isLoading, error } = useBuddy(id as string);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !buddy) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900">MyBuddy not found</h2>
        <p className="text-slate-500 mt-2">The buddy you're looking for doesn't exist or you don't have access.</p>
        <Button className="mt-6" onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Navigation & Header */}
      <div className="flex flex-col gap-6">
        <Link href="/dashboard" className="w-fit">
          <Button variant="ghost" size="sm" className="text-slate-500 hover:text-primary pl-0 transition-colors group">
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Button>
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
               <BrainCircuit className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">{buddy.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="bg-white border-slate-200 text-slate-600 px-3 py-1 rounded-full font-bold uppercase text-[10px]">
                  <GraduationCap className="w-3 h-3 mr-1.5" />
                  {buddy.subject || "General"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <Button variant="outline" size="icon" className="rounded-xl border-slate-200 text-slate-500 hover:text-primary transition-all">
                <Settings className="w-4 h-4" />
             </Button>
             <Link href={`/dashboard/study/${buddy.id}?mode=chat`}>
               <Button className="rounded-xl px-6 h-11 font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Start Chatting
               </Button>
             </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Documents */}
        <div className="lg:col-span-2 space-y-8">
           <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Knowledge Sources</h3>
              </div>
              <FileUpload studyBuddyId={buddy.id} />
           </section>

           <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Uploaded Files</h3>
              </div>
              <DocumentList studyBuddyId={buddy.id} />
           </section>
        </div>

        {/* Right Column: Actions & Stats */}
        <div className="space-y-8">
           <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                 <CardTitle className="text-lg font-bold">Quick Learning</CardTitle>
                 <CardDescription>Master this subject with AI tools.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                 <Link href={`/dashboard/study/${buddy.id}?mode=flashcards`} className="block">
                    <Button variant="outline" className="w-full justify-start h-14 rounded-xl border-slate-100 hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all font-bold gap-4 group">
                        <div className="p-2 rounded-lg bg-orange-50 text-orange-500 group-hover:bg-orange-100 transition-colors">
                            <Zap className="w-4 h-4" />
                        </div>
                        Generate Flashcards
                    </Button>
                 </Link>
                 <Link href={`/dashboard/study/${buddy.id}?mode=quiz`} className="block">
                    <Button variant="outline" className="w-full justify-start h-14 rounded-xl border-slate-100 hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all font-bold gap-4 group">
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-500 group-hover:bg-blue-100 transition-colors">
                            <GraduationCap className="w-4 h-4" />
                        </div>
                        Create Practice Quiz
                    </Button>
                 </Link>
                 <Link href={`/dashboard/study/${buddy.id}?mode=summarize`} className="block">
                    <Button variant="outline" className="w-full justify-start h-14 rounded-xl border-slate-100 hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all font-bold gap-4 group">
                        <div className="p-2 rounded-lg bg-purple-50 text-purple-500 group-hover:bg-purple-100 transition-colors">
                            <FileText className="w-4 h-4" />
                        </div>
                        Summarize Sources
                    </Button>
                 </Link>
              </CardContent>
           </Card>

           <Card className="bg-primary/5 border-primary/10 shadow-sm">
              <CardContent className="p-6">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30">
                       <Clock className="w-5 h-5" />
                    </div>
                    <h4 className="font-black text-slate-900 tracking-tight">Buddy Stats</h4>
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-slate-500 font-medium">Memory Usage</span>
                       <span className="text-slate-900 font-black tracking-tight tracking-wider">0/50MB</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                       <div className="h-full bg-primary w-[5%] rounded-full shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                       <div className="p-3 bg-white rounded-xl border border-primary/10">
                          <p className="text-[10px] font-black uppercase text-slate-400">Notes</p>
                          <p className="text-xl font-black text-slate-900">0</p>
                       </div>
                       <div className="p-3 bg-white rounded-xl border border-primary/10">
                          <p className="text-[10px] font-black uppercase text-slate-400">Score</p>
                          <p className="text-xl font-black text-slate-900">0%</p>
                       </div>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}

// Minimal Badge since it's used in header
function Badge({ className, variant, children }: { className?: string, variant?: string, children: React.ReactNode }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 ${className}`}>
            {children}
        </span>
    );
}
