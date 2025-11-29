"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PaletteIcon as AlertIcon } from "lucide-react"
import { useState } from "react"
import type { AlertMessage } from "@/lib/types"

interface AlertsPanelProps {
  initialAlerts: AlertMessage[]
}

export function AlertsPanel({ initialAlerts }: AlertsPanelProps) {
  const [alerts, setAlerts] = useState<AlertMessage[]>(initialAlerts)

  const handleSimulateSpike = () => {
    const newAlert: AlertMessage = {
      id: Math.random().toString(),
      message: `Usage spike detected at ${new Date().toLocaleTimeString()}: 40% above baseline!`,
      timestamp: new Date(),
      severity: "alert",
    }
    setAlerts((prev) => [newAlert, ...prev].slice(0, 5))
  }

  return (
    <Card className="bg-white border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <AlertIcon className="w-5 h-5 text-orange-600" />
          <CardTitle className="text-lg font-semibold">Real-Time Alerts</CardTitle>
        </div>
        <Button size="sm" onClick={handleSimulateSpike} className="bg-blue-600 text-white hover:bg-blue-700">
          Simulate Spike
        </Button>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <p className="text-sm text-slate-500 py-4">No recent alerts</p>
        ) : (
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border-l-4 ${
                  alert.severity === "alert"
                    ? "bg-red-50 border-red-400"
                    : alert.severity === "warning"
                      ? "bg-yellow-50 border-yellow-400"
                      : "bg-blue-50 border-blue-400"
                }`}
              >
                <p
                  className={`text-sm font-medium ${
                    alert.severity === "alert"
                      ? "text-red-700"
                      : alert.severity === "warning"
                        ? "text-yellow-700"
                        : "text-blue-700"
                  }`}
                >
                  {alert.message}
                </p>
                <p className="text-xs text-slate-500 mt-1">{alert.timestamp.toLocaleTimeString()}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
