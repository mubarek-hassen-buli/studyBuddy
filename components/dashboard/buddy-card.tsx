"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit, GraduationCap, ArrowRight, Trash2 } from "lucide-react";
import Link from "next/link";
import { useBuddies } from "@/hooks/use-buddies";

interface BuddyCardProps {
  id: string;
  name: string;
  subject?: string;
  description?: string;
}

export function BuddyCard({ id, name, subject, description }: BuddyCardProps) {
  const { deleteBuddy } = useBuddies();

  return (
    <Card className="group relative bg-white border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
           <div className="p-2 rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <BrainCircuit className="w-5 h-5" />
           </div>
           <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
            onClick={() => deleteBuddy.mutate(id)}
           >
              <Trash2 className="w-4 h-4" />
           </Button>
        </div>
        <CardTitle className="mt-4 text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">{name}</CardTitle>
        <CardDescription className="flex items-center gap-1.5 text-slate-500 font-medium">
          <GraduationCap className="w-3.5 h-3.5" />
          {subject || "General Subject"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <p className="text-sm text-slate-500 line-clamp-2 min-h-[40px]">
          {description || "No description provided. Add documents to start learning."}
        </p>
      </CardContent>
      <CardFooter className="pt-0 border-t border-slate-50 bg-slate-50/50">
        <Link href={`/dashboard/buddies/${id}`} className="w-full">
          <Button variant="ghost" className="w-full justify-between text-slate-600 hover:text-primary group/btn">
            View Details
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
