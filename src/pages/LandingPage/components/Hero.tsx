import {
  Activity,
  BarChart2,
  Calendar,
  ChevronRight,
  Heart,
} from "lucide-react"
import type { Stats } from "../types"

export default function Hero({ stats }: { stats: Stats }) {
  return (
    <section className="bg-white pt-28 pb-20" id="features">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
        <div>
          <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-[#e8f5ee] px-3 py-1.5 text-xs font-semibold text-[#1a6b3a]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1a6b3a]" />
            Clinical Nutrition Platform
          </span>
          <h1 className="mb-5 text-4xl leading-tight font-extrabold text-gray-900 md:text-5xl">
            Your Smart Health &amp; Nutrition Companion
          </h1>
          <p className="mb-8 max-w-md text-base leading-relaxed text-gray-500">
            Healthia connects patients with their nutritionists — personalized
            diet plans, daily tracking, and real-time care coordination all in
            one place.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://wa.me/201000000000"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full bg-[#1a6b3a] px-6 py-3 font-semibold text-white shadow-sm hover:bg-[#155730]"
            >
              Get Started Now <ChevronRight className="h-4 w-4" />
            </a>
            <a
              href="#for-patients"
              className="flex items-center gap-2 rounded-full border border-gray-200 px-6 py-3 font-semibold text-gray-700 hover:border-[#1a6b3a] hover:text-[#1a6b3a]"
            >
              Learn More
            </a>
          </div>

          {/* Stats */}
          <div className="mt-10 flex gap-8">
            {[
              { value: `${stats.totalPatients}+`, label: "Active Patients" },
              { value: `${stats.totalDoctors}+`, label: "Nutritionists" },
              { value: `${stats.satisfactionRate}%`, label: "Satisfaction" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-extrabold text-[#1a6b3a]">
                  {s.value}
                </p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right visual */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              icon: <BarChart2 size={22} className="text-[#1a6b3a]" />,
              title: "Diet Plans",
              desc: "Personalized weekly meal plans",
            },
            {
              icon: <Activity size={22} className="text-blue-500" />,
              title: "Daily Tracking",
              desc: "Water, sleep, mood & weight",
            },
            {
              icon: <Calendar size={22} className="text-purple-500" />,
              title: "Appointments",
              desc: "Easy online booking",
            },
            {
              icon: <Heart size={22} className="text-red-400" />,
              title: "Health Goals",
              desc: "Track your progress daily",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-2">{card.icon}</div>
              <p className="text-sm font-bold text-gray-800">{card.title}</p>
              <p className="mt-0.5 text-xs text-gray-400">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
