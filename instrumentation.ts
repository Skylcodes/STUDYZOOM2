// Next.js instrumentation file for server-side initialization

export async function register() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    // Initialize Sentry on the server
    const Sentry = await import('@sentry/nextjs');
    
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 1.0,
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
}
