import { PageLoader } from "@/components/loading/page-loader";

/**
 * Root-segment loading UI (Next.js App Router convention — not a page).
 * Shown automatically while the segment below suspends on data/assets.
 */
export default function Loading() {
  return <PageLoader />;
}
