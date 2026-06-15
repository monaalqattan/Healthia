import { Check } from "lucide-react"

export default function Pricing() {
  const plans = [
    {
      name: "Basic",
      price: "200",
      period: " EGP",
      tag: "Single Session",
      desc: "Perfect for a one-time consultation",
      color: "border-gray-200",
      badge: "",
      features: [
        "1 nutrition consultation",
        "Personalized diet assessment",
        "Basic meal plan",
        "Follow-up notes",
        "Email support",
      ],
    },
    {
      name: "Monthly",
      price: "800",
      period: " EGP/month",
      tag: "Monthly Follow-up",
      desc: "Ideal for ongoing progress tracking",
      color: "border-[#1a6b3a]",
      badge: "Most Popular",
      features: [
        "4 sessions per month",
        "Custom weekly diet plan",
        "Daily progress tracking",
        "WhatsApp support",
        "Body measurements tracking",
        "Plan adjustments anytime",
      ],
    },
    {
      name: "Premium",
      price: "2,000",
      period: " EGP",
      tag: "3-Month Program",
      desc: "Full transformation program",
      color: "border-gray-200",
      badge: "",
      features: [
        "12 sessions over 3 months",
        "Full nutrition program",
        "Weekly plan updates",
        "Priority WhatsApp support",
        "Progress reports & analytics",
        "Guaranteed results or refund",
      ],
    },
  ]

  return (
    <section className="bg-white py-20" id="pricing">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-bold tracking-widest text-[#1a6b3a] uppercase">
            Pricing
          </p>
          <h2 className="text-2xl font-bold text-gray-900">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            No hidden fees. Choose the plan that fits your goal.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border-2 p-6 ${plan.color} ${plan.badge ? "shadow-lg" : "shadow-sm"}`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#1a6b3a] px-3 py-1 text-xs font-bold text-white">
                  {plan.badge}
                </span>
              )}
              <p className="text-xs font-bold tracking-wide text-[#1a6b3a] uppercase">
                {plan.tag}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-gray-500">
                {plan.name}
              </p>
              <div className="my-3 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-gray-900">
                  {plan.price}
                </span>
                <span className="text-sm text-gray-400">{plan.period}</span>
              </div>
              <p className="mb-5 text-xs text-gray-400">{plan.desc}</p>
              <ul className="mb-6 space-y-2.5">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <Check size={14} className="shrink-0 text-[#1a6b3a]" /> {f}
                  </li>
                ))}
              </ul>
              <a
                href="https://wa.me/201000000000"
                target="_blank"
                rel="noreferrer"
                className={`block w-full rounded-xl py-2.5 text-center text-sm font-semibold transition-colors ${
                  plan.badge
                    ? "bg-[#1a6b3a] text-white hover:bg-[#155730]"
                    : "border border-gray-200 text-gray-700 hover:border-[#1a6b3a] hover:text-[#1a6b3a]"
                }`}
              >
                Get Started
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
