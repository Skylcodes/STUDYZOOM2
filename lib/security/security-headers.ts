/**
 * Security headers configuration for StudyZoom
 * These headers help protect against common web vulnerabilities
 */

import { NextResponse } from 'next/server';

/**
 * Security header configuration
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers
 */
export const securityHeaders = {
  // Control DNS prefetching
  'X-DNS-Prefetch-Control': 'on',
  
  // Strict Transport Security
  // Ensures the browser only uses HTTPS for this domain
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  
  // X-XSS-Protection
  // Prevents reflected XSS attacks
  'X-XSS-Protection': '1; mode=block',
  
  // X-Content-Type-Options
  // Prevents MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Referrer-Policy
  // Controls how much referrer information is sent
  'Referrer-Policy': 'origin-when-cross-origin',
  
  // Content-Security-Policy
  // Controls which resources can be loaded
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Required for Next.js
    "style-src 'self' 'unsafe-inline'", // Required for styled-components
    "img-src 'self' data: blob:", // Allow data: for base64 images
    "font-src 'self'",
    "connect-src 'self' https://*.sentry.io", // Allow Sentry
    "frame-ancestors 'none'", // Prevent embedding in iframes
    "form-action 'self'", // Restrict form submissions
    "base-uri 'self'", // Restrict base tag
    "object-src 'none'", // Prevent object, embed, applet
  ].join('; '),
  
  // X-Frame-Options
  // Prevents clickjacking by disallowing framing
  'X-Frame-Options': 'DENY',
  
  // Permissions-Policy
  // Controls which browser features can be used
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'interest-cohort=()', // Disable FLoC
  ].join(', '),
};

/**
 * Apply security headers to a Next.js response
 * @param response Next.js response object
 * @returns Response with security headers
 */
export function applySecurityHeaders(response: NextResponse): NextResponse {
  // Add security headers to the response
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

/**
 * Generate a Content Security Policy nonce for use in inline scripts
 * @returns Random nonce string
 */
export function generateCSPNonce(): string {
  return Buffer.from(crypto.randomUUID()).toString('base64');
}

/**
 * Update the Content Security Policy header with a nonce
 * @param headers Response headers
 * @param nonce CSP nonce
 */
export function updateCSPWithNonce(headers: Headers, nonce: string): void {
  const currentCSP = headers.get('Content-Security-Policy') || '';
  const updatedCSP = currentCSP.replace(
    "script-src 'self' 'unsafe-inline'",
    `script-src 'self' 'nonce-${nonce}'`
  );
  
  headers.set('Content-Security-Policy', updatedCSP);
}
