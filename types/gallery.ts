export interface GalleryImage {
  id: string;
  imageUrl: string;
  originalUrl: string;
  fabricId: string;
  fabricName: string;
  fabricThumbnailUrl: string;
  createdAt: string;
}

export interface UserGallery {
  userId: string;
  images: GalleryImage[];
}

export interface SaveImageRequest {
  imageUrl: string;
  originalUrl: string;
  fabricId: string;
  fabricName: string;
  fabricThumbnailUrl: string;
}

export interface SaveImageResponse {
  success: boolean;
  image?: GalleryImage;
  error?: "gallery_full" | string;
}

export interface GalleryResponse {
  images: GalleryImage[];
  count: number;
  maxAllowed: number;
}
