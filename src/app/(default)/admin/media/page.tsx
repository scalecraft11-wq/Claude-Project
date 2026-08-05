import { MediaGrid } from "@/components/admin/media/media-grid";
import { PageHeader } from "@/components/admin/page-header";
import { prisma } from "@/lib/prisma";

export default async function AdminMediaPage() {
  const assets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
    include: { uploadedBy: { select: { name: true } } },
  });

  const rows = assets.map((asset) => ({
    id: asset.id,
    filename: asset.filename,
    url: asset.url,
    mimeType: asset.mimeType,
    sizeBytes: asset.sizeBytes,
    width: asset.width,
    height: asset.height,
    folder: asset.folder,
    uploadedByName: asset.uploadedBy?.name ?? null,
    createdAt: asset.createdAt.toISOString(),
  }));

  return (
    <div>
      <PageHeader
        title="Media Library"
        description={`${rows.length} asset${rows.length === 1 ? "" : "s"}.`}
      />
      <MediaGrid assets={rows} />
    </div>
  );
}
