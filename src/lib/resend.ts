import { Resend } from "resend";

import { env } from "@/lib/env";

/** Shared Resend client — one singleton reused by every email module
 * (auth flows, order confirmations), same rationale as lib/redis.ts. */
let resendClient: Resend | null | undefined;

export function getResendClient(): Resend | null {
  if (resendClient !== undefined) return resendClient;
  resendClient = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;
  return resendClient;
}

export const FROM_EMAIL =
  env.RESEND_FROM_EMAIL ?? "Lumora Digital <onboarding@resend.dev>";
