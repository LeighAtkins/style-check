import { NextRequest, NextResponse } from "next/server";
import { getFabric, updateFabric, deleteFabric } from "@/lib/db/fabrics";
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
    const body = await request.json();

    const updates: {
      name?: string;
      category?: FabricCategory;
      description?: string;
      colorHex?: string;
      tags?: string[];
      isActive?: boolean;
      sortOrder?: number;
    } = {};

    if (body.name !== undefined) updates.name = body.name;
    if (body.category !== undefined) updates.category = body.category;
    if (body.description !== undefined) updates.description = body.description;
    if (body.colorHex !== undefined) updates.colorHex = body.colorHex;
    if (body.tags !== undefined) updates.tags = body.tags;
    if (body.isActive !== undefined) updates.isActive = body.isActive;
    if (body.sortOrder !== undefined) updates.sortOrder = body.sortOrder;

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
