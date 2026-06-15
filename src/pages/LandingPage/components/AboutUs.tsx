export default function AboutUs() {
  return (
    <section className="bg-white py-20" id="about-us">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-bold tracking-widest text-[#1a6b3a] uppercase">
              About Us
            </p>
            <h2 className="mb-4 text-3xl font-extrabold text-gray-900">
              We're on a Mission to Make Clinical Nutrition Accessible
            </h2>
            <p className="mb-5 text-sm leading-relaxed text-gray-500">
              Healthia was founded by a team of nutritionists, doctors, and
              engineers who believed that managing health and nutrition
              shouldn't be complicated. We built a platform that bridges the gap
              between patients and their healthcare providers.
            </p>
            <p className="text-sm leading-relaxed text-gray-500">
              Our system is used by hundreds of certified nutritionists across
              Egypt and the Middle East, helping thousands of patients reach
              their health goals through personalized diet plans and continuous
              monitoring.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                value: "2026",
                label: "Founded",
                bg: "bg-[#e8f5ee] text-[#1a6b3a]",
              },
              {
                value: "100%",
                label: "Personalized Plans",
                bg: "bg-blue-50 text-blue-700",
              },
              {
                value: "Weekly",
                label: "Doctor Follow-up",
                bg: "bg-purple-50 text-purple-700",
              },
              {
                value: "3 Months",
                label: "Average Goal Achieved",
                bg: "bg-orange-50 text-orange-700",
              },
            ].map((s) => (
              <div key={s.label} className={`rounded-2xl p-5 ${s.bg}`}>
                <p className="text-2xl font-extrabold">{s.value}</p>
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
