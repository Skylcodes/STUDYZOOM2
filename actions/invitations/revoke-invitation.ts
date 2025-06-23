'use server';

import { revalidateTag } from 'next/cache';
import { InviteStatus } from '../../types/prisma-mappings';

import { authActionClient } from '@/actions/safe-action';
import { Caching, OrganizationCacheKey } from '@/data/caching';
import { prisma } from '@/lib/db/prisma';
import { sendRevokedInvitationEmail } from '@/lib/smtp/send-revoked-invitation-email';
import { NotFoundError } from '@/lib/validation/exceptions';
import { revokeInvitationSchema } from '@/schemas/invitations/revoke-invitation-schema';

export const revokeInvitation = authActionClient
  .metadata({ actionName: 'revokeInvitation' })
  .schema(revokeInvitationSchema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    // Using the renamed StudyGroupInvite model
    const invitation = await (prisma as any).studyGroupInvite.findFirst({
      where: {
        studyGroupId: session.user.organizationId,
        id: parsedInput.id
      },
      select: {
        status: true,
        email: true,
        studyGroup: {
          select: {
            name: true
          }
        }
      }
    });
    if (!invitation) {
      throw new NotFoundError('Invitation not found');
    }

    // Using the renamed StudyGroupInvite model
    await (prisma as any).studyGroupInvite.updateMany({
      where: {
        studyGroupId: session.user.organizationId,
        id: parsedInput.id,
        AND: [
          { NOT: { status: { equals: InviteStatus.ACCEPTED } } },
          { NOT: { status: { equals: InviteStatus.REVOKED } } }
        ]
      },
      data: {
        status: InviteStatus.REVOKED
      }
    });

    if (
      invitation.status !== InviteStatus.REVOKED &&
      invitation.status !== InviteStatus.ACCEPTED
    ) {
      try {
        await sendRevokedInvitationEmail({
          recipient: invitation.email,
          organizationName: invitation.studyGroup.name
        });
      } catch (e) {
        console.error(e);
      }
    }

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.Invitations,
        session.user.organizationId // Will be renamed to studyGroupId in future
      )
    );
  });
