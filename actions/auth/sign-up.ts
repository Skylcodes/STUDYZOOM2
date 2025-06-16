'use server';

import { redirect } from 'next/navigation';
import { addHours } from 'date-fns';
import { returnValidationErrors } from 'next-safe-action';

import { actionClient } from '@/actions/safe-action';
import { EMAIL_VERIFICATION_EXPIRY_HOURS } from '@/constants/limits';
import { Routes } from '@/constants/routes';
import { createUserWithOrganization } from '@/lib/auth/organization';
import { hashPassword } from '@/lib/auth/password';
import { createHash, randomString } from '@/lib/auth/utils';
import { prisma } from '@/lib/db/prisma';
import { sendVerifyEmailAddressEmail } from '@/lib/smtp/send-verify-email-address-email';
import { getBaseUrl } from '@/lib/urls/get-base-url';
import { signUpSchema } from '@/schemas/auth/sign-up-schema';

export const signUp = actionClient
  .metadata({ actionName: 'signUp' })
  .schema(signUpSchema)
  .action(async ({ parsedInput }) => {
    console.log(`[SIGNUP] Processing signup for email: ${parsedInput.email}`);
    
    const normalizedEmail = parsedInput.email.toLowerCase();
    console.log(`[SIGNUP] Checking if email already exists: ${normalizedEmail}`);
    
    const count = await prisma.user.count({
      where: { email: normalizedEmail }
    });
    
    if (count > 0) {
      console.warn(`[SIGNUP] Email already taken: ${normalizedEmail}`);
      return returnValidationErrors(signUpSchema, {
        email: {
          _errors: ['Email address is already taken.']
        }
      });
    }
    
    console.log(`[SIGNUP] Email is available: ${normalizedEmail}`);
    

    console.log(`[SIGNUP] Hashing password for user: ${normalizedEmail}`);
    const hashedPassword = await hashPassword(parsedInput.password);

    // Generate verification token
    console.log(`[SIGNUP] Generating verification token for: ${normalizedEmail}`);
    const otp = randomString(3).toUpperCase();
    const hashedOtp = await createHash(`${otp}${process.env.AUTH_SECRET}`);
    
    // Store user data in the verification token instead of creating the user immediately
    // This way, we only create the user after email verification is confirmed
    const userData = {
      name: parsedInput.name,
      email: normalizedEmail,
      hashedPassword,
      locale: 'en-US'
    };
    
    // Serialize user data to JSON for storage in the token
    const serializedUserData = JSON.stringify(userData);
    
    console.log(`[SIGNUP] Creating verification token with user data for: ${normalizedEmail}`);
    // Create verification token in database with user data
    // Using $executeRaw to bypass TypeScript checking since userData is a new field
    // that may not be recognized by the TypeScript types yet
    await prisma.$executeRaw`
      INSERT INTO "VerificationToken" (identifier, token, expires, "userData")
      VALUES (${normalizedEmail}, ${hashedOtp}, ${addHours(new Date(), EMAIL_VERIFICATION_EXPIRY_HOURS)}, ${serializedUserData})
    `;

    // Send verification email - if this fails, the error will propagate
    // and the entire sign-up action will fail, preventing the redirect
    await sendVerifyEmailAddressEmail({
      recipient: normalizedEmail,
      name: parsedInput.name,
      otp,
      verificationLink: `${getBaseUrl()}${Routes.VerifyEmailRequest}/${hashedOtp}`
    });

    return redirect(
      `${Routes.VerifyEmail}?email=${encodeURIComponent(parsedInput.email)}`
    );
  });
