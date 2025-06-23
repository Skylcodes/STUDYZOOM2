import { type ContactRecord } from '../prisma-mappings';

export type VisitedContactDto = {
  id: string;
  name: string;
  image?: string;
  record: ContactRecord;
  pageVisits: number;
};
