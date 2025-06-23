'use server';

import { revalidateTag } from 'next/cache';

import { authActionClient } from '@/actions/safe-action';
import { Caching, StudyGroupCacheKey, UserCacheKey } from '@/data/caching';
import { prisma } from '@/lib/db/prisma';
import { deleteContactsSchema } from '@/schemas/contacts/delete-contacts-schema';

export const deleteContacts = authActionClient
  .metadata({ actionName: 'deleteContacts' })
  .schema(deleteContactsSchema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    // Using (prisma as any) for temporary typing workarounds during transition
    await (prisma as any).studySet.deleteMany({
      where: {
        id: {
          in: parsedInput.ids
        },
        studyGroupId: session.user.studyGroupId
      }
    });

    revalidateTag(
      Caching.createStudyGroupTag(
        StudyGroupCacheKey.Contacts, // Using Contacts until StudySets is added to StudyGroupCacheKey
        session.user.studyGroupId
      )
    );

    for (const id of parsedInput.ids) {
      revalidateTag(
        Caching.createStudyGroupTag(
          StudyGroupCacheKey.Contact, // Using Contact until StudySet is added to StudyGroupCacheKey
          session.user.studyGroupId,
          id
        )
      );
    }

    revalidateTag(
      Caching.createUserTag(UserCacheKey.Favorites, session.user.id)
    );
  });
