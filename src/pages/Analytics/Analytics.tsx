// src/pages/Analytics/Analytics.tsx
// Practice Analytics — بنفس نمط باقي صفحات المشروع

import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement,
  LineElement, ArcElement, Filler, Tooltip, Legend,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Users, Activity, TrendingUp, Heart,
  AlertTriangle, Trophy, ArrowUpRight, ArrowDownRight,
  Calendar, Download,
} from "lucide-react";
// import SearchNavbar from "@/components/SearchNavbar/SearchNavbar";
// // حطيه في أول الـ JSX
// <SearchNavbar />
ChartJS.register(
  CategoryScale, LinearScale, PointElement,
  LineElement, ArcElement, Filler, Tooltip, Legend
);

// ── Types ─────────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
}

interface RiskPatient {
  name: string;
  initials: string;
  issue: string;
  issueType: "missing" | "alert";
  color: string;
}

interface LeaderEntry {
  rank: number;
  name: string;
  initials: string;
  adherence: number;
  color: string;
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const WEEKS = ["Week 1", "Week 2", "Week 3", "Week 4"];

const ACTIVITY_DATA = {
  labels: WEEKS,
  datasets: [{
    label: "Patient Activity",
    data: [420, 580, 710, 870],
    borderColor: "#016333",
    backgroundColor: "rgba(1,99,51,0.08)",
    borderWidth: 2.5,
    fill: true,
    tension: 0.45,
    pointRadius: 4,
    pointBackgroundColor: "#016333",
  }],
};

const DONUT_DATA = {
  labels: ["On Track", "Slow", "At Risk"],
  datasets: [{
    data: [65, 20, 15],
    backgroundColor: ["#016333", "#4ade80", "#fca5a5"],
    borderWidth: 0,
    hoverOffset: 4,
  }],
};

const RISK_PATIENTS: RiskPatient[] = [
  { name: "Sarah Jenkins", initials: "SJ", issue: "No logs for 3 days",   issueType: "missing", color: "bg-green-700" },
  { name: "Michael Chang",  initials: "MC", issue: "Abnormal weight spike", issueType: "alert",   color: "bg-gray-700" },
];

const LEADERS: LeaderEntry[] = [
  { rank: 1, name: "Emily R.",   initials: "ER", adherence: 99, color: "bg-green-700" },
  { rank: 2, name: "James D.",   initials: "JD", adherence: 96, color: "bg-emerald-600" },
  { rank: 3, name: "Alicia M.",  initials: "AM", adherence: 92, color: "bg-teal-600" },
];

const RANGE_OPTIONS = ["Last 7 Days", "Last 30 Days", "Last 3 Months", "Last Year"];

// ── Sub-components ─────────────────────────────────────────────────────────────

const StatCard: React.FC<StatCardProps> = ({ title, value, change, positive, icon }) => (
  <div className="bg-white rounded-xl px-4 py-4 shadow-sm flex items-start justify-between gap-3">
    <div>
      <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <div className={`flex items-center gap-1 mt-1 text-xs font-semibold ${positive ? "text-green-600" : "text-red-500"}`}>
        {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
        {change}
      </div>
    </div>
    <div className={`p-2 rounded-lg ${positive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-500"}`}>
      {icon}
    </div>
  </div>
);

// ── Main Page ──────────────────────────────────────────────────────────────────

const Analytics: React.FC = () => {
  const [range, setRange] = useState("Last 30 Days");
  const [showRange, setShowRange] = useState(false);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { mode: "index" as const, intersect: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#9ca3af", font: { size: 11 } } },
      y: { grid: { color: "#f3f4f6" }, ticks: { color: "#9ca3af", font: { size: 11 } } },
    },
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "72%",
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-5 md:px-8 md:py-7">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
            Practice<br />Analytics
          </h1>
          <p className="text-sm text-gray-400 mt-1">Overview of patient engagement and clinical outcomes.</p>
        </div>

        {/* Date Range Picker */}
        <div className="relative self-start sm:self-center">
          <button
            onClick={() => setShowRange(p => !p)}
            className="flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <Calendar size={15} className="text-green-700" />
            {range}
            <span className="text-gray-400 text-xs">▾</span>
          </button>
          {showRange && (
            <div className="absolute right-0 top-10 bg-white border border-gray-100 rounded-xl shadow-lg z-10 py-1 w-44">
              {RANGE_OPTIONS.map(r => (
                <button
                  key={r}
                  onClick={() => { setRange(r); setShowRange(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-green-50 transition-colors ${range === r ? "text-green-700 font-semibold" : "text-gray-600"}`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard title="Total Patients"   value="1,280" change="+4.2%"  positive={true}  icon={<Users size={18} />} />
        <StatCard title="Active Patients"  value="945"   change="+12.5%" positive={true}  icon={<Activity size={18} />} />
        <StatCard title="Avg. Progress"    value="72%"   change="0.0%"   positive={true}  icon={<TrendingUp size={18} />} />
        <StatCard title="Retention Rate"   value="88%"   change="-1.2%"  positive={false} icon={<Heart size={18} />} />
      </div>

      {/* ── Patient Activity Chart ── */}
      <div className="bg-white rounded-xl p-5 shadow-sm mb-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold text-gray-800">Patient Activity</h2>
          <button className="flex items-center gap-1.5 text-green-700 text-xs font-semibold hover:underline">
            <Download size={13} /> EXPORT REPORT
          </button>
        </div>
        <div style={{ height: 200 }}>
          <Line data={ACTIVITY_DATA} options={chartOptions} />
        </div>
      </div>

      {/* ── Progress Distribution + Meal Plan Adherence ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">

        {/* Donut */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-800 mb-4">Progress Distribution</h2>
          <div className="flex flex-col items-center">
            <div className="relative" style={{ width: 160, height: 160 }}>
              <Doughnut data={DONUT_DATA} options={donutOptions} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-gray-800">65%</span>
                <span className="text-[10px] text-gray-400 font-semibold tracking-wide">ON TRACK</span>
              </div>
            </div>
            <div className="flex gap-5 mt-4">
              {[
                { label: "On Track (65%)", color: "bg-[#016333]" },
                { label: "Slow (20%)",     color: "bg-green-300" },
                { label: "At Risk (15%)",  color: "bg-red-300"   },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Meal Plan Adherence — gauge style */}
        <div className="bg-white rounded-xl p-5 shadow-sm flex flex-col">
          <h2 className="text-base font-bold text-gray-800 mb-4">Meal Plan Adherence</h2>
          <div className="flex flex-col items-center justify-center flex-1 gap-4">
            {/* Simple semi-circle via SVG */}
            <div className="relative" style={{ width: 180, height: 100 }}>
              <svg viewBox="0 0 180 100" className="w-full h-full">
                {/* track */}
                <path d="M 10 90 A 80 80 0 0 1 170 90" fill="none" stroke="#e5e7eb" strokeWidth="16" strokeLinecap="round" />
                {/* progress 82% */}
                <path d="M 10 90 A 80 80 0 0 1 170 90" fill="none" stroke="#016333" strokeWidth="16" strokeLinecap="round"
                  strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.82)} />
              </svg>
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
                <span className="text-3xl font-extrabold text-gray-800">82%</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 w-full mt-2">
              {[
                { label: "Breakfast", val: "91%", color: "text-green-700" },
                { label: "Lunch",     val: "85%", color: "text-green-600" },
                { label: "Dinner",    val: "70%", color: "text-orange-500" },
              ].map(m => (
                <div key={m.label} className="bg-gray-50 rounded-lg p-2 text-center">
                  <div className={`text-base font-bold ${m.color}`}>{m.val}</div>
                  <div className="text-[10px] text-gray-400">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Patients at Risk + Engagement Leaders ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Patients at Risk */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="flex items-center gap-2 text-base font-bold text-gray-800">
              <AlertTriangle size={16} className="text-orange-500" /> Patients at Risk
            </h2>
            <span className="text-[10px] font-bold bg-red-500 text-white px-2.5 py-1 rounded-full">
              Action Required
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {RISK_PATIENTS.map(p => (
              <div key={p.name} className="flex items-center justify-between gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${p.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {p.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{p.name}</div>
                    <div className={`text-xs flex items-center gap-1 ${p.issueType === "alert" ? "text-red-500" : "text-orange-500"}`}>
                      {p.issueType === "alert" ? "⚠" : "🕐"} {p.issue}
                    </div>
                  </div>
                </div>
                <button className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg font-semibold text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap">
                  REVIEW
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Leaders */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-base font-bold text-gray-800 mb-4">
            <Trophy size={16} className="text-green-700" /> Engagement Leaders
          </h2>
          <div className="flex flex-col gap-2">
            {LEADERS.map(l => (
              <div key={l.name} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5">
                <span className="text-sm font-bold text-gray-400 w-4">{l.rank}</span>
                <div className={`w-8 h-8 rounded-full ${l.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {l.initials}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-800">{l.name}</div>
                  <div className="text-xs text-gray-400">{l.adherence}% Adherence</div>
                </div>
                <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600 rounded-full" style={{ width: `${l.adherence}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;