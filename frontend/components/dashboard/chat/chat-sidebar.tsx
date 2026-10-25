"use client";

import * as React from "react";
import {
  FileText,
  Lock,
  Lightbulb,
  Sparkles,
  FileSpreadsheet,
  GraduationCap,
  CheckCircle,
  MessageSquare,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

interface ChatSidebarProps {
  useMaterials: boolean;
  onToggleUseMaterials: (val: boolean) => void;
  onSelectPrompt: (prompt: string) => void;
  onSelectRecentChat: (title: string) => void;
}

export function ChatSidebar({
  useMaterials,
  onToggleUseMaterials,
  onSelectPrompt,
  onSelectRecentChat,
}: ChatSidebarProps) {
  const quickPrompts = [
    {
      id: "qp-1",
      title: "Explain a complex concept",
      desc: "Get simple, clear explanations",
      prompt: "Can you explain this complex concept in simple terms?",
      icon: Sparkles,
    },
    {
      id: "qp-2",
      title: "Summarize my notes",
      desc: "Turn long notes into key points",
      prompt: "Please summarize my latest study notes into key bullet points.",
      icon: FileSpreadsheet,
    },
    {
      id: "qp-3",
      title: "Help me study",
      desc: "Create practice questions or flashcards",
      prompt: "Help me study this topic by generating 3 practice questions.",
      icon: GraduationCap,
    },
    {
      id: "qp-4",
      title: "Check my understanding",
      desc: "Ask me a few questions on the topic",
      prompt: "Quiz me to check my understanding of this chapter.",
      icon: CheckCircle,
    },
  ];

  const recentChats = [
    {
      id: "rc-1",
      title: "Photosynthesis vs Cellular Respiration",
      time: "Today · 10:26 AM",
    },
    {
      id: "rc-2",
      title: "Quantum Mechanics Basics",
      time: "Yesterday · 4:12 PM",
    },
    {
      id: "rc-3",
      title: "Essay on Climate Change",
      time: "Oct 23 · 2:18 PM",
    },
    {
      id: "rc-4",
      title: "Organic Chemistry - Reaction Mechanisms",
      time: "Oct 21 · 11:03 AM",
    },
  ];

  return (
    <aside className="w-full lg:w-80 space-y-4 font-sans">
      {/* 1. Chat with your materials card */}
      <div className="bg-white border border-[#E5EAE7] rounded-2xl p-4 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-[#E8F5EE] text-[#0D382B] flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-[#1B4B38]" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#11231B] leading-tight">
              Chat with your materials
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Folio can base its answers on your uploaded notes, PDFs, and documents.
            </p>
          </div>
        </div>

        <div className="border-t border-[#EDF2EE] mt-3.5 pt-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#11231B]">
            <div className="h-6 w-6 rounded-lg bg-[#F4F6F4] text-slate-500 flex items-center justify-center">
              <Lock className="w-3 h-3 text-emerald-800" />
            </div>
            <span>Use my materials</span>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={() => onToggleUseMaterials(!useMaterials)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
              useMaterials ? "bg-[#0D382B]" : "bg-slate-200"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                useMaterials ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* 2. Quick Prompts card */}
      <div className="bg-white border border-[#E5EAE7] rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-emerald-700" />
          <h3 className="text-xs sm:text-sm font-bold text-[#11231B]">
            Quick Prompts
          </h3>
        </div>

        <div className="space-y-2">
          {quickPrompts.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSelectPrompt(item.prompt)}
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#F4F8F5] transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-[#E8F5EE] text-[#0D382B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4 text-[#1B4B38]" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-[#11231B] truncate leading-tight group-hover:text-emerald-950">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate">
                      {item.desc}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-800 shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Recent Chats card */}
      <div className="bg-white border border-[#E5EAE7] rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs sm:text-sm font-bold text-[#11231B]">
            Recent Chats
          </h3>
          <button className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-0.5">
            <span>View all</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2">
          {recentChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectRecentChat(chat.title)}
              className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-[#F4F8F5] transition-all cursor-pointer group"
            >
              <div className="h-7 w-7 rounded-lg bg-[#F4F6F4] text-slate-500 group-hover:bg-[#E8F5EE] group-hover:text-[#0D382B] flex items-center justify-center shrink-0 mt-0.5">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-[#11231B] truncate leading-tight group-hover:text-emerald-950">
                  {chat.title}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  {chat.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
