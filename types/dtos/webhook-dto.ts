import { type WebhookTrigger } from '../prisma-mappings';

export type WebhookDto = {
  id: string;
  url: string;
  triggers: WebhookTrigger[];
  secret?: string;
};
