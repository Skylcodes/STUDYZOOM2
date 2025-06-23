// No longer using invitation-related imports

import { prisma } from '@/lib/db/prisma';

/**
 * Clean up verification-related records for a verified email
 * 
 * This function is called after a user's email has been verified to clean up
 * any related verification tokens and requests. It does NOT set the user's
 * emailVerified field as that is now handled during the verification process.
 * 
 * @param email The verified email address
 */
export async function cleanupVerificationRecords(email: string): Promise<void> {
  console.log(`[VERIFICATION] Cleaning up verification records for: ${email}`);
  
  await prisma.$transaction([
    // Expire all verification tokens for this email
    prisma.verificationToken.updateMany({
      where: { identifier: email },
      data: { expires: new Date(+0) }
    }),
    // Delete any change email requests
    prisma.changeEmailRequest.deleteMany({
      where: { email }
    }),
    // Delete any reset password requests
    prisma.resetPasswordRequest.deleteMany({
      where: { email }
    }),
    // No longer updating invitations as they've been removed
    // Note: We no longer update the user's emailVerified field here
    // as that is now handled during the verification process in verify-email-with-token.ts
  ]);
  
  console.log(`[VERIFICATION] Successfully cleaned up verification records for: ${email}`);
}

// The deprecated verifyEmail function has been removed.
// All code should now use cleanupVerificationRecords instead, along with
// explicitly setting emailVerified when needed.
