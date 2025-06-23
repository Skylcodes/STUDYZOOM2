import 'server-only';

import { Session } from 'next-auth';

import { dedupedAuth } from '@/lib/auth';
import { getLoginRedirect } from '@/lib/auth/redirect';
import { checkSession } from '@/lib/auth/session';

/**
 * Higher-order function that wraps server actions requiring authentication
 * Handles session validation and redirects to login if needed
 */
export function authActionClient<TInput, TOutput>(
  handler: (params: { session: Session; input: TInput }) => Promise<TOutput>
): (input: TInput) => Promise<TOutput> {
  return async (input: TInput) => {
    const session = await dedupedAuth();
    
    if (!checkSession(session)) {
      throw new Error('Authentication required');
    }
    
    return handler({ session, input });
  };
}
