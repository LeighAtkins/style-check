"use client";

import { Header, Footer } from "@/components/layout";
import { Card } from "@/components/ui";
import { GalleryView } from "@/components/gallery";
import { useGallery } from "@/hooks";

export default function GalleryPage() {
  const { images, isLoading, deleteImage } = useGallery();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-warm">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-3xl font-bold text-[var(--color-text)] sm:text-4xl">
              My Gallery
            </h1>
            <p className="text-[var(--color-text-muted)]">
              Compare your saved sofa designs
            </p>
          </div>

          <Card variant="elevated">
            <GalleryView
              images={images}
              isLoading={isLoading}
              onDelete={deleteImage}
            />
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
