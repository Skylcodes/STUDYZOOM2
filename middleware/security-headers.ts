/**
 * Security headers middleware for StudyZoom
 * Implements best practices for web security headers
 */

import { NextRequest, NextResponse } from 'next/server';
import logger, { LogCategory } from '@/lib/logging/application-logger';

/**
 * Content Security Policy directives
 * Customized for StudyZoom's requirements
 */
const cspDirectives = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://js.stripe.com', 'https://cdn.jsdelivr.net'],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdn.jsdelivr.net'],
  'img-src': ["'self'", 'data:', 'blob:', 'https://res.cloudinary.com', 'https://*.stripe.com'],
  'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
  'connect-src': ["'self'", 'https://api.openai.com', 'https://*.stripe.com', 'https://sentry.io'],
  'frame-src': ["'self'", 'https://js.stripe.com', 'https://hooks.stripe.com'],
  'media-src': ["'self'", 'data:', 'blob:'],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'self'"],
  'upgrade-insecure-requests': []
};

/**
 * Build Content Security Policy header value
 * @returns CSP header value
 */
function buildCspHeaderValue(): string {
  return Object.entries(cspDirectives)
    .map(([directive, sources]) => {
      if (sources.length === 0) {
        return directive;
      }
      return `${directive} ${sources.join(' ')}`;
    })
    .join('; ');
}

/**
 * Add security headers to response
 * @param response NextResponse object
 * @returns Response with security headers
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Content Security Policy
  response.headers.set('Content-Security-Policy', buildCspHeaderValue());
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  
  // Enable XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Strict Transport Security (HSTS)
  // Only in production to avoid issues in development
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }
  
  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );
  
  return response;
}

/**
 * Middleware wrapper for adding security headers
 * @param handler Request handler function
 * @returns Wrapped handler function
 */
export function withSecurityHeaders(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const response = await handler(req);
      return addSecurityHeaders(response);
    } catch (error) {
      // Log security header application error
      logger.error(LogCategory.SECURITY, 'Error applying security headers', {
        error: error instanceof Error ? error : new Error(String(error)),
        data: {
          url: req.url,
          method: req.method
        }
      });
      
      // Re-throw the error to be handled by error middleware
      throw error;
    }
  };
}

/**
 * Apply security headers middleware to a handler
 * @param handler Request handler function
 * @returns Wrapped handler function with security headers
 */
export function withResponseSecurityHeaders<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T
): T {
  return withSecurityHeaders(handler as any) as any;
}
