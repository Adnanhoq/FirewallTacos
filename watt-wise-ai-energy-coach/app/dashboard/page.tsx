"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { KPICard } from "@/components/kpi-card"
import { ChartTimeSeries } from "@/components/chart-time-series"
import { ChartBreakdown } from "@/components/chart-breakdown"
import { AIInsightsPanel } from "@/components/ai-insights-panel"
import { AlertsPanel } from "@/components/alerts-panel"
import { LayoutHeader } from "@/components/layout-header"
import {
  HOUSEHOLD_DATA,
  OFFICE_DATA,
  HOUSEHOLD_SUMMARY,
  OFFICE_SUMMARY,
  AI_INSIGHTS_HOUSEHOLD,
  AI_INSIGHTS_OFFICE,
} from "@/lib/mock-data"
import type { AlertMessage, SpaceType } from "@/lib/types"
import { Zap, BarChart3, TrendingDown, Leaf } from "lucide-react"

export default function Dashboard() {
  const searchParams = useSearchParams()
  const spaceParam = (searchParams.get("space") || "household") as SpaceType

  const [space, setSpace] = useState<SpaceType>(spaceParam)

  const isHousehold = space === "household"
  const data = isHousehold ? HOUSEHOLD_DATA : OFFICE_DATA
  const summary = isHousehold ? HOUSEHOLD_SUMMARY : OFFICE_SUMMARY
  const insights = isHousehold ? AI_INSIGHTS_HOUSEHOLD : AI_INSIGHTS_OFFICE
  const spaceName = isHousehold ? "Household Demo" : "Office Demo"

  const initialAlerts: AlertMessage[] = [
    {
      id: "1",
      message: `${spaceName} is running at baseline efficiency.`,
      timestamp: new Date(Date.now() - 5 * 60000),
      severity: "info",
    },
  ]

  const handleReanalyze = () => {
    // TODO: In production, re-fetch data from analytics API
    alert("Re-analyzing energy data... (mock)")
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <LayoutHeader title="Energy Dashboard" badge={spaceName} />

      {/* Top Action Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={isHousehold ? "default" : "outline"}
              onClick={() => setSpace("household")}
              className={isHousehold ? "bg-blue-600 text-white hover:bg-blue-700" : "border-slate-300"}
            >
              Household
            </Button>
            <Button
              variant={!isHousehold ? "default" : "outline"}
              onClick={() => setSpace("office")}
              className={!isHousehold ? "bg-emerald-600 text-white hover:bg-emerald-700" : "border-slate-300"}
            >
              Office
            </Button>
          </div>
          <Button onClick={handleReanalyze} className="bg-blue-600 text-white hover:bg-blue-700">
            Re-analyze now
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard
            label="Total Energy (30 days)"
            value={summary.totalEnergyKwh}
            unit="kWh"
            icon={<Zap className="w-6 h-6" />}
            tooltip="Sum of all measured energy consumption"
          />
          <KPICard
            label="Total Cost (30 days)"
            value={`£${summary.totalCost.toFixed(2)}`}
            icon={<BarChart3 className="w-6 h-6" />}
            tooltip="Estimated cost at current tariff rates"
          />
          <KPICard
            label="Avoidable Cost"
            value={`£${summary.avoidableCost.toFixed(2)}`}
            unit="/month"
            icon={<TrendingDown className="w-6 h-6" />}
            trend="down"
            trendValue="25% savings potential"
            tooltip="Typically achievable through efficiency gains"
          />
          <KPICard
            label="CO₂ Emissions"
            value={summary.co2Emissions}
            unit="kg CO₂"
            icon={<Leaf className="w-6 h-6" />}
            tooltip="Estimated carbon footprint (UK grid avg)"
          />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <ChartTimeSeries data={data} title="Energy Usage Over Time" />
          <ChartBreakdown data={data} title="Energy by Device" />
        </div>

        {/* Insights & Alerts Row */}
        <div className="grid lg:grid-cols-2 gap-8">
          <AIInsightsPanel insights={insights} />
          <AlertsPanel initialAlerts={initialAlerts} />
        </div>
      </div>
    </main>
  )
}
