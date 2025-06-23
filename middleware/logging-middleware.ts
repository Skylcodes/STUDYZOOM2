/**
 * Logging middleware for StudyZoom
 * Provides request logging and error handling for all API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateRequestId } from '@/lib/logging/application-logger';
import logger, { LogCategory } from '@/lib/logging/application-logger';
import { handleError } from '@/lib/error/error-handler';
import { auth } from '@/lib/auth';

/**
 * Middleware wrapper for logging requests and handling errors
 * @param handler Request handler function
 * @returns Wrapped handler function
 */
export function withLogging(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const requestId = generateRequestId();
    const startTime = performance.now();
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;
    
    // Add request ID to headers for tracking
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-request-id', requestId);
    
    // Get user ID if authenticated
    let userId: string | undefined;
    try {
      const session = await auth();
      userId = session?.user?.id;
      if (userId) {
        requestHeaders.set('x-user-id', userId);
      }
    } catch (error) {
      // Ignore auth errors here, they'll be handled by the auth middleware
    }
    
    // Create a new request with the updated headers
    const requestWithHeaders = new NextRequest(req.url, {
      headers: requestHeaders,
      method: req.method,
      body: req.body,
      cache: req.cache,
      credentials: req.credentials,
      integrity: req.integrity,
      keepalive: req.keepalive,
      mode: req.mode,
      redirect: req.redirect,
      referrer: req.referrer,
      referrerPolicy: req.referrerPolicy,
      signal: req.signal,
    });
    
    // Log the incoming request
    logger.info(LogCategory.API, `${method} ${path}`, {
      requestId,
      userId,
      data: {
        method,
        path,
        query: Object.fromEntries(url.searchParams.entries()),
        userAgent: req.headers.get('user-agent'),
        referer: req.headers.get('referer'),
        contentType: req.headers.get('content-type'),
      }
    });
    
    try {
      // Execute the handler
      const response = await handler(requestWithHeaders);
      
      // Calculate and log response time
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      // Add response headers
      response.headers.set('x-request-id', requestId);
      response.headers.set('x-response-time', `${responseTime.toFixed(2)}ms`);
      
      // Log the response
      logger.info(LogCategory.API, `${method} ${path} ${response.status}`, {
        requestId,
        userId,
        data: {
          status: response.status,
          responseTime: `${responseTime.toFixed(2)}ms`,
        }
      });
      
      return response;
    } catch (error) {
      // Calculate error response time
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      // Log the error
      logger.error(LogCategory.API, `Error handling ${method} ${path}`, {
        requestId,
        userId,
        data: {
          responseTime: `${responseTime.toFixed(2)}ms`,
        },
        error: error instanceof Error ? error : new Error(String(error))
      });
      
      // Handle the error and return a standardized response
      const errorResponse = handleError(error, requestId, userId);
      
      // Add response headers
      errorResponse.headers.set('x-request-id', requestId);
      errorResponse.headers.set('x-response-time', `${responseTime.toFixed(2)}ms`);
      
      return errorResponse;
    }
  };
}

/**
 * Apply logging middleware to a handler
 * @param handler Request handler function
 * @returns Wrapped handler function with logging
 */
export function withRequestLogging<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T
): T {
  return withLogging(handler as any) as any;
}
