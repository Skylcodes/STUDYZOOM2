/**
 * Error handling utilities for StudyZoom
 * Provides standardized error handling and reporting across the application
 */

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import logger, { LogCategory, LogLevel } from '@/lib/logging/application-logger';

// Error types for StudyZoom
export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  RATE_LIMIT = 'RATE_LIMIT_ERROR',
  SERVER = 'SERVER_ERROR',
  DATABASE = 'DATABASE_ERROR',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE_ERROR',
  SECURITY = 'SECURITY_ERROR',
  INPUT = 'INPUT_ERROR'
}

// Error codes for StudyZoom
export enum ErrorCode {
  // Validation errors
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',
  
  // Authentication errors
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  
  // Authorization errors
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  RESOURCE_ACCESS_DENIED = 'RESOURCE_ACCESS_DENIED',
  
  // Not found errors
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  ENDPOINT_NOT_FOUND = 'ENDPOINT_NOT_FOUND',
  
  // Rate limit errors
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  
  // Server errors
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  
  // Database errors
  DATABASE_CONNECTION_ERROR = 'DATABASE_CONNECTION_ERROR',
  DATABASE_QUERY_ERROR = 'DATABASE_QUERY_ERROR',
  DATABASE_CONSTRAINT_ERROR = 'DATABASE_CONSTRAINT_ERROR',
  
  // External service errors
  EXTERNAL_SERVICE_UNAVAILABLE = 'EXTERNAL_SERVICE_UNAVAILABLE',
  EXTERNAL_SERVICE_TIMEOUT = 'EXTERNAL_SERVICE_TIMEOUT',
  
  // Security errors
  SECURITY_VIOLATION = 'SECURITY_VIOLATION',
  VIRUS_DETECTED = 'VIRUS_DETECTED',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  
  // Input errors
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  UNSUPPORTED_FILE_TYPE = 'UNSUPPORTED_FILE_TYPE',
  MALFORMED_REQUEST = 'MALFORMED_REQUEST'
}

// StudyZoom error interface
export interface StudyZoomError {
  type: ErrorType;
  code: ErrorCode;
  message: string;
  details?: Record<string, any>;
  stack?: string;
}

/**
 * Create a standardized error object
 * @param type Error type
 * @param code Error code
 * @param message Error message
 * @param details Additional error details
 * @returns StudyZoom error object
 */
export function createError(
  type: ErrorType,
  code: ErrorCode,
  message: string,
  details?: Record<string, any>
): StudyZoomError {
  return {
    type,
    code,
    message,
    details,
    stack: process.env.NODE_ENV === 'development' ? new Error().stack : undefined
  };
}

/**
 * Handle errors and return a standardized response
 * @param error Error to handle
 * @param requestId Optional request ID for tracking
 * @param userId Optional user ID for tracking
 * @returns NextResponse with standardized error format
 */
