import { Star } from "lucide-react"

export default function Testimonials() {
  const reviews = [
    {
      name: "Sara M.",
      role: "Patient",
      stars: 5,
      text: "My nutritionist created a perfect plan and I lost 8 kg in 2 months. The daily tracking keeps me motivated!",
    },
    {
      name: "Dr. Layla",
      role: "Nutritionist",
      stars: 5,
      text: "Healthia saved me hours of admin work. I can manage all my patients, create plans and track progress effortlessly.",
    },
    {
      name: "Ahmed K.",
      role: "Patient",
      stars: 5,
      text: "Booking appointments is so easy and the meal plan is actually delicious. My health has improved dramatically.",
    },
  ]
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-bold tracking-widest text-[#1a6b3a] uppercase">
            Testimonials
          </p>
          <h2 className="text-2xl font-bold text-gray-900">
            What Our Users Say
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: r.stars }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="mb-4 text-sm leading-relaxed text-gray-600">
                "{r.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8f5ee] text-sm font-bold text-[#1a6b3a]">
                  {r.name[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
