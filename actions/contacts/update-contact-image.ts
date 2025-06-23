'use server';

import { createHash } from 'crypto';
import { revalidateTag } from 'next/cache';

import { authActionClient } from '@/actions/safe-action';
import { Caching, StudyGroupCacheKey, UserCacheKey } from '@/data/caching';
import { updateContactAndCaptureEvent } from '@/lib/db/contact-event-capture'; // Will be renamed to study-set-event-capture
import { prisma } from '@/lib/db/prisma';
import { decodeBase64Image } from '@/lib/imaging/decode-base64-image';
import { resizeImage } from '@/lib/imaging/resize-image';
import { getContactImageUrl } from '@/lib/urls/get-contact-image-url'; // Will be renamed to get-study-set-image-url
import { NotFoundError } from '@/lib/validation/exceptions';
import { updateContactImageSchema } from '@/schemas/contacts/update-contact-image-schema';
import { FileUploadAction } from '@/types/file-upload-action';
import type { Maybe } from '@/types/maybe';

export const updateContactImage = authActionClient
  .metadata({ actionName: 'updateContactImage' })
  .schema(updateContactImageSchema)
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

    let imageUrl: Maybe<string> = undefined;

    if (parsedInput.action === FileUploadAction.Update && parsedInput.image) {
      const { buffer, mimeType } = decodeBase64Image(parsedInput.image);
      const data = await resizeImage(buffer, mimeType);
      const hash = createHash('sha256').update(data).digest('hex');

      // Using (prisma as any) for temporary typing workarounds during transition
      await prisma.$transaction([
        (prisma as any).studySetImage.deleteMany({
          where: { studySetId: parsedInput.id }
        }),
        (prisma as any).studySetImage.create({
          data: {
            studySetId: parsedInput.id,
            data,
            contentType: mimeType,
            hash
          }
        })
      ]);

      imageUrl = getContactImageUrl(parsedInput.id, hash);
    }
    if (parsedInput.action === FileUploadAction.Delete) {
      // Using (prisma as any) for temporary typing workarounds during transition
      await (prisma as any).studySetImage.deleteMany({
        where: { studySetId: parsedInput.id }
      });

      imageUrl = null;
    }

    // Using updateContactAndCaptureEvent temporarily until we create updateStudySetAndCaptureEvent
    // The 'image' property is now called 'filePath' in the StudySet model
    await updateContactAndCaptureEvent(
      parsedInput.id,
      { filePath: imageUrl } as any, // Using type assertion for backward compatibility
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
    revalidateTag(
      Caching.createUserTag(UserCacheKey.Favorites, session.user.id)
    );
  });
