import { NextRequest, NextResponse } from 'next/server';
import { withPerformanceTracking } from './lib/monitoring/performance-monitor';
import { getToken } from 'next-auth/jwt';
import { applySecurityHeaders } from './lib/security/security-headers';
import { rateLimiter } from './lib/security/rate-limiter';

// Get auth secret from environment variables
const authSecret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;

/**
 * StudyZoom middleware for request processing
 * Handles performance monitoring, security headers, and authentication checks
 */
export async function middleware(request: NextRequest) {
  return withPerformanceTracking(request, async (req) => {
    // Get the pathname from the URL
    const pathname = req.nextUrl.pathname;
    
    // Skip middleware for static files and favicon
    if (
      req.nextUrl.pathname.startsWith('/_next') ||
      req.nextUrl.pathname.includes('favicon.ico')
    ) {
      return NextResponse.next();
    }
  
    // Apply rate limiting for API routes
    if (req.nextUrl.pathname.startsWith('/api')) {
      // Use different rate limit configurations based on the endpoint
      let limitType: 'default' | 'health' | 'auth' | 'sensitive' = 'default';
      
      // Health checks get a more permissive limit
      if (req.nextUrl.pathname.startsWith('/api/health')) {
        limitType = 'health';
      }
      // Auth endpoints get a stricter limit to prevent brute force
      else if (req.nextUrl.pathname.includes('/api/auth/')) {
        limitType = 'auth';
      }
      // Sensitive operations get the strictest limit
      else if (
        req.nextUrl.pathname.includes('/api/user-images') ||
        req.nextUrl.pathname.includes('/api/contact-images') ||
        req.nextUrl.pathname.includes('/api/study-materials')
      ) {
        limitType = 'sensitive';
      }
      
      // Apply rate limiting
      const rateLimitResponse = await rateLimiter(req, limitType);
      if (rateLimitResponse) {
        return rateLimitResponse;
      }
    }
    
    // Create response and apply security headers
    const response = applySecurityHeaders(NextResponse.next());
    
    
    // Add user ID to headers for performance tracking if authenticated
    try {
      const token = await getToken({ 
        req, 
        secret: authSecret 
      });
      
      if (token?.sub) {
        response.headers.set('x-user-id', token.sub);
      }
    } catch (error) {
      // Log error but don't fail the request
      console.error('Error getting auth token in middleware:', error);
    }
    
    return response;
  });
}

/**
 * Configure which paths the middleware should run on
 * We want to run on all paths except for static assets
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
