import { createHash, randomBytes } from "node:crypto";

/**
 * Token lifecycle helpers shared by the email-verification and
 * password-reset flows.
 *
 * The raw token is what gets emailed to the user and is never persisted;
 * only its SHA-256 hash is stored (`EmailVerificationToken.tokenHash` /
 * `PasswordResetToken.tokenHash`). A stolen database export is then
 * useless for account takeover — the attacker would still need the raw
 * token, which only ever existed in an email already delivered to the
 * legitimate address.
 */

const RAW_TOKEN_BYTES = 32; // 256 bits of entropy

export function generateRawToken(): string {
  return randomBytes(RAW_TOKEN_BYTES).toString("base64url");
}

export function hashToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}

export const EMAIL_VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24h
export const PASSWORD_RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1h

export function tokenExpiryDate(ttlMs: number): Date {
  return new Date(Date.now() + ttlMs);
}

export function isTokenExpired(expiresAt: Date): boolean {
  return expiresAt.getTime() < Date.now();
}
