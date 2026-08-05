import { SeoTable } from "@/components/admin/seo/seo-table";
import { PageHeader } from "@/components/admin/page-header";
import { prisma } from "@/lib/prisma";

export default async function AdminSeoPage() {
  const entries = await prisma.seoMeta.findMany({ orderBy: { path: "asc" } });

  const rows = entries.map((entry) => ({
    id: entry.id,
    path: entry.path,
    title: entry.title,
    description: entry.description,
    ogImage: entry.ogImage,
    noIndex: entry.noIndex,
  }));

  return (
    <div>
      <PageHeader
        title="SEO Manager"
        description={`${rows.length} route${rows.length === 1 ? "" : "s"} with custom metadata.`}
      />
      <SeoTable entries={rows} />
    </div>
  );
}
