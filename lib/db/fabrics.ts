import { v4 as uuidv4 } from "uuid";
import { nanoid } from "nanoid";
import type { Fabric, FabricInput, FabricCategory } from "@/types/fabric";
import { KV_KEYS, getValue, setValue, deleteValue, addToSet, removeFromSet, getSetMembers } from "./kv";

function createSlug(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") + `-${nanoid(6)}`
  );
}

export async function createFabric(
  input: FabricInput,
  imageUrl: string,
  thumbnailUrl: string
): Promise<Fabric> {
  const id = uuidv4();
  const now = new Date().toISOString();
  const slug = createSlug(input.name);

  const fabric: Fabric = {
    id,
    name: input.name,
    slug,
    category: input.category,
    description: input.description,
    imageUrl,
    thumbnailUrl,
    colorHex: input.colorHex,
    tags: input.tags,
    isActive: input.isActive ?? true,
    sortOrder: input.sortOrder ?? 0,
    createdAt: now,
    updatedAt: now,
  };

  // Save fabric
  await setValue(KV_KEYS.fabric(id), fabric);

  // Add to index
  await addToSet(KV_KEYS.fabricIndex, id);

  // Add to category index
  await addToSet(KV_KEYS.fabricsByCategory(input.category), id);

  return fabric;
}

export async function getFabric(id: string): Promise<Fabric | null> {
  return getValue<Fabric>(KV_KEYS.fabric(id));
}

export async function getFabricBySlug(slug: string): Promise<Fabric | null> {
  const allFabrics = await getAllFabrics();
  return allFabrics.find((f) => f.slug === slug) || null;
}

export async function getAllFabrics(): Promise<Fabric[]> {
  const ids = await getSetMembers(KV_KEYS.fabricIndex);
  if (ids.length === 0) return [];

  const fabrics = await Promise.all(
    ids.map((id) => getValue<Fabric>(KV_KEYS.fabric(id)))
  );

  return fabrics
    .filter((f): f is Fabric => f !== null)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getActiveFabrics(): Promise<Fabric[]> {
  const fabrics = await getAllFabrics();
  return fabrics.filter((f) => f.isActive);
}

export async function getFabricsByCategory(
  category: FabricCategory
): Promise<Fabric[]> {
  const ids = await getSetMembers(KV_KEYS.fabricsByCategory(category));
  if (ids.length === 0) return [];

  const fabrics = await Promise.all(
    ids.map((id) => getValue<Fabric>(KV_KEYS.fabric(id)))
  );

  return fabrics
    .filter((f): f is Fabric => f !== null && f.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function updateFabric(
  id: string,
  updates: Partial<FabricInput> & { imageUrl?: string; thumbnailUrl?: string }
): Promise<Fabric | null> {
  const existing = await getFabric(id);
  if (!existing) return null;

  // If category changed, update category indexes
  if (updates.category && updates.category !== existing.category) {
    await removeFromSet(KV_KEYS.fabricsByCategory(existing.category), id);
    await addToSet(KV_KEYS.fabricsByCategory(updates.category), id);
  }

  const updated: Fabric = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await setValue(KV_KEYS.fabric(id), updated);
  return updated;
}

export async function deleteFabric(id: string): Promise<boolean> {
  const fabric = await getFabric(id);
  if (!fabric) return false;

  // Remove from all indexes
  await removeFromSet(KV_KEYS.fabricIndex, id);
  await removeFromSet(KV_KEYS.fabricsByCategory(fabric.category), id);

  // Delete the fabric
  await deleteValue(KV_KEYS.fabric(id));

  return true;
}

export async function toggleFabricActive(id: string): Promise<Fabric | null> {
  const fabric = await getFabric(id);
  if (!fabric) return null;

  return updateFabric(id, { isActive: !fabric.isActive });
}
