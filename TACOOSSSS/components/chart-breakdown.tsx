"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { EnergyRecord } from "@/lib/mock-data"

interface ChartBreakdownProps {
  data: EnergyRecord[]
  title: string
}

const COLORS = ["#0ea5e9", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

export function ChartBreakdown({ data, title }: ChartBreakdownProps) {
  // Group by device
  const breakdown = data.reduce(
    (acc, record) => {
      const existing = acc.find((item) => item.name === record.deviceName)
      if (existing) {
        existing.value += record.energyKwh
      } else {
        acc.push({ name: record.deviceName, value: record.energyKwh })
      }
      return acc
    },
    [] as Array<{ name: string; value: number }>,
  )

  // Sort by value descending
  breakdown.sort((a, b) => b.value - a.value)

  return (
    <Card className="bg-white border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={breakdown}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.name}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {breakdown.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "6px",
                color: "#f1f5f9",
              }}
              formatter={(value: number) => `${value.toFixed(1)} kWh`}
            />
            <Legend wrapperStyle={{ color: "#64748b" }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
