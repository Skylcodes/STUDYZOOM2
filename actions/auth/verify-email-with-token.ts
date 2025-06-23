'use server';

import { redirect } from 'next/navigation';
import { isAfter } from 'date-fns';

import { actionClient } from '@/actions/safe-action';
import { Routes } from '@/constants/routes';
import { signIn } from '@/lib/auth';
import { createUser } from '@/lib/auth/user-creation';
import { cleanupVerificationRecords } from '@/lib/auth/verification';
import { prisma } from '@/lib/db/prisma';
import { sendWelcomeEmail } from '@/lib/smtp/send-welcome-email';
import { NotFoundError } from '@/lib/validation/exceptions';
import { verifyEmailWithTokenSchema } from '@/schemas/auth/verify-email-with-token-schema';

export const verifyEmailWithToken = actionClient
  .metadata({ actionName: 'verifyEmailWithToken' })
  .schema(verifyEmailWithTokenSchema)
  .action(async ({ parsedInput }) => {
    console.log(`[VERIFY_EMAIL] Processing verification token: ${parsedInput.token}`);
    
    // Find the verification token using Prisma's typed API
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token: parsedInput.token },
      select: {
        identifier: true,
        token: true,
        expires: true,
        userData: true
      }
    });
    
    if (!verificationToken) {
      console.error(`[VERIFY_EMAIL] Verification token not found: ${parsedInput.token}`);
      // Redirect to invalid token page instead of throwing an error
      return redirect(Routes.VerifyEmailInvalid);
    }
    
    console.log(`[VERIFY_EMAIL] Found token for email: ${verificationToken.identifier}`);
    
    // Check if token is expired
    if (isAfter(new Date(), verificationToken.expires)) {
      console.warn(`[VERIFY_EMAIL] Token expired for: ${verificationToken.identifier}`);
      return redirect(
        `${Routes.VerifyEmailExpired}?email=${verificationToken.identifier}`
      );
    }
    
    // Check if user already exists (might happen in edge cases)
    const existingUser = await prisma.user.findFirst({
      where: { email: verificationToken.identifier },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true
      }
    });
    
    // If user already exists and is verified, just redirect
    if (existingUser?.emailVerified) {
      console.log(`[VERIFY_EMAIL] User already verified: ${verificationToken.identifier}`);
      return redirect(Routes.VerifyEmailSuccess);
    }
    
    let userId: string;
    let userName: string;
    let userEmail: string | null;
    
    // If userData exists, create the user now
    if (verificationToken.userData) {
      try {
        console.log(`[VERIFY_EMAIL] Creating user from stored data for: ${verificationToken.identifier}`);
        const userData = JSON.parse(verificationToken.userData);
        
        // Create user
        const user = await createUser({
          name: userData.name,
          email: userData.email,
          hashedPassword: userData.hashedPassword,
          locale: userData.locale,
          emailVerified: new Date() // Set email as verified immediately
        });
        
        userId = user.id;
        userName = user.name;
        userEmail = user.email;
        
        console.log(`[VERIFY_EMAIL] Successfully created user: ${userId} (${userEmail})`);
      } catch (error) {
        console.error(`[VERIFY_EMAIL] Error creating user: ${error}`);
        throw new Error(`Failed to create user account: ${error instanceof Error ? error.message : String(error)}`);
      }
    } 
    // If existing user but not verified, mark as verified
    else if (existingUser) {
      console.log(`[VERIFY_EMAIL] Verifying existing user: ${existingUser.id}`);
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { emailVerified: new Date() }
      });
      
      userId = existingUser.id;
      userName = existingUser.name;
      userEmail = existingUser.email;
    } 
    // No user data and no existing user - this shouldn't happen with our new flow
    else {
      console.error(`[VERIFY_EMAIL] No user data found for: ${verificationToken.identifier}`);
      throw new NotFoundError('User data not found for verification.');
    }
    
    // Delete the verification token as it's been used
    await prisma.verificationToken.delete({
      where: { token: parsedInput.token }
    });
    
    // Clean up any remaining verification-related records
    try {
      console.log(`[VERIFY_EMAIL] Cleaning up verification records for: ${verificationToken.identifier}`);
      await cleanupVerificationRecords(verificationToken.identifier);
    } catch (error) {
      console.error(`[VERIFY_EMAIL] Error cleaning up verification records: ${error}`);
      // Continue with the process even if cleanup fails
    }
    
    // Send welcome email
    if (userName && userEmail) {
      console.log(`[VERIFY_EMAIL] Sending welcome email to: ${userEmail}`);
      await sendWelcomeEmail({
        name: userName,
        recipient: userEmail
      });
    }
    
    // Instead of auto-signin which would fail without password,
    // redirect to login page with success message
    console.log(`[VERIFY_EMAIL] Email verification successful for: ${userEmail}`);
    return redirect(`${Routes.Login}?verified=true&email=${encodeURIComponent(verificationToken.identifier)}`);
  });
