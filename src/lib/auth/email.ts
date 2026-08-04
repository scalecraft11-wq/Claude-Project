import { Resend } from "resend";

import { env } from "@/lib/env";

/**
 * Transactional auth email sending. Resend-backed when `RESEND_API_KEY`
 * is configured; otherwise logs the link to the server console so local
 * development and CI never require a real email provider to exercise the
 * verification/reset/magic-link flows end to end.
 */

let resendClient: Resend | null | undefined;

function getResendClient(): Resend | null {
  if (resendClient !== undefined) return resendClient;
  resendClient = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;
  return resendClient;
}

const FROM_EMAIL =
  env.RESEND_FROM_EMAIL ?? "Lumora Digital <onboarding@resend.dev>";

interface SendEmailInput {
  to: string;
  subject: string;
  heading: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
  footnote: string;
}

function renderEmailHtml({
  heading,
  body,
  ctaLabel,
  ctaUrl,
  footnote,
}: SendEmailInput) {
  // Inline-styled by necessity — email clients don't load external
  // stylesheets. Kept deliberately simple (one accent color, one font
  // stack) rather than trying to replicate the full design system here.
  return `
    <div style="background:#0d0a08;padding:48px 24px;font-family:Georgia,'Times New Roman',serif;color:#f4ede1;">
      <div style="max-width:480px;margin:0 auto;">
        <p style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#a8632b;margin:0 0 24px;">
          Lumora Digital
        </p>
        <h1 style="font-size:28px;line-height:1.3;margin:0 0 16px;color:#f4ede1;">${heading}</h1>
        <p style="font-size:16px;line-height:1.6;color:#c9beac;margin:0 0 32px;">${body}</p>
        <a href="${ctaUrl}" style="display:inline-block;background:#f4ede1;color:#0d0a08;font-family:Arial,sans-serif;font-size:14px;font-weight:600;padding:14px 28px;border-radius:4px;text-decoration:none;">
          ${ctaLabel}
        </a>
        <p style="font-size:13px;line-height:1.6;color:#7a6f5f;margin:32px 0 0;">${footnote}</p>
      </div>
    </div>
  `;
}

async function sendEmail(input: SendEmailInput): Promise<void> {
  const client = getResendClient();

  if (!client) {
    console.warn(
      `\n[email:dev] RESEND_API_KEY not set — would send "${input.subject}" to ${input.to}\n[email:dev] Link: ${input.ctaUrl}\n`,
    );
    return;
  }

  const { error } = await client.emails.send({
    from: FROM_EMAIL,
    to: input.to,
    subject: input.subject,
    html: renderEmailHtml(input),
  });

  if (error) {
    console.error("[email] Resend send failed:", error);
    throw new Error("Failed to send email.");
  }
}

export async function sendVerificationEmail(
  to: string,
  verifyUrl: string,
): Promise<void> {
  await sendEmail({
    to,
    subject: "Verify your email address",
    heading: "Confirm your email",
    body: "Welcome to Lumora Digital. Click below to verify your email address and finish setting up your account. This link expires in 24 hours.",
    ctaLabel: "Verify email",
    ctaUrl: verifyUrl,
    footnote:
      "If you didn't create this account, you can safely ignore this email.",
  });
}

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string,
): Promise<void> {
  await sendEmail({
    to,
    subject: "Reset your password",
    heading: "Reset your password",
    body: "We received a request to reset your password. Click below to choose a new one. This link expires in 1 hour and can only be used once.",
    ctaLabel: "Reset password",
    ctaUrl: resetUrl,
    footnote:
      "If you didn't request this, you can safely ignore this email — your password won't change.",
  });
}

export async function sendMagicLinkEmail(
  to: string,
  signInUrl: string,
): Promise<void> {
  await sendEmail({
    to,
    subject: "Your sign-in link",
    heading: "Sign in to Lumora Digital",
    body: "Click below to sign in. This link expires in 10 minutes and can only be used once.",
    ctaLabel: "Sign in",
    ctaUrl: signInUrl,
    footnote:
      "If you didn't request this link, you can safely ignore this email.",
  });
}
