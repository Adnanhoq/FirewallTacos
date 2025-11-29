import type { EnergyRecord } from "@/lib/mock-data";

export type RoomLLMSummary = {
  room: string;
  total_kwh: number;
  total_cost: number;
  peak_share_percent: number;
  offpeak_share_percent: number;
  top_devices: { name: string; kwh: number; cost: number }[];
};

export type LLMUsageSummary = {
  period: { start: string; end: string };
  overall: { total_kwh: number; total_cost: number };
  rooms: RoomLLMSummary[];
};

export function buildLLMUsageSummary(records: EnergyRecord[]): LLMUsageSummary {
  if (!records.length) {
    return {
      period: { start: "", end: "" },
      overall: { total_kwh: 0, total_cost: 0 },
      rooms: [],
    };
  }

  const sorted = [...records].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const period = {
    start: sorted[0].timestamp,
    end: sorted[sorted.length - 1].timestamp,
  };

  let total_kwh = 0;
  let total_cost = 0;

  const roomMap = new Map<
    string,
    {
      total_kwh: number;
      total_cost: number;
      peak_kwh: number;
      offpeak_kwh: number;
      devices: Map<string, { kwh: number; cost: number }>;
    }
  >();

  for (const r of records) {
    total_kwh += r.energyKwh;
    total_cost += r.cost;

    const roomName = r.room || "Unknown room";
    if (!roomMap.has(roomName)) {
      roomMap.set(roomName, {
        total_kwh: 0,
        total_cost: 0,
        peak_kwh: 0,
        offpeak_kwh: 0,
        devices: new Map(),
      });
    }

    const room = roomMap.get(roomName)!;
    room.total_kwh += r.energyKwh;
    room.total_cost += r.cost;

    if (r.isBusinessHours) room.peak_kwh += r.energyKwh;
    else room.offpeak_kwh += r.energyKwh;

    const deviceName = r.deviceName || "Unknown device";
    if (!room.devices.has(deviceName)) {
      room.devices.set(deviceName, { kwh: 0, cost: 0 });
    }
    const d = room.devices.get(deviceName)!;
    d.kwh += r.energyKwh;
    d.cost += r.cost;
  }

  const rooms: RoomLLMSummary[] = Array.from(roomMap.entries()).map(
    ([room, r]) => {
      const total = r.total_kwh || 1;
      const peak_share_percent = Number(
        ((r.peak_kwh / total) * 100).toFixed(1)
      );
      const offpeak_share_percent = Number(
        ((r.offpeak_kwh / total) * 100).toFixed(1)
      );

      const top_devices = Array.from(r.devices.entries())
        .map(([name, d]) => ({ name, kwh: d.kwh, cost: d.cost }))
        .sort((a, b) => b.kwh - a.kwh)
        .slice(0, 5);

      return {
        room,
        total_kwh: r.total_kwh,
        total_cost: r.total_cost,
        peak_share_percent,
        offpeak_share_percent,
        top_devices,
      };
    }
  );

  return {
    period,
    overall: { total_kwh, total_cost },
    rooms,
  };
}
