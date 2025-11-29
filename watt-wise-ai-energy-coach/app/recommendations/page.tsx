"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RecommendationCard } from "@/components/recommendation-card"
import { LayoutHeader } from "@/components/layout-header"
import { RECOMMENDATIONS_HOUSEHOLD, RECOMMENDATIONS_OFFICE, type Recommendation } from "@/lib/mock-data"
import { X, CheckCircle2 } from "lucide-react"

export default function Recommendations() {
  const [impact, setImpact] = useState<"high" | "medium" | "low" | "all">("all")
  const [difficulty, setDifficulty] = useState<"low" | "medium" | "high" | "all">("all")
  const [quickWinsOnly, setQuickWinsOnly] = useState(false)
  const [selectedRec, setSelectedRec] = useState<Recommendation | null>(null)

  const allRecs = [...RECOMMENDATIONS_HOUSEHOLD, ...RECOMMENDATIONS_OFFICE]

  const filteredRecs = useMemo(() => {
    return allRecs.filter((rec) => {
      if (impact !== "all" && rec.impact !== impact) return false
      if (difficulty !== "all" && rec.difficulty !== difficulty) return false
      if (quickWinsOnly && !rec.tags.includes("Quick win")) return false
      return true
    })
  }, [impact, difficulty, quickWinsOnly])

  return (
    <main className="min-h-screen bg-slate-50">
      <LayoutHeader title="Energy-Saving Playbook" />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="bg-white border-slate-200 mb-8">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">Impact</label>
                <select
                  value={impact}
                  onChange={(e) => setImpact(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  <option value="all">All</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  <option value="all">All</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={quickWinsOnly}
                    onChange={(e) => setQuickWinsOnly(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-semibold text-slate-900">Quick Wins Only</span>
                </label>
              </div>

              <div className="flex items-end justify-end">
                <Button
                  onClick={() => {
                    setImpact("all")
                    setDifficulty("all")
                    setQuickWinsOnly(false)
                  }}
                  variant="outline"
                  className="border-slate-300"
                >
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-8">
          <p className="text-sm text-slate-600 mb-4">
            Found <span className="font-bold text-slate-900">{filteredRecs.length}</span> recommendation
            {filteredRecs.length !== 1 ? "s" : ""}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecs.map((rec) => (
              <RecommendationCard key={rec.id} rec={rec} onClick={() => setSelectedRec(rec)} />
            ))}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRec && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-white border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
              <div>
                <CardTitle>{selectedRec.title}</CardTitle>
                <p className="text-sm text-slate-600 mt-2">{selectedRec.description}</p>
              </div>
              <button onClick={() => setSelectedRec(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-xs text-slate-600 mb-1">Monthly Savings</p>
                  <p className="text-2xl font-bold text-blue-600">£{selectedRec.savingsPoundPerMonth.toFixed(2)}</p>
                  <p className="text-xs text-slate-500 mt-1">{selectedRec.savingsKwhPerMonth} kWh</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <p className="text-xs text-slate-600 mb-1">Implementation</p>
                  <p className="text-lg font-semibold text-emerald-700 capitalize">
                    {selectedRec.difficulty} Difficulty
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Why This Matters</h4>
                <ul className="space-y-2">
                  {selectedRec.details.map((detail, idx) => (
                    <li key={idx} className="text-sm text-slate-700 flex gap-2">
                      <span className="text-emerald-600 mt-0.5">✓</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Implementation Steps</h4>
                <ol className="space-y-2">
                  {selectedRec.steps.map((step, idx) => (
                    <li key={idx} className="text-sm text-slate-700 flex gap-3">
                      <span className="font-semibold text-slate-400 min-w-6">{idx + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="pt-4 border-t border-slate-200 flex gap-2">
                <Button onClick={() => setSelectedRec(null)} variant="outline" className="flex-1 border-slate-300">
                  Close
                </Button>
                <Button className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Start This Action
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  )
}
