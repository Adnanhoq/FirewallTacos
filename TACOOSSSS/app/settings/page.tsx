"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LayoutHeader } from "@/components/layout-header"
import { Upload, AlertCircle } from "lucide-react"

export default function Settings() {
  const [activeDataset, setActiveDataset] = useState<"household" | "office">("household")
  const [tariffType, setTariffType] = useState<"flat" | "time-of-use">("flat")
  const [peakRate, setPeakRate] = useState("0.28")
  const [offPeakRate, setOffPeakRate] = useState("0.20")
  const [businessHoursStart, setBusinessHoursStart] = useState("09:00")
  const [businessHoursEnd, setBusinessHoursEnd] = useState("18:00")

  return (
    <main className="min-h-screen bg-slate-50">
      <LayoutHeader title="Settings" />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Dataset Section */}
        <Card className="bg-white border-slate-200 mb-8">
          <CardHeader>
            <CardTitle>Dataset</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-900 block mb-3">Active Dataset</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="household"
                    checked={activeDataset === "household"}
                    onChange={(e) => setActiveDataset(e.target.value as "household" | "office")}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-slate-700">Household Demo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="office"
                    checked={activeDataset === "office"}
                    onChange={(e) => setActiveDataset(e.target.value as "household" | "office")}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-slate-700">Office Demo</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-900 mb-1">Upload CSV (Coming Soon)</p>
                <p className="text-xs text-slate-600 mb-4">Import your own energy data to replace demo datasets</p>
                <Button disabled className="bg-slate-300 text-slate-500">
                  Choose File
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-3">Expected columns: timestamp, device, room, energy_kwh, cost</p>
            </div>
          </CardContent>
        </Card>

        {/* Tariff & Rates */}
        <Card className="bg-white border-slate-200 mb-8">
          <CardHeader>
            <CardTitle>Tariff & Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-slate-900 block mb-3">Tariff Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="flat"
                    checked={tariffType === "flat"}
                    onChange={(e) => setTariffType(e.target.value as "flat" | "time-of-use")}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-slate-700">Flat Rate</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="time-of-use"
                    checked={tariffType === "time-of-use"}
                    onChange={(e) => setTariffType(e.target.value as "flat" | "time-of-use")}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-slate-700">Time-of-Use</span>
                </label>
              </div>
            </div>

            {tariffType === "time-of-use" && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-900 block mb-1">Peak Rate (£/kWh)</label>
                  <input
                    type="number"
                    value={peakRate}
                    onChange={(e) => setPeakRate(e.target.value)}
                    step="0.01"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-900 block mb-1">Off-Peak Rate (£/kWh)</label>
                  <input
                    type="number"
                    value={offPeakRate}
                    onChange={(e) => setOffPeakRate(e.target.value)}
                    step="0.01"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Business Hours (Office Only) */}
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle>Business Hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-3">
              <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700">
                Configure business hours to adjust energy calculations for office analysis
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-1">Start Time (HH:MM)</label>
                <input
                  type="time"
                  value={businessHoursStart}
                  onChange={(e) => setBusinessHoursStart(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-1">End Time (HH:MM)</label>
                <input
                  type="time"
                  value={businessHoursEnd}
                  onChange={(e) => setBusinessHoursEnd(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <Button className="bg-blue-600 text-white hover:bg-blue-700">Save Settings</Button>
              <p className="text-xs text-slate-500 mt-3">
                Settings are stored locally for this demo. Production: integrate with backend API.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
