import { CheckCircle2 } from "lucide-react"
import type { Stats } from "../types"

export default function ForDoctors({ stats }: { stats: Stats }) {
  const features = [
    "Manage unlimited patients from one dashboard",
    "Create & publish weekly diet plans instantly",
    "Track patient progress with real-time analytics",
    "Receive appointment bookings automatically",
    "Send clinical notes and recommendations",
    "Export patient reports as PDF",
  ]
  return (
    <section className="bg-white py-20" id="for-doctors">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-bold tracking-widest text-[#1a6b3a] uppercase">
              For Doctors
            </p>
            <h2 className="mb-4 text-3xl font-extrabold text-gray-900">
              Everything You Need to Manage Your Practice
            </h2>
            <p className="mb-8 text-sm leading-relaxed text-gray-500">
              Healthia gives nutritionists and dietitians a complete clinical
              management system — from patient onboarding to diet plan delivery.
            </p>
            <ul className="space-y-3">
              {features.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-3 text-sm text-gray-700"
                >
                  <CheckCircle2 size={16} className="shrink-0 text-[#1a6b3a]" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                label: "Patients Managed",
                value: `${stats.totalPatients || 0}+`,
                color: "bg-[#e8f5ee] text-[#1a6b3a]",
              },
              {
                label: "Plans Created",
                value: `${stats.totalPlans || 0}+`,
                color: "bg-blue-50 text-blue-700",
              },
              {
                label: "Appointments",
                value: `${stats.totalAppointments || 0}+`,
                color: "bg-purple-50 text-purple-700",
              },
              {
                label: "Success Rate",
                value: `${stats.satisfactionRate || 98}%`,
                color: "bg-orange-50 text-orange-700",
              },
            ].map((s) => (
              <div key={s.label} className={`rounded-2xl p-5 ${s.color}`}>
                <p className="text-3xl font-extrabold">{s.value}</p>
                <p className="mt-1 text-xs font-semibold opacity-70">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
