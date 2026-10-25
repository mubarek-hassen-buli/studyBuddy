"use client";

import * as React from "react";
import Image from "next/image";
import {
  Paperclip,
  ArrowUp,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RotateCcw,
  Check,
  CheckCheck,
  Sun,
  Cloud,
  Droplets,
  Leaf,
  Wind,
} from "lucide-react";

export interface ChatMessage {
  id: string;
  sender: "user" | "folio";
  text: string;
  time: string;
  showDiagram?: boolean;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "user",
    text: "Explain the concept of photosynthesis in simple terms.",
    time: "10:24 AM",
  },
  {
    id: "msg-2",
    sender: "folio",
    text: "Sure! Let's break it down in simple terms.\n\nPhotosynthesis is the process plants use to make their own food. They take in **sunlight**, **carbon dioxide** (from the air), and **water** (from the soil), and turn it into **glucose** (food) and **oxygen**.",
    time: "10:24 AM",
    showDiagram: true,
  },
  {
    id: "msg-3",
    sender: "user",
    text: "That's great! Can you also explain the difference between photosynthesis and cellular respiration?",
    time: "10:26 AM",
  },
];

interface ChatConversationProps {
  useMaterials: boolean;
  inputPrompt?: string;
  onClearInputPrompt?: () => void;
}

