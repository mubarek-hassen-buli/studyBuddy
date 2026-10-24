"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrainCircuit, Send, Loader2, User, ChevronLeft, Info } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useBuddy } from "@/hooks/use-buddies";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatInterface({ buddyId }: { buddyId: string }) {
  const { data: buddy, isLoading: buddyLoading } = useBuddy(buddyId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const session = await authClient.getSession();
      const token = session?.data?.session?.token;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        credentials: "include",
        body: JSON.stringify({ studyBuddyId: buddyId, message: userMessage }),
      });

      if (response.status === 401) {
        throw new Error("Unauthorized");
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        
        // Parse SSE-style chunks (id: xxx\ndata: yyy\n\n)
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data:')) {
            // Extract content: 'data: ' -> line.substring(6), 'data:' -> line.substring(5)
            const content = line.startsWith('data: ') ? line.substring(6) : line.substring(5);
            assistantContent += content + (line === 'data:' || line === 'data: ' ? '\n' : '');
          }
        }

        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = assistantContent;
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (buddyLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-black text-slate-900 leading-tight">{buddy?.name}</h2>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Active Chat Session</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary rounded-xl">
              <Info className="w-5 h-5" />
           </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-40">
            <div className="p-6 rounded-3xl bg-slate-50">
               <BrainCircuit className="w-12 h-12 text-slate-300" />
            </div>
            <div>
               <h3 className="font-black text-slate-900 text-xl tracking-tight">Ask your MyBuddy</h3>
               <p className="text-slate-500 font-medium max-w-xs">Ask specific questions about your uploaded documents or general subject questions.</p>
            </div>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-5 py-4 rounded-3xl shadow-sm ${
                msg.role === "user"
                  ? "bg-primary text-white rounded-br-none font-medium"
                  : "bg-slate-100 text-slate-900 rounded-bl-none font-medium leading-relaxed"
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-slate-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative group"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="h-16 pl-6 pr-20 rounded-2xl border-slate-200 focus:ring-primary text-lg font-medium shadow-sm transition-all group-focus-within:shadow-md"
            disabled={isLoading}
          />
          <Button
            type="submit"
            className="absolute right-2 top-2 h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 group-hover:scale-105 active:scale-95"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </form>
        <p className="mt-3 text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest">
           Your buddy is grounded in your documents. It will only answer based on them.
        </p>
      </div>
    </div>
  );
}
