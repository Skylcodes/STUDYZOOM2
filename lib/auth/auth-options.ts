/**
 * Auth options for NextAuth.js
 * This file exports the configuration for NextAuth.js
 */

import { authConfig } from '@/lib/auth';

/**
 * Export the auth options for NextAuth.js
 * This is used by the server-side auth functions
 */
export const authOptions = authConfig;
