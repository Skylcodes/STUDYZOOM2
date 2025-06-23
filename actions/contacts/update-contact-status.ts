'use server';

import { revalidateTag } from 'next/cache';

import { authActionClient } from '@/actions/safe-action';
import { Caching, StudyGroupCacheKey } from '@/data/caching';
import { updateContactAndCaptureEvent } from '@/lib/db/contact-event-capture';
import { prisma } from '@/lib/db/prisma';
import { NotFoundError } from '@/lib/validation/exceptions';
import { updateContactStageSchema } from '@/schemas/contacts/update-contact-stage-schema';

export const updateContactStage = authActionClient
  .metadata({ actionName: 'updateContactStage' })
  .schema(updateContactStageSchema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    // Using (prisma as any) for temporary typing workarounds during transition
    const count = await (prisma as any).studySet.count({
      where: {
        studyGroupId: session.user.studyGroupId,
        id: parsedInput.id
      }
    });
    if (count < 1) {
      throw new NotFoundError('Study set not found');
    }

    // Using type assertion to maintain backward compatibility during transition
    await updateContactAndCaptureEvent(
      parsedInput.id,
      { stage: parsedInput.stage } as any,
      session.user.id
    );

    revalidateTag(
      Caching.createStudyGroupTag(
        StudyGroupCacheKey.Contacts, // Using Contacts until StudySets is added to StudyGroupCacheKey
        session.user.studyGroupId
      )
    );
    revalidateTag(
      Caching.createStudyGroupTag(
        StudyGroupCacheKey.Contact, // Using Contact until StudySet is added to StudyGroupCacheKey
        session.user.studyGroupId,
        parsedInput.id
      )
    );
  });
