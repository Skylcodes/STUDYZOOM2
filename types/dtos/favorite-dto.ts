import { type ContactRecord } from '../prisma-mappings';

export type FavoriteDto = {
  id: string;
  order: number;
  contactId: string;
  name: string;
  record: ContactRecord;
  image?: string;
};
