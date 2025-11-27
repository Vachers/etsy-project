// ========================================
// Pusher Configuration for Real-time Messaging
// ========================================

import Pusher from "pusher";
import PusherClient from "pusher-js";

// Server-side Pusher instance
export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

// Client-side Pusher instance
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY!,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    authEndpoint: "/api/pusher/auth",
  }
);

// Channel naming conventions
export const getProjectChannel = (projectId: string) => `private-project-${projectId}`;
export const getUserChannel = (userId: string) => `private-user-${userId}`;

// Event types
export const PUSHER_EVENTS = {
  NEW_MESSAGE: "new-message",
  MESSAGE_READ: "message-read",
  USER_TYPING: "user-typing",
  MEMBER_ADDED: "member-added",
  MEMBER_REMOVED: "member-removed",
  PROJECT_UPDATED: "project-updated",
  TASK_UPDATED: "task-updated",
  ACTIVITY_LOG: "activity-log",
} as const;

// Types
export interface PusherMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  projectId: string;
  createdAt: string;
}

export interface TypingIndicator {
  userId: string;
  userName: string;
  isTyping: boolean;
}

export interface ActivityLogEvent {
  id: string;
  action: string;
  description: string;
  userId: string;
  userName: string;
  projectId: string;
  createdAt: string;
}


