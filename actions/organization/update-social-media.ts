'use server';

import { revalidateTag } from 'next/cache';

import { authActionClient } from '@/actions/safe-action';
import { Caching, StudyGroupCacheKey } from '@/data/caching';
import { prisma } from '@/lib/db/prisma';
import { NotFoundError } from '@/lib/validation/exceptions';
import { updateStudyGroupSocialMediaSchema } from '@/schemas/organization/update-social-media-schema';

export const updateStudyGroupSocialMedia = authActionClient
  .metadata({ actionName: 'updateStudyGroupSocialMedia' })
  .schema(updateStudyGroupSocialMediaSchema)
  .action(async ({ parsedInput, ctx: { session } }) => {
    // Using (prisma as any) for temporary typing workarounds during transition
    const count = await (prisma as any).studyGroup.count({
      where: { id: session.user.studyGroupId }
    });
    if (count < 1) {
      throw new NotFoundError('Study group not found');
    }

    // Using (prisma as any) for temporary typing workarounds during transition
    await (prisma as any).studyGroup.update({
      where: { id: session.user.studyGroupId },
      data: {
        linkedInProfile: parsedInput.linkedInProfile,
        instagramProfile: parsedInput.instagramProfile,
        youTubeChannel: parsedInput.youTubeChannel,
        xProfile: parsedInput.xProfile,
        tikTokProfile: parsedInput.tikTokProfile,
        facebookPage: parsedInput.facebookPage
      },
      select: {
        id: true // SELECT NONE
      }
    });

    revalidateTag(
      Caching.createStudyGroupTag(
        StudyGroupCacheKey.SocialMedia, // Will be renamed or removed in future
        session.user.studyGroupId
      )
    );
  });

// For backward compatibility during refactoring
export const updateSocialMedia = updateStudyGroupSocialMedia;
