import { type TopicTag } from '../prisma-mappings';

export type TagDto = TopicTag & {
  // Any additional fields for the DTO can be added here
};
