import * as React from 'react';
import { type Metadata } from 'next';
import { createSearchParamsCache, parseAsString } from 'nuqs/server';

import { AuthContainer } from '@/components/auth/auth-container';
import { VerifyEmailInvalidCard } from '@/components/auth/verify-email/verify-email-invalid-card';
import { createTitle } from '@/lib/utils';
import type { NextPageProps } from '@/types/next-page-props';

const searchParamsCache = createSearchParamsCache({
  email: parseAsString.withDefault('')
});

export const metadata: Metadata = {
  title: createTitle('Invalid Verification Link')
};

export default async function VerifyEmailInvalidPage({
  searchParams
}: NextPageProps): Promise<React.JSX.Element> {
  const { email } = await searchParamsCache.parse(searchParams);
  return (
    <AuthContainer maxWidth="sm">
      <VerifyEmailInvalidCard email={email} />
    </AuthContainer>
  );
}
