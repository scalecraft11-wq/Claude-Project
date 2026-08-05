import { ReviewsTable } from "@/components/admin/reviews/reviews-table";
import { PageHeader } from "@/components/admin/page-header";
import { prisma } from "@/lib/prisma";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: { select: { name: true } } },
  });

  const rows = reviews.map((review) => ({
    id: review.id,
    productName: review.product.name,
    authorName: review.authorName,
    rating: review.rating,
    title: review.title,
    body: review.body,
    status: review.status,
    createdAt: review.createdAt.toISOString(),
  }));

  const pendingCount = rows.filter((row) => row.status === "PENDING").length;

  return (
    <div>
      <PageHeader
        title="Reviews"
        description={`${rows.length} review${rows.length === 1 ? "" : "s"}, ${pendingCount} awaiting moderation.`}
      />
      <ReviewsTable reviews={rows} />
    </div>
  );
}
