'use server';

import { revalidateTag } from 'next/cache';

import { authActionClient } from '@/actions/safe-action';
import { Caching, StudyGroupCacheKey } from '@/data/caching';
import { prisma } from '@/lib/db/prisma';
import { NotFoundError } from '@/lib/validation/exceptions';
import { deleteActionItemSchema } from '@/schemas/contacts/delete-contact-task-schema'; // Using domain-aligned schema name

export const deleteActionItem = authActionClient
  .metadata({ actionName: 'deleteActionItem' })
  .schema(deleteActionItemSchema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    // Using the renamed ActionItem model
    const count = await (prisma as any).actionItem.count({
      where: {
        id: parsedInput.id,
        studySet: {
          studyGroupId: session.user.studyGroupId
        }
      }
    });
    if (count < 1) {
      throw new NotFoundError('Task not found');
    }

    // Using the renamed ActionItem model
    const deletedTask = await (prisma as any).actionItem.delete({
      where: { id: parsedInput.id },
      select: { studySetId: true }
    });

    revalidateTag(
      Caching.createStudyGroupTag(
        StudyGroupCacheKey.ContactTasks, // Will be renamed to ActionItems in future
        session.user.studyGroupId,
        deletedTask.studySetId
      )
    );
  });

// For backward compatibility during refactoring
export const deleteContactTask = deleteActionItem;
