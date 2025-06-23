import { createHash, randomBytes } from 'crypto';
import { isAfter } from 'date-fns';

import { isString } from '@/lib/validation/is-string';

export const API_KEY_PREFIX = 'api_';
export const API_KEY_RANDOM_SIZE = 16;
export const API_KEY_LENGTH = API_KEY_RANDOM_SIZE * 2 + API_KEY_PREFIX.length;

export function generateApiKey(): string {
  return `${API_KEY_PREFIX}${randomBytes(API_KEY_RANDOM_SIZE).toString('hex')}`;
}

export function hashApiKey(apiKey: string): string {
  return createHash('sha256').update(apiKey).digest('hex');
}

type ErrorResult = {
  success: false;
  errorMessage: string;
};

type SuccessResult = {
  success: true;
  id: string;
  userId: string;
};

// Note: This function is a placeholder since we've removed the ApiKey model
// In the future, we can implement API keys associated with users directly
export async function verifyApiKey(token: string) {
  return {
    success: false,
    errorMessage: 'API key functionality is not available in this version'
  } as ErrorResult;
}
