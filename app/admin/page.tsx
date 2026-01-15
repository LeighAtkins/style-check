"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui";
import { PlusIcon, SwatchIcon } from "@heroicons/react/24/outline";
import type { Fabric } from "@/types/fabric";

export default function AdminDashboard() {
  const [stats, setStats] = useState<{
    totalFabrics: number;
    activeFabrics: number;
    categories: Record<string, number>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/fabrics");
        const data = await res.json();
        const fabrics: Fabric[] = data.fabrics || [];

        const categories: Record<string, number> = {};
        fabrics.forEach((f) => {
          categories[f.category] = (categories[f.category] || 0) + 1;
        });

        setStats({
          totalFabrics: fabrics.length,
          activeFabrics: fabrics.filter((f) => f.isActive).length,
          categories,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            Dashboard
          </h1>
          <p className="text-[var(--color-text-muted)]">
            Manage your fabric visualizer
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
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 animate-pulse rounded bg-[var(--color-border)]" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[var(--color-text-muted)]">
                Total Fabrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[var(--color-text)]">
                {stats?.totalFabrics || 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[var(--color-text-muted)]">
                Active Fabrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[var(--color-accent-sage)]">
                {stats?.activeFabrics || 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[var(--color-text-muted)]">
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[var(--color-primary)]">
                {Object.keys(stats?.categories || {}).length}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Category breakdown */}
      {stats && Object.keys(stats.categories).length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Fabrics by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.categories).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SwatchIcon className="h-5 w-5 text-[var(--color-text-muted)]" />
                    <span className="capitalize text-[var(--color-text)]">
                      {category}
                    </span>
                  </div>
                  <span className="font-medium text-[var(--color-text)]">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick actions */}
      <div className="mt-6 flex items-center gap-4">
        <Link href="/admin/fabrics">
          <Button variant="outline">
            <SwatchIcon className="mr-2 h-5 w-5" />
            Manage Fabrics
          </Button>
        </Link>
        <Link href="/" target="_blank">
          <Button variant="ghost">View Live Site</Button>
        </Link>
      </div>
    </div>
  );
}
