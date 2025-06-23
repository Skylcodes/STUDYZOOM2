import 'server-only';

import { unstable_cache as cache } from 'next/cache';
import { redirect } from 'next/navigation';

import {
  Caching,
  defaultRevalidateTimeInSeconds,
  OrganizationCacheKey
} from '@/data/caching';
import { dedupedAuth } from '@/lib/auth';
import { getLoginRedirect } from '@/lib/auth/redirect';
import { checkSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import { ValidationError } from '@/lib/validation/exceptions';
import {
  getActionItemsSchema,
  type GetActionItemsSchema
} from '@/schemas/contacts/get-contact-tasks-schema'; // Will be renamed to get-action-items-schema
import type { ActionItemDto } from '@/types/dtos/contact-task-dto'; // Will be renamed to action-item-dto
import { SortDirection } from '@/types/sort-direction';

export async function getActionItems(
  input: GetActionItemsSchema
): Promise<ActionItemDto[]> {
  const session = await dedupedAuth();
  if (!checkSession(session)) {
    return redirect(getLoginRedirect());
  }

  const result = getActionItemsSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(JSON.stringify(result.error.flatten()));
  }
  const parsedInput = result.data;

  return cache(
    async () => {
      // Using the renamed ActionItem model
      const tasks = await (prisma as any).actionItem.findMany({
        where: {
          studySetId: parsedInput.contactId, // Will be renamed to studySetId in future
          studySet: {
            studyGroupId: session.user.organizationId
          }
        },
        select: {
          id: true,
          contactId: true,
          title: true,
          description: true,
          status: true,
          dueDate: true,
          createdAt: true
        },
        orderBy: {
          createdAt: SortDirection.Asc
        }
      });

      const mapped: ActionItemDto[] = tasks.map((task) => ({
        id: task.id,
        contactId: task.studySetId ?? undefined, // Will be renamed to studySetId in future
        title: task.title,
        description: task.description ?? undefined,
        status: task.status,
        dueDate: task.dueDate ?? undefined,
        createdAt: task.createdAt
      }));

      return mapped;
    },
    Caching.createOrganizationKeyParts(
      OrganizationCacheKey.ContactTasks,
      session.user.organizationId,
      parsedInput.contactId
    ),
    {
      revalidate: defaultRevalidateTimeInSeconds,
      tags: [
        Caching.createOrganizationTag(
          OrganizationCacheKey.ContactTasks, // Will be renamed to ActionItems in future
          session.user.organizationId,
          parsedInput.contactId
        )
      ]
    }
  )();
}

// Backward compatibility export
export const getContactTasks = getActionItems;
