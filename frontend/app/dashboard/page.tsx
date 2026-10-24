"use client";

import { useAuthStore } from "@/store/auth-store";
import { useStudyBuddyStore } from "@/store/studybuddy-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, BookOpen, GraduationCap } from "lucide-react";
import { BuddyList } from "@/components/dashboard/buddy-list";
import { useStats } from "@/hooks/use-stats";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { stats, isLoading: statsLoading } = useStats();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Welcome back, {user?.name || "Scholar"}!</h2>
        <p className="text-slate-500 mt-2">Ready to level up your learning today?</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Buddies</CardTitle>
            <BrainCircuit className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">
                {statsLoading ? "..." : stats.totalBuddies}
            </div>
            <p className="text-xs text-slate-400 mt-1">AI companions active</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Documents</CardTitle>
            <BookOpen className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">
                {statsLoading ? "..." : stats.totalDocuments}
            </div>
            <p className="text-xs text-slate-400 mt-1">Knowledge sources</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Quiz Score</CardTitle>
            <GraduationCap className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">
                {statsLoading ? "..." : `${stats.avgQuizScore}%`}
            </div>
            <p className="text-xs text-slate-400 mt-1">Average performance</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="col-span-full">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Your MyBuddies</h3>
           </div>
           <BuddyList />
        </div>
      </div>
    </div>
  );
}
