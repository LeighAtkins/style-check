import { v4 as uuidv4 } from "uuid";
import { KV_KEYS, getValue, setValue } from "./kv";
import type { GalleryImage, UserGallery, SaveImageRequest } from "@/types/gallery";

const MAX_GALLERY_SIZE = 5;

export async function getGallery(userId: string): Promise<UserGallery> {
  const key = KV_KEYS.gallery(userId);
  const data = await getValue<UserGallery>(key);
  return data || { userId, images: [] };
}

export async function addToGallery(
  userId: string,
  imageData: SaveImageRequest
): Promise<{ success: boolean; image?: GalleryImage; error?: string }> {
  const gallery = await getGallery(userId);

  if (gallery.images.length >= MAX_GALLERY_SIZE) {
    return { success: false, error: "gallery_full" };
  }

  const newImage: GalleryImage = {
    id: uuidv4(),
    ...imageData,
    createdAt: new Date().toISOString(),
  };

  gallery.images.unshift(newImage);
  await setValue(KV_KEYS.gallery(userId), gallery);

  return { success: true, image: newImage };
}

export async function removeFromGallery(
  userId: string,
  imageId: string
): Promise<{ success: boolean; remainingCount: number }> {
  const gallery = await getGallery(userId);
  gallery.images = gallery.images.filter((img) => img.id !== imageId);
  await setValue(KV_KEYS.gallery(userId), gallery);
  return { success: true, remainingCount: gallery.images.length };
}

export async function getGalleryImage(
  userId: string,
  imageId: string
): Promise<GalleryImage | null> {
  const gallery = await getGallery(userId);
  return gallery.images.find((img) => img.id === imageId) || null;
}

export { MAX_GALLERY_SIZE };
