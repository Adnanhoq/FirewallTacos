import type React from "react"
import { Card, CardContent } from "@/components/ui/card"

interface KPICardProps {
  label: string
  value: string | number
  unit?: string
  icon?: React.ReactNode
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  tooltip?: string
}

export function KPICard({ label, value, unit, icon, trend, trendValue, tooltip }: KPICardProps) {
  return (
    <Card className="bg-white border-slate-200">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600">{label}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-slate-900">{value}</span>
              {unit && <span className="text-sm text-slate-500">{unit}</span>}
            </div>
            {trendValue && (
              <p
                className={`text-xs font-medium mt-2 ${
                  trend === "down" ? "text-emerald-600" : trend === "up" ? "text-red-600" : "text-slate-600"
                }`}
              >
                {trend === "down" ? "↓" : trend === "up" ? "↑" : "→"} {trendValue}
              </p>
            )}
          </div>
          {icon && <div className="text-slate-400 ml-4">{icon}</div>}
        </div>
        {tooltip && <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-200">{tooltip}</p>}
      </CardContent>
    </Card>
  )
}
