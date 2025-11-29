"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import type { EnergyRecord } from "@/lib/mock-data"

interface ChartTimeSeriesProps {
  data: EnergyRecord[]
  title: string
}

export function ChartTimeSeries({ data, title }: ChartTimeSeriesProps) {
  const [granularity, setGranularity] = useState<"hourly" | "daily">("daily")

  // Aggregate data by granularity
  const aggregatedData = data.reduce(
    (acc, record) => {
      const date = new Date(record.timestamp)
      const key = granularity === "daily" ? date.toISOString().split("T")[0] : date.toISOString().slice(0, 13)

      const existing = acc.find((item) => item.period === key)
      if (existing) {
        existing.usage += record.energyKwh
      } else {
        acc.push({ period: key, usage: record.energyKwh })
      }
      return acc
    },
    [] as Array<{ period: string; usage: number }>,
  )

  return (
    <Card className="bg-white border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={granularity === "hourly" ? "default" : "outline"}
            onClick={() => setGranularity("hourly")}
            className={granularity === "hourly" ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
          >
            Hourly
          </Button>
          <Button
            size="sm"
            variant={granularity === "daily" ? "default" : "outline"}
            onClick={() => setGranularity("daily")}
            className={granularity === "daily" ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
          >
            Daily
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={aggregatedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="period" stroke="#64748b" style={{ fontSize: "12px" }} tick={{ fill: "#64748b" }} />
            <YAxis stroke="#64748b" style={{ fontSize: "12px" }} tick={{ fill: "#64748b" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "6px",
                color: "#f1f5f9",
              }}
              cursor={{ stroke: "#e0e7ff", strokeWidth: 2 }}
            />
            <Legend wrapperStyle={{ color: "#64748b" }} />
            <Line
              type="monotone"
              dataKey="usage"
              stroke="#0ea5e9"
              dot={false}
              strokeWidth={2}
              name="Energy Usage (kWh)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
