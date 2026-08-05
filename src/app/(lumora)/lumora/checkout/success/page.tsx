import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { OrderConfirmationView } from "@/components/lumora/order-confirmation";
import { Container } from "@/components/layouts";

export const metadata: Metadata = { title: "Order Confirmed" };

export default async function LumoraCheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  if (!sessionId) redirect("/lumora");

  return (
    <Container
      size="lg"
      className="grid min-h-[60vh] items-center py-section-sm"
    >
      <OrderConfirmationView sessionId={sessionId} />
    </Container>
  );
}
