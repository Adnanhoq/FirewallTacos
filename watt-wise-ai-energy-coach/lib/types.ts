export type SpaceType = "household" | "office"

export type AlertMessage = {
  id: string
  message: string
  timestamp: Date
  severity: "info" | "warning" | "alert"
}
