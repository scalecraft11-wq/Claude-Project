"use client";

import { Upload } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { uploadMediaAction } from "@/lib/admin/actions/media";

const MAX_FILE_BYTES = 3 * 1024 * 1024;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

function readImageDimensions(
  dataUrl: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () =>
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = dataUrl;
  });
}

export function UploadMediaButton() {
  const [open, setOpen] = React.useState(false);
  const [folder, setFolder] = React.useState("uploads");
  const [preview, setPreview] = React.useState<string | null>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const reset = () => {
    setFolder("uploads");
    setPreview(null);
    setFile(null);
    setError(null);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    if (!selected.type.startsWith("image/")) {
      setError("Only image files are supported.");
      return;
    }
    if (selected.size > MAX_FILE_BYTES) {
      setError("Images must be under 3MB.");
      return;
    }
    setError(null);
    setFile(selected);
    const dataUrl = await readFileAsDataUrl(selected);
    setPreview(dataUrl);
  };

  const handleUpload = async () => {
    if (!file || !preview) return;
    setIsSubmitting(true);
    setError(null);

    const { width, height } = await readImageDimensions(preview);
    const result = await uploadMediaAction({
      filename: file.name,
      url: preview,
      mimeType: file.type,
      sizeBytes: file.size,
      width,
      height,
      folder: folder || "uploads",
    });

    setIsSubmitting(false);
    if (!result.success) {
      setError(result.message);
      return;
    }
    reset();
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
      title="Upload media"
      description="Images are stored inline — no external storage configured."
      trigger={
        <Button type="button" variant="primary" size="sm">
          <Upload className="size-4" aria-hidden="true" />
          Upload
        </Button>
      }
    >
      <div className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="media-file">Image file</Label>
          <input
            id="media-file"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-body-sm text-content-secondary file:mr-3 file:rounded-button file:border-0 file:bg-button-primary file:px-4 file:py-2 file:text-button file:text-button-primary-foreground"
          />
        </div>
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element -- an inline base64 data URI, not an optimizable remote/static asset
          <img
            src={preview}
            alt="Upload preview"
            className="max-h-48 w-full rounded-card border border-hairline-subtle object-contain"
          />
        )}
        <div className="grid gap-1.5">
          <Label htmlFor="media-folder">Folder</Label>
          <Input
            id="media-folder"
            value={folder}
            onChange={(event) => setFolder(event.target.value)}
          />
        </div>
        {error && (
          <p role="alert" className="text-body-sm text-danger">
            {error}
          </p>
        )}
        <Button
          type="button"
          variant="primary"
          isLoading={isSubmitting}
          disabled={!file}
          onClick={handleUpload}
          className="justify-self-end"
        >
          Save to library
        </Button>
      </div>
    </Modal>
  );
}
