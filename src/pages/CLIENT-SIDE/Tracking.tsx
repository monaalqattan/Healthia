"use client"

import { useState } from "react"
import type { Range } from "../../components/types"
import { weightData, sleepData, statCards, achievements } from "../../components/Tracking/index"

import { StatCard } from "../../components/Tracking/StatCard"
import { WeightSection } from "../../components/Tracking/WeightSection"
import { NutritionCard } from "../../components/Tracking/NutritionCard"
import { SleepCard } from "../../components/Tracking/SleepCard"
import { AchievementsCard } from "../../components/Tracking/AchievementsCard"
import { AIInsightsCard } from "../../components/Tracking/AIInsightsCard"
import { BottomActions } from "../../components/Tracking/BottomActions"

export default function PatientDashboard() {
  const [range, setRange] = useState<Range>("week")

  return (
    <div className="min-h-screen bg-zinc-50 p-6 font-sans">
      <div className="mx-auto max-w-6xl space-y-5">
        {/* ── Page header ── */}
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-0.5 text-xs font-medium tracking-wider text-zinc-400 uppercase">
              Patient
            </p>
            <h1 className="text-xl font-semibold text-zinc-900">
              Jane Doe{" "}
              <span className="text-sm font-normal text-zinc-400">
                ID: 8849-B
              </span>
            </h1>
          </div>
          <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Active
          </span>
        </div>

        {/* ── Health overview cards ── */}
        <div className="grid grid-cols-6 gap-3">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>

        {/* ── Weight chart + goal ring ── */}
        <WeightSection
          data={weightData[range]}
          range={range}
          onRangeChange={setRange}
        />

        {/* ── Nutrition + Sleep ── */}
        <div className="grid grid-cols-2 gap-4">
          <NutritionCard />
          <SleepCard data={sleepData} />
        </div>

        {/* ── Goals & Achievements ── */}
        <AchievementsCard items={achievements} />

        {/* ── AI Insights ── */}
        <AIInsightsCard />

        {/* ── Bottom actions ── */}
        <BottomActions />
      </div>
    </div>
  )
}
