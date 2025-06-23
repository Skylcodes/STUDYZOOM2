import * as Sentry from '@sentry/nextjs';

/**
 * Initialize Sentry for server-side error monitoring
 */
export function initServerSentry() {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    
    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1.0,
    
    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: process.env.NODE_ENV === 'development',

    // Add custom context to all errors
    beforeSend(event) {
      // Don't send users' personal information to Sentry
      if (event.user) {
        delete event.user.email;
        delete event.user.ip_address;
      }
      
      // Remove any sensitive data from request bodies
      if (event.request?.data) {
        const data = event.request.data;
        if (typeof data === 'object' && data !== null) {
          // Sanitize sensitive fields
          const sanitizedData = { ...data };
          ['password', 'token', 'secret', 'key', 'apiKey'].forEach(field => {
            if (field in sanitizedData) {
              sanitizedData[field] = '[REDACTED]';
            }
          });
          event.request.data = sanitizedData;
        }
      }
      
      return event;
    }
  });
}
