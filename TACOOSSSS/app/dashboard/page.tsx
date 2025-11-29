"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { KPICard } from "@/components/kpi-card"
import { ChartTimeSeries } from "@/components/chart-time-series"
import { ChartBreakdown } from "@/components/chart-breakdown"
import { AIInsightsPanel } from "@/components/ai-insights-panel"
import { AlertsPanel } from "@/components/alerts-panel"
import { LayoutHeader } from "@/components/layout-header"
import {
  AI_INSIGHTS_HOUSEHOLD,
  calculateSummary,
  HOUSEHOLD_DATA,
  type EnergyRecord,
} from "@/lib/mock-data"
import type { AlertMessage } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { Zap, BarChart3, TrendingDown, Leaf } from "lucide-react"

type TariffBand = "off_peak" | "shoulder" | "peak"

const TARIFF_RATES: Record<TariffBand, number> = {
  off_peak: 0.12,
  shoulder: 0.18,
  peak: 0.28,
}

type Room = { id: number; name: string }

export default function Dashboard() {
  const [supabaseData, setSupabaseData] = useState<EnergyRecord[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    const fetchData = async () => {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("energy_readings")
        .select(
          `
            reading_timestamp,
            usage_kwh,
            tariff_band,
            devices (
              name,
              rooms (
                name
              )
            )
          `,
        )
        .order("reading_timestamp", { ascending: true })

      if (error) {
        setLoadError(error.message)
        setIsLoading(false)
        return
      }

      const mapped: EnergyRecord[] =
        data?.map((row) => {
          const tariff = (row.tariff_band as TariffBand) ?? "shoulder"
          const usage = Number(row.usage_kwh ?? 0)
          const timestamp = row.reading_timestamp as string
          const deviceName = row.devices?.name ?? "Unknown device"
          const roomName = row.devices?.rooms?.name ?? "Unknown room"
          const hour = new Date(timestamp).getHours()

          return {
            timestamp,
            deviceName,
            room: roomName,
            energyKwh: usage,
            cost: usage * TARIFF_RATES[tariff],
            isBusinessHours: hour >= 9 && hour <= 18,
          }
        }) ?? []

      setSupabaseData(mapped)
      setLoadError(null)
      setIsLoading(false)
    }

    fetchData()
  }, [])

  useEffect(() => {
    const supabase = createClient()

    const fetchRooms = async () => {
      const { data, error } = await supabase.from("rooms").select("id, name").order("name", { ascending: true })
      if (error) {
        setLoadError((prev) => prev ?? error.message)
        return
      }
      setRooms(data ?? [])
      if (data?.length) {
        setSelectedRoomId(data[0].id)
      }
    }

    fetchRooms()
  }, [])

  const data = useMemo(() => {
    if (!supabaseData.length) return HOUSEHOLD_DATA
    if (selectedRoomId === null) return supabaseData
    const selectedRoomName = rooms.find((r) => r.id === selectedRoomId)?.name
    if (!selectedRoomName) return supabaseData
    return supabaseData.filter((record) => record.room === selectedRoomName)
  }, [supabaseData, selectedRoomId, rooms])

  const summary = useMemo(() => calculateSummary(data), [data])
  const insights = AI_INSIGHTS_HOUSEHOLD
  const spaceName = supabaseData.length
    ? selectedRoomId
      ? `Room: ${rooms.find((r) => r.id === selectedRoomId)?.name ?? "Room"}`
      : "All Rooms"
    : "Household Demo"

  const initialAlerts: AlertMessage[] = [
    {
      id: "1",
      message: loadError
        ? `Fell back to mock data: ${loadError}`
        : `${spaceName} is running at baseline efficiency.`,
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
          <div className="flex gap-2 overflow-x-auto py-1">
            <Button
              variant={selectedRoomId === null ? "default" : "outline"}
              onClick={() => setSelectedRoomId(null)}
              className={selectedRoomId === null ? "bg-blue-600 text-white hover:bg-blue-700" : "border-slate-300"}
            >
              All Rooms
            </Button>
            {rooms.map((room) => (
              <Button
                key={room.id}
                variant={selectedRoomId === room.id ? "default" : "outline"}
                onClick={() => setSelectedRoomId(room.id)}
                className={
                  selectedRoomId === room.id ? "bg-blue-600 text-white hover:bg-blue-700" : "border-slate-300"
                }
              >
                {room.name}
              </Button>
            ))}
          </div>
          <Button onClick={handleReanalyze} className="bg-blue-600 text-white hover:bg-blue-700">
            Re-analyze now
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isLoading && (
          <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            Loading latest readings from Supabase...
          </div>
        )}
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
