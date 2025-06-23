import 'server-only';

import { hash } from '@node-rs/bcrypt';
import { revalidatePath } from 'next/cache';

import { authActionClient } from '@/actions/auth/auth-action-client';
import { prisma } from '@/lib/db/prisma';
import { joinSchema } from '@/schemas/auth/join-schema';

export const join = authActionClient(
  async ({ session, input }) => {
    const result = joinSchema.safeParse(input);
    if (!result.success) {
      return {
        error: 'Invalid input'
      };
    }

    const { invitationId, password } = result.data;

    // Find the invitation
    const invitation = await prisma.invitation.findUnique({
      where: {
        id: invitationId,
        status: 'PENDING'
      }
    });

    if (!invitation) {
      return {
        error: 'Invitation not found or already used'
      };
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: invitation.email
      }
    });

    if (existingUser) {
      return {
        error: 'User already exists'
      };
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create the user
    await prisma.user.create({
      data: {
        email: invitation.email,
        name: invitation.name,
        password: hashedPassword,
        studyGroupId: invitation.studyGroupId,
        role: 'MEMBER'
      }
    });

    // Update the invitation status
    await prisma.invitation.update({
      where: {
        id: invitationId
      },
      data: {
        status: 'ACCEPTED'
      }
    });

    // Revalidate paths
    revalidatePath('/auth/login');
    revalidatePath('/invitations');

    return { success: true };
  }
);
