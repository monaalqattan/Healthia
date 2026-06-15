import { ClipboardList, Stethoscope, TrendingUp, User } from "lucide-react"

const steps = [
  {
    icon: User,
    label: "Create Account",
    desc: "Sign up and enter your basic health info and goals.",
  },
  {
    icon: Stethoscope,
    label: "Meet Your Doctor",
    desc: "Get matched with a certified nutritionist who fits your needs.",
  },
  {
    icon: ClipboardList,
    label: "Get Your Plan",
    desc: "Receive a personalized diet plan tailored to your goals.",
  },
  {
    icon: TrendingUp,
    label: "Track Progress",
    desc: "Log daily check-ins and watch your health improve over time.",
  },
]

export default function HowItWorks() {
  return (
    <section className="bg-gray-50 py-20" id="for-patients">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <p className="mb-2 text-xs font-bold tracking-widest text-[#1a6b3a] uppercase">
          How It Works
        </p>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Your Journey to Better Health
        </h2>
        <p className="mx-auto mb-12 max-w-md text-sm text-gray-500">
          From sign-up to results — everything in four simple steps.
        </p>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {steps.map(({ icon: Icon, label, desc }, i) => (
            <div key={label} className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#1a6b3a]/20 bg-white shadow-sm">
                  <Icon className="h-6 w-6 text-[#1a6b3a]" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#1a6b3a] text-[10px] font-bold text-white">
                  {i + 1}
                </span>
              </div>
              <p className="mb-1 text-sm font-bold text-gray-800">{label}</p>
              <p className="text-xs leading-relaxed text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
