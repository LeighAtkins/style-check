import type { Fabric } from "@/types/fabric";

export function buildFabricReplacementPrompt(fabric: Fabric): string {
  const categoryDescriptions: Record<string, string> = {
    cotton: "soft, breathable cotton with a natural texture",
    velvet: "luxurious velvet with a soft, plush pile and subtle sheen",
    linen: "natural linen with a relaxed, textured weave",
    leather: "smooth leather with natural grain and subtle sheen",
    microfiber: "soft microfiber with a uniform, suede-like texture",
    wool: "cozy wool with natural warmth and subtle texture",
    synthetic: "durable synthetic fabric with consistent appearance",
    patterned: "decorative fabric with the visible pattern design",
  };

  const materialDescription =
    categoryDescriptions[fabric.category] || "quality upholstery fabric";

  return `You are an expert interior designer and photo editor specializing in furniture visualization.

TASK: Transform the sofa in the FIRST image by applying the fabric shown in the SECOND image as the new sofa cover.

FABRIC DETAILS:
- Name: ${fabric.name}
- Material: ${materialDescription}
- Description: ${fabric.description}

CRITICAL REQUIREMENTS:
1. PRESERVE EXACTLY:
   - The entire room environment (walls, floor, windows, lighting, decorations)
   - All other furniture and objects in the room
   - The sofa's exact shape, size, cushion structure, and position
   - The camera angle and perspective
   - The overall lighting conditions and shadows in the room

2. TRANSFORM THE SOFA:
   - Apply the fabric from the second image to completely cover the sofa
   - Make the fabric appear naturally draped and fitted to the sofa's contours
   - Ensure the fabric texture is visible and realistic
   - Adjust fabric appearance based on how light hits different surfaces
   - Show appropriate shadows and highlights on the fabric

3. QUALITY REQUIREMENTS:
   - The result should look like a professional interior photograph
   - The sofa should look like it genuinely has this fabric cover
   - Maintain photorealistic quality throughout
   - No visible editing artifacts or unnatural transitions

Generate a single photorealistic image showing the room with the sofa now covered in the ${fabric.name} fabric.`;
}

export function buildSimplePrompt(fabricName: string): string {
  return `Transform the sofa in the first image by applying the fabric shown in the second image (${fabricName}) as the new cover. Keep everything else in the room exactly the same. Make it look natural and photorealistic.`;
}
