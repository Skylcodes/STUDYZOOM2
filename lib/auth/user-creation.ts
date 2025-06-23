import { Role, User } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { matchLocale } from '@/lib/i18n/match-locale';
import { logger } from '@/lib/logger';

/**
 * Creates a new user without any organization context
 * 
 * @param input User creation parameters
 * @returns The created user
 */
export async function createUser(input: {
  name: string;
  email: string;
  hashedPassword: string;
  locale?: string;
  emailVerified?: Date;
}): Promise<{ id: string; name: string; email: string }> {
  logger.info('Creating new user', { email: input.email });
  
  const locale = matchLocale(input.locale);
  
  // Create the user
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: input.hashedPassword,
      role: Role.ADMIN, // Default role for new users
      locale,
      completedOnboarding: false,
      emailVerified: input.emailVerified
    },
    select: {
      id: true,
      name: true,
      email: true
    }
  });

  logger.info('User created successfully', { userId: user.id });
  
  return {
    id: user.id,
    name: user.name,
    email: user.email || input.email // Fallback in case email is null
  };
}

/**
 * Cleans up any pending requests for a user
 * 
 * @param email The user's email
 */
export async function cleanupUserRequests(email: string): Promise<void> {
  logger.info('Cleaning up user requests', { email });
  
  await prisma.$transaction([
    prisma.changeEmailRequest.deleteMany({
      where: { email }
    }),
    prisma.resetPasswordRequest.deleteMany({
      where: { email }
    }),
    prisma.verificationToken.updateMany({
      where: { identifier: email },
      data: { expires: new Date(+0) }
    })
  ]);
  
  logger.info('User requests cleaned up', { email });
}
