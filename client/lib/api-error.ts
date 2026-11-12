import { isAxiosError } from 'axios';

const FALLBACK_ERROR_MESSAGE = 'Something went wrong. Please try again.';
const NETWORK_ERROR_MESSAGE = 'Network error. Please check your connection.';

export function getErrorMessage(error: unknown): string {
  if (!isAxiosError(error)) {
    return FALLBACK_ERROR_MESSAGE;
  }

  if (!error.response) {
    return NETWORK_ERROR_MESSAGE;
  }

  const message: unknown = error.response.data?.message;

  if (Array.isArray(message)) {
    return message.join(', ');
  }

  return typeof message === 'string' ? message : FALLBACK_ERROR_MESSAGE;
}

