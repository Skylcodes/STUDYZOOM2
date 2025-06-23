'use server';

import { revalidateTag } from 'next/cache';
import { InviteStatus, Role } from '../../types/prisma-mappings';

import { authActionClient } from '@/actions/safe-action';
import { Routes } from '@/constants/routes';
import { Caching, OrganizationCacheKey } from '@/data/caching';
import { isAdmin } from '@/lib/auth/permissions';
import { prisma } from '@/lib/db/prisma';
import { sendInvitationEmail } from '@/lib/smtp/send-invitation-email';
import { getBaseUrl } from '@/lib/urls/get-base-url';
import {
  ForbiddenError,
  NotFoundError,
  PreConditionError
} from '@/lib/validation/exceptions';
import { sendInvitationSchema } from '@/schemas/invitations/send-invitation-schema';

export const sendInvitation = authActionClient
  .metadata({ actionName: 'sendInvitation' })
  .schema(sendInvitationSchema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    if (parsedInput.role === Role.ADMIN && !(await isAdmin(session.user.id))) {
      throw new ForbiddenError('Insufficient permissions');
    }

    const [countUsers, countInvitations] = await prisma.$transaction([
      prisma.user.count({
        where: {
          email: parsedInput.email
        }
      }),
      (prisma as any).studyGroupInvite.count({
        where: {
          email: parsedInput.email,
          studyGroupId: session.user.organizationId,
          status: {
            not: InviteStatus.REVOKED
          }
        }
      })
    ]);
    if (countUsers > 0 || countInvitations > 0) {
      throw new PreConditionError('Email address is already taken');
    }

    const organization = await (prisma as any).studyGroup.findFirst({
      where: { id: session.user.organizationId },
      select: { name: true }
    });
    if (!organization) {
      throw new NotFoundError('Organization not found');
    }

    const [, invitation] = await prisma.$transaction([
      (prisma as any).studyGroupInvite.updateMany({
        where: {
          studyGroupId: session.user.organizationId,
          email: parsedInput.email,
          AND: [
            { NOT: { status: { equals: InviteStatus.ACCEPTED } } },
            { NOT: { status: { equals: InviteStatus.REVOKED } } }
          ]
        },
        data: {
          status: InviteStatus.REVOKED
        }
      }),
      (prisma as any).studyGroupInvite.create({
        data: {
          email: parsedInput.email,
          role: parsedInput.role,
          studyGroupId: session.user.organizationId
        },
        select: {
          id: true,
          role: true,
          email: true,
          token: true
        }
      })
    ]);

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.Invitations,
        session.user.organizationId // Will be renamed to studyGroupId in future
      )
    );

    await sendInvitationEmail({
      recipient: parsedInput.email,
      organizationName: organization.name,
      invitedByEmail: session.user.email,
      invitedByName: session.user.name,
      inviteLink: `${getBaseUrl()}/invitations/request/${invitation.token}` // Using direct path instead of Routes constant
    });

    await (prisma as any).studyGroupInvite.update({
      where: {
        id: invitation.id,
        studyGroupId: session.user.organizationId
      },
      data: { lastSentAt: new Date() },
      select: {
        id: true // SELECT NONE
      }
    });
  });
