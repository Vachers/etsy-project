// ========================================
// Pusher Configuration for Real-time Messaging
// ========================================
// NOTE: Pusher is disabled until packages are installed
// Run: npm install pusher pusher-js

// Placeholder types and functions for build compatibility
export const pusherServer = {
  trigger: async (..._args: unknown[]) => {},
  authorizeChannel: (..._args: unknown[]) => ({}),
};

export const pusherClient = null;

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
