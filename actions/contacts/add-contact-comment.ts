'use server';

import { revalidateTag } from 'next/cache';

import { authActionClient } from '@/actions/safe-action';
import { Caching, StudyGroupCacheKey } from '@/data/caching';
import { prisma } from '@/lib/db/prisma';
import { addContactCommentSchema } from '@/schemas/contacts/add-contact-comment-schema';

export const addContactComment = authActionClient
  .metadata({ actionName: 'addContactComment' })
  .schema(addContactCommentSchema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    // Using (prisma as any) for temporary typing workarounds during transition
    await (prisma as any).studySetComment.create({
      data: {
        studySetId: parsedInput.contactId, // Using contactId for backward compatibility
        text: parsedInput.text,
        userId: session.user.id
      },
      select: {
        id: true // SELECT NONE
      }
    });

    revalidateTag(
      Caching.createStudyGroupTag(
        StudyGroupCacheKey.ContactTimelineEvents, // Using ContactTimelineEvents until StudySetTimelineEvents is added to StudyGroupCacheKey
        session.user.studyGroupId,
        parsedInput.contactId // Using contactId from input for backward compatibility
      )
    );
  });
