"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Paperclip,
  ArrowUp,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  CheckCheck,
  Sparkles,
  BookOpen,
  Loader2,
} from "lucide-react";
import { ChatMessageItem } from "@/hooks/use-chat-session";

interface ChatConversationProps {
  useMaterials: boolean;
  messages: ChatMessageItem[];
  isStreaming: boolean;
  onSendMessage: (text: string) => void;
  inputPrompt?: string;
  onClearInputPrompt?: () => void;
}

function formatMessageTime(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

function FormattedContent({ text }: { text: string }) {
  if (!text) return null;

  // Split into paragraphs
  const paragraphs = text.split("\n\n");

  return (
    <div className="space-y-2 text-xs sm:text-sm font-medium text-[#11231B] leading-relaxed">
      {paragraphs.map((p, pIdx) => {
        // Handle bullet points
        if (p.trim().startsWith("- ") || p.trim().startsWith("* ")) {
          const lines = p.split("\n");
          return (
            <ul key={pIdx} className="list-disc pl-5 space-y-1">
              {lines.map((line, lIdx) => {
                const clean = line.replace(/^[-*]\s+/, "");
                return <li key={lIdx} dangerouslySetInnerHTML={{ __html: renderBold(clean) }} />;
              })}
            </ul>
          );
        }

        // Handle numbered lists
        if (/^\d+\.\s/.test(p.trim())) {
          const lines = p.split("\n");
          return (
            <ol key={pIdx} className="list-decimal pl-5 space-y-1">
              {lines.map((line, lIdx) => {
                const clean = line.replace(/^\d+\.\s+/, "");
                return <li key={lIdx} dangerouslySetInnerHTML={{ __html: renderBold(clean) }} />;
              })}
            </ol>
          );
        }

        return (
          <p
            key={pIdx}
            dangerouslySetInnerHTML={{ __html: renderBold(p) }}
          />
        );
      })}
    </div>
  );
}

function renderBold(str: string): string {
  // Replace **bold** with <strong>bold</strong>
  return str.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

export function ChatConversation({
  useMaterials,
  messages,
  isStreaming,
  onSendMessage,
  inputPrompt,
  onClearInputPrompt,
}: ChatConversationProps) {
  const [inputText, setInputText] = React.useState("");
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [likedMap, setLikedMap] = React.useState<Record<string, boolean>>({});
  const [dislikedMap, setDislikedMap] = React.useState<Record<string, boolean>>({});
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (inputPrompt) {
      setInputText(inputPrompt);
      if (onClearInputPrompt) onClearInputPrompt();
    }
  }, [inputPrompt, onClearInputPrompt]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isStreaming) return;

    const text = inputText.trim();
    setInputText("");
    onSendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const suggestionPills = [
    "Summarize my uploaded notes",
    "Explain the key concepts here",
    "Quiz me on this chapter",
    "Break down this topic step-by-step",
  ];

  return (
    <div className="bg-white border border-[#E5EAE7] rounded-3xl p-5 sm:p-7 shadow-2xs flex flex-col justify-between min-h-[580px] font-sans">
      {/* Scrollable Conversation Thread */}
      <div className="space-y-6 flex-1 overflow-y-auto pr-1 pb-4 max-h-[520px]">
        {/* Welcome Empty State if zero messages */}
        {messages.length === 0 && (
          <div className="py-12 text-center space-y-4 max-w-md mx-auto">
            <div className="relative w-20 h-20 mx-auto">
              <Image
                src="/images/folio.png"
                alt="Folio character"
                fill
                priority
                className="object-contain"
              />
            </div>

            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-800">
                FOLIO ACADEMIC MENTOR
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#11231B] mt-0.5">
                How may I assist your studies today?
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Ask any question, explore complex theorems, or review your lecture slides.{" "}
                {useMaterials ? (
                  <span className="text-emerald-700 font-semibold">
                    &ldquo;Use my materials&rdquo; is active.
                  </span>
                ) : (
                  <span className="text-slate-400">
                    &ldquo;Use my materials&rdquo; is off (answering from general AI knowledge).
                  </span>
                )}
              </p>
            </div>

            {/* Quick Starters */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {suggestionPills.map((pill, i) => (
                <button
                  key={i}
                  onClick={() => onSendMessage(pill)}
                  className="px-3.5 py-1.5 rounded-xl border border-[#CDE3D5] bg-[#E8F3EC] hover:bg-[#D5EADB] text-[#0D382B] text-xs font-semibold transition-all active:scale-95"
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Stream */}
        {messages.map((msg) => {
          if (msg.role === "user") {
            return (
              <div key={msg.id} className="flex justify-end items-end gap-2.5">
                <div className="bg-[#EBF5EF] border border-[#D5EADB] rounded-2xl rounded-tr-xs px-4 py-3 max-w-[85%] sm:max-w-[70%] shadow-2xs">
                  <div className="flex items-start gap-2.5">
                    <div className="h-6 w-6 rounded-full bg-[#0D382B] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      You
                    </div>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-medium text-[#11231B] leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                      <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-emerald-800 font-semibold">
                        <span>{formatMessageTime(msg.createdAt)}</span>
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-700" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Assistant Response
          return (
            <div key={msg.id} className="flex items-start gap-3">
              <div className="relative h-9 w-9 rounded-full bg-[#E8F3EC] border border-[#CDE3D5] overflow-hidden shrink-0 mt-1 shadow-2xs">
                <Image
                  src="/images/folio.png"
                  alt="Folio avatar"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="space-y-2 flex-1 max-w-[92%] sm:max-w-[85%]">
                <div className="bg-white border border-[#E5EAE7] rounded-2xl rounded-tl-xs p-4 sm:p-5 shadow-2xs space-y-3">
                  {/* Sources Pill if grounded */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="flex items-center gap-1.5 bg-[#EEF6F1] border border-[#D0E5D7] rounded-lg px-2.5 py-1 text-[10px] font-semibold text-emerald-800 w-fit">
                      <BookOpen className="w-3 h-3 text-emerald-700" />
                      <span>
                        Grounded in: {msg.sources.map((s) => s.fileName).join(", ")}
                      </span>
                    </div>
                  )}

                  {/* Body Content */}
                  <FormattedContent text={msg.content} />

                  {/* Streaming indicator */}
                  {msg.isStreaming && (
                    <span className="inline-block w-2 h-4 bg-emerald-600 animate-pulse ml-0.5" />
                  )}

                  {/* Response Actions */}
                  {!msg.isStreaming && msg.content && (
                    <div className="border-t border-[#F2F5F3] pt-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-700 transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700 font-semibold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-1 text-slate-300">
                        <button
                          onClick={() => {
                            setLikedMap((prev) => ({ ...prev, [msg.id]: !prev[msg.id] }));
                            setDislikedMap((prev) => ({ ...prev, [msg.id]: false }));
                          }}
                          className={`p-1 rounded-md transition-all ${
                            likedMap[msg.id] ? "text-emerald-700 bg-emerald-50" : "hover:text-slate-600"
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            setDislikedMap((prev) => ({ ...prev, [msg.id]: !prev[msg.id] }));
                            setLikedMap((prev) => ({ ...prev, [msg.id]: false }));
                          }}
                          className={`p-1 rounded-md transition-all ${
                            dislikedMap[msg.id] ? "text-rose-600 bg-rose-50" : "hover:text-slate-600"
                          }`}
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips Row (when not streaming and conversation has messages) */}
      {messages.length > 0 && !isStreaming && (
        <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none">
          {suggestionPills.map((pill, i) => (
            <button
              key={i}
              onClick={() => onSendMessage(pill)}
              className="text-[11px] font-semibold text-[#1B4B38] bg-[#EEF6F1] hover:bg-[#DFEFE5] border border-[#CDE3D5] px-3 py-1.5 rounded-full shrink-0 transition-all active:scale-95"
            >
              {pill}
            </button>
          ))}
        </div>
      )}

      {/* Input Box & Action Bar */}
      <div className="relative pt-2">
        <form
          onSubmit={handleSend}
          className="relative rounded-2xl border border-[#D5E0D8] bg-white p-2.5 shadow-sm focus-within:border-emerald-600 transition-all flex items-end gap-2"
        >
          {/* Paperclip Document Link */}
          <Link
            href="/dashboard/documents"
            className="p-2 text-slate-400 hover:text-emerald-800 rounded-xl hover:bg-slate-50 transition-all shrink-0 mb-0.5"
            title="Upload new documents"
          >
            <Paperclip className="w-4 h-4" />
          </Link>

          {/* Text Area */}
          <textarea
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              useMaterials
                ? "Ask anything about your study materials... (Enter to send)"
                : "Ask anything... (Enter to send)"
            }
            disabled={isStreaming}
            className="w-full text-xs sm:text-sm font-medium text-[#11231B] placeholder:text-slate-400 resize-none outline-none py-1.5 px-1 max-h-32 min-h-[36px]"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={isStreaming || !inputText.trim()}
            className="h-8 w-8 rounded-xl bg-[#0D382B] hover:bg-[#07251C] text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:hover:bg-[#0D382B] shrink-0 mb-0.5 shadow-2xs active:scale-95"
          >
            {isStreaming ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-200" />
            ) : (
              <ArrowUp className="w-4 h-4" />
            )}
          </button>
        </form>

        <div className="flex items-center justify-between text-[10px] text-slate-400 px-2 mt-2">
          <span>
            Shift + Enter for new line · Folio grounds responses using Gemini AI
          </span>
          {useMaterials && (
            <span className="text-emerald-700 font-semibold">
              ✓ Materials Linked
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
