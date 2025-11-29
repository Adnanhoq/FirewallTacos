import Link from "next/link";
import {
  Zap,
  Home,
  Building2,
  TrendingDown,
  Lightbulb,
  BarChart3,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950">
      {/* Top nav */}
      <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 shadow-sm">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-semibold tracking-tight">
                WattWise
              </span>
              <span className="text-xs text-muted-foreground">
                AI Energy Coach
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="#how-it-works">How it works</Link>
            </Button>
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href="/dashboard?dataset=household">Open dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="container mx-auto px-4 pb-16 pt-10 sm:pt-16">
        <section className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-center">
          {/* Left column */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50/70 px-3 py-1 text-xs font-medium text-emerald-800 shadow-sm dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-100">
              <Lightbulb className="h-3.5 w-3.5" />
              <span>Room-by-room AI energy insights</span>
            </div>

            <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Turn{" "}
              <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                raw energy data
              </span>{" "}
              into action.
            </h1>

            <p className="mt-4 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
              WattWise connects your readings to AI so you can see which{" "}
              <span className="font-medium text-slate-900 dark:text-slate-50">
                rooms and devices
              </span>{" "}
              are wasting power, get targeted tips, and cut costs without
              guessing.
            </p>

            {/* Hero stats */}
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-700 dark:text-slate-200">
              <div className="flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900/70 dark:ring-slate-800">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                <span>Real-time room breakdowns</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900/70 dark:ring-slate-800">
                <TrendingDown className="h-4 w-4 text-emerald-600" />
                <span>AI suggestions powered by Gemini</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="px-6">
                <Link href="/dashboard?dataset=household">
                  <Home className="mr-2 h-4 w-4" />
                  Try household demo
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="px-6">
                <Link href="/dashboard?dataset=office">
                  <Building2 className="mr-2 h-4 w-4" />
                  Try office demo
                </Link>
              </Button>
            </div>

            {/* Mini trust row */}
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span>Built with Supabase &amp; Gemini</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span>No hardware required — sample data included</span>
            </div>
          </div>

          {/* Right column – fake dashboard preview */}
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-tr from-blue-200/60 via-emerald-200/50 to-transparent blur-3xl dark:from-blue-900/40 dark:via-emerald-900/40" />
            <Card className="overflow-hidden border-slate-200/70 bg-white/90 shadow-xl backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/80">
              <CardHeader className="border-b border-slate-100/70 bg-slate-50/60 pb-3 dark:border-slate-800 dark:bg-slate-900/60">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">
                      Live household snapshot
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Kitchen is using 38% of energy right now
                    </CardDescription>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-100">
                    AI coach enabled
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {/* Room pills */}
                <div className="flex flex-wrap gap-2 text-xs">
                  {["All rooms", "Kitchen", "Master bedroom", "Study"].map(
                    (room, idx) => (
                      <button
                        key={room}
                        className={`rounded-full border px-3 py-1 ${
                          idx === 1
                            ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/60 dark:text-blue-100"
                            : "border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {room}
                      </button>
                    )
                  )}
                </div>

                {/* Fake chart bars */}
                <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-xs dark:border-slate-800 dark:bg-slate-900/80">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-slate-500">
                    <span>Today&apos;s usage</span>
                    <span>+18% vs baseline</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: "Kitchen", value: 70, color: "bg-blue-500" },
                      {
                        label: "Living room",
                        value: 45,
                        color: "bg-emerald-500",
                      },
                      { label: "Study", value: 32, color: "bg-amber-500" },
                    ].map((item) => (
                      <div key={item.label} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                          <span>{item.label}</span>
                          <span>{item.value} kWh</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800">
                          <div
                            className={`h-full ${item.color}`}
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI insight list */}
                <div className="space-y-2 rounded-xl border border-emerald-100 bg-emerald-50/70 p-3 text-xs text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-100">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide">
                    <Lightbulb className="h-3.5 w-3.5" />
                    <span>AI insights</span>
                  </div>
                  <ul className="space-y-1">
                    <li className="flex gap-2">
                      <span className="mt-0.5 text-emerald-500">•</span>
                      <span>
                        Move dishwasher and oven use to off-peak hours for ~12%
                        savings.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-0.5 text-emerald-500">•</span>
                      <span>
                        Study room devices stay on after 22:00. Suggest
                        automatic shutdown.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-0.5 text-emerald-500">•</span>
                      <span>
                        Kitchen lighting could be cut by 25% with task-lighting
                        scenes.
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="mt-16 rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70"
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                How WattWise works
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                From raw readings to room-level actions in three simple steps.
              </p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-100">
                1
              </div>
              <h3 className="text-sm font-semibold">Ingest your readings</h3>
              <p className="text-sm text-muted-foreground">
                Sample datasets stream into Supabase, capturing usage per room,
                device, and tariff band.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-100">
                2
              </div>
              <h3 className="text-sm font-semibold">Analyze room patterns</h3>
              <p className="text-sm text-muted-foreground">
                The dashboard breaks down kWh and cost so you can see which
                rooms and devices drive your bill.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-100">
                3
              </div>
              <h3 className="text-sm font-semibold">Get AI recommendations</h3>
              <p className="text-sm text-muted-foreground">
                Gemini turns those patterns into concrete actions you can take
                today to cut waste and emissions.
              </p>
            </div>
          </div>
        </section>

        {/* Demo cards */}
        <section className="mt-16">
          <h2 className="mb-2 text-center text-2xl font-bold tracking-tight">
            Choose a demo environment
          </h2>
          <p className="mb-8 text-center text-sm text-muted-foreground">
            Explore WattWise in a home or office setup. Both use the same AI
            engine, tuned to different spaces.
          </p>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Household Card */}
            <Card className="transition-all hover:-translate-y-0.5 hover:shadow-xl">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  <Home className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                </div>
                <CardTitle className="text-2xl">Household</CardTitle>
                <CardDescription className="text-base">
                  For homeowners who want to understand where every kWh goes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="mb-6 space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                    <span>Track HVAC, appliances, and lighting by room.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                    <span>
                      AI tips for cooking, laundry, and standby losses.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                    <span>Monitor monthly cost trends vs. your baseline.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                    <span>See the impact in CO₂ as well as currency.</span>
                  </li>
                </ul>
                <Button asChild className="w-full" size="lg">
                  <Link href="/dashboard?dataset=household">
                    Explore household demo
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Office Card */}
            <Card className="transition-all hover:-translate-y-0.5 hover:shadow-xl">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
                  <Building2 className="h-8 w-8 text-emerald-600 dark:text-emerald-300" />
                </div>
                <CardTitle className="text-2xl">Office</CardTitle>
                <CardDescription className="text-base">
                  For teams that want to cut bills without killing comfort.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="mb-6 space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                    <span>
                      Monitor equipment, monitors, and server energy draw.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                    <span>Spot after-hours waste across floors and rooms.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                    <span>
                      Optimize HVAC schedules and business-hours usage.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                    <span>Track progress towards sustainability targets.</span>
                  </li>
                </ul>
                <Button
                  asChild
                  className="w-full"
                  size="lg"
                  variant="secondary"
                >
                  <Link href="/dashboard?dataset=office">
                    Explore office demo
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/70 bg-white/70 py-6 text-center text-xs text-muted-foreground backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <p>
          © 2025 WattWise · AI energy coach built with Supabase &amp; Gemini for
          hackathon demo purposes.
        </p>
      </footer>
    </div>
  );
}
