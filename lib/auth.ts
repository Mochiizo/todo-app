import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE_NAME = "session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
export const SESSION_MAX_AGE_SECONDS = SESSION_DURATION_MS / 1000;

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET n'est pas défini.");
  }
  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  return `${expiresAt}.${sign(String(expiresAt))}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;

  const [expiresAtRaw, signature] = token.split(".");
  if (!expiresAtRaw || !signature) return false;

  const expected = sign(expiresAtRaw);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);

  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return false;
  }

  const expiresAt = Number(expiresAtRaw);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

export function verifyPassword(password: string): boolean {
  const expected = process.env.APP_PASSWORD;
  if (!expected) return false;

  const a = Buffer.from(password);
  const b = Buffer.from(expected);

  return a.length === b.length && timingSafeEqual(a, b);
}
