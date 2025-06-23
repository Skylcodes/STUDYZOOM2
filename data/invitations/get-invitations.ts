import 'server-only';

import { unstable_cache as cache } from 'next/cache';
import { redirect } from 'next/navigation';
// Import from prisma-mappings instead of @prisma/client
import { InviteStatus } from '@/types/prisma-mappings';

import {
  Caching,
  defaultRevalidateTimeInSeconds,
  OrganizationCacheKey,
  StudyGroupCacheKey
} from '@/data/caching';
import { dedupedAuth } from '@/lib/auth';
import { getLoginRedirect } from '@/lib/auth/redirect';
import { checkSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import type { InvitationDto } from '@/types/dtos/invitation-dto';
import { SortDirection } from '@/types/sort-direction';

export async function getInvitations(): Promise<InvitationDto[]> {
  const session = await dedupedAuth();
  if (!checkSession(session)) {
    return redirect(getLoginRedirect());
  }

  return cache(
    async () => {
      const invitations = await (prisma as any).studyGroupInvite.findMany({
        where: {
          studyGroupId: session.user.studyGroupId || session.user.organizationId,
          NOT: { status: { equals: InviteStatus.ACCEPTED } }
        },
        select: {
          id: true,
          token: true,
          status: true,
          email: true,
          role: true,
          createdAt: true,
          lastSentAt: true
        },
        orderBy: {
          createdAt: SortDirection.Asc
        }
      });

      const response: InvitationDto[] = invitations.map((invitation) => ({
        id: invitation.id,
        token: invitation.token,
        status: invitation.status,
        email: invitation.email,
        role: invitation.role,
        lastSent: invitation.lastSentAt ?? undefined,
        dateAdded: invitation.createdAt
      }));

      return response;
    },
    Caching.createStudyGroupKeyParts(
      StudyGroupCacheKey.Invitations,
      session.user.studyGroupId || session.user.organizationId
    ),
    {
      revalidate: defaultRevalidateTimeInSeconds,
      tags: [
        Caching.createStudyGroupTag(
          StudyGroupCacheKey.Invitations,
          session.user.studyGroupId || session.user.organizationId
        )
      ]
    }
  )();
}
