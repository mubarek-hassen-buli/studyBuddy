"use client";

import * as React from "react";
import { ChatHero } from "@/components/dashboard/chat/chat-hero";
import { ChatConversation } from "@/components/dashboard/chat/chat-conversation";
import { ChatSidebar } from "@/components/dashboard/chat/chat-sidebar";

export default function ChatPage() {
  const [useMaterials, setUseMaterials] = React.useState(true);
  const [selectedPrompt, setSelectedPrompt] = React.useState<string | undefined>(undefined);

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Hero (Ask. Explore. Learn. + Bust) + Chat Conversation Container */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          <ChatHero />

          <ChatConversation
            useMaterials={useMaterials}
            inputPrompt={selectedPrompt}
            onClearInputPrompt={() => setSelectedPrompt(undefined)}
          />
        </div>

        {/* Right Column: Chat with materials toggle + Quick Prompts + Recent Chats */}
        <div className="lg:col-span-4 xl:col-span-3">
          <ChatSidebar
            useMaterials={useMaterials}
            onToggleUseMaterials={setUseMaterials}
            onSelectPrompt={(prompt) => setSelectedPrompt(prompt)}
            onSelectRecentChat={(title) => {
              setSelectedPrompt(`Tell me more about ${title}`);
            }}
          />
        </div>
      </div>
    </div>
  );
}
