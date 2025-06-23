'use server';

import { revalidateTag } from 'next/cache';

import { authActionClient } from '@/actions/safe-action';
import { Caching, OrganizationCacheKey } from '@/data/caching';
import { prisma } from '@/lib/db/prisma';
import { NotFoundError } from '@/lib/validation/exceptions';
import { deleteInvitationSchema } from '@/schemas/invitations/delete-invitation-schema'; // Will be renamed to delete-study-group-invite-schema

export const deleteStudyGroupInvite = authActionClient
  .metadata({ actionName: 'deleteStudyGroupInvite' })
  .schema(deleteInvitationSchema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    // Using the renamed StudyGroupInvite model
    const count = await (prisma as any).studyGroupInvite.count({
      where: {
        studyGroupId: session.user.organizationId,
        id: parsedInput.id
      }
    });
    if (count < 1) {
      throw new NotFoundError('Invitation not found');
    }

    // Using the renamed StudyGroupInvite model
    await (prisma as any).studyGroupInvite.deleteMany({
      where: {
        studyGroupId: session.user.organizationId,
        id: parsedInput.id
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
export const deleteInvitation = deleteStudyGroupInvite;
