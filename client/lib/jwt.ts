export interface JwtPayload {
  sub: string;
  exp: number;
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const encodedPayload = token.split('.')[1];
    const base64 = encodedPayload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    return JSON.parse(atob(paddedBase64)) as JwtPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  return !payload || payload.exp * 1000 <= Date.now();
}

