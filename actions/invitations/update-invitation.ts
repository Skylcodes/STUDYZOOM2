'use server';

import { revalidateTag } from 'next/cache';
import { Role } from '../../types/prisma-mappings';
import { Prisma } from '@prisma/client';

import { authActionClient } from '@/actions/safe-action';
import { Caching, OrganizationCacheKey } from '@/data/caching';
import { isAdmin } from '@/lib/auth/permissions';
import { prisma } from '@/lib/db/prisma';
import { ForbiddenError, NotFoundError } from '@/lib/validation/exceptions';
import { updateInvitationSchema } from '@/schemas/invitations/update-invitation-schema'; // Will be renamed to update-study-group-invite-schema

export const updateStudyGroupInvite = authActionClient
  .metadata({ actionName: 'updateStudyGroupInvite' })
  .schema(updateInvitationSchema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    // Using the new model name from our schema with type assertion
    const invitation = await (prisma as any).studyGroupInvite.findFirst({
      where: {
        id: parsedInput.id,
        studyGroupId: session.user.organizationId
      },
      select: {
        email: true,
        role: true
      }
    });
    if (!invitation) {
      throw new NotFoundError('Invitation not found');
    }
    if (
      invitation.role !== Role.ADMIN &&
      parsedInput.role === Role.ADMIN &&
      !(await isAdmin(session.user.id))
    ) {
      throw new ForbiddenError('Insufficient permissions');
    }

    // Using the new model name from our schema with type assertion
    await (prisma as any).studyGroupInvite.update({
      where: { id: parsedInput.id },
      data: { role: parsedInput.role },
      select: {
        id: true // SELECT NONE
      }
    });

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.Invitations,
        session.user.organizationId // Will be renamed to studyGroupId in future
      )
    );
  });

// For backward compatibility during refactoring
export const updateInvitation = updateStudyGroupInvite;
