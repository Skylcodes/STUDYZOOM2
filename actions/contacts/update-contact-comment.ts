'use server';

import { revalidateTag } from 'next/cache';

import { authActionClient } from '@/actions/safe-action';
import { Caching, StudyGroupCacheKey } from '@/data/caching';
import { prisma } from '@/lib/db/prisma';
import { NotFoundError } from '@/lib/validation/exceptions';
import { updateContactCommentSchema } from '@/schemas/contacts/update-contact-comment-schema';

export const updateContactComment = authActionClient
  .metadata({ actionName: 'updateContactComment' })
  .schema(updateContactCommentSchema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    // Using (prisma as any) for temporary typing workarounds during transition
    const count = await (prisma as any).studySetComment.count({
      where: {
        id: parsedInput.id,
        studySet: {
          studyGroupId: session.user.studyGroupId
        }
      }
    });
    if (count < 1) {
      throw new NotFoundError('Study set comment not found');
    }

    // Using (prisma as any) for temporary typing workarounds during transition
    const comment = await (prisma as any).studySetComment.update({
      where: { id: parsedInput.id },
      data: { text: parsedInput.text },
      select: { studySetId: true }
    });

    revalidateTag(
      Caching.createStudyGroupTag(
        StudyGroupCacheKey.ContactTimelineEvents, // Using ContactTimelineEvents until StudySetTimelineEvents is added to StudyGroupCacheKey
        session.user.studyGroupId,
        comment.studySetId // Using studySetId from the domain model
      )
    );
  });
