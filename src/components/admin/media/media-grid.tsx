"use client";

import { Search, Trash2 } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { UploadMediaButton } from "@/components/admin/media/upload-media-button";
import { deleteMediaAction } from "@/lib/admin/actions/media";

export interface MediaAssetRow {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  folder: string;
  uploadedByName: string | null;
  createdAt: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function MediaCard({
  asset,
  onDeleted,
}: {
  asset: MediaAssetRow;
  onDeleted: () => void;
}) {
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteMediaAction(asset.id);
    setIsDeleting(false);
    if (!result.success) {
      setError(result.message);
      return;
    }
    setDeleteOpen(false);
    onDeleted();
  };

  return (
    <>
      <div className="group relative overflow-hidden rounded-card border border-hairline-subtle bg-surface">
        <div className="aspect-square w-full overflow-hidden bg-surface-raised">
          {/* eslint-disable-next-line @next/next/no-img-element -- inline base64 data URI, not an optimizable remote/static asset */}
          <img
            src={asset.url}
            alt={asset.filename}
            className="size-full object-cover"
          />
        </div>
        <Button
          type="button"
          variant="icon"
          size="icon"
          aria-label={`Delete ${asset.filename}`}
          onClick={() => {
            setError(null);
            setDeleteOpen(true);
          }}
          className="bg-surface/90 absolute right-2 top-2 opacity-0 shadow-elevation-2 backdrop-blur transition-opacity duration-fast group-focus-within:opacity-100 group-hover:opacity-100"
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </Button>
        <div className="p-3">
          <p className="truncate text-body-sm font-medium text-content-primary">
            {asset.filename}
          </p>
          <p className="text-caption text-content-muted">
            {asset.folder} · {formatBytes(asset.sizeBytes)}
            {asset.width && asset.height
              ? ` · ${asset.width}×${asset.height}`
              : ""}
          </p>
        </div>
      </div>

      <Modal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete "${asset.filename}"?`}
        description="This can't be undone."
        footer={
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              className="bg-danger text-content-inverse hover:opacity-90"
              isLoading={isDeleting}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </>
        }
      >
        {error && (
          <p role="alert" className="text-body-sm text-danger">
            {error}
          </p>
        )}
      </Modal>
    </>
  );
}

export function MediaGrid({ assets }: { assets: MediaAssetRow[] }) {
  const [search, setSearch] = React.useState("");
  const [deletedIds, setDeletedIds] = React.useState<Set<string>>(new Set());

  const visible = assets.filter(
    (asset) =>
      !deletedIds.has(asset.id) &&
      (asset.filename.toLowerCase().includes(search.toLowerCase()) ||
        asset.folder.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-content-muted"
            aria-hidden="true"
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search media..."
            className="pl-9"
            aria-label="Search media"
          />
        </div>
        <UploadMediaButton />
      </div>

      {visible.length === 0 ? (
        <p className="py-10 text-center text-body-sm text-content-muted">
          No media found.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {visible.map((asset) => (
            <MediaCard
              key={asset.id}
              asset={asset}
              onDeleted={() =>
                setDeletedIds((prev) => new Set(prev).add(asset.id))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
