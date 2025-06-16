import { cookies } from 'next/headers';
import { addMinutes } from 'date-fns';
import type { NextAuthConfig } from 'next-auth';

import { TOTP_AND_RECOVERY_CODES_EXPIRY_MINUTES } from '@/constants/limits';
import { Routes } from '@/constants/routes';
import { adapter } from '@/lib/auth/adapter';
import { AuthCookies } from '@/lib/auth/cookies';
import { symmetricEncrypt } from '@/lib/auth/encryption';
import { AuthErrorCode } from '@/lib/auth/errors';
import {
  generateSessionToken,
  getSessionExpiryFromNow
} from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import {
  IdentityProvider,
  OAuthIdentityProvider
} from '@/types/identity-provider';

async function isAuthenticatorAppEnabled(userId: string): Promise<boolean> {
  const count = await prisma.authenticatorApp.count({
    where: { userId }
  });
  return count > 0;
}

function redirectToTotp(userId: string): string {
  if (!process.env.AUTH_SECRET) {
    console.error(
      'Missing encryption key; cannot proceed with token encryption.'
    );
    return `${Routes.AuthError}?error=${AuthErrorCode.InternalServerError}`;
  }
  const token = symmetricEncrypt(userId, process.env.AUTH_SECRET);
  const expiry = symmetricEncrypt(
    addMinutes(
      new Date(),
      TOTP_AND_RECOVERY_CODES_EXPIRY_MINUTES
    ).toISOString(),
    process.env.AUTH_SECRET
  );
  return `/auth/totp?token=${encodeURIComponent(token)}&expiry=${encodeURIComponent(expiry)}`;
}

export const callbacks = {
  async signIn({ user, account, profile }): Promise<string | boolean> {
    console.log(`[AUTH] Sign-in attempt for user: ${user?.email || 'unknown'}, provider: ${account?.provider || 'unknown'}`);
    
    if (!account) {
      console.warn('[AUTH] Sign-in failed: No account provided');
      return false;
    }
    // All Credentials Provider
    if (account.type === 'credentials') {
      console.log(`[AUTH] Processing credentials sign-in for user ID: ${user?.id || 'unknown'}`);
      
      if (!user || !user.id) {
        console.warn('[AUTH] Sign-in failed: Invalid user data');
        return false;
      }

      // Only username/password provider
      if (account.provider === IdentityProvider.Credentials) {
        console.log(`[AUTH] Checking if MFA is enabled for user ID: ${user.id}`);
        if (await isAuthenticatorAppEnabled(user.id)) {
          console.log(`[AUTH] MFA is enabled, redirecting to TOTP for user ID: ${user.id}`);
          return redirectToTotp(user.id);
        }
        console.log(`[AUTH] MFA is not enabled for user ID: ${user.id}`);
      }

      const sessionToken = generateSessionToken();
      const sessionExpiry = getSessionExpiryFromNow();

      const createdSession = await adapter.createSession!({
        sessionToken: sessionToken,
        userId: user.id,
        expires: sessionExpiry
      });

      if (!createdSession) {
        return false;
      }

      const cookieStore = await cookies();
      cookieStore.set({
        name: AuthCookies.SessionToken,
        value: sessionToken,
        expires: sessionExpiry
      });

      // already authorized
      return true;
    }

    // All OAuth Providers
    console.log(`[AUTH] Processing OAuth sign-in for provider: ${account.provider || 'unknown'}`);
    
    if (!account.provider || !profile) {
      console.warn('[AUTH] OAuth sign-in failed: Missing provider or profile');
      return false;
    }

    if (
      !Object.values(OAuthIdentityProvider).includes(
        account.provider.toLowerCase() as OAuthIdentityProvider
      )
    ) {
      console.warn(`[AUTH] OAuth sign-in failed: Illegal provider ${account.provider}`);
      return `${Routes.AuthError}?error=${AuthErrorCode.IllegalOAuthProvider}`;
    }

    if (account.provider === OAuthIdentityProvider.Google) {
      console.log(`[AUTH] Processing Google OAuth sign-in for email: ${profile.email || 'unknown'}`);
      if (!profile.email_verified) {
        console.warn(`[AUTH] Google OAuth sign-in failed: Email not verified for ${profile.email}`);
        return `${Routes.AuthError}?error=${AuthErrorCode.UnverifiedEmail}`;
      }
      console.log(`[AUTH] Google OAuth sign-in: Email verified for ${profile.email}`);
    }

    if (account.provider === OAuthIdentityProvider.MicrosoftEntraId) {
      console.log(`[AUTH] Processing Microsoft Entra ID OAuth sign-in for email: ${profile.email || 'unknown'}`);
      // Microsoft does not provide a verified email field
      // If you want to have verified emails, the suggestion is to use the user here, e.g.
      //
      // if (!user.emailVerified || isBefore(new Date(), user.emailVerified)) {
      //    /* send verification email */
      //    return `${Routes.VerifyEmail}?email=${encodeURIComponent(parsedInput.email)}`
      // }
    }

    if (user?.id) {
      console.log(`[AUTH] Checking if MFA is enabled for OAuth user ID: ${user.id}`);
      if (await isAuthenticatorAppEnabled(user.id)) {
        console.log(`[AUTH] MFA is enabled for OAuth user, redirecting to TOTP for user ID: ${user.id}`);
        return redirectToTotp(user.id);
      }
      console.log(`[AUTH] MFA is not enabled for OAuth user ID: ${user.id}`);
    }

    if (user?.name) {
      user.name = user.name.substring(0, 64);
    }
    if (profile.name) {
      profile.name = profile.name.substring(0, 64);
    }

    return true;
  },
  async jwt({ token, trigger, account, user }) {
    console.log(`[AUTH] JWT callback triggered: ${trigger}`);
    
    if ((trigger === 'signIn' || trigger === 'signUp') && account) {
      console.log(`[AUTH] Setting access token for ${trigger} with provider: ${account.provider}`);
      token.accessToken = account.access_token;

      if (account.type === 'credentials' && user.id) {
        console.log(`[AUTH] Creating session for credentials user ID: ${user.id}`);
        const expires = getSessionExpiryFromNow();
        const sessionToken = generateSessionToken();

        try {
          const session = await adapter.createSession!({
            userId: user.id,
            sessionToken,
            expires
          });

          console.log(`[AUTH] Session created successfully for user ID: ${user.id}`);
          token.sessionId = session.sessionToken;
        } catch (error) {
          console.error(`[AUTH ERROR] Failed to create session for user ID: ${user.id}`, error);
          // Re-throw to ensure the error is propagated
          throw error;
        }
      }
    }

    // Let's not allow the client to indirectly update the token using useSession().update()
    if (trigger === 'update') {
      console.log('[AUTH] Blocked token update from client');
      return token;
    }

    return token;
  },
  async session({ trigger, session, user }) {
    console.log(`[AUTH] Session callback triggered: ${trigger}`);
    
    if (session && user) {
      console.log(`[AUTH] Setting session data for user ID: ${user.id}, organization ID: ${user.organizationId || 'none'}`);
      session.user.organizationId = user.organizationId;
      session.user.id = user.id;
    } else if (!session) {
      console.warn('[AUTH] Session callback called with no session data');
    } else if (!user) {
      console.warn('[AUTH] Session callback called with no user data');
    }

    // Let's not allow the client to update the session using useSession().update()
    if (trigger === 'update') {
      console.log('[AUTH] Blocked session update from client');
      return session;
    }

    return session;
  }
} satisfies NextAuthConfig['callbacks'];
