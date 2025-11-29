// Mock energy usage data for Household and Office demos
export type EnergyRecord = {
  timestamp: string
  deviceName: string
  room: string
  energyKwh: number
  cost: number
  isBusinessHours?: boolean
}

// Generate hourly data for the last 30 days
function generateMockData(devices: string[], rooms: string[], isOffice: boolean): EnergyRecord[] {
  const records: EnergyRecord[] = []
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  for (let d = thirtyDaysAgo; d <= now; d.setHours(d.getHours() + 1)) {
    const hour = d.getHours()
    const isBusinessHour = isOffice && hour >= 9 && hour <= 18

    devices.forEach((device, idx) => {
      const room = rooms[idx % rooms.length]
      let baseUsage = Math.random() * 2

      // Add patterns
      if (device === "Fridge" || device === "Server Rack") {
        baseUsage = 0.5 + Math.random() * 0.3 // Always on
      } else if (device === "AC Unit 1" || device === "AC Unit 2") {
        if (isBusinessHour) baseUsage = 2 + Math.random() * 1
        else baseUsage = Math.random() * 0.5
      } else if (device.includes("Lights")) {
        if (isBusinessHour) baseUsage = 1 + Math.random() * 0.5
        else baseUsage = Math.random() * 0.2
      }

      records.push({
        timestamp: new Date(d).toISOString(),
        deviceName: device,
        room,
        energyKwh: baseUsage,
        cost: baseUsage * (isBusinessHour ? 0.28 : 0.2),
        isBusinessHours: isBusinessHour,
      })
    })
  }

  return records
}

const HOUSEHOLD_DEVICES = [
  "Fridge",
  "Washing Machine",
  "Dishwasher",
  "Lights",
  "TV",
  "Heating System",
  "Water Heater",
  "Oven",
]

const HOUSEHOLD_ROOMS = ["Kitchen", "Living Room", "Bedroom", "Bathroom", "Hallway"]

const OFFICE_DEVICES = [
  "Lights",
  "AC Unit 1",
  "AC Unit 2",
  "Server Rack",
  "Workstations",
  "Meeting Room Screens",
  "Coffee Machine",
]

const OFFICE_ROOMS = ["Open Floor", "Meeting Room A", "Meeting Room B", "Server Room", "Restroom"]

export const HOUSEHOLD_DATA = generateMockData(HOUSEHOLD_DEVICES, HOUSEHOLD_ROOMS, false)

export const OFFICE_DATA = generateMockData(OFFICE_DEVICES, OFFICE_ROOMS, true)

export type Summary = {
  totalEnergyKwh: number
  totalCost: number
  avoidableCost: number
  co2Emissions: number
  baseload: number
  peakUsage: number
  averageDailyUsage: number
}

export function calculateSummary(data: EnergyRecord[]): Summary {
  const totalEnergyKwh = data.reduce((sum, r) => sum + r.energyKwh, 0)
  const totalCost = data.reduce((sum, r) => sum + r.cost, 0)

  // Calculate baseload (min continuous usage)
  const hourlyTotals = Array(24).fill(0)
  data.forEach((r) => {
    const hour = new Date(r.timestamp).getHours()
    hourlyTotals[hour] += r.energyKwh
  })
  const baseload = Math.min(...hourlyTotals) * 30

  return {
    totalEnergyKwh: Math.round(totalEnergyKwh * 10) / 10,
    totalCost: Math.round(totalCost * 100) / 100,
    avoidableCost: Math.round(totalCost * 0.25 * 100) / 100, // 25% is typically avoidable
    co2Emissions: Math.round(totalEnergyKwh * 0.233 * 10) / 10, // UK grid avg
    baseload: Math.round(baseload * 10) / 10,
    peakUsage: Math.max(...hourlyTotals),
    averageDailyUsage: Math.round((totalEnergyKwh / 30) * 10) / 10,
  }
}

export const HOUSEHOLD_SUMMARY = calculateSummary(HOUSEHOLD_DATA)
export const OFFICE_SUMMARY = calculateSummary(OFFICE_DATA)

export const AI_INSIGHTS_HOUSEHOLD = [
  "Baseload at night is 2.8 kW due to fridge, heating system, and always-on devices.",
  "Refrigerator is your single largest continuous consumer at ~0.5 kWh/day.",
  "Peak usage occurs at 6–8 PM when cooking and lighting peak simultaneously.",
  "Weekend usage is 15% higher than weekdays, suggesting increased appliance use.",
  "Water heater could be on a timer to avoid heating during off-peak hours.",
]

export const AI_INSIGHTS_OFFICE = [
  "Server rack runs continuously at 2.1 kW, consuming 50 kWh/day alone.",
  "AC units run at full capacity 9–6 PM but exceed 40°C set-point on hot days.",
  "Office lights remain on after 9 PM on 20% of weekdays (compliance risk).",
  "Meeting room screens are left on standby, wasting ~1.2 kWh/day.",
  "Peak demand charge ($8–12/day) occurs at 3–5 PM; shifting meetings earlier saves 5–8%.",
]

