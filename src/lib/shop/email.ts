import { formatCurrency, formatDate } from "@/lib/format";
import { logger } from "@/lib/logger";
import { FROM_EMAIL, getResendClient } from "@/lib/resend";

const log = logger.child({ module: "shop-email" });

export interface OrderConfirmationEmailItem {
  name: string;
  quantity: number;
  priceCents: number;
}

export interface OrderConfirmationEmailInput {
  to: string;
  orderNumber: string;
  items: OrderConfirmationEmailItem[];
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  discountCents: number;
  totalCents: number;
  orderUrl: string;
}

function renderOrderConfirmationHtml(
  input: OrderConfirmationEmailInput,
): string {
  const rows = input.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;color:#2b2820;">${item.name} × ${item.quantity}</td>
          <td style="padding:8px 0;text-align:right;color:#2b2820;">${formatCurrency(item.priceCents * item.quantity)}</td>
        </tr>`,
    )
    .join("");

  return `
    <div style="background:#fbf7f1;padding:48px 24px;font-family:Georgia,'Times New Roman',serif;color:#2b2820;">
      <div style="max-width:520px;margin:0 auto;">
        <p style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#c9a15c;margin:0 0 24px;">
          Lumora Skin
        </p>
        <h1 style="font-size:26px;line-height:1.3;margin:0 0 8px;">Thank you for your order</h1>
        <p style="font-size:15px;color:#5e5445;margin:0 0 32px;">Order ${input.orderNumber}, ${formatDate(new Date())}</p>

        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          ${rows}
        </table>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:16px;border-top:1px solid #e0d6c4;padding-top:8px;">
          <tr><td style="padding:4px 0;color:#5e5445;">Subtotal</td><td style="padding:4px 0;text-align:right;">${formatCurrency(input.subtotalCents)}</td></tr>
          <tr><td style="padding:4px 0;color:#5e5445;">Shipping</td><td style="padding:4px 0;text-align:right;">${formatCurrency(input.shippingCents)}</td></tr>
          <tr><td style="padding:4px 0;color:#5e5445;">Tax</td><td style="padding:4px 0;text-align:right;">${formatCurrency(input.taxCents)}</td></tr>
          ${input.discountCents > 0 ? `<tr><td style="padding:4px 0;color:#5e5445;">Discount</td><td style="padding:4px 0;text-align:right;">-${formatCurrency(input.discountCents)}</td></tr>` : ""}
          <tr><td style="padding:8px 0;font-weight:700;">Total</td><td style="padding:8px 0;text-align:right;font-weight:700;">${formatCurrency(input.totalCents)}</td></tr>
        </table>

        <a href="${input.orderUrl}" style="display:inline-block;margin-top:32px;background:#2b2820;color:#fbf7f1;font-family:Arial,sans-serif;font-size:14px;font-weight:600;padding:14px 28px;border-radius:999px;text-decoration:none;">
          View your order
        </a>
      </div>
    </div>
  `;
}

/** Fire-and-forget from the Stripe webhook after an Order is created —
 * logs and swallows its own errors rather than throwing, since a failed
 * confirmation email must never roll back or retry the payment
 * fulfillment transaction that already succeeded. */
export async function sendOrderConfirmationEmail(
  input: OrderConfirmationEmailInput,
): Promise<void> {
  const client = getResendClient();

  if (!client) {
    log.warn(
      { to: input.to, orderNumber: input.orderNumber },
      "RESEND_API_KEY not set — order confirmation not sent",
    );
    return;
  }

  try {
    const { error } = await client.emails.send({
      from: FROM_EMAIL,
      to: input.to,
      subject: `Order confirmed — ${input.orderNumber}`,
      html: renderOrderConfirmationHtml(input),
    });
    if (error) {
      log.error(
        { err: error, orderNumber: input.orderNumber },
        "Resend send failed",
      );
    }
  } catch (error) {
    log.error(
      { err: error, orderNumber: input.orderNumber },
      "order confirmation email failed",
    );
  }
}
