// Mock data removed - Application now uses real database
// This file is kept for type exports only

import type { Product } from "@/components/common/product-card";

// YouTube types
export interface YouTubeChannel {
  id: string;
  name: string;
  email: string;
  password: string;
  channelUrl: string;
  handle?: string;
  description?: string;
  thumbnail?: string;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
  status: "active" | "inactive" | "suspended" | "pending";
  niche?: string;
  monetized: boolean;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export interface YouTubeVideo {
  id: string;
  channelId: string;
  title: string;
  description: string;
  thumbnail?: string;
  videoUrl?: string;
  status: "draft" | "scheduled" | "published" | "private" | "unlisted";
  prompt?: string;
  tags: string[];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Empty arrays - all data comes from database
export const mockPlatforms: never[] = [];
export const mockEbooks: Product[] = [];
export const mockDigitalProducts: Product[] = [];
export const mockDigitalBundles: Product[] = [];
export const mockSocialMedia: Product[] = [];
export const mockDetectiveProjects: Product[] = [];
export const mockMusicProjects: Product[] = [];
export const mockGameSell: Product[] = [];
export const mockYoutubeProducts: Product[] = [];
export const mockScriptsProducts: Product[] = [];
export const mockYoutubeChannels: never[] = [];

// Helper functions now return undefined/empty - use database queries instead
export const getMockProductById = (_id: string): Product | undefined => undefined;
export const getMockYoutubeChannelById = (_id: string): undefined => undefined;
export const getMockProductsByCategory = (_category: string): Product[] => [];
