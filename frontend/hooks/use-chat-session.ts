"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace(/\/$/, "");
const API_URL = BASE_URL.endsWith("/api") ? BASE_URL : `${BASE_URL}/api`;

export interface ChatSource {
  fileName: string;
  score?: number;
}

export interface ChatMessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: ChatSource[] | null;
  createdAt: string;
  isStreaming?: boolean;
}

export interface ChatConversationItem {
  id: string;
  title: string;
  studyBuddyId?: string | null;
  studyBuddyName?: string | null;
  useMaterials: boolean;
  lastMessage: string | null;
  lastMessageRole: string | null;
  createdAt: string;
  updatedAt: string;
}

interface MessagesApiResponse {
  conversation: ChatConversationItem;
  messages: Array<{
    id: string;
    conversationId: string;
    role: "user" | "assistant";
    content: string;
    sources?: ChatSource[] | null;
    createdAt: string;
  }>;
}

export function useChatSession() {
  const queryClient = useQueryClient();
  const [activeConversationId, setActiveConversationId] = React.useState<string | null>(null);
  const [localMessages, setLocalMessages] = React.useState<ChatMessageItem[]>([]);
  const [isStreaming, setIsStreaming] = React.useState(false);

  // 1. Fetch Conversations List
  const conversationsQuery = useQuery<ChatConversationItem[]>({
    queryKey: ["chat", "conversations"],
    queryFn: () => api.get("/chat/conversations"),
    refetchOnWindowFocus: true,
  });

  // 2. Fetch Messages for Active Conversation
  const messagesQuery = useQuery<MessagesApiResponse>({
    queryKey: ["chat", "messages", activeConversationId],
    queryFn: () => api.get(`/chat/conversations/${activeConversationId}/messages`),
    enabled: !!activeConversationId,
  });

  // Sync local messages when query data changes and not actively streaming
  React.useEffect(() => {
    if (!isStreaming) {
      if (activeConversationId && messagesQuery.data?.messages) {
        setLocalMessages(
          messagesQuery.data.messages.map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            sources: m.sources,
            createdAt: m.createdAt,
          }))
        );
      } else if (!activeConversationId) {
        setLocalMessages([]);
      }
    }
  }, [messagesQuery.data, activeConversationId, isStreaming]);

  // 3. Delete Conversation Mutation
  const deleteConversationMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/chat/conversations/${id}`),
    onSuccess: (_, deletedId) => {
      toast.success("Conversation deleted");
      if (activeConversationId === deletedId) {
        setActiveConversationId(null);
        setLocalMessages([]);
      }
      queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] });
    },
    onError: (err: unknown) => {
      const error = err as { message?: string };
      toast.error(error?.message || "Failed to delete conversation.");
    },
  });

  // 4. Send Message with Streaming AI Response
  const sendMessage = async (
    text: string,
    options: {
      useMaterials?: boolean;
      studyBuddyId?: string | null;
    } = {}
  ) => {
    if (!text.trim() || isStreaming) return;

    const userText = text.trim();
    const tempUserMsgId = `temp-user-${Date.now()}`;
    const tempAssistantMsgId = `temp-assistant-${Date.now()}`;
    const nowIso = new Date().toISOString();

    const userMsg: ChatMessageItem = {
      id: tempUserMsgId,
      role: "user",
      content: userText,
      createdAt: nowIso,
    };

    const assistantPlaceholder: ChatMessageItem = {
      id: tempAssistantMsgId,
      role: "assistant",
      content: "",
      createdAt: nowIso,
      isStreaming: true,
    };

    // Optimistically update message feed
    setLocalMessages((prev) => [...prev, userMsg, assistantPlaceholder]);
    setIsStreaming(true);

    try {
      const session = await authClient.getSession();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (session?.data?.session?.token) {
        headers["Authorization"] = `Bearer ${session.data.session.token}`;
      }

      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({
          message: userText,
          conversationId: activeConversationId || undefined,
          useMaterials: options.useMaterials ?? true,
          studyBuddyId: options.studyBuddyId || undefined,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Chat request failed with status ${response.status}`);
      }

      // Check header for newly created conversation ID
      const newConversationId = response.headers.get("x-conversation-id");
      if (newConversationId && (!activeConversationId || activeConversationId !== newConversationId)) {
        setActiveConversationId(newConversationId);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Response body is not readable");
      }

      const decoder = new TextDecoder("utf-8");
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        setLocalMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempAssistantMsgId
              ? { ...msg, content: accumulatedText, isStreaming: true }
              : msg
          )
        );
      }

      // Mark streaming as complete
      setLocalMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempAssistantMsgId
            ? { ...msg, content: accumulatedText, isStreaming: false }
            : msg
        )
      );

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] });
      queryClient.invalidateQueries({ queryKey: ["sessions", "daily-goals"] });
      queryClient.invalidateQueries({ queryKey: ["studybuddy", "recent-activity"] });
    } catch (err: unknown) {
      console.error("Chat streaming error:", err);
      const error = err as { message?: string };
      const errorMessage =
        error?.message || "Folio was unable to complete the response. Please try again.";

      toast.error("Failed to receive AI response.");

      setLocalMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempAssistantMsgId
            ? {
                ...msg,
                content: `*${errorMessage}*`,
                isStreaming: false,
              }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const startNewConversation = () => {
    setActiveConversationId(null);
    setLocalMessages([]);
  };

  return {
    conversations: Array.isArray(conversationsQuery.data) ? conversationsQuery.data : [],
    isLoadingConversations: conversationsQuery.isLoading,
    activeConversationId,
    setActiveConversationId,
    messages: localMessages,
    isLoadingMessages: messagesQuery.isLoading && localMessages.length === 0,
    isStreaming,
    sendMessage,
    deleteConversation: deleteConversationMutation.mutateAsync,
    isDeletingConversation: deleteConversationMutation.isPending,
    startNewConversation,
  };
}
