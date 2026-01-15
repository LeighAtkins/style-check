"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, Button } from "@/components/ui";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { Fabric } from "@/types/fabric";
import { cn } from "@/lib/utils/cn";

export default function AdminFabricsPage() {
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFabrics();
  }, []);

  async function fetchFabrics() {
    try {
      const res = await fetch("/api/fabrics");
      const data = await res.json();
      setFabrics(data.fabrics || []);
    } catch (error) {
      console.error("Failed to fetch fabrics:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this fabric?")) return;

    try {
      const res = await fetch(`/api/fabrics/${id}`, { method: "DELETE" });
      if (res.ok) {
        setFabrics((prev) => prev.filter((f) => f.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete fabric:", error);
    }
  }

  async function handleToggleActive(id: string) {
    try {
      const fabric = fabrics.find((f) => f.id === id);
      if (!fabric) return;

      const res = await fetch(`/api/fabrics/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !fabric.isActive }),
      });

      if (res.ok) {
        setFabrics((prev) =>
          prev.map((f) =>
            f.id === id ? { ...f, isActive: !f.isActive } : f
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle fabric:", error);
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            Fabrics
          </h1>
          <p className="text-[var(--color-text-muted)]">
            Manage your fabric catalog
          </p>
        </div>
        <Link href="/admin/fabrics/new">
          <Button>
            <PlusIcon className="mr-2 h-5 w-5" />
            Add Fabric
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <div className="h-48 animate-pulse bg-[var(--color-border)]" />
            </Card>
          ))}
        </div>
      ) : fabrics.length === 0 ? (
        <Card className="py-12 text-center">
          <p className="mb-4 text-[var(--color-text-muted)]">
            No fabrics yet. Add your first fabric to get started.
          </p>
          <Link href="/admin/fabrics/new">
            <Button>
              <PlusIcon className="mr-2 h-5 w-5" />
              Add Fabric
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {fabrics.map((fabric) => (
            <Card key={fabric.id} className="overflow-hidden p-0">
              <div className="relative aspect-square">
                <Image
                  src={fabric.imageUrl}
                  alt={fabric.name}
                  fill
                  className="object-cover"
                />
                <div
                  className={cn(
                    "absolute right-2 top-2 rounded-[var(--radius-full)] px-2 py-1 text-xs font-medium",
                    fabric.isActive
                      ? "bg-[var(--color-accent-sage)] text-white"
                      : "bg-[var(--color-text-light)] text-white"
                  )}
                >
                  {fabric.isActive ? "Active" : "Inactive"}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-[var(--color-text)]">
                  {fabric.name}
                </h3>
                <p className="text-sm capitalize text-[var(--color-text-muted)]">
                  {fabric.category}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-[var(--color-text-muted)]">
                  {fabric.description}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <Link href={`/admin/fabrics/${fabric.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <PencilIcon className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleActive(fabric.id)}
                  >
                    {fabric.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(fabric.id)}
                    className="text-[var(--color-error)] hover:bg-[var(--color-error)]/10"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
