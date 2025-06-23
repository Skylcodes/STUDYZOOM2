'use server';

import { revalidateTag } from 'next/cache';

import { authActionClient } from '@/actions/safe-action';
import { Caching, StudyGroupCacheKey } from '@/data/caching';
import { prisma } from '@/lib/db/prisma';
import { updateActionItemSchema } from '@/schemas/contacts/update-contact-task-schema';

export const updateActionItem = authActionClient
  .metadata({ actionName: 'updateActionItem' })
  .schema(updateActionItemSchema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    // Using the renamed ActionItem model
    const task = await (prisma as any).actionItem.update({
      where: {
        id: parsedInput.id,
        studySet: {
          studyGroupId: session.user.studyGroupId
        }
      },
      data: {
        title: parsedInput.title,
        description: parsedInput.description,
        status: parsedInput.status,
        dueDate: parsedInput.dueDate ? parsedInput.dueDate : null
      },
      select: { studySetId: true }
    });

    revalidateTag(
      Caching.createStudyGroupTag(
        StudyGroupCacheKey.ContactTasks, // Will be renamed to ActionItems in future
        session.user.studyGroupId,
        task.studySetId
      )
    );
  });

// For backward compatibility during refactoring
export const updateContactTask = updateActionItem;
