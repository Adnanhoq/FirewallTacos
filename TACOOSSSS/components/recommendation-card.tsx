"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { Recommendation } from "@/lib/mock-data"

interface RecommendationCardProps {
  rec: Recommendation
  onClick: () => void
}

const impactColors = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-blue-100 text-blue-800",
}

const difficultyColors = {
  low: "bg-emerald-100 text-emerald-800",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-orange-100 text-orange-800",
}

export function RecommendationCard({ rec, onClick }: RecommendationCardProps) {
  return (
    <Card
      onClick={onClick}
      className="bg-white border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
    >
      <CardContent className="pt-6">
        <div className="space-y-3">
          <h3 className="font-semibold text-slate-900 leading-snug">{rec.title}</h3>

          <p className="text-sm text-slate-600 line-clamp-2">{rec.description}</p>

          <div className="flex flex-wrap gap-2">
            <span className={`text-xs font-semibold px-2 py-1 rounded ${impactColors[rec.impact]}`}>
              Impact: {rec.impact}
            </span>
            <span className={`text-xs font-semibold px-2 py-1 rounded ${difficultyColors[rec.difficulty]}`}>
              {rec.difficulty}
            </span>
          </div>

          <div className="flex flex-wrap gap-1">
            {rec.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200">
            <p className="text-sm font-semibold text-emerald-600">Save ~{rec.savingsPoundPerMonth}/mo (£)</p>
            <p className="text-xs text-slate-500">{rec.savingsKwhPerMonth} kWh/month</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
