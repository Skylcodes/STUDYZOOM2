'use server';

import { revalidateTag } from 'next/cache';
import { InviteStatus } from '../../types/prisma-mappings';

import { authActionClient } from '@/actions/safe-action';
import { Routes } from '@/constants/routes';
import { Caching, OrganizationCacheKey } from '@/data/caching';
import { prisma } from '@/lib/db/prisma';
import { sendInvitationEmail } from '@/lib/smtp/send-invitation-email';
import { getBaseUrl } from '@/lib/urls/get-base-url';
import { NotFoundError, PreConditionError } from '@/lib/validation/exceptions';
import { resendInvitationSchema } from '@/schemas/invitations/resend-invitation-schema';

export const resendInvitation = authActionClient
  .metadata({ actionName: 'resendInvitation' })
  .schema(resendInvitationSchema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    // Using the renamed StudyGroup model
    const organization = await (prisma as any).studyGroup.findFirst({
      where: { id: session.user.organizationId }, // Will be renamed to studyGroupId in future
      select: { name: true }
    });
    if (!organization) {
      throw new NotFoundError('Organization not found');
    }

    // Using the renamed StudyGroupInvite model
    const invitation = await (prisma as any).studyGroupInvite.findFirst({
      where: {
        id: parsedInput.id,
        studyGroupId: session.user.organizationId
      },
      select: {
        email: true,
        token: true,
        status: true
      }
    });
    if (!invitation) {
      throw new NotFoundError('Invitation not found');
    }

    if (invitation.status === InviteStatus.ACCEPTED) {
      throw new PreConditionError('Invitation already accepted');
    }
    if (invitation.status === InviteStatus.REVOKED) {
      throw new PreConditionError('Invitation was revoked');
    }

    await sendInvitationEmail({
      recipient: invitation.email,
      organizationName: organization.name,
      invitedByEmail: session.user.email,
      invitedByName: session.user.name,
      inviteLink: `${getBaseUrl()}/invitations/request/${invitation.token}` // Using direct path instead of Routes constant
    });

    // Using the renamed StudyGroupInvite model
    await (prisma as any).studyGroupInvite.update({
      where: {
        id: parsedInput.id,
        studyGroupId: session.user.organizationId
      },
      data: { lastSentAt: new Date() },
      select: {
        id: true // SELECT NONE
      }
    });

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.Invitations,
        session.user.organizationId
      )
    );
  });
