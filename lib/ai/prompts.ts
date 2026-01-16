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

TASK: Transform the sofa in the FIRST image by applying a NEW fabric slipcover using the fabric shown in the SECOND image.

FABRIC DETAILS:
- Name: ${fabric.name}
- Material: ${materialDescription}
- Description: ${fabric.description}

CRITICAL REQUIREMENTS:
1. PRESERVE EXACTLY:
   - The entire room environment (walls, floor, windows, lighting, decorations)
   - All other furniture and objects in the room
   - The sofa's underlying shape, size, and position
   - The camera angle and perspective
   - The overall lighting conditions and shadows in the room

2. APPLY THE NEW FABRIC SLIPCOVER:
   - This is a BRAND NEW, pristine fabric slipcover being placed over the sofa
   - The fabric should be completely clean - no wrinkles, stains, scratches, or wear marks
   - Show the fabric as smooth and freshly fitted
   - The fabric will naturally drape over the sofa's structural features:
     * If there are tufted buttons, the fabric will show subtle indentations/bumps where buttons are
     * If there are cushion seams, the fabric will conform to these contours
     * The fabric should look like it's smoothly draped over these features, not tightly reupholstered
   - Ensure the fabric texture from the second image is clearly visible and realistic
   - Adjust fabric appearance based on how light hits different surfaces
   - Show appropriate shadows and highlights on the fabric
   - Remove any imperfections from the original sofa (stains, tears, worn areas)

3. QUALITY REQUIREMENTS:
   - The result should look like a professional interior photograph
   - The sofa should look like it has a freshly fitted, new fabric cover
   - Maintain photorealistic quality throughout
   - No visible editing artifacts or unnatural transitions
   - The fabric should appear clean and new, as if just unwrapped from packaging

Generate a single photorealistic image showing the room with the sofa now covered in a pristine, new ${fabric.name} slipcover.`;
}

export function buildSimplePrompt(fabricName: string): string {
  return `Transform the sofa in the first image by applying the fabric shown in the second image (${fabricName}) as the new cover. Keep everything else in the room exactly the same. Make it look natural and photorealistic.`;
}
