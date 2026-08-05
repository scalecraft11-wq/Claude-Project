import { BlogTable } from "@/components/admin/blog/blog-table";
import { PageHeader } from "@/components/admin/page-header";
import { prisma } from "@/lib/prisma";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  const rows = posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage,
    status: post.status,
    tags: post.tags,
    authorName: post.author?.name ?? null,
    publishedAt: post.publishedAt?.toISOString() ?? null,
    createdAt: post.createdAt.toISOString(),
  }));

  return (
    <div>
      <PageHeader
        title="Blog"
        description={`${rows.length} post${rows.length === 1 ? "" : "s"}.`}
      />
      <BlogTable posts={rows} />
    </div>
  );
}
