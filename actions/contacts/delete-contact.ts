'use server';

import { revalidateTag } from 'next/cache';

import { authActionClient } from '@/actions/safe-action';
import { Caching, StudyGroupCacheKey, UserCacheKey } from '@/data/caching';
import { prisma } from '@/lib/db/prisma';
import { NotFoundError } from '@/lib/validation/exceptions';
import { deleteContactSchema } from '@/schemas/contacts/delete-contact-schema';

export const deleteContact = authActionClient
  .metadata({ actionName: 'deleteContact' })
  .schema(deleteContactSchema)
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

    await prisma.$transaction([
      (prisma as any).studySetImage.deleteMany({
        where: { studySetId: parsedInput.id }
      }),
      (prisma as any).studySet.delete({
        where: { id: parsedInput.id },
        select: {
          id: true // SELECT NONE
        }
      })
    ]);

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

    revalidateTag(
      Caching.createUserTag(UserCacheKey.Favorites, session.user.id)
    );
  });
