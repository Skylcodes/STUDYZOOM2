import { StudySetStage } from '../../types/prisma-mappings';
import { z } from 'zod';

// Schema for updating study set stage (formerly contact stage)
export const updateContactStageSchema = z.object({
  id: z
    .string({
      required_error: 'Id is required.',
      invalid_type_error: 'Id must be a string.'
    })
    .trim()
    .uuid('Id is invalid.')
    .min(1, 'Id is required.')
    .max(36, 'Maximum 36 characters allowed.'),
  stage: z.nativeEnum(StudySetStage, {
    required_error: 'Stage is required',
    invalid_type_error: 'Stage must be a string'
  })
});

export type UpdateContactStageSchema = z.infer<typeof updateContactStageSchema>;

// For backward compatibility during refactoring
export const updateStudySetStageSchema = updateContactStageSchema;
export type UpdateStudySetStageSchema = UpdateContactStageSchema;
