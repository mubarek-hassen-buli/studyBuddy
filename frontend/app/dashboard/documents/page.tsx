"use client";

import { GlobalDocumentList } from "@/components/dashboard/global-document-list";
import { FileText, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function DocumentsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Documents</h1>
        <p className="text-slate-500 mt-2 font-medium">A central hub for all your learning materials across all Buddies.</p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
           <Input 
             placeholder="Search your documents..." 
             className="pl-12 py-7 rounded-[20px] border-slate-200 focus:ring-primary/10 transition-all font-medium"
           />
        </div>
        <button className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 rounded-[20px] text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm">
           <Filter className="w-4 h-4" />
           <span>Filters</span>
        </button>
      </div>

      <div className="bg-white/40 backdrop-blur-md rounded-[40px] border border-slate-100 p-8 shadow-sm">
        <GlobalDocumentList />
      </div>
    </div>
  );
}
