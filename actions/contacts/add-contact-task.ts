'use server';

import { revalidateTag } from 'next/cache';

import { authActionClient } from '@/actions/safe-action';
import { Caching, StudyGroupCacheKey } from '@/data/caching';
import { prisma } from '@/lib/db/prisma';
import { NotFoundError } from '@/lib/validation/exceptions';
import { addActionItemSchema } from '@/schemas/contacts/add-contact-task-schema'; // Using domain-aligned schema name

export const addActionItem = authActionClient
  .metadata({ actionName: 'addActionItem' })
  .schema(addActionItemSchema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    // Using the renamed StudySet model
    const count = await (prisma as any).studySet.count({
      where: {
        id: parsedInput.contactId,
        studyGroupId: session.user.studyGroupId
      }
    });
    if (count < 1) {
      throw new NotFoundError('StudySet not found.');
    }

    // Using the renamed ActionItem model
    await (prisma as any).actionItem.create({
      data: {
        studySetId: parsedInput.contactId, // Will be renamed to studySetId in schema
        title: parsedInput.title,
        description: parsedInput.description,
        status: parsedInput.status,
        dueDate: parsedInput.dueDate ? parsedInput.dueDate : null
      },
      select: {
        id: true // SELECT NONE
      }
    });

    revalidateTag(
      Caching.createStudyGroupTag(
        StudyGroupCacheKey.ContactTasks, // Will be renamed to ActionItems in future
        session.user.studyGroupId,
        parsedInput.contactId // Will be renamed to studySetId in schema
      )
    );
  });

// For backward compatibility during refactoring
export const addContactTask = addActionItem;
