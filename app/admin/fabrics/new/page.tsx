"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { FABRIC_CATEGORIES, type FabricCategory } from "@/types/fabric";
import { ArrowLeftIcon, PhotoIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function AddFabricPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [category, setCategory] = useState<FabricCategory>("cotton");
  const [description, setDescription] = useState("");
  const [colorHex, setColorHex] = useState("#808080");
  const [tags, setTags] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !category || !description || !imageFile) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("colorHex", colorHex);
      formData.append("tags", tags);
      formData.append("image", imageFile);

      const res = await fetch("/api/fabrics", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create fabric");
      }

      router.push("/admin/fabrics");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create fabric");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <Link
          href="/admin/fabrics"
          className="mb-4 inline-flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Fabrics
        </Link>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">
          Add New Fabric
        </h1>
        <p className="text-[var(--color-text-muted)]">
          Add a new fabric to your catalog
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fabric Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
                Fabric Image *
              </label>
              <div className="flex items-start gap-4">
                <div className="relative h-32 w-32 overflow-hidden rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--color-border)] bg-[var(--color-accent-cream)]">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <PhotoIcon className="h-8 w-8 text-[var(--color-text-light)]" />
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="fabric-image"
                  />
                  <label
                    htmlFor="fabric-image"
                    className="inline-flex cursor-pointer items-center justify-center font-medium transition-all duration-200 rounded-[var(--radius-lg)] border-2 border-[var(--color-border)] bg-transparent text-[var(--color-text)] hover:bg-[var(--color-accent-cream)] hover:border-[var(--color-primary)] h-11 px-6 text-base min-w-[44px]"
                  >
                    Choose Image
                  </label>
                  <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                    Square images work best. JPG, PNG, or WebP.
                  </p>
                </div>
              </div>
            </div>

            {/* Name */}
            <Input
              label="Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Velvet Ocean Blue"
              required
            />

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as FabricCategory)}
                className="w-full h-12 px-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                {FABRIC_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the fabric texture, feel, and best uses..."
                rows={3}
                required
                className="w-full px-4 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text)] placeholder:text-[var(--color-text-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>

            {/* Color */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
                Primary Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="h-12 w-12 cursor-pointer rounded-[var(--radius-md)] border border-[var(--color-border)]"
                />
                <Input
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  placeholder="#808080"
                  className="flex-1"
                />
              </div>
            </div>

            {/* Tags */}
            <Input
              label="Tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., soft, durable, pet-friendly (comma separated)"
              hint="Optional tags to help with searchability"
            />

            {error && (
              <p className="text-sm text-[var(--color-error)]">{error}</p>
            )}

            <div className="flex items-center gap-4 pt-4">
              <Button type="submit" isLoading={isLoading} disabled={isLoading}>
                Add Fabric
              </Button>
              <Link href="/admin/fabrics">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
