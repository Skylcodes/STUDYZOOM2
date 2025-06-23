import { z } from 'zod';

// Helper function for creating social media field validators
const createSocialMediaField = (name: string) => {
  return z
    .string({
      required_error: `${name} URL is required.`,
      invalid_type_error: `${name} URL must be a string.`
    })
    .trim()
    .url(`Enter a valid ${name} URL.`)
    .max(2000, `Maximum 2000 characters allowed.`)
    .optional()
    .or(z.literal(''));
};

// Schema for updating study group social media profiles (formerly organization social media)
export const updateStudyGroupSocialMediaSchema = z.object({
  linkedInProfile: createSocialMediaField('LinkedIn'),
  instagramProfile: createSocialMediaField('Instagram'),
  youTubeChannel: createSocialMediaField('YouTube'),
  xProfile: createSocialMediaField('X (Twitter)'),
  tikTokProfile: createSocialMediaField('TikTok'),
  facebookPage: createSocialMediaField('Facebook')
});

export type UpdateStudyGroupSocialMediaSchema = z.infer<typeof updateStudyGroupSocialMediaSchema>;

// For backward compatibility during refactoring
export const updateSocialMediaSchema = updateStudyGroupSocialMediaSchema;
export type UpdateSocialMediaSchema = UpdateStudyGroupSocialMediaSchema;
