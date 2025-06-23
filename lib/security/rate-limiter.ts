/**
 * Rate limiting utilities for StudyZoom
 * Protects API endpoints from abuse and ensures fair usage
 */

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// In-memory store for rate limiting
// In production, this should be replaced with Redis or a similar distributed cache
const rateLimitStore: Record<string, { count: number; resetTime: number }> = {};

// Rate limit configuration
interface RateLimitConfig {
  // Maximum number of requests allowed in the time window
  maxRequests: number;
  // Time window in seconds
  windowSizeInSeconds: number;
  // Whether to use a sliding window (true) or fixed window (false)
  slidingWindow: boolean;
}

// Default rate limit configurations
const defaultRateLimits: Record<string, RateLimitConfig> = {
  // Default limit for most API endpoints
  default: {
    maxRequests: 100,
    windowSizeInSeconds: 60,
    slidingWindow: true
  },
  // More permissive limit for health checks
  health: {
    maxRequests: 300,
    windowSizeInSeconds: 60,
    slidingWindow: true
  },
  // Stricter limit for authentication endpoints to prevent brute force
  auth: {
    maxRequests: 10,
    windowSizeInSeconds: 60,
    slidingWindow: true
  },
  // Very strict limit for sensitive operations
  sensitive: {
    maxRequests: 5,
    windowSizeInSeconds: 60,
    slidingWindow: true
  }
};

/**
 * Clean up expired rate limit entries
 * This should be called periodically to prevent memory leaks
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  Object.keys(rateLimitStore).forEach(key => {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key];
    }
  });
}

/**
 * Get a rate limit key for a request
 * @param req Next.js request object
 * @param userId Optional user ID from authentication
 * @returns Rate limit key
 */
async function getRateLimitKey(req: NextRequest, userId?: string): Promise<string> {
  // If we have a user ID, use that for the rate limit key
  if (userId) {
    return `user:${userId}:${req.nextUrl.pathname}`;
  }
  
  // Otherwise, try to get the user ID from the JWT token
  if (!userId) {
    try {
      const token = await getToken({ req });
      if (token?.sub) {
        return `user:${token.sub}:${req.nextUrl.pathname}`;
      }
    } catch (error) {
      // Ignore token errors and fall back to IP-based rate limiting
    }
  }
  
  // Fall back to IP-based rate limiting
  const forwardedFor = req.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';
  return `ip:${ip}:${req.nextUrl.pathname}`;
}

/**
 * Check if a request exceeds the rate limit
 * @param key Rate limit key
 * @param config Rate limit configuration
 * @returns Object with isLimited flag and headers for rate limit information
 */
function checkRateLimit(key: string, config: RateLimitConfig): {
  isLimited: boolean;
  headers: Record<string, string>;
} {
  const now = Date.now();
  const windowMs = config.windowSizeInSeconds * 1000;
  
  // Initialize or get the rate limit entry
  if (!rateLimitStore[key] || rateLimitStore[key].resetTime < now) {
    rateLimitStore[key] = {
      count: 0,
      resetTime: now + windowMs
    };
  }
  
  // Increment the request count
  rateLimitStore[key].count++;
  
  // Calculate remaining requests and time until reset
  const remaining = Math.max(0, config.maxRequests - rateLimitStore[key].count);
  const resetTime = rateLimitStore[key].resetTime;
  const resetSeconds = Math.ceil((resetTime - now) / 1000);
  
  // Check if the rate limit is exceeded
  const isLimited = rateLimitStore[key].count > config.maxRequests;
  
  // Prepare headers for rate limit information
  const headers = {
    'X-RateLimit-Limit': config.maxRequests.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': resetSeconds.toString()
  };
  
  return { isLimited, headers };
}

/**
 * Rate limiting middleware for Next.js API routes
 * @param req Next.js request object
 * @param limitType Type of rate limit to apply
 * @param userId Optional user ID for user-specific rate limiting
 * @returns Next.js response if rate limited, null otherwise
 */
export async function rateLimiter(
  req: NextRequest,
  limitType: keyof typeof defaultRateLimits = 'default',
  userId?: string
): Promise<NextResponse | null> {
  // Get the rate limit configuration
  const config = defaultRateLimits[limitType] || defaultRateLimits.default;
  
  // Get the rate limit key
  const key = await getRateLimitKey(req, userId);
  
  // Check if the request exceeds the rate limit
  const { isLimited, headers } = checkRateLimit(key, config);
  
  // If the rate limit is exceeded, return a 429 Too Many Requests response
  if (isLimited) {
    return NextResponse.json(
      { error: 'Too many requests, please try again later.' },
      {
        status: 429,
        headers: {
          ...headers,
          'Retry-After': headers['X-RateLimit-Reset']
        }
      }
    );
  }
  
  // Otherwise, return null to allow the request to proceed
  return null;
}

/**
 * Apply rate limit headers to a response
 * @param response Next.js response object
 * @param headers Rate limit headers
 * @returns Response with rate limit headers
 */
export function applyRateLimitHeaders(
  response: NextResponse,
  headers: Record<string, string>
): NextResponse {
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

/**
 * Schedule periodic cleanup of the rate limit store
 * This prevents memory leaks in the in-memory store
 */
export function scheduleRateLimitCleanup(): void {
  // Clean up every minute
  setInterval(cleanupRateLimitStore, 60 * 1000);
}

// Initialize cleanup on module load if in a Node.js environment
if (typeof window === 'undefined') {
  scheduleRateLimitCleanup();
}
