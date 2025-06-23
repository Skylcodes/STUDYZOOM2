import 'server-only';

import { unstable_cache as cache } from 'next/cache';
import { redirect } from 'next/navigation';

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
import type { WebhookDto } from '@/types/dtos/webhook-dto';
import { SortDirection } from '@/types/sort-direction';

export async function getWebhooks(): Promise<WebhookDto[]> {
  const session = await dedupedAuth();
  if (!checkSession(session)) {
    return redirect(getLoginRedirect());
  }

  return cache(
    async () => {
      const webhooks = await (prisma as any).webhook.findMany({
        where: { studyGroupId: session.user.studyGroupId || session.user.organizationId },
        select: {
          id: true,
          url: true,
          triggers: true,
          secret: true
        },
        orderBy: {
          createdAt: SortDirection.Asc
        }
      });

      const response: WebhookDto[] = webhooks.map((webhook) => ({
        id: webhook.id,
        url: webhook.url,
        triggers: webhook.triggers,
        secret: webhook.secret ?? undefined
      }));

      return response;
    },
    Caching.createStudyGroupKeyParts(
      StudyGroupCacheKey.Webhooks,
      session.user.studyGroupId || session.user.organizationId
    ),
    {
      revalidate: defaultRevalidateTimeInSeconds,
      tags: [
        Caching.createStudyGroupTag(
          StudyGroupCacheKey.Webhooks,
          session.user.studyGroupId || session.user.organizationId
        )
      ]
    }
  )();
}
