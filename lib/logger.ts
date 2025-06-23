/**
 * Simple logger utility for consistent logging across the application
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

/**
 * Logger utility for consistent logging across the application
 */
export const logger = {
  /**
   * Log a debug message
   */
  debug(message: string, context?: LogContext): void {
    log('debug', message, context);
  },

  /**
   * Log an info message
   */
  info(message: string, context?: LogContext): void {
    log('info', message, context);
  },

  /**
   * Log a warning message
   */
  warn(message: string, context?: LogContext): void {
    log('warn', message, context);
  },

  /**
   * Log an error message
   */
  error(message: string, context?: LogContext): void {
    log('error', message, context);
  }
};

/**
 * Internal log function
 */
function log(level: LogLevel, message: string, context?: LogContext): void {
  const timestamp = new Date().toISOString();
  const contextString = context ? ` ${JSON.stringify(context)}` : '';
  
  switch (level) {
    case 'debug':
      console.debug(`[${timestamp}] DEBUG: ${message}${contextString}`);
      break;
    case 'info':
      console.info(`[${timestamp}] INFO: ${message}${contextString}`);
      break;
    case 'warn':
      console.warn(`[${timestamp}] WARN: ${message}${contextString}`);
      break;
    case 'error':
      console.error(`[${timestamp}] ERROR: ${message}${contextString}`);
      break;
  }
}
