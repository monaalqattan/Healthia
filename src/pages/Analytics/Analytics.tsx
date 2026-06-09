import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement, Filler, Tooltip, Legend,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Users, Activity, TrendingUp, Heart,
  AlertTriangle, Trophy, ArrowUpRight, ArrowDownRight,
  Download, Loader2, Target, Scale, ClipboardList,
} from "lucide-react";
import { analyticsService } from "@/services/api";

ChartJS.register(
  CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement, Filler, Tooltip, Legend
);

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function buildMonthlyLabels(data: any[]) {
  return data.map(d => `${MONTH_NAMES[d._id.month - 1]} ${d._id.year}`);
}

const StatCard = ({
  title, value, change, positive, icon, isLoading,
}: {
  title: string; value: string | number; change: string;
  positive: boolean; icon: React.ReactNode; isLoading?: boolean;
}) => (
  <div className="bg-white rounded-xl px-4 py-4 shadow-sm flex items-start justify-between gap-3">
    <div>
      <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-800">
        {isLoading ? <span className="text-gray-300 animate-pulse">—</span> : value}
      </p>
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

const Analytics: React.FC = () => {
  const [data, setData]           = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState("");

  useEffect(() => {
    analyticsService.getDoctorAnalytics()
      .then(res => setData(res.data))
      .catch(() => setError("Failed to load analytics"))
      .finally(() => setIsLoading(false));
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { mode: "index" as const, intersect: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#9ca3af", font: { size: 11 } } },
      y: { grid: { color: "#f3f4f6" }, ticks: { color: "#9ca3af", font: { size: 11 } }, beginAtZero: true },
    },
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "72%",
    plugins: { legend: { display: false } },
  };

  // ── Chart Data ────────────────────────────────
  const patientActivityData = {
    labels: data?.patientsByMonth ? buildMonthlyLabels(data.patientsByMonth) : ["No data"],
    datasets: [{
      label: "New Patients",
      data: data?.patientsByMonth?.map((d: any) => d.count) || [0],
      borderColor: "#016333",
      backgroundColor: "rgba(1,99,51,0.08)",
      borderWidth: 2.5,
      fill: true,
      tension: 0.45,
      pointRadius: 4,
      pointBackgroundColor: "#016333",
    }],
  };

  const appointmentsData = {
    labels: data?.appointmentsByMonth ? buildMonthlyLabels(data.appointmentsByMonth) : ["No data"],
    datasets: [{
      label: "Appointments",
      data: data?.appointmentsByMonth?.map((d: any) => d.count) || [0],
      backgroundColor: "#065F46",
      borderRadius: 6,
    }],
  };

  // BMI Distribution chart
  const bmiDist = data?.bmiDistribution || {};
  const bmiChartData = {
    labels: ["Underweight", "Normal", "Overweight", "Obese"],
    datasets: [{
      data: [bmiDist.underweight || 0, bmiDist.normal || 0, bmiDist.overweight || 0, bmiDist.obese || 0],
      backgroundColor: ["#3b82f6", "#16a34a", "#ca8a04", "#ef4444"],
      borderWidth: 0,
      hoverOffset: 4,
    }],
  };

  // Diet Plan coverage chart
  const planCoverage = {
    labels: ["With Plan", "Without Plan"],
    datasets: [{
      data: [data?.patientsWithPlanCount || 0, data?.patientsWithoutPlan || 0],
      backgroundColor: ["#016333", "#e5e7eb"],
      borderWidth: 0,
      hoverOffset: 4,
    }],
  };

  // Online vs Offline
  const onlineCount  = data?.clientTypeStats?.find((c: any) => c._id === "online")?.count  || 0;
  const offlineCount = data?.clientTypeStats?.find((c: any) => c._id === "offline")?.count || 0;
  const totalForPct  = onlineCount + offlineCount || 1;

  const clientTypeData = {
    labels: ["Online", "Offline"],
    datasets: [{
      data: [onlineCount, offlineCount],
      backgroundColor: ["#016333", "#4ade80"],
      borderWidth: 0,
      hoverOffset: 4,
    }],
  };

  const completionRate = data
    ? data.totalAppointments > 0
      ? Math.round((data.completedAppointments / data.totalAppointments) * 100)
      : 0
    : 0;

  // BMI category label
  const avgBMI = data?.avgBMI || 0;
  const bmiLabel = avgBMI < 18.5 ? { label: "Underweight", color: "text-blue-500" }
    : avgBMI < 25 ? { label: "Normal", color: "text-green-600" }
    : avgBMI < 30 ? { label: "Overweight", color: "text-yellow-600" }
    : { label: "Obese", color: "text-red-500" };

  const handleExportPDF = () => {
    const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const completionRate_ = data?.totalAppointments > 0
      ? Math.round((data.completedAppointments / data.totalAppointments) * 100) : 0;
    const avgBMI_ = data?.avgBMI || 0;
    const bmiLabel_ = avgBMI_ < 18.5 ? "Underweight" : avgBMI_ < 25 ? "Normal" : avgBMI_ < 30 ? "Overweight" : "Obese";

    const goalsRows = (data?.goalsStats || []).map((g: any) => {
      const pct = Math.round((g.count / (data.totalPatients || 1)) * 100);
      return `<tr><td style="padding:6px 10px;border-bottom:1px solid #f3f4f6">${g.goal}</td>
              <td style="padding:6px 10px;border-bottom:1px solid #f3f4f6;text-align:center">${g.count}</td>
              <td style="padding:6px 10px;border-bottom:1px solid #f3f4f6;text-align:center">${pct}%</td></tr>`;
    }).join("") || `<tr><td colspan="3" style="padding:10px;text-align:center;color:#9ca3af">No goals recorded yet</td></tr>`;

    const atRiskRows = (data?.patientsAtRisk || []).map((p: any) =>
      `<tr><td style="padding:6px 10px;border-bottom:1px solid #f3f4f6">${p.name}</td>
       <td style="padding:6px 10px;border-bottom:1px solid #f3f4f6;color:#9ca3af">${p.patientId}</td>
       <td style="padding:6px 10px;border-bottom:1px solid #f3f4f6;color:#f97316">
         ${!p.weight || p.weight === 0 ? "⚠ Weight not recorded" : "⚠ Height not recorded"}
       </td></tr>`
    ).join("") || `<tr><td colspan="3" style="padding:10px;text-align:center;color:#16a34a">✓ All patients have complete records</td></tr>`;

    const categoryRows = (data?.categoryStats || []).map((c: any) => {
      const pct = Math.round((c.count / (data.totalPatients || 1)) * 100);
      return `<tr><td style="padding:6px 10px;border-bottom:1px solid #f3f4f6">${c._id || "Unspecified"}</td>
              <td style="padding:6px 10px;border-bottom:1px solid #f3f4f6;text-align:center">${c.count}</td>
              <td style="padding:6px 10px;border-bottom:1px solid #f3f4f6;text-align:center">${pct}%</td></tr>`;
    }).join("");

    const bmiDist_ = data?.bmiDistribution || {};

    const html = `<html><head><meta charset="utf-8"/>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: Arial, sans-serif; padding: 32px; color: #1a1a1a; background: white; }
      h1 { color: #065F46; font-size: 26px; font-weight: 800; }
      h2 { font-size: 14px; font-weight: 700; color: #374151; margin-bottom: 10px; }
      .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 16px; border-bottom: 2px solid #065F46; margin-bottom: 24px; }
      .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
      .stat-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 14px; }
      .stat-label { font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
      .stat-value { font-size: 22px; font-weight: 800; color: #065F46; }
      .stat-sub { font-size: 11px; color: #6b7280; margin-top: 3px; }
      .section { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; margin-bottom: 16px; }
      .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
      table { width: 100%; border-collapse: collapse; }
      th { background: #f9fafb; padding: 8px 10px; text-align: left; font-size: 11px; color: #9ca3af; font-weight: 600; text-transform: uppercase; }
      .bmi-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
      .bmi-bar { flex: 1; height: 8px; background: #f3f4f6; border-radius: 4px; overflow: hidden; }
      .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 11px; }
      @media print { body { padding: 16px; } }
    </style></head><body>

    <div class="header">
      <div>
        <h1>Practice Analytics Report</h1>
        <p style="color:#6b7280;font-size:13px;margin-top:4px">Generated on ${today}</p>
      </div>
      <div style="text-align:right">
        <p style="font-size:11px;color:#9ca3af">Healthia — Clinical Management</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-box">
        <div class="stat-label">Total Patients</div>
        <div class="stat-value">${data?.totalPatients ?? 0}</div>
        <div class="stat-sub">+${data?.newPatientsThisMonth ?? 0} this month</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Active Plans</div>
        <div class="stat-value">${data?.activePlans ?? 0}</div>
        <div class="stat-sub">Currently active</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Appointments</div>
        <div class="stat-value">${data?.totalAppointments ?? 0}</div>
        <div class="stat-sub">${data?.completedAppointments ?? 0} completed</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Completion Rate</div>
        <div class="stat-value">${completionRate_}%</div>
        <div class="stat-sub">${data?.cancelledAppointments ?? 0} cancelled</div>
      </div>
    </div>

    <div class="grid-2">
      <!-- Patient Goals -->
      <div class="section">
        <h2>Patient Goals</h2>
        <table>
          <tr><th>Goal</th><th style="text-align:center">Patients</th><th style="text-align:center">%</th></tr>
          ${goalsRows}
        </table>
      </div>

      <!-- Category Breakdown -->
      <div class="section">
        <h2>Category Breakdown</h2>
        <table>
          <tr><th>Category</th><th style="text-align:center">Patients</th><th style="text-align:center">%</th></tr>
          ${categoryRows}
        </table>
      </div>
    </div>

    <div class="grid-2">
      <!-- BMI Overview -->
      <div class="section">
        <h2>BMI Overview &nbsp;<span style="color:#065F46;font-size:13px">Avg: ${avgBMI_} — ${bmiLabel_}</span></h2>
        ${[
          { label: "Underweight", count: bmiDist_.underweight || 0, color: "#3b82f6" },
          { label: "Normal",      count: bmiDist_.normal      || 0, color: "#16a34a" },
          { label: "Overweight",  count: bmiDist_.overweight  || 0, color: "#ca8a04" },
          { label: "Obese",       count: bmiDist_.obese       || 0, color: "#ef4444" },
        ].map(b => {
          const pct = Math.round((b.count / (data?.totalPatients || 1)) * 100);
          return `<div class="bmi-row">
            <span style="font-size:12px;width:90px;color:#374151">${b.label}</span>
            <div class="bmi-bar"><div style="height:100%;width:${pct}%;background:${b.color};border-radius:4px"></div></div>
            <span style="font-size:12px;width:60px;text-align:right;color:#6b7280">${b.count} (${pct}%)</span>
          </div>`;
        }).join("")}
      </div>

      <!-- Diet Plan Coverage -->
      <div class="section">
        <h2>Diet Plan Coverage</h2>
        <div style="display:flex;align-items:center;gap:16px;margin-top:8px">
          <div style="font-size:36px;font-weight:800;color:#065F46">
            ${data?.totalPatients > 0 ? Math.round((data.patientsWithPlanCount / data.totalPatients) * 100) : 0}%
          </div>
          <div>
            <div style="font-size:13px;color:#374151">✅ With plan: <strong>${data?.patientsWithPlanCount || 0}</strong></div>
            <div style="font-size:13px;color:#374151;margin-top:4px">❌ Without plan: <strong>${data?.patientsWithoutPlan || 0}</strong></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Patients Needing Attention -->
    <div class="section">
      <h2>⚠ Patients Needing Attention <span style="font-size:12px;color:#f97316">(missing weight or height)</span></h2>
      <table>
        <tr><th>Name</th><th>Patient ID</th><th>Issue</th></tr>
        ${atRiskRows}
      </table>
    </div>

    <!-- Appointment Summary -->
    <div class="section">
      <h2>Appointment Summary</h2>
      <div style="display:flex;gap:16px;margin-top:8px">
        ${[
          { label: "Scheduled", value: data?.scheduledAppointments ?? 0, color: "#3b82f6" },
          { label: "Completed", value: data?.completedAppointments ?? 0, color: "#16a34a" },
          { label: "Cancelled", value: data?.cancelledAppointments ?? 0, color: "#ef4444" },
        ].map(a => `
          <div style="flex:1;background:#f9fafb;border-radius:8px;padding:12px;text-align:center">
            <div style="font-size:24px;font-weight:800;color:${a.color}">${a.value}</div>
            <div style="font-size:11px;color:#9ca3af;margin-top:2px">${a.label}</div>
          </div>`).join("")}
      </div>
    </div>

    <div class="footer">Healthia — Clinical Management System &nbsp;·&nbsp; ${today}</div>
    </body></html>`;

    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 600);
  };

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-400">{error}</div>
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-5 md:px-8 md:py-7">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
            Practice<br />Analytics
          </h1>
          <p className="text-sm text-gray-400 mt-1">Live overview of your patients and appointments.</p>
        </div>
        <button
          onClick={handleExportPDF}
          className="self-start flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 transition-colors"
        >
          <Download size={15} className="text-green-700" />
          Export Report
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          title="Total Patients"   value={data?.totalPatients ?? "—"}
          change={`+${data?.newPatientsThisMonth ?? 0} this month`} positive={true}
          icon={<Users size={18} />} isLoading={isLoading} />
        <StatCard
          title="Active Plans"     value={data?.activePlans ?? "—"}
          change="Currently active" positive={true}
          icon={<Activity size={18} />} isLoading={isLoading} />
        <StatCard
          title="Appointments"     value={data?.totalAppointments ?? "—"}
          change={`${data?.completedAppointments ?? 0} completed`} positive={true}
          icon={<TrendingUp size={18} />} isLoading={isLoading} />
        <StatCard
          title="Completion Rate"  value={`${completionRate}%`}
          change={`${data?.cancelledAppointments ?? 0} cancelled`}
          positive={completionRate >= 50}
          icon={<Heart size={18} />} isLoading={isLoading} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      ) : (
        <>
          {/* Row 1: New Patients + Appointments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="text-base font-bold text-gray-800 mb-4">New Patients per Month</h2>
              <div style={{ height: 200 }}>
                {data?.patientsByMonth?.length > 0
                  ? <Line data={patientActivityData} options={chartOptions} />
                  : <div className="flex items-center justify-center h-full text-gray-300 text-sm">No data yet</div>
                }
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="text-base font-bold text-gray-800 mb-4">Appointments per Month</h2>
              <div style={{ height: 200 }}>
                {data?.appointmentsByMonth?.length > 0
                  ? <Bar data={appointmentsData} options={chartOptions} />
                  : <div className="flex items-center justify-center h-full text-gray-300 text-sm">No data yet</div>
                }
              </div>
            </div>
          </div>

          {/* Row 2: Client Type + Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="text-base font-bold text-gray-800 mb-4">Client Type Distribution</h2>
              <div className="flex items-center gap-6">
                <div className="relative shrink-0" style={{ width: 140, height: 140 }}>
                  <Doughnut data={clientTypeData} options={donutOptions} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-extrabold text-gray-800">{data?.totalPatients}</span>
                    <span className="text-[10px] text-gray-400 font-semibold">TOTAL</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Online",  count: onlineCount,  pct: Math.round((onlineCount / totalForPct) * 100),  color: "bg-[#016333]" },
                    { label: "Offline", count: offlineCount, pct: Math.round((offlineCount / totalForPct) * 100), color: "bg-green-300" },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                        <span className="text-sm text-gray-600 font-medium">{item.label}</span>
                        <span className="ml-auto text-sm font-bold text-gray-800">{item.count}</span>
                      </div>
                      <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="text-base font-bold text-gray-800 mb-4">Category Breakdown</h2>
              {data?.categoryStats?.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {data.categoryStats.map((cat: any, i: number) => {
                    const pct = Math.round((cat.count / (data.totalPatients || 1)) * 100);
                    const colors = ["bg-emerald-600", "bg-green-400", "bg-teal-500", "bg-lime-500"];
                    return (
                      <div key={i}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600 font-medium">{cat._id || "Unspecified"}</span>
                          <span className="text-xs font-bold text-gray-700">{cat.count} ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${colors[i % colors.length]}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-24 text-gray-300 text-sm">No data yet</div>
              )}
            </div>
          </div>

          {/* ✅ Row 3: BMI + Diet Plan Coverage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">

            {/* BMI Distribution */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Scale size={16} className="text-green-700" />
                <h2 className="text-base font-bold text-gray-800">Patient BMI Overview</h2>
              </div>
              <div className="flex items-center gap-6">
                <div className="relative shrink-0" style={{ width: 140, height: 140 }}>
                  <Doughnut data={bmiChartData} options={donutOptions} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-extrabold text-gray-800">{avgBMI > 0 ? avgBMI : "—"}</span>
                    <span className="text-[10px] text-gray-400 font-semibold">AVG BMI</span>
                    {avgBMI > 0 && <span className={`text-[9px] font-bold ${bmiLabel.color}`}>{bmiLabel.label}</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-2.5 flex-1">
                  {[
                    { label: "Underweight", key: "underweight", color: "bg-blue-400",   text: "text-blue-600"   },
                    { label: "Normal",      key: "normal",      color: "bg-green-500",  text: "text-green-600"  },
                    { label: "Overweight",  key: "overweight",  color: "bg-yellow-400", text: "text-yellow-600" },
                    { label: "Obese",       key: "obese",       color: "bg-red-400",    text: "text-red-500"    },
                  ].map(item => {
                    const count = bmiDist[item.key] || 0;
                    const total = (bmiDist.underweight + bmiDist.normal + bmiDist.overweight + bmiDist.obese) || 1;
                    const pct   = Math.round((count / (data?.totalPatients || 1)) * 100);
                    return (
                      <div key={item.key}>
                        <div className="flex justify-between items-center mb-0.5">
                          <span className={`text-xs font-semibold ${item.text}`}>{item.label}</span>
                          <span className="text-xs text-gray-500">{count} patients</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${item.color}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Diet Plan Coverage */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardList size={16} className="text-green-700" />
                <h2 className="text-base font-bold text-gray-800">Diet Plan Coverage</h2>
              </div>
              <div className="flex items-center gap-6">
                <div className="relative shrink-0" style={{ width: 140, height: 140 }}>
                  <Doughnut data={planCoverage} options={donutOptions} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-extrabold text-gray-800">
                      {data?.totalPatients > 0
                        ? Math.round((data.patientsWithPlanCount / data.totalPatients) * 100)
                        : 0}%
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold">COVERAGE</span>
                  </div>
                </div>
                <div className="flex flex-col gap-4 flex-1">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-semibold text-green-700">With Diet Plan</span>
                      <span className="text-xs text-gray-500">{data?.patientsWithPlanCount || 0} patients</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#016333] rounded-full"
                        style={{ width: `${data?.totalPatients > 0 ? Math.round((data.patientsWithPlanCount / data.totalPatients) * 100) : 0}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-semibold text-gray-400">Without Plan</span>
                      <span className="text-xs text-gray-500">{data?.patientsWithoutPlan || 0} patients</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-300 rounded-full"
                        style={{ width: `${data?.totalPatients > 0 ? Math.round((data.patientsWithoutPlan / data.totalPatients) * 100) : 0}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ Row 4: Goals Distribution + Program Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">

            {/* Goals Distribution */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Target size={16} className="text-green-700" />
                <h2 className="text-base font-bold text-gray-800">Patient Goals</h2>
              </div>
              {data?.goalsStats?.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {data.goalsStats.map((g: any, i: number) => {
                    const pct = Math.round((g.count / (data.totalPatients || 1)) * 100);
                    const colors = ["bg-emerald-600", "bg-green-400", "bg-teal-500", "bg-lime-500", "bg-cyan-500"];
                    return (
                      <div key={i}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600 font-medium">{g.goal}</span>
                          <span className="text-xs font-bold text-gray-700">{g.count} ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${colors[i % colors.length]}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-24 gap-2 text-gray-300">
                  <Target size={28} />
                  <p className="text-sm">No goals recorded yet</p>
                </div>
              )}
            </div>

            {/* Program Distribution */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Trophy size={16} className="text-green-700" />
                <h2 className="text-base font-bold text-gray-800">Program Distribution</h2>
              </div>
              {data?.periodStats?.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {data.periodStats.map((p: any, i: number) => {
                    const pct = Math.round((p.count / (data.totalPatients || 1)) * 100);
                    const colors = ["bg-emerald-600", "bg-green-400", "bg-teal-500", "bg-lime-500"];
                    return (
                      <div key={i}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600 font-medium">{p._id || "Unspecified"}</span>
                          <span className="text-xs font-bold text-gray-700">{p.count} ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${colors[i % colors.length]}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-24 text-gray-300 text-sm">No data yet</div>
              )}
            </div>
          </div>

          {/* Row 5: Patients at Risk + Appointment Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="flex items-center gap-2 text-base font-bold text-gray-800">
                  <AlertTriangle size={16} className="text-orange-500" /> Patients Needing Attention
                </h2>
                {data?.patientsAtRisk?.length > 0 && (
                  <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-2.5 py-1 rounded-full">
                    {data.patientsAtRisk.length} FLAGGED
                  </span>
                )}
              </div>
              {data?.patientsAtRisk?.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {data.patientsAtRisk.map((p: any) => (
                    <div key={p._id} className="flex items-center justify-between gap-3 py-2 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {p.name ? p.name[0].toUpperCase() : "P"}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-800">{p.name}</div>
                          <div className="text-xs text-orange-500">
                            {!p.weight || p.weight === 0 ? "⚠ Weight not recorded" : "⚠ Height not recorded"}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-gray-400">{p.patientId}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-8 text-green-600 text-sm font-medium">
                  ✓ All patients have complete records
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-base font-bold text-gray-800 mb-4">
                <Trophy size={16} className="text-green-700" /> Appointment Summary
              </h2>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Scheduled", value: data?.scheduledAppointments  ?? 0, color: "bg-blue-500",  bg: "bg-blue-50",  text: "text-blue-700"  },
                  { label: "Completed", value: data?.completedAppointments  ?? 0, color: "bg-green-500", bg: "bg-green-50", text: "text-green-700" },
                  { label: "Cancelled", value: data?.cancelledAppointments  ?? 0, color: "bg-red-400",   bg: "bg-red-50",   text: "text-red-600"   },
                ].map(item => (
                  <div key={item.label} className={`flex items-center justify-between px-4 py-3 rounded-xl ${item.bg}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                      <span className={`text-sm font-semibold ${item.text}`}>{item.label}</span>
                    </div>
                    <span className={`text-xl font-bold ${item.text}`}>{item.value}</span>
                  </div>
                ))}
                <div className="mt-2 pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500 font-medium">Completion Rate</span>
                    <span className="text-xs font-bold text-gray-700">{completionRate}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-600 rounded-full transition-all" style={{ width: `${completionRate}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;