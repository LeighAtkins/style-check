export type FabricCategory =
  | "cotton"
  | "velvet"
  | "linen"
  | "leather"
  | "microfiber"
  | "wool"
  | "synthetic"
  | "patterned";

export interface Fabric {
  id: string;
  name: string;
  slug: string;
  category: FabricCategory;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  colorHex: string;
  tags: string[];
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface FabricInput {
  name: string;
  category: FabricCategory;
  description: string;
  colorHex: string;
  tags: string[];
  isActive?: boolean;
  sortOrder?: number;
}

export const FABRIC_CATEGORIES: { value: FabricCategory; label: string }[] = [
  { value: "cotton", label: "Cotton" },
  { value: "velvet", label: "Velvet" },
  { value: "linen", label: "Linen" },
  { value: "leather", label: "Leather" },
  { value: "microfiber", label: "Microfiber" },
  { value: "wool", label: "Wool" },
  { value: "synthetic", label: "Synthetic" },
  { value: "patterned", label: "Patterned" },
];
