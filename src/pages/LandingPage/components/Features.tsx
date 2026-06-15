import {
  Brain,
  Calendar,
  Shield,
  TrendingUp,
  Utensils,
  Zap,
} from "lucide-react"

export default function Features() {
  const cards = [
    {
      icon: <Utensils size={24} className="text-[#1a6b3a]" />,
      title: "Personalized Diet Plans",
      desc: "Doctors create weekly meal plans with calories, macros, and daily meal structure tailored to each patient.",
    },
    {
      icon: <TrendingUp size={24} className="text-blue-500" />,
      title: "Health Tracking",
      desc: "Patients log daily water, sleep, mood, exercise and weight. Doctors see everything in real-time.",
    },
    {
      icon: <Calendar size={24} className="text-purple-500" />,
      title: "Appointment Booking",
      desc: "Patients book sessions with their doctor from available slots. Automated confirmations included.",
    },
    {
      icon: <Brain size={24} className="text-orange-500" />,
      title: "Progress Analytics",
      desc: "Visual charts and insights on weight progress, compliance rates, BMI trends and goal achievement.",
    },
    {
      icon: <Shield size={24} className="text-red-400" />,
      title: "Secure & Private",
      desc: "All health data is encrypted and private. HIPAA-compliant infrastructure protects every record.",
    },
    {
      icon: <Zap size={24} className="text-yellow-500" />,
      title: "Real-Time Updates",
      desc: "Changes to diet plans, notes, and check-ups sync instantly between doctor and patient.",
    },
  ]
  return (
    <section className="bg-gray-50 py-20" id="features">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-bold tracking-widest text-[#1a6b3a] uppercase">
            Platform Features
          </p>
          <h2 className="text-2xl font-bold text-gray-900">
            Everything in One Place
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Built for both patients and healthcare providers.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {cards.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4">{c.icon}</div>
              <h3 className="mb-2 font-bold text-gray-900">{c.title}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
