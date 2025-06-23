import type { ObjectValues } from '@/types/object-values';

import packageInfo from '../package.json';

/**
 * Application constants for StudyZoom
 * Used throughout the application for consistent naming and versioning
 */
export const AppInfo = {
  // Basic app information
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? 'StudyZoom',
  APP_DESCRIPTION: 'AI-powered academic support platform for students',
  PRODUCTION: process.env.NODE_ENV === 'production',
  VERSION: packageInfo.version,
  
  // Contact information
  SUPPORT_EMAIL: 'support@studyzoom.app',
  CONTACT_URL: 'https://studyzoom.app/contact',
  
  // Social media
  TWITTER_HANDLE: '@studyzoom',
  GITHUB_REPO: 'https://github.com/studyzoom/studyzoom',
  
  // API information
  API_VERSION: 'v1',
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL ?? '/api',
  
  // Security settings
  SESSION_DURATION: 7 * 24 * 60 * 60, // 7 days in seconds
  PASSWORD_MIN_LENGTH: 12,
  MFA_ENABLED: true,
  
  // Performance monitoring
  PERFORMANCE_SAMPLE_RATE: 0.1, // 10% of requests
  ERROR_SAMPLE_RATE: 1.0, // 100% of errors
  
  // Feature flags
  FEATURES: {
    STUDY_MATERIALS: true,
    FLASHCARDS: true,
    QUIZZES: true,
    PODCASTS: true,
    CHAT: true,
    STUDY_PLANNER: true
  }
} as const;

export type AppInfo = ObjectValues<typeof AppInfo>;

/**
 * Environment information
 * Used for health checks and debugging
 */
export const EnvironmentInfo = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  DEPLOYMENT_ENV: process.env.NEXT_PUBLIC_DEPLOYMENT_ENV ?? 'local',
  DATABASE_URL: process.env.DATABASE_URL ? '[REDACTED]' : undefined,
  BUILD_TIME: new Date().toISOString(),
  BUILD_ID: process.env.NEXT_PUBLIC_BUILD_ID ?? 'development'
} as const;

export type EnvironmentInfo = ObjectValues<typeof EnvironmentInfo>;
