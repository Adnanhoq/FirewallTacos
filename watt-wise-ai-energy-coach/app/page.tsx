"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Zap, Building2 } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Zap className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl font-bold text-slate-900">WattWise</h1>
          </div>
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">AI Energy Coach</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
            Understand your energy usage and get AI-powered tips to cut your bill.
          </p>
          <p className="text-sm text-slate-500">
            Choose a demo to explore real-time energy insights and AI recommendations
          </p>
        </div>

        {/* Demo Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Household Demo */}
          <Link href="/dashboard?space=household">
            <Card className="bg-white border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer h-full">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-blue-100 p-3 rounded-lg">{/* Home icon */}</div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Household Demo</h3>
                    <p className="text-sm text-slate-500">Residential energy insights</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-6">
                  Analyze a typical home's energy usage including appliances, heating, and lighting. Get personalized
                  recommendations to reduce bills and carbon footprint.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-xs font-semibold text-slate-700">Devices tracked:</p>
                  <p className="text-sm text-slate-600">Fridge, Heating, Dishwasher, Lights, AC, TV</p>
                </div>
                <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">Try Household Demo →</Button>
              </CardContent>
            </Card>
          </Link>

          {/* Office Demo */}
          <Link href="/dashboard?space=office">
            <Card className="bg-white border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer h-full">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <Building2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Office Demo</h3>
                    <p className="text-sm text-slate-500">Commercial energy insights</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-6">
                  Monitor office energy consumption including HVAC, lighting, and server infrastructure. Identify peak
                  demand charges and cost-saving opportunities.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-xs font-semibold text-slate-700">Devices tracked:</p>
                  <p className="text-sm text-slate-600">Server Rack, AC, Lights, Workstations, Meeting Screens</p>
                </div>
                <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700">Try Office Demo →</Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Features Overview */}
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="pt-8">
            <h3 className="text-lg font-bold text-slate-900 mb-6">What You'll Discover</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">📊 Real-Time Insights</h4>
                <p className="text-sm text-slate-600">
                  View hourly and daily energy usage patterns with interactive charts.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">🤖 AI Recommendations</h4>
                <p className="text-sm text-slate-600">
                  Get actionable tips to reduce consumption, costs, and CO₂ emissions.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">💡 Smart Playbook</h4>
                <p className="text-sm text-slate-600">
                  Filterable list of energy-saving strategies with estimated savings.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
