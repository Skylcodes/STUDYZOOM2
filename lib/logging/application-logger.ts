/**
 * Application logging system for StudyZoom
 * Provides structured logging with different severity levels
 * and integration with monitoring systems
 */

import { createHash } from 'crypto';

// Log levels in order of severity
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical'
}

// Log categories for better filtering and analysis
export enum LogCategory {
  SECURITY = 'security',
  PERFORMANCE = 'performance',
  DATABASE = 'database',
  API = 'api',
  AUTH = 'auth',
  USER = 'user',
  SYSTEM = 'system',
  EXTERNAL = 'external',
  FILE = 'file'
}

// Log entry interface
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  userId?: string;
  requestId?: string;
  data?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  tags?: string[];
}

// Configuration for the logger
interface LoggerConfig {
  minLevel: LogLevel;
  enableConsole: boolean;
  enableSentry: boolean;
  includeStackTrace: boolean;
  sanitizeData: boolean;
  redactFields: string[];
}

// Default configuration
const defaultConfig: LoggerConfig = {
  minLevel: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  enableConsole: true,
  enableSentry: process.env.NODE_ENV === 'production',
  includeStackTrace: process.env.NODE_ENV !== 'production',
  sanitizeData: true,
  redactFields: ['password', 'token', 'secret', 'apiKey', 'creditCard', 'ssn']
};

// Global configuration
let config: LoggerConfig = { ...defaultConfig };

/**
 * Configure the logger
 * @param newConfig Configuration options
 */
export function configureLogger(newConfig: Partial<LoggerConfig>): void {
  config = { ...config, ...newConfig };
}

/**
 * Generate a unique request ID
 * @returns Unique request ID
 */
export function generateRequestId(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString();
  return createHash('md5').update(`${timestamp}-${random}`).digest('hex').substring(0, 16);
}

/**
 * Sanitize log data to remove sensitive information
 * @param data Data to sanitize
 * @returns Sanitized data
 */
function sanitizeData(data: Record<string, any>): Record<string, any> {
  if (!config.sanitizeData || !data) {
    return data;
  }

  const sanitized = { ...data };
  
  // Recursively check and redact sensitive fields
  const redact = (obj: Record<string, any>, path = ''): void => {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      // Check if this field should be redacted
      const shouldRedact = config.redactFields.some(field => 
        key.toLowerCase().includes(field.toLowerCase())
      );
      
      if (shouldRedact && typeof value === 'string') {
        obj[key] = '[REDACTED]';
      } else if (value && typeof value === 'object' && !Array.isArray(value)) {
        redact(value, currentPath);
      }
    }
  };
  
  redact(sanitized);
  return sanitized;
}

/**
 * Format error for logging
 * @param error Error object
 * @returns Formatted error
 */
function formatError(error: Error): LogEntry['error'] {
  return {
    name: error.name,
    message: error.message,
    stack: config.includeStackTrace ? error.stack : undefined
  };
}

/**
 * Log a message
 * @param level Log level
 * @param category Log category
 * @param message Log message
 * @param options Additional log options
 */
export function log(
  level: LogLevel,
  category: LogCategory,
  message: string,
  options: {
    userId?: string;
    requestId?: string;
    data?: Record<string, any>;
    error?: Error;
    tags?: string[];
  } = {}
): void {
  // Skip if below minimum log level
  if (
    (level === LogLevel.DEBUG && config.minLevel !== LogLevel.DEBUG) ||
    (level === LogLevel.INFO && config.minLevel === LogLevel.WARN) ||
    (level === LogLevel.INFO && config.minLevel === LogLevel.ERROR) ||
    (level === LogLevel.INFO && config.minLevel === LogLevel.CRITICAL) ||
    (level === LogLevel.WARN && config.minLevel === LogLevel.ERROR) ||
    (level === LogLevel.WARN && config.minLevel === LogLevel.CRITICAL) ||
    (level === LogLevel.ERROR && config.minLevel === LogLevel.CRITICAL)
  ) {
    return;
  }

  const timestamp = new Date().toISOString();
  const sanitizedData = options.data ? sanitizeData(options.data) : undefined;
  
  const logEntry: LogEntry = {
    timestamp,
    level,
    category,
    message,
    userId: options.userId,
    requestId: options.requestId,
    data: sanitizedData,
    tags: options.tags
  };
  
  if (options.error) {
    logEntry.error = formatError(options.error);
  }
  
  // Console logging
  if (config.enableConsole) {
    let consoleMethod: 'debug' | 'info' | 'warn' | 'error';
    
    switch (level) {
      case LogLevel.DEBUG:
        consoleMethod = 'debug';
        break;
      case LogLevel.INFO:
        consoleMethod = 'info';
        break;
      case LogLevel.WARN:
        consoleMethod = 'warn';
        break;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        consoleMethod = 'error';
        break;
      default:
        consoleMethod = 'info';
    }
    
    console[consoleMethod](
      `[${timestamp}] [${level.toUpperCase()}] [${category}] ${message}`,
      options.userId ? `User: ${options.userId}` : '',
      options.requestId ? `Request: ${options.requestId}` : '',
      sanitizedData ? { data: sanitizedData } : '',
      options.error ? options.error : ''
    );
  }
  
  // Sentry integration (would be implemented in production)
  if (config.enableSentry && (level === LogLevel.ERROR || level === LogLevel.CRITICAL)) {
    // In a real implementation, this would send to Sentry
    // Sentry.captureException(options.error || new Error(message), {
    //   level: level === LogLevel.CRITICAL ? 'fatal' : 'error',
    //   tags: {
    //     category,
    //     ...(options.tags ? options.tags.reduce((acc, tag) => ({ ...acc, [tag]: true }), {}) : {})
    //   },
    //   user: options.userId ? { id: options.userId } : undefined,
    //   extra: {
    //     data: sanitizedData,
    //     requestId: options.requestId
    //   }
    // });
    
    // For now, just log that we would send to Sentry
    if (process.env.NODE_ENV === 'development') {
      console.info('[SENTRY] Would send error to Sentry:', message);
    }
  }
  
  // In a production environment, this might also:
  // - Write to a log file
  // - Send to a log aggregation service
  // - Trigger alerts for critical errors
}

// Convenience methods for different log levels
export const logger = {
  debug: (category: LogCategory, message: string, options?: Parameters<typeof log>[3]) => 
    log(LogLevel.DEBUG, category, message, options),
    
  info: (category: LogCategory, message: string, options?: Parameters<typeof log>[3]) => 
    log(LogLevel.INFO, category, message, options),
    
  warn: (category: LogCategory, message: string, options?: Parameters<typeof log>[3]) => 
    log(LogLevel.WARN, category, message, options),
    
  error: (category: LogCategory, message: string, options?: Parameters<typeof log>[3]) => 
    log(LogLevel.ERROR, category, message, options),
    
  critical: (category: LogCategory, message: string, options?: Parameters<typeof log>[3]) => 
    log(LogLevel.CRITICAL, category, message, options)
};

// Export a default logger instance
export default logger;
