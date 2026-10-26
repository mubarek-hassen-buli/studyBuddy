"use client";

import * as React from "react";
import { ChatHero } from "@/components/dashboard/chat/chat-hero";
import { ChatConversation } from "@/components/dashboard/chat/chat-conversation";
import { ChatSidebar } from "@/components/dashboard/chat/chat-sidebar";
import { useChatSession } from "@/hooks/use-chat-session";

export default function ChatPage() {
  const [useMaterials, setUseMaterials] = React.useState(true);
  const [selectedPrompt, setSelectedPrompt] = React.useState<string | undefined>(undefined);

  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    messages,
    isStreaming,
    sendMessage,
    deleteConversation,
    startNewConversation,
  } = useChatSession();

  const handleSendMessage = (text: string) => {
    sendMessage(text, { useMaterials });
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Hero + Chat Conversation Container */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          <ChatHero />

          <ChatConversation
            useMaterials={useMaterials}
            messages={messages}
            isStreaming={isStreaming}
            onSendMessage={handleSendMessage}
            inputPrompt={selectedPrompt}
            onClearInputPrompt={() => setSelectedPrompt(undefined)}
          />
        </div>

        {/* Right Column: Chat with materials toggle + Quick Prompts + Recent Discussions */}
        <div className="lg:col-span-4 xl:col-span-3">
          <ChatSidebar
            useMaterials={useMaterials}
            onToggleUseMaterials={setUseMaterials}
            onSelectPrompt={(prompt) => setSelectedPrompt(prompt)}
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={setActiveConversationId}
            onNewChat={startNewConversation}
            onDeleteConversation={deleteConversation}
          />
        </div>
      </div>
    </div>
  );
}