export function handleError(error: unknown, requestId?: string, userId?: string): NextResponse {
  let studyZoomError: StudyZoomError;
  
  // Handle different error types
  if (error instanceof ZodError) {
    // Handle Zod validation errors
    studyZoomError = createError(
      ErrorType.VALIDATION,
      ErrorCode.INVALID_INPUT,
      'Validation error',
      { zodErrors: error.errors }
    );
    
    // Log validation error
    logger.warn(LogCategory.API, 'Validation error', {
      requestId,
      userId,
      data: { zodErrors: error.errors },
      error: error
    });
    
    return NextResponse.json({ error: studyZoomError }, { status: 400 });
  } else if (error instanceof Error) {
    // Handle generic errors based on error message content
    if (error.message.includes('Authentication')) {
      studyZoomError = createError(
        ErrorType.AUTHENTICATION,
        ErrorCode.INVALID_CREDENTIALS,
        error.message
      );
      
      // Log authentication error
      logger.warn(LogCategory.AUTH, `Authentication error: ${error.message}`, {
        requestId,
        userId,
        error: error
      });
      
      return NextResponse.json({ error: studyZoomError }, { status: 401 });
    } else if (error.message.includes('Permission') || error.message.includes('Authorization')) {
      studyZoomError = createError(
        ErrorType.AUTHORIZATION,
        ErrorCode.INSUFFICIENT_PERMISSIONS,
        error.message
      );
      
      // Log authorization error
      logger.warn(LogCategory.SECURITY, `Authorization error: ${error.message}`, {
        requestId,
        userId,
        error: error
      });
      
      return NextResponse.json({ error: studyZoomError }, { status: 403 });
    } else if (error.message.includes('not found') || error.message.includes('Not Found')) {
      studyZoomError = createError(
        ErrorType.NOT_FOUND,
        ErrorCode.RESOURCE_NOT_FOUND,
        error.message
      );
      
      // Log not found error
      logger.info(LogCategory.API, `Resource not found: ${error.message}`, {
        requestId,
        userId,
        error: error
      });
      
      return NextResponse.json({ error: studyZoomError }, { status: 404 });
    } else if (error.message.includes('Too many requests') || error.message.includes('Rate limit')) {
      studyZoomError = createError(
        ErrorType.RATE_LIMIT,
        ErrorCode.TOO_MANY_REQUESTS,
        error.message
      );
      
      // Log rate limit error
      logger.warn(LogCategory.SECURITY, `Rate limit exceeded: ${error.message}`, {
        requestId,
        userId,
        error: error
      });
      
      return NextResponse.json({ error: studyZoomError }, { status: 429 });
    } else if (error.message.includes('Database')) {
      studyZoomError = createError(
        ErrorType.DATABASE,
        ErrorCode.DATABASE_QUERY_ERROR,
        'Database error occurred',
        { originalMessage: error.message }
      );
      
      // Log database error
      logger.error(LogCategory.DATABASE, `Database error: ${error.message}`, {
        requestId,
        userId,
        error: error
      });
      
      return NextResponse.json({ error: studyZoomError }, { status: 500 });
    } else if (error.message.includes('Virus') || error.message.includes('Security')) {
      studyZoomError = createError(
        ErrorType.SECURITY,
        ErrorCode.SECURITY_VIOLATION,
        error.message
      );
      
      // Log security error
      logger.error(LogCategory.SECURITY, `Security violation: ${error.message}`, {
        requestId,
        userId,
        error: error
      });
      
      return NextResponse.json({ error: studyZoomError }, { status: 400 });
    } else {
      // Default to server error
      studyZoomError = createError(
        ErrorType.SERVER,
        ErrorCode.INTERNAL_SERVER_ERROR,
        'An unexpected error occurred',
        { originalMessage: error.message }
      );
      
      // Log server error
      logger.error(LogCategory.SYSTEM, `Unexpected error: ${error.message}`, {
        requestId,
        userId,
        error: error
      });
      
      return NextResponse.json({ error: studyZoomError }, { status: 500 });
    }
  } else {
    // Handle unknown errors
    studyZoomError = createError(
      ErrorType.SERVER,
      ErrorCode.INTERNAL_SERVER_ERROR,
      'An unexpected error occurred'
    );
    
    // Log unknown error
    logger.critical(LogCategory.SYSTEM, 'Unknown error type encountered', {
      requestId,
      userId,
      data: { error: typeof error === 'object' ? JSON.stringify(error) : String(error) }
    });
    
    return NextResponse.json({ error: studyZoomError }, { status: 500 });
  }
}

/**
 * Create a validation error response
 * @param message Error message
 * @param details Validation error details
 * @returns NextResponse with validation error
 */
export function createValidationErrorResponse(
  message: string,
  details?: Record<string, any>
): NextResponse {
  const error = createError(
    ErrorType.VALIDATION,
    ErrorCode.INVALID_INPUT,
    message,
    details
  );
  return NextResponse.json({ error }, { status: 400 });
}

/**
 * Create an authentication error response
 * @param message Error message
 * @returns NextResponse with authentication error
 */
export function createAuthenticationErrorResponse(message: string): NextResponse {
  const error = createError(
    ErrorType.AUTHENTICATION,
    ErrorCode.INVALID_CREDENTIALS,
    message
  );
  return NextResponse.json({ error }, { status: 401 });
}

/**
 * Create an authorization error response
 * @param message Error message
 * @returns NextResponse with authorization error
 */
export function createAuthorizationErrorResponse(message: string): NextResponse {
  const error = createError(
    ErrorType.AUTHORIZATION,
    ErrorCode.INSUFFICIENT_PERMISSIONS,
    message
  );
  return NextResponse.json({ error }, { status: 403 });
}

/**
 * Create a not found error response
 * @param message Error message
 * @returns NextResponse with not found error
 */
export function createNotFoundErrorResponse(message: string): NextResponse {
  const error = createError(
    ErrorType.NOT_FOUND,
    ErrorCode.RESOURCE_NOT_FOUND,
    message
  );
  return NextResponse.json({ error }, { status: 404 });
}

/**
 * Create a security error response
 * @param message Error message
 * @param code Specific security error code
 * @param details Additional error details
 * @returns NextResponse with security error
 */
export function createSecurityErrorResponse(
  message: string,
  code: ErrorCode = ErrorCode.SECURITY_VIOLATION,
  details?: Record<string, any>
): NextResponse {
  const error = createError(
    ErrorType.SECURITY,
    code,
    message,
    details
  );
  return NextResponse.json({ error }, { status: 400 });
}

/**
 * Create a server error response
 * @param message Error message
 * @param details Additional error details
 * @returns NextResponse with server error
 */
export function createServerErrorResponse(
  message: string,
  details?: Record<string, any>
): NextResponse {
  const error = createError(
    ErrorType.SERVER,
    ErrorCode.INTERNAL_SERVER_ERROR,
    message,
    details
  );
  return NextResponse.json({ error }, { status: 500 });
}
