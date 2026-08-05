import { ProductsTable } from "@/components/admin/products/products-table";
import { PageHeader } from "@/components/admin/page-header";
import { prisma } from "@/lib/prisma";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: { select: { name: true } } },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const rows = products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    description: product.description,
    priceCents: product.priceCents,
    compareAtCents: product.compareAtCents,
    costCents: product.costCents,
    status: product.status,
    categoryId: product.categoryId,
    categoryName: product.category?.name ?? null,
    stock: product.stock,
    lowStockThreshold: product.lowStockThreshold,
  }));

  return (
    <div>
      <PageHeader
        title="Products"
        description={`${rows.length} product${rows.length === 1 ? "" : "s"} in the catalog.`}
      />
      <ProductsTable products={rows} categories={categories} />
    </div>
  );
}