export type Recommendation = {
  id: string
  title: string
  impact: "high" | "medium" | "low"
  difficulty: "low" | "medium" | "high"
  savingsKwhPerMonth: number
  savingsPoundPerMonth: number
  tags: string[]
  description: string
  details: string[]
  steps: string[]
}

export const RECOMMENDATIONS_HOUSEHOLD: Recommendation[] = [
  {
    id: "1",
    title: "Replace old fridge with ENERGY STAR model",
    impact: "high",
    difficulty: "high",
    savingsKwhPerMonth: 25,
    savingsPoundPerMonth: 5.5,
    tags: ["Appliance", "High ROI", "Long-term"],
    description: "Old fridges waste 15–20% more energy than modern models.",
    details: [
      "Current fridge uses ~0.5 kWh/day consistently",
      "ENERGY STAR models use 40% less energy",
      "Upfront cost: £600–800, payback in 3–4 years",
    ],
    steps: [
      "Compare ENERGY STAR certified fridges on price/capacity",
      "Schedule delivery and removal",
      "Recycle old unit responsibly",
      "Monitor new fridge usage over 2 weeks",
    ],
  },
  {
    id: "2",
    title: "Turn off heating system at night in summer",
    impact: "high",
    difficulty: "low",
    savingsKwhPerMonth: 18,
    savingsPoundPerMonth: 4.2,
    tags: ["HVAC", "Schedule", "Quick win"],
    description: "Disable heating 10 PM–6 AM when outdoor temps are cool.",
    details: ["Saves ~0.6 kWh/night × 30 nights in warmer months", "No comfort impact; homes retain heat overnight"],
    steps: [
      "Check thermostat schedule setting",
      'Set night mode to 62°F (17°C) or "off"',
      "Test one week and confirm indoor temps stay comfortable",
    ],
  },
  {
    id: "3",
    title: "Install programmable smart thermostats",
    impact: "medium",
    difficulty: "medium",
    savingsKwhPerMonth: 35,
    savingsPoundPerMonth: 8.1,
    tags: ["HVAC", "Technology", "Smart Home"],
    description: "Smart thermostats learn your schedule and optimize heating/cooling.",
    details: [
      "Cost: £200–300 (DIY install)",
      "Typical savings: 10–15% on heating/cooling",
      "Bonus: remote control and usage insights",
    ],
    steps: [
      "Choose device (Nest, Ecobee, Honeywell)",
      "Turn off power at breaker before installation",
      "Follow manufacturer install guide",
      "Connect to WiFi and create schedules",
    ],
  },
]

export const RECOMMENDATIONS_OFFICE: Recommendation[] = [
  {
    id: "1",
    title: "Power down server rack after business hours",
    impact: "high",
    difficulty: "high",
    savingsKwhPerMonth: 150,
    savingsPoundPerMonth: 42,
    tags: ["Server", "Schedule", "IT"],
    description: "Most services can run on a single low-power VM overnight.",
    details: [
      "Server rack currently draws 2.1 kW 24/7 = 50 kWh/day",
      "Shutting down 6 PM–9 AM saves 33 kWh/day",
      "Requires IT coordination and brief unplanned downtime risk",
    ],
    steps: [
      "Audit which services truly need 24/7 uptime",
      "Migrate non-critical services to cloud",
      "Set up scheduled shutdown via BIOS settings",
      "Test graceful restart procedure",
    ],
  },
  {
    id: "2",
    title: "Replace office lights with LED fixtures",
    impact: "high",
    difficulty: "medium",
    savingsKwhPerMonth: 45,
    savingsPoundPerMonth: 12.6,
    tags: ["Lighting", "Capex", "Quick win"],
    description: "LEDs use 75% less energy than incandescent and last 10 years.",
    details: [
      "Upfront cost: £2,000–3,000 for office",
      "Payback period: 18–24 months",
      "Improved light quality and employee satisfaction",
    ],
    steps: [
      "Audit current bulbs and fixture count",
      "Get LED retrofit quotes",
      "Schedule installation off-hours",
      "Dispose of old bulbs at e-waste center",
    ],
  },
  {
    id: "3",
    title: "Install motion sensors for lights",
    impact: "medium",
    difficulty: "low",
    savingsKwhPerMonth: 22,
    savingsPoundPerMonth: 6.16,
    tags: ["Lighting", "Automation", "Quick win"],
    description: "Auto-off lights when rooms are unoccupied.",
    details: [
      "Cost: £15–50 per sensor + installation",
      "Especially effective for restrooms and storage",
      "Reduces waste on after-hours lights",
    ],
    steps: [
      "Identify rooms with highest non-use hours",
      "Purchase motion-sensor switch modules",
      "Test sensitivity and delay settings",
      "Monitor for a month and adjust as needed",
    ],
  },
]
