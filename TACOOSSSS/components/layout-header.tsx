"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface LayoutHeaderProps {
  title: string;
  badge?: string;
  showBackButton?: boolean;
}

export function LayoutHeader({
  title,
  badge,
  showBackButton,
}: LayoutHeaderProps) {
  const router = useRouter();

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-slate-600 hover:text-slate-900"
            >
              ← Back
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            {badge && (
              <span className="text-xs font-semibold text-blue-600 mt-1">
                {badge}
              </span>
            )}
          </div>
        </div>
        <nav className="flex gap-5">
          <Link
            href="/"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Dashboard
          </Link>
          <Link
            href="/floorplan"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Floor Plan
          </Link>
          <Link
            href="/recommendations"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Recommendations
          </Link>
          <Link
            href="/settings"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Settings
          </Link>
        </nav>
      </div>
    </div>
  );
}
