"use client";

import { useEffect, useState, useCallback } from "react";
import { pusherClient, getProjectChannel, PUSHER_EVENTS, PusherMessage, TypingIndicator } from "@/lib/pusher";
import type { Channel } from "pusher-js";

export function useProjectMessages(projectId: string) {
  const [messages, setMessages] = useState<PusherMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!projectId) return;

    const channelName = getProjectChannel(projectId);
    const channel = pusherClient.subscribe(channelName);

    channel.bind("pusher:subscription_succeeded", () => {
      setIsConnected(true);
    });

    channel.bind("pusher:subscription_error", (error: Error) => {
      console.error("Pusher subscription error:", error);
      setIsConnected(false);
    });

    // Listen for new messages
    channel.bind(PUSHER_EVENTS.NEW_MESSAGE, (message: PusherMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    // Listen for typing indicators
    channel.bind(PUSHER_EVENTS.USER_TYPING, (data: TypingIndicator) => {
      if (data.isTyping) {
        setTypingUsers((prev) => [...new Set([...prev, data.userName])]);
      } else {
        setTypingUsers((prev) => prev.filter((name) => name !== data.userName));
      }
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(channelName);
      setIsConnected(false);
    };
  }, [projectId]);

  const sendTypingIndicator = useCallback((userName: string, isTyping: boolean) => {
    const channelName = getProjectChannel(projectId);
    const channel = pusherClient.channel(channelName) as Channel;
    
    if (channel) {
      channel.trigger("client-typing", {
        userName,
        isTyping,
      });
    }
  }, [projectId]);

  return {
    messages,
    setMessages,
    isConnected,
    typingUsers,
    sendTypingIndicator,
  };
}

export function useProjectActivity(projectId: string) {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    if (!projectId) return;

    const channelName = getProjectChannel(projectId);
    const channel = pusherClient.subscribe(channelName);

    // Listen for activity logs
    channel.bind(PUSHER_EVENTS.ACTIVITY_LOG, (activity: any) => {
      setActivities((prev) => [activity, ...prev]);
    });

    // Listen for member changes
    channel.bind(PUSHER_EVENTS.MEMBER_ADDED, (data: any) => {
      console.log("Member added:", data);
    });

    channel.bind(PUSHER_EVENTS.MEMBER_REMOVED, (data: any) => {
      console.log("Member removed:", data);
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(channelName);
    };
  }, [projectId]);

  return { activities, setActivities };
}


