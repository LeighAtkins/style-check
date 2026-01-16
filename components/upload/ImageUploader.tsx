"use client";

import { useCallback, useState, useEffect } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { cn } from "@/lib/utils/cn";
import { PhotoIcon, XMarkIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { CameraIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui";
import Image from "next/image";

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  onImageClear: () => void;
  previewUrl: string | null;
  isUploading?: boolean;
  uploadProgress?: number;
  error?: string;
  className?: string;
}

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ACCEPTED_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

export function ImageUploader({
  onImageSelect,
  onImageClear,
  previewUrl,
  isUploading = false,
  uploadProgress = 0,
  error,
  className,
}: ImageUploaderProps) {
  const [localError, setLocalError] = useState<string | null>(null);
  const [hasSavedImage, setHasSavedImage] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUrl = sessionStorage.getItem("uploadedImageUrl");
      setHasSavedImage(!!savedUrl);
    }
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setLocalError(null);

      if (fileRejections.length > 0) {
        const error = fileRejections[0].errors[0];
        setLocalError(error.message);
        return;
      }

      if (acceptedFiles.length > 0) {
        onImageSelect(acceptedFiles[0]);
      }
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE_BYTES,
    maxFiles: 1,
    disabled: isUploading,
  });

  const handleRestorePrevious = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const displayError = error || localError;

  if (previewUrl) {
    return (
      <div className={cn("relative", className)}>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-accent-cream)]">
          <Image
            src={previewUrl}
            alt="Selected sofa image"
            fill
            className="object-contain"
          />
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-center text-white">
                <div className="mb-2 h-2 w-32 overflow-hidden rounded-full bg-white/30">
                  <div
                    className="h-full bg-white transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm">Uploading... {uploadProgress}%</p>
              </div>
            </div>
          )}
        </div>
        {!isUploading && (
          <button
            onClick={onImageClear}
            className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-text)] text-white shadow-medium hover:bg-[var(--color-text-muted)] transition-colors"
            aria-label="Remove image"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={cn(
          "relative flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-[var(--radius-xl)] border-2 border-dashed p-8 transition-all duration-200",
          isDragActive
            ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
            : "border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-primary)] hover:bg-[var(--color-accent-cream)]/50",
          displayError && "border-[var(--color-error)]"
        )}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent-cream)]">
            <PhotoIcon className="h-8 w-8 text-[var(--color-primary)]" />
          </div>

          <p className="mb-2 text-lg font-medium text-[var(--color-text)]">
            {isDragActive ? "Drop your image here" : "Upload your sofa photo"}
          </p>

          <p className="mb-4 text-sm text-[var(--color-text-muted)]">
            Drag and drop or tap to select
          </p>

          <p className="text-xs text-[var(--color-text-light)]">
            JPG, PNG, or WebP up to {MAX_SIZE_MB}MB
          </p>
        </div>

        {/* Mobile camera button */}
        <div className="mt-6 sm:hidden">
          <label className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] bg-[var(--color-primary)] px-4 py-3 text-white">
            <CameraIcon className="h-5 w-5" />
            <span className="font-medium">Take Photo</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onImageSelect(file);
              }}
            />
          </label>
        </div>
      </div>

      {displayError && (
        <p className="mt-2 text-sm text-[var(--color-error)]">{displayError}</p>
      )}

      {hasSavedImage && !previewUrl && (
        <div className="mt-4 text-center">
          <Button onClick={handleRestorePrevious} variant="secondary" size="sm">
            <ArrowPathIcon className="mr-2 h-4 w-4" />
            Restore Previous Image
          </Button>
        </div>
      )}
    </div>
  );
}
