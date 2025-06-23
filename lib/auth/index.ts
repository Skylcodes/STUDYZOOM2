import { cache } from 'react';
import NextAuth, { type DefaultSession, type NextAuthConfig } from 'next-auth';
import { encode } from 'next-auth/jwt';

import { Routes } from '@/constants/routes';
import { adapter } from '@/lib/auth/adapter';
import { callbacks } from '@/lib/auth/callbacks';
import { events } from '@/lib/auth/events';
import { providers } from '@/lib/auth/providers';
import { session } from '@/lib/auth/session';

declare module 'next-auth' {
  interface User {
    // Include both for backward compatibility during domain-aligned refactoring
    organizationId: string | undefined;
    studyGroupId: string | undefined;
  }

  interface Session {
    user: DefaultSession['user'];
  }
}

declare module '@auth/core/adapters' {
  interface AdapterUser {
    // Include both for backward compatibility during domain-aligned refactoring
    organizationId: string | undefined;
    studyGroupId: string | undefined;
  }
}

declare module '@auth/core/types' {
  interface User {
    // Include both for backward compatibility during domain-aligned refactoring
    organizationId: string | undefined;
    studyGroupId: string | undefined;
  }
}

export const authConfig = {
  adapter,
  providers,
  secret: process.env.AUTH_SECRET,
  session,
  pages: {
    signIn: Routes.Login,
    signOut: Routes.Logout,
    error: Routes.AuthError, // Error code passed in query string as ?error=ERROR_CODE
    newUser: Routes.Onboarding
  },
  callbacks,
  events,
  logger: {
    error(code, ...message) {
      console.error(`[AUTH ERROR] ${code}:`, ...message);
    },
    warn(code, ...message) {
      console.warn(`[AUTH WARNING] ${code}:`, ...message);
    },
    debug(code, ...message) {
      console.log(`[AUTH DEBUG] ${code}:`, ...message);
    }
  },
  jwt: {
    maxAge: session.maxAge,
    // Required line to encode credentials sessions
    async encode(arg) {
      return (arg.token?.sessionId as string) ?? encode(arg);
    }
  },
  trustHost: true
} satisfies NextAuthConfig;

// All those actions need to be called server-side
export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);

// Deduplicated server-side auth call
export const dedupedAuth = cache(auth);
