'use server';

import { revalidateTag } from 'next/cache';

import { authActionClient } from '@/actions/safe-action';
import { Caching, StudyGroupCacheKey } from '@/data/caching';
import { prisma } from '@/lib/db/prisma';
import { NotFoundError } from '@/lib/validation/exceptions';
import { deleteContactCommentSchema } from '@/schemas/contacts/delete-contact-comment-schema';

export const deleteContactComment = authActionClient
  .metadata({ actionName: 'deleteContactComment' })
  .schema(deleteContactCommentSchema)
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
    const comment = await (prisma as any).studySetComment.delete({
      where: { id: parsedInput.id },
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
