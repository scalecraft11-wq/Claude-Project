import { CategoriesTable } from "@/components/admin/categories/categories-table";
import { PageHeader } from "@/components/admin/page-header";
import { prisma } from "@/lib/prisma";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      parent: { select: { name: true } },
      _count: { select: { products: true, children: true } },
    },
  });

  const rows = categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    parentId: category.parentId,
    parentName: category.parent?.name ?? null,
    productCount: category._count.products,
    childCount: category._count.children,
  }));

  return (
    <div>
      <PageHeader
        title="Categories"
        description={`${rows.length} categor${rows.length === 1 ? "y" : "ies"} in the catalog.`}
      />
      <CategoriesTable categories={rows} />
    </div>
  );
}
