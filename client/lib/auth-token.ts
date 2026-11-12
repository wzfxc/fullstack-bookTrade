import { decodeJwtPayload } from './jwt';

export const AUTH_TOKEN_COOKIE_NAME = 'access_token';

const FALLBACK_MAX_AGE_SECONDS = 60 * 60;

export function getAuthToken(): string | null {
  const cookiePrefix = `${AUTH_TOKEN_COOKIE_NAME}=`;
  const tokenCookie = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(cookiePrefix));

  return tokenCookie ? decodeURIComponent(tokenCookie.slice(cookiePrefix.length)) : null;
}

export function saveAuthToken(token: string): void {
  const payload = decodeJwtPayload(token);
  const maxAgeSeconds = payload
    ? Math.max(payload.exp - Math.floor(Date.now() / 1000), 0)
    : FALLBACK_MAX_AGE_SECONDS;

  document.cookie = `${AUTH_TOKEN_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

export function clearAuthToken(): void {
  document.cookie = `${AUTH_TOKEN_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

