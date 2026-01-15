import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(
  file: File | Buffer,
  folder: string,
  publicId?: string
): Promise<string> {
  let base64Data: string;

  if (Buffer.isBuffer(file)) {
    base64Data = `data:image/png;base64,${file.toString("base64")}`;
  } else {
    // file is File
    const arrayBuffer = await (file as File).arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = (file as File).type || "image/jpeg";
    base64Data = `data:${mimeType};base64,${buffer.toString("base64")}`;
  }

  const result = await cloudinary.uploader.upload(base64Data, {
    folder,
    public_id: publicId,
    resource_type: "image",
  });

  return result.secure_url;
}

export async function uploadSofaImage(
  file: File | Buffer,
  userId: string
): Promise<string> {
  const timestamp = Date.now();
  return uploadImage(file, "style-check/sofa-images", `${userId}_${timestamp}`);
}

export async function uploadFabricImage(
  file: File | Buffer,
  fabricSlug: string
): Promise<{ imageUrl: string; thumbnailUrl: string }> {
  const imageUrl = await uploadImage(file, "style-check/fabrics", fabricSlug);

  // Generate thumbnail URL using Cloudinary transformations
  const thumbnailUrl = imageUrl.replace(
    "/upload/",
    "/upload/c_fill,w_200,h_200/"
  );

  return { imageUrl, thumbnailUrl };
}

export async function uploadGeneratedImage(
  imageData: Buffer,
  userId: string
): Promise<string> {
  const timestamp = Date.now();
  return uploadImage(
    imageData,
    "style-check/generated",
    `${userId}_${timestamp}`
  );
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export { cloudinary };
