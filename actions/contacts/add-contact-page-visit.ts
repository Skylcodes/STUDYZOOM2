'use server';

import { revalidateTag } from 'next/cache';

import { authActionClient } from '@/actions/safe-action';
import { Caching, StudyGroupCacheKey } from '@/data/caching';
import { prisma } from '@/lib/db/prisma';
import { NotFoundError } from '@/lib/validation/exceptions';
import { addContactPageVisitSchema } from '@/schemas/contacts/add-contact-page-visit-schema';

export const addContactPageVisit = authActionClient
  .metadata({ actionName: 'addContactPageVisit' })
  .schema(addContactPageVisitSchema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    // Using (prisma as any) for temporary typing workarounds during transition
    const countContacts = await (prisma as any).studySet.count({
      where: {
        studyGroupId: session.user.studyGroupId,
        id: parsedInput.contactId
      }
    });
    if (countContacts < 1) {
      throw new NotFoundError('Study set not found');
    }

    // Using (prisma as any) for temporary typing workarounds during transition
    await (prisma as any).studySetPageVisit.create({
      data: {
        studySetId: parsedInput.contactId, // Using contactId for backward compatibility
        userId: session.user.id
      },
      select: {
        id: true // SELECT NONE
      }
    });

    revalidateTag(
      Caching.createStudyGroupTag(
        StudyGroupCacheKey.ContactPageVisits, // Using ContactPageVisits until StudySetPageVisits is added to StudyGroupCacheKey
        session.user.studyGroupId
      )
    );
  });
