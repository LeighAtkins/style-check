import { NextRequest, NextResponse } from "next/server";
import { getActiveFabrics, getFabricsByCategory, createFabric } from "@/lib/db/fabrics";
import { uploadFabricImage } from "@/lib/storage/cloudinary";
import type { FabricCategory, FabricInput } from "@/types/fabric";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") as FabricCategory | null;

    let fabrics;
    if (category) {
      fabrics = await getFabricsByCategory(category);
    } else {
      fabrics = await getActiveFabrics();
    }

    return NextResponse.json({ fabrics });
  } catch (error) {
    console.error("Error fetching fabrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch fabrics" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check for admin
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const category = formData.get("category") as FabricCategory;
    const description = formData.get("description") as string;
    const colorHex = formData.get("colorHex") as string;
    const tagsString = formData.get("tags") as string;
    const file = formData.get("image") as File;

    if (!name || !category || !description || !file) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Upload fabric image
    const { imageUrl, thumbnailUrl } = await uploadFabricImage(
      file,
      name.toLowerCase().replace(/\s+/g, "-")
    );

    // Parse tags
    const tags = tagsString
      ? tagsString.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    // Create fabric
    const input: FabricInput = {
      name,
      category,
      description,
      colorHex: colorHex || "#808080",
      tags,
      isActive: true,
    };

    const fabric = await createFabric(input, imageUrl, thumbnailUrl);

    return NextResponse.json({ success: true, fabric });
  } catch (error) {
    console.error("Error creating fabric:", error);
    return NextResponse.json(
      { error: "Failed to create fabric" },
      { status: 500 }
    );
  }
}
