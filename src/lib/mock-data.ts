// Mock data removed - Application now uses real database
// This file is kept for type exports only

import type { Product } from "@/components/common/product-card";

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
