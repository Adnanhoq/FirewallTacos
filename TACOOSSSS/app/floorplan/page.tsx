"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";
import { LayoutHeader } from "@/components/layout-header";
import { Card, CardContent } from "@/components/ui/card";
import { HOUSEHOLD_DATA, type EnergyRecord } from "@/lib/mock-data";
import {
  BREAKDOWN_COLORS,
  buildDeviceBreakdown,
  type BreakdownItem,
} from "@/components/chart-breakdown";
import { createClient } from "@/lib/supabase/client";

type TariffBand = "off_peak" | "shoulder" | "peak";

const TARIFF_RATES: Record<TariffBand, number> = {
  off_peak: 0.12,
  shoulder: 0.18,
  peak: 0.28,
};

const ROOM_NAME_MAP: Record<string, string[]> = {
  kitchen: ["Kitchen"],
  living: ["Living", "Living Room"],
  study: ["Study", "Hallway"],
  "master-bedroom": ["Master bedroom", "Master Bedroom"],
  "bedroom-1": ["Bedroom 1", "Bedroom"],
  "bedroom-2": ["Bedroom 2", "Bedroom"],
  "bedroom-3": ["Bedroom 3", "Bedroom"],
  "bedroom-4": ["Bedroom 4", "Bedroom"],
  "bathroom-1": ["Bathroom 1", "Bathroom"],
  "bathroom-2": ["Bathroom 2", "Bathroom"],
};

const TOOLTIP_WIDTH = 260;
const TOOLTIP_HEIGHT = 220;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function buildRoomBreakdown(
  roomId: string,
  dataset: EnergyRecord[]
): BreakdownItem[] {
  const targets = ROOM_NAME_MAP[roomId]?.map((name) => name.toLowerCase()) ?? [
    roomId.toLowerCase(),
  ];

  const filtered = dataset.filter((record) =>
    targets.includes((record.room ?? "").toLowerCase())
  );
  return buildDeviceBreakdown(filtered).slice(0, 8);
}

