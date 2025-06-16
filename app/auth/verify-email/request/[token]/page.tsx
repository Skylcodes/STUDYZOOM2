import * as React from 'react';
import { type Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { isAfter } from 'date-fns';
import { createSearchParamsCache, parseAsString } from 'nuqs/server';

import { verifyEmailWithToken } from '@/actions/auth/verify-email-with-token';
import { Routes } from '@/constants/routes';
import { prisma } from '@/lib/db/prisma';
import { createTitle } from '@/lib/utils';
import type { NextPageProps } from '@/types/next-page-props';

const paramsCache = createSearchParamsCache({
  token: parseAsString.withDefault('')
});

export const metadata: Metadata = {
  title: createTitle('Email Verification')
};

export default async function EmailVerificationPage({
  params
}: NextPageProps): Promise<React.JSX.Element> {
  console.log(`[VERIFY_EMAIL_PAGE] Processing verification request with params:`, params);
  
  const { token } = await paramsCache.parse(params);
  if (!token) {
    console.warn(`[VERIFY_EMAIL_PAGE] No token provided in params`);
    return notFound();
  }
  
  console.log(`[VERIFY_EMAIL_PAGE] Verifying token: ${token}`);
  
  // Find the verification token
  // Using raw query to access userData field which may not be recognized by TypeScript
  const verificationTokens = await prisma.$queryRaw<Array<{
    identifier: string;
    token: string;
    expires: Date;
  }>>`
    SELECT identifier, token, expires
    FROM "VerificationToken"
    WHERE token = ${token}
  `;
  
  const verificationToken = verificationTokens[0];
  if (!verificationToken) {
    console.warn(`[VERIFY_EMAIL_PAGE] Token not found: ${token}`);
    return notFound();
  }
  
  console.log(`[VERIFY_EMAIL_PAGE] Token found for: ${verificationToken.identifier}`);
  
  // Check if token is expired
  if (isAfter(new Date(), verificationToken.expires)) {
    console.warn(`[VERIFY_EMAIL_PAGE] Token expired for: ${verificationToken.identifier}`);
    return redirect(
      `${Routes.VerifyEmailExpired}?email=${verificationToken.identifier}`
    );
  }
  
  // Check if a user with this email already exists and is verified
  // This is just a precaution - our new flow should handle this in the action
  const existingUser = await prisma.user.findFirst({
    where: { email: verificationToken.identifier },
    select: { emailVerified: true }
  });
  
  if (existingUser?.emailVerified) {
    console.log(`[VERIFY_EMAIL_PAGE] User already verified: ${verificationToken.identifier}`);
    return redirect(Routes.VerifyEmailSuccess);
  }
  
  console.log(`[VERIFY_EMAIL_PAGE] Processing verification with token: ${token}`);
  
  // Call the server action to handle verification and user creation
  await verifyEmailWithToken({ token: token });
  
  console.log(`[VERIFY_EMAIL_PAGE] Verification complete, redirecting to success page`);
  return redirect(Routes.VerifyEmailSuccess);
}
