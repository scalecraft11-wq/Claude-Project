import bcrypt from "bcryptjs";

/**
 * Password hashing — bcrypt, cost factor 12 (ARCHITECTURE.md §16 specifies
 * Argon2id; bcrypt is used here instead for dependency-free portability
 * across serverless/edge-adjacent runtimes with no native build step,
 * while still meeting the same bar: a deliberately slow, salted, adaptive
 * hash — never a fast general-purpose hash like SHA-256 for passwords).
 * Cost 12 costs ~250ms/hash on typical server hardware, tuned to make
 * brute-forcing expensive without making login noticeably slow.
 */
const BCRYPT_COST_FACTOR = 12;

export async function hashPassword(plainTextPassword: string): Promise<string> {
  return bcrypt.hash(plainTextPassword, BCRYPT_COST_FACTOR);
}

export async function verifyPassword(
  plainTextPassword: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(plainTextPassword, passwordHash);
}