function RoomHoverChart({ data }: { data: BreakdownItem[] }) {
  if (!data.length) return null;

  return (
    <div className="pointer-events-none w-[260px] rounded-lg border border-slate-200 bg-white p-3 shadow-xl">
      <p className="text-sm font-semibold text-slate-900">Energy by device</p>
      <ResponsiveContainer width="100%" height={140}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={30}
            outerRadius={60}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={BREAKDOWN_COLORS[index % BREAKDOWN_COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-600">
        {data.slice(0, 6).map((item, index) => (
          <div key={item.name} className="flex items-center gap-1 truncate">
            <span
              className="inline-block h-2 w-2 rounded-sm"
              style={{
                backgroundColor:
                  BREAKDOWN_COLORS[index % BREAKDOWN_COLORS.length],
              }}
            />
            <span className="truncate">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FloorplanPage() {
  const [energyData, setEnergyData] = useState<EnergyRecord[]>(HOUSEHOLD_DATA);
  const [tooltip, setTooltip] = useState<{
    roomId: string;
    x: number;
    y: number;
  } | null>(null);
  const svgWrapperRef = useRef<HTMLDivElement>(null);

  const breakdownData = useMemo(() => {
    if (!tooltip) return [] as BreakdownItem[];
    return buildRoomBreakdown(tooltip.roomId, energyData);
  }, [tooltip, energyData]);

  useEffect(() => {
    const supabase = createClient();

    const fetchData = async () => {
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
          `
        )
        .order("reading_timestamp", { ascending: true });

      if (error || !data) {
        console.error("Failed to load floorplan energy data", error);
        return;
      }

      const mapped: EnergyRecord[] = data.map((row) => {
        const tariff = (row.tariff_band as TariffBand) ?? "shoulder";
        const usage = Number(row.usage_kwh ?? 0);
        const timestamp = row.reading_timestamp as string;
        const deviceName = row.devices?.name ?? "Unknown device";
        const roomName = row.devices?.rooms?.name ?? "Unknown room";
        const hour = new Date(timestamp).getHours();

        return {
          timestamp,
          deviceName,
          room: roomName,
          energyKwh: usage,
          cost: usage * TARIFF_RATES[tariff],
          isBusinessHours: hour >= 9 && hour <= 18,
        };
      });

      setEnergyData(mapped.length ? mapped : HOUSEHOLD_DATA);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const rooms = document.querySelectorAll<SVGRectElement>(".room");

    const computePosition = (event: MouseEvent) => {
      const container = svgWrapperRef.current;
      if (!container) return null;

      const rect = container.getBoundingClientRect();
      const padding = 8;
      const maxX = Math.max(rect.width - TOOLTIP_WIDTH - padding, padding);
      const maxY = Math.max(rect.height - TOOLTIP_HEIGHT - padding, padding);

      const relativeX = event.clientX - rect.left;
      const relativeY = event.clientY - rect.top;

      return {
        x: clamp(relativeX + 12, padding, maxX),
        y: clamp(relativeY + 12, padding, maxY),
      };
    };

    const handleClick = (event: Event) => {
      const target = event.target as SVGElement | null;
      if (!target) return;
      console.log("Clicked room:", target.id);
    };

    const handleEnter = (event: MouseEvent) => {
      const target = event.target as SVGElement | null;
      if (!target) return;
      console.log("Hover start:", target.id);

      const position = computePosition(event);
      if (!position) return;
      setTooltip({ roomId: target.id, ...position });
    };

    const handleMove = (event: MouseEvent) => {
      const target = event.target as SVGElement | null;
      if (!target) return;
      const position = computePosition(event);
      if (!position) return;
      setTooltip({ roomId: target.id, ...position });
    };

    const handleLeave = () => {
      setTooltip(null);
    };

    rooms.forEach((room) => {
      room.addEventListener("click", handleClick);
      room.addEventListener("mouseenter", handleEnter);
      room.addEventListener("mousemove", handleMove);
      room.addEventListener("mouseleave", handleLeave);
    });

    return () => {
      rooms.forEach((room) => {
        room.removeEventListener("click", handleClick);
        room.removeEventListener("mouseenter", handleEnter);
        room.removeEventListener("mousemove", handleMove);
        room.removeEventListener("mouseleave", handleLeave);
      });
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <LayoutHeader title="Floorplan" badge="Interactive rooms" />

      <div className="max-w-5xl mx-auto px-4 py-10">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold text-white-900">
                  Home floorplan
                </h2>
                <p className="text-sm text-slate-600">
                  Hover or click any room to highlight it and log the selection
                  in your console.
                </p>
              </div>

              <div className="w-full flex justify-center">
                <div
                  ref={svgWrapperRef}
                  className="relative overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-30"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 445 671"
                    width="445"
                    height="671"
                    className="h-auto w-full max-w-[445px]"
                  >
                    <style>{`
                      .room {
                        fill: transparent;
                        stroke: transparent;
                        cursor: pointer;
                      }
                      .room:hover {
                        fill: #4f46e5;
                        fill-opacity: 0.2;
                      }
                    `}</style>

                    <image
                      href="/floorplan.png"
                      x="0"
                      y="0"
                      width="445"
                      height="671"
                      preserveAspectRatio="none"
                    />

                    <rect
                      id="master-bedroom"
                      className="room"
                      x="20"
                      y="25"
                      width="200"
                      height="170"
                    >
                      <title>Master bedroom</title>
                    </rect>

                    <rect
                      id="study"
                      className="room"
                      x="20"
                      y="180"
                      width="160"
                      height="110"
                    >
                      <title>Study</title>
                    </rect>

                    <rect
                      id="living"
                      className="room"
                      x="20"
                      y="340"
                      width="200"
                      height="130"
                    >
                      <title>Living</title>
                    </rect>

                    <rect
                      id="kitchen"
                      className="room"
                      x="20"
                      y="470"
                      width="160"
                      height="120"
                    >
                      <title>Kitchen</title>
                    </rect>

                    <rect
                      id="bathroom-1"
                      className="room"
                      x="215"
                      y="40"
                      width="100"
                      height="80"
                    >
                      <title>Bathroom 1</title>
                    </rect>

                    <rect
                      id="bathroom-2"
                      className="room"
                      x="320"
                      y="40"
                      width="90"
                      height="80"
                    >
                      <title>Bathroom 2</title>
                    </rect>

                    <rect
                      id="bedroom-1"
                      className="room"
                      x="250"
                      y="120"
                      width="165"
                      height="110"
                    >
                      <title>Bedroom 1</title>
                    </rect>

                    <rect
                      id="bedroom-2"
                      className="room"
                      x="250"
                      y="225"
                      width="165"
                      height="110"
                    >
                      <title>Bedroom 2</title>
                    </rect>

                    <rect
                      id="bedroom-3"
                      className="room"
                      x="250"
                      y="340"
                      width="165"
                      height="100"
                    >
                      <title>Bedroom 3</title>
                    </rect>

                    <rect
                      id="bedroom-4"
                      className="room"
                      x="290"
                      y="440"
                      width="117"
                      height="110"
                    >
                      <title>Bedroom 4</title>
                    </rect>
                  </svg>
                  {tooltip && breakdownData.length > 0 && (
                    <div
                      className="absolute z-30"
                      style={{ left: tooltip.x, top: tooltip.y }}
                    >
                      <RoomHoverChart data={breakdownData} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
