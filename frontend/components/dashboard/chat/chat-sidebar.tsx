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
  Plus,
  Trash2,
} from "lucide-react";
import { ChatConversationItem } from "@/hooks/use-chat-session";

interface ChatSidebarProps {
  useMaterials: boolean;
  onToggleUseMaterials: (val: boolean) => void;
  onSelectPrompt: (prompt: string) => void;
  conversations: ChatConversationItem[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
}

function formatRelativeTime(dateStr: string): string {
  try {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    return `${diffDays}d ago`;
  } catch {
    return "Recently";
  }
}

export function ChatSidebar({
  useMaterials,
  onToggleUseMaterials,
  onSelectPrompt,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
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

  return (
    <aside className="w-full lg:w-80 space-y-4 font-sans">
      {/* 0. New Chat Button */}
      <button
        onClick={onNewChat}
        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0D382B] hover:bg-[#07251C] text-white text-xs font-bold py-3 px-4 shadow-sm transition-all active:scale-95"
      >
        <Plus className="w-4 h-4" />
        <span>New Discussion</span>
      </button>

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
              Folio grounds answers in your uploaded notes, PDFs, and study materials.
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
            Recent Discussions
          </h3>
          <span className="text-[11px] font-bold text-emerald-800">
            {conversations.length}
          </span>
        </div>

        {conversations.length > 0 ? (
          <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
            {conversations.map((chat) => {
              const isActive = activeConversationId === chat.id;
              return (
                <div
                  key={chat.id}
                  className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer group ${
                    isActive
                      ? "bg-[#E8F3EC] border border-[#CDE3D5]"
                      : "hover:bg-[#F4F8F5] border border-transparent"
                  }`}
                >
                  <div
                    onClick={() => onSelectConversation(chat.id)}
                    className="flex items-start gap-2.5 min-w-0 flex-1"
                  >
                    <div
                      className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isActive
                          ? "bg-[#0D382B] text-white"
                          : "bg-[#F4F6F4] text-slate-500 group-hover:bg-[#E8F5EE] group-hover:text-[#0D382B]"
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-xs font-bold text-[#11231B] truncate leading-tight">
                        {chat.title}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        {formatRelativeTime(chat.updatedAt)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(chat.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 rounded-md transition-all shrink-0 ml-1"
                    title="Delete discussion"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-4 text-center">
            <p className="text-xs text-slate-400">
              No past discussions yet.
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Ask any question to begin!
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