export function ChatConversation({
  useMaterials,
  inputPrompt,
  onClearInputPrompt,
}: ChatConversationProps) {
  const [messages, setMessages] = React.useState<ChatMessage[]>(INITIAL_MESSAGES);
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newUserMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: userText,
      time: timeStr,
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputText("");

    setTimeout(() => {
      // Realistic Folio response
      const folioResponse: ChatMessage = {
        id: `folio-${Date.now()}`,
        sender: "folio",
        text: `While **photosynthesis** stores energy by building glucose using sunlight, **cellular respiration** does the opposite: it breaks glucose down in the mitochondria to release usable cellular energy (**ATP**).\n\n1. **Location:** Chloroplasts vs. Mitochondria\n2. **Reactants:** CO2 + H2O vs. Glucose + O2\n3. **Products:** Glucose + O2 vs. CO2 + H2O + ATP\n\nThey form a perfect biological cycle: the outputs of one become the inputs of the other!`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, folioResponse]);
      scrollToBottom();
    }, 600);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const suggestionPills = [
    "Summarize this document",
    "Explain this concept",
    "Give me a study plan",
    "Ask a follow up",
  ];

  return (
    <div className="bg-white border border-[#E5EAE7] rounded-3xl p-5 sm:p-7 shadow-2xs flex flex-col justify-between min-h-[580px] font-sans">
      {/* Scrollable Conversation Thread */}
      <div className="space-y-6 flex-1 overflow-y-auto pr-1 pb-4">
        {messages.map((msg) => {
          if (msg.sender === "user") {
            return (
              <div key={msg.id} className="flex justify-end items-end gap-2.5">
                <div className="bg-[#EBF5EF] border border-[#D5EADB] rounded-2xl rounded-tr-xs px-4 py-3 max-w-[85%] sm:max-w-[70%] shadow-2xs">
                  <div className="flex items-start gap-2.5">
                    {/* User initial avatar "M" */}
                    <div className="h-6 w-6 rounded-full bg-[#0D382B] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      M
                    </div>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-medium text-[#11231B] leading-relaxed">
                        {msg.text}
                      </p>
                      <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-emerald-800 font-semibold">
                        <span>{msg.time}</span>
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-700" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Folio response
          return (
            <div key={msg.id} className="flex items-start gap-3">
              {/* Classical Philosopher Avatar */}
              <div className="relative h-9 w-9 rounded-full bg-[#E8F3EC] border border-[#CDE3D5] overflow-hidden shrink-0 mt-1 shadow-2xs">
                <Image
                  src="/images/folio.png"
                  alt="Folio"
                  fill
                  className="object-cover object-top scale-125"
                />
              </div>

              {/* Response Message Body */}
              <div className="bg-[#FAFBF9] border border-[#E8ECE8] rounded-2xl rounded-tl-xs p-4 sm:p-5 flex-1 max-w-[95%] shadow-2xs space-y-3">
                <p className="text-xs sm:text-sm font-semibold text-[#11231B]">
                  Sure! Let&apos;s break it down in simple terms.
                </p>

                <p className="text-xs sm:text-sm text-[#26382E] leading-relaxed">
                  Photosynthesis is the process plants use to make their own food. They take in{" "}
                  <strong>sunlight</strong>, <strong>carbon dioxide</strong> (from the air), and{" "}
                  <strong>water</strong> (from the soil), and turn it into <strong>glucose</strong>{" "}
                  (food) and <strong>oxygen</strong>.
                </p>

                {/* Diagram Card for Photosynthesis */}
                {msg.showDiagram && (
                  <div className="bg-[#F1F6F2] border border-[#DEEADE] rounded-2xl p-4 my-2">
                    <div className="flex items-center justify-between flex-wrap gap-2 text-center text-[11px] text-[#243A2C]">
                      {/* Step 1: Sunlight */}
                      <div className="flex flex-col items-center">
                        <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-500 border border-amber-200 flex items-center justify-center mb-1">
                          <Sun className="w-4 h-4" />
                        </div>
                        <span className="font-bold">Sunlight</span>
                        <span className="text-[10px] text-slate-400">(energy)</span>
                      </div>

                      <span className="text-slate-400 font-bold text-sm">+</span>

                      {/* Step 2: CO2 */}
                      <div className="flex flex-col items-center">
                        <div className="h-9 w-9 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 flex items-center justify-center mb-1 font-bold text-[10px]">
                          CO₂
                        </div>
                        <span className="font-bold">Carbon Dioxide</span>
                        <span className="text-[10px] text-slate-400">(from air)</span>
                      </div>

                      <span className="text-slate-400 font-bold text-sm">+</span>

                      {/* Step 3: Water */}
                      <div className="flex flex-col items-center">
                        <div className="h-9 w-9 rounded-xl bg-sky-50 text-sky-500 border border-sky-200 flex items-center justify-center mb-1">
                          <Droplets className="w-4 h-4" />
                        </div>
                        <span className="font-bold">Water</span>
                        <span className="text-[10px] text-slate-400">(from soil)</span>
                      </div>

                      <span className="text-emerald-700 font-bold text-base">→</span>

                      {/* Step 4: Glucose */}
                      <div className="flex flex-col items-center">
                        <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center mb-1">
                          <Leaf className="w-4 h-4 fill-emerald-800 text-emerald-800" />
                        </div>
                        <span className="font-bold text-emerald-950">Glucose</span>
                        <span className="text-[10px] text-emerald-700">(food for plant)</span>
                      </div>

                      <span className="text-slate-400 font-bold text-sm">+</span>

                      {/* Step 5: Oxygen */}
                      <div className="flex flex-col items-center">
                        <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-500 border border-blue-200 flex items-center justify-center mb-1 font-bold text-[10px]">
                          O₂
                        </div>
                        <span className="font-bold">Oxygen</span>
                        <span className="text-[10px] text-slate-400">(released)</span>
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-xs sm:text-sm text-[#26382E] leading-relaxed">
                  It happens mainly in the <strong>leaves</strong>, using a{" "}
                  <strong>green pigment</strong> called <strong>chlorophyll</strong>.
                  <br />
                  This process helps plants grow and also gives us oxygen!
                </p>

                {/* Message Action Footer: Thumb, Copy, Regenerate, Time */}
                <div className="flex items-center justify-between pt-2 border-t border-[#EDF2EE] text-slate-400 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setLikedMap((p) => ({ ...p, [msg.id]: !p[msg.id] }))
                      }
                      className={`p-1.5 rounded-lg hover:bg-slate-100 transition-colors ${
                        likedMap[msg.id] ? "text-emerald-700 bg-emerald-50" : ""
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() =>
                        setDislikedMap((p) => ({ ...p, [msg.id]: !p[msg.id] }))
                      }
                      className={`p-1.5 rounded-lg hover:bg-slate-100 transition-colors ${
                        dislikedMap[msg.id] ? "text-rose-600 bg-rose-50" : ""
                      }`}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        const folioResponse: ChatMessage = {
                          id: `folio-${Date.now()}`,
                          sender: "folio",
                          text: "Here is an alternate perspective: Plants are nature's solar panels, converting photons into carbohydrate bonds that power terrestrial ecosystems.",
                          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                        };
                        setMessages((prev) => [...prev, folioResponse]);
                      }}
                      className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {msg.time}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section & Suggestion Pills */}
      <div className="pt-3 border-t border-[#EDF2EE] space-y-2.5">
        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="relative flex items-center gap-2 bg-white border border-[#D6E0D9] focus-within:border-emerald-700 rounded-2xl px-3 py-2 shadow-2xs transition-all"
        >
          {/* Paperclip Button */}
          <button
            type="button"
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl transition-colors"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Text input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Message Folio..."
            className="flex-1 bg-transparent text-xs sm:text-sm text-[#11231B] placeholder:text-slate-400 focus:outline-none py-1"
          />

          {/* Circular Dark Green Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="h-8 w-8 rounded-full bg-[#0D382B] hover:bg-[#07251C] disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-xs active:scale-95 shrink-0"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Suggestion Pills */}
        <div className="flex items-center flex-wrap gap-2">
          {suggestionPills.map((pill) => (
            <button
              key={pill}
              onClick={() => {
                setInputText(pill);
              }}
              className="bg-white hover:bg-[#F2F6F3] border border-[#DEE5DF] text-[#33463B] text-[11px] font-semibold px-3 py-1 rounded-full transition-all shadow-3xs"
            >
              {pill}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
