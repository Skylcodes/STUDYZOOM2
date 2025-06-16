'use server';

import { cookies } from 'next/headers';
import { CredentialsSignin } from 'next-auth';
import { returnValidationErrors } from 'next-safe-action';

import { actionClient } from '@/actions/safe-action';
import { Routes } from '@/constants/routes';
import { signIn } from '@/lib/auth';
import { AuthCookies } from '@/lib/auth/cookies';
import { passThroughlogInSchema } from '@/schemas/auth/log-in-schema';
import { IdentityProvider } from '@/types/identity-provider';

export const logIn = actionClient
  .metadata({ actionName: 'login' })
  .schema(passThroughlogInSchema)
  .action(async ({ parsedInput }) => {
    const cookieStore = await cookies();
    const callbackUrl =
      cookieStore.get(AuthCookies.CallbackUrl)?.value || Routes.Home;

    try {
      console.log(`[LOGIN] Attempting login for email: ${parsedInput.email}, redirectTo: ${callbackUrl}`);
      
      // When redirect is true, signIn() will throw a Response object that should be returned
      // to allow Next.js to perform the redirect
      const result = await signIn(IdentityProvider.Credentials, {
        ...parsedInput,
        redirectTo: callbackUrl,
        redirect: true
      });
      
      // If we reach here, it means redirect was handled or disabled
      console.log(`[LOGIN] Login successful without redirect for email: ${parsedInput.email}`);
      return result;
    } catch (e) {
      // Only catch and handle CredentialsSignin errors
      if (e instanceof CredentialsSignin) {
        console.error(`[LOGIN ERROR] Credentials signin error for email: ${parsedInput.email}, code: ${e.code}`);
        return returnValidationErrors(passThroughlogInSchema, {
          _errors: [e.code]
        });
      }
      
      // For other errors (including Response redirect), let them propagate
      if (e instanceof Response) {
        console.log(`[LOGIN] Redirecting user after successful login for email: ${parsedInput.email}`);
      } else {
        console.error(`[LOGIN ERROR] Unexpected error during login for email: ${parsedInput.email}:`, e);
      }
      throw e;
    }
  });
