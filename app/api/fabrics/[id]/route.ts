import { NextRequest, NextResponse } from "next/server";
import { getFabric, updateFabric, deleteFabric } from "@/lib/db/fabrics";
import { uploadFabricImage } from "@/lib/storage/cloudinary";
import type { FabricCategory } from "@/types/fabric";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const fabric = await getFabric(id);

    if (!fabric) {
      return NextResponse.json({ error: "Fabric not found" }, { status: 404 });
    }

    return NextResponse.json({ fabric });
  } catch (error) {
    console.error("Error fetching fabric:", error);
    return NextResponse.json(
      { error: "Failed to fetch fabric" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const contentType = request.headers.get("content-type");

    const updates: {
      name?: string;
      category?: FabricCategory;
      description?: string;
      colorHex?: string;
      tags?: string[];
      isActive?: boolean;
      sortOrder?: number;
      imageUrl?: string;
      thumbnailUrl?: string;
    } = {};

    if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData();

      const name = formData.get("name") as string;
      const category = formData.get("category") as FabricCategory;
      const description = formData.get("description") as string;
      const colorHex = formData.get("colorHex") as string;
      const tagsString = formData.get("tags") as string;
      const file = formData.get("image") as File;

      if (name) updates.name = name;
      if (category) updates.category = category;
      if (description) updates.description = description;
      if (colorHex) updates.colorHex = colorHex;
      if (tagsString) {
        updates.tags = tagsString
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }

      if (file) {
        const slug = name ? name.toLowerCase().replace(/\s+/g, "-") : id;
        const { imageUrl, thumbnailUrl } = await uploadFabricImage(file, slug);
        updates.imageUrl = imageUrl;
        updates.thumbnailUrl = thumbnailUrl;
      }
    } else {
      const body = await request.json();

      if (body.name !== undefined) updates.name = body.name;
      if (body.category !== undefined) updates.category = body.category;
      if (body.description !== undefined) updates.description = body.description;
      if (body.colorHex !== undefined) updates.colorHex = body.colorHex;
      if (body.tags !== undefined) updates.tags = body.tags;
      if (body.isActive !== undefined) updates.isActive = body.isActive;
      if (body.sortOrder !== undefined) updates.sortOrder = body.sortOrder;
    }

    const fabric = await updateFabric(id, updates);

    if (!fabric) {
      return NextResponse.json({ error: "Fabric not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, fabric });
  } catch (error) {
    console.error("Error updating fabric:", error);
    return NextResponse.json(
      { error: "Failed to update fabric" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const success = await deleteFabric(id);

    if (!success) {
      return NextResponse.json({ error: "Fabric not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting fabric:", error);
    return NextResponse.json(
      { error: "Failed to delete fabric" },
      { status: 500 }
    );
  }
}
