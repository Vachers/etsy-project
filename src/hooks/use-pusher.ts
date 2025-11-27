"use client";

import { useState, useCallback } from "react";
import { PusherMessage } from "@/lib/pusher";

// Pusher hooks - disabled until pusher-js is installed
// Run: npm install pusher pusher-js

export function useProjectMessages(_projectId: string) {
  const [messages, setMessages] = useState<PusherMessage[]>([]);
  const [isConnected] = useState(false);
  const [typingUsers] = useState<string[]>([]);

  const sendTypingIndicator = useCallback((_userName: string, _isTyping: boolean) => {
    // Pusher not configured
  }, []);

  return {
    messages,
    setMessages,
    isConnected,
    typingUsers,
    sendTypingIndicator,
  };
}

export function useProjectActivity(_projectId: string) {
  const [activities, setActivities] = useState<unknown[]>([]);

  return { activities, setActivities };
}
