import {
  Activity,
  Brain,
  Calendar,
  ChevronRight,
  ClipboardList,
  Lock,
  Play,
  Stethoscope,
  TrendingUp,
  User,
  Utensils,
  CheckCircle2,
  BarChart2,
  FileText,
  Menu,
} from "lucide-react"

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <span className="text-xl font-bold tracking-tight text-[#1a6b3a]">
          Healthia
        </span>

        <ul className="hidden items-center gap-7 text-sm font-medium text-gray-600 md:flex">
          {[
            "Features",
            "For Patients",
            "For Doctors",
            "Solutions",
            "Pricing",
          ].map((item) => (
            <li key={item}>
              <a href="#" className="transition-colors hover:text-[#1a6b3a]">
                {item}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#"
            className="hidden text-sm font-medium text-gray-700 hover:text-[#1a6b3a] md:block"
          >
            Login
          </a>
          <button className="rounded-full bg-[#1a6b3a] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#155730]">
            Get Started
          </button>
          <Menu className="h-5 w-5 text-gray-600 md:hidden" />
        </div>
      </div>
    </nav>
  )
}

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
function Hero() {
  return (
    <section className="bg-white pt-28 pb-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
        {/* Left */}
        <div>
          <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-[#e8f5ee] px-3 py-1.5 text-xs font-semibold text-[#1a6b3a]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1a6b3a]" />
            NEW PLATFORM FEATURES
          </span>
          <h1 className="mb-5 text-4xl leading-tight font-extrabold text-gray-900 md:text-5xl">
            Your Smart Health &amp; Nutrition Companion
          </h1>
          <p className="mb-8 max-w-md text-base leading-relaxed text-gray-500">
            Healthia Vitality integrates clinical-grade health tracking with
            intuitive nutritional planning. Empowering both patients and
            clinicians with actionable insights and seamless care coordination.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 rounded-full bg-[#1a6b3a] px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-[#155730]">
              Get Started Now <ChevronRight className="h-4 w-4" />
            </button>
            <button className="flex items-center gap-2 rounded-full border border-gray-200 px-6 py-3 font-semibold text-gray-700 transition-colors hover:border-[#1a6b3a] hover:text-[#1a6b3a]">
              <Play className="h-4 w-4 fill-current" /> View Demo
            </button>
          </div>
        </div>

        {/* Right – decorative food image placeholder */}
        <div className="flex aspect-4/3 items-center justify-center overflow-hidden rounded-2xl bg-[#f3f9f5] shadow-lg">
          <div className="space-y-2 text-center text-[#1a6b3a]/40">
            <Utensils className="mx-auto h-16 w-16" />
            <p className="text-sm font-medium">Nutritious Meals</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   STEPS
───────────────────────────────────────────── */
const steps = [
  {
    icon: User,
    label: "Profile Setup",
    desc: "Enter basic health metrics and goals to initialize your personalized dashboard.",
  },
  {
    icon: Activity,
    label: "Daily Tracking",
    desc: "Log nutrition, vitals, and activity with our intuitive bento-style interface.",
  },
  {
    icon: Brain,
    label: "AI Insights",
    desc: "Receive automated recommendations based on your unique clinical data trends.",
  },
  {
    icon: Stethoscope,
    label: "Doctor Review",
    desc: "Share curated reports instantly with your healthcare provider for adjusted care.",
  },
]

function Steps() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Streamlined Care Journey
        </h2>
        <p className="mx-auto mb-12 max-w-md text-sm text-gray-500">
          Experience a seamless integration of tracking, planning, and
          professional guidance designed for real-world results.
        </p>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {steps.map(({ icon: Icon, label, desc }, i) => (
            <div key={label} className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#1a6b3a]/20 bg-white shadow-sm">
                <Icon className="h-6 w-6 text-[#1a6b3a]" />
              </div>
              <p className="mb-1 text-xs font-semibold tracking-wide text-gray-400 uppercase">
                {i + 1}. {label}
              </p>
              <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   CAPABILITIES
───────────────────────────────────────────── */
function Capabilities() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Comprehensive Capabilities
          </h2>
          <a
            href="#"
            className="flex items-center gap-1 text-sm font-semibold text-[#1a6b3a] hover:underline"
          >
            View all features <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Card 1 – Nutritional */}
          <div className="rounded-2xl border border-gray-100 p-6 shadow-sm transition-shadow hover:shadow-md">
            <Utensils className="mb-4 h-7 w-7 text-[#1a6b3a]" />
            <h3 className="mb-2 font-bold text-gray-900">
              Nutritional Architecture
            </h3>
            <p className="mb-5 text-sm leading-relaxed text-gray-500">
              Advanced meal planning algorithms that balance macronutrients with
              specific medical dietary requirements, ensuring compliance and
              taste.
            </p>
            <div className="rounded-xl bg-gray-50 p-3">
              <div className="mb-1.5 flex justify-between text-xs text-gray-500">
                <span className="font-medium">DIETARY COMPLIANCE</span>
                <span className="font-bold text-[#1a6b3a]">81%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-[#1a6b3a]"
                  style={{ width: "81%" }}
                />
              </div>
            </div>
          </div>

          {/* Card 2 – Vitals */}
          <div className="rounded-2xl border border-gray-100 p-6 shadow-sm transition-shadow hover:shadow-md">
            <TrendingUp className="mb-4 h-7 w-7 text-[#1a6b3a]" />
            <h3 className="mb-2 font-bold text-gray-900">
              Clinical Vital Tracking
            </h3>
            <p className="mb-5 text-sm leading-relaxed text-gray-500">
              Secure, HIPAA-compliant logging of core vitals with real-time
              alert thresholds customized by your physician.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-gray-50 p-3 text-center">
                <p className="mb-1 text-[10px] tracking-wide text-gray-400 uppercase">
                  Blood Pressure
                </p>
                <p className="text-lg font-bold text-gray-800">120/80</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-3 text-center">
                <p className="mb-1 text-[10px] tracking-wide text-gray-400 uppercase">
                  Heart Rate
                </p>
                <p className="text-lg font-bold text-gray-800">
                  72{" "}
                  <span className="text-sm font-normal text-gray-400">bpm</span>
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 – Scheduling */}
          <div className="rounded-2xl border border-gray-100 p-6 shadow-sm transition-shadow hover:shadow-md">
            <Calendar className="mb-4 h-7 w-7 text-[#1a6b3a]" />
            <h3 className="mb-2 font-bold text-gray-900">
              Integrated Scheduling
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-gray-500">
              Seamlessly book follow-ups, schedule lab tests, and set medication
              reminders all from a centralized, clear calendar view.
            </p>
            <a
              href="#"
              className="flex items-center gap-1 text-sm font-semibold text-[#1a6b3a] hover:underline"
            >
              Explore Calendar <ChevronRight className="h-4 w-4" />
            </a>
          </div>

          {/* Card 4 – Security */}
          <div className="rounded-2xl bg-[#1a6b3a] p-6 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <Lock className="h-5 w-5 text-white" />
            </div>
            <h3 className="mb-2 font-bold text-white">Bank-Grade Security</h3>
            <p className="mb-5 text-sm leading-relaxed text-white/70">
              Your health data is encrypted end-to-end. We adhere to the
              strictest compliance standards to ensure your privacy is never
              compromised.
            </p>
            <div className="space-y-2">
              {["HIPAA Compliant", "SOC 2 Type II"].map((badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-2 text-sm font-medium text-white"
                >
                  <CheckCircle2 className="h-4 w-4 text-white/70" /> {badge}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   APP PREVIEW
───────────────────────────────────────────── */
function AppPreview() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-12 text-center text-2xl font-bold text-gray-900">
          Experience the Interface
        </h2>

        {/* Mock App Shell */}
        <div className="flex h-125 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
          {/* Sidebar */}
          <aside className="w-44 shrink-0 border-r border-gray-100 bg-gray-50 p-4">
            <p className="mb-1 text-[10px] font-bold text-[#1a6b3a]">
              Vitalis Clinical
            </p>
            <p className="mb-5 text-[9px] text-gray-400">Clinical Metrics</p>
            {[
              { icon: BarChart2, label: "Dashboard" },
              { icon: User, label: "Patients" },
              { icon: Utensils, label: "Meal Builder", active: true },
              { icon: ClipboardList, label: "Diet Calculator" },
              { icon: FileText, label: "Templates" },
              { icon: Activity, label: "Reports" },
            ].map(({ icon: Icon, label, active }) => (
              <div
                key={label}
                className={`mb-0.5 flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 ${
                  active
                    ? "bg-[#e8f5ee] text-[#1a6b3a]"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{label}</span>
              </div>
            ))}
          </aside>

          {/* Main Area */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Top bar */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
              <p className="text-sm font-bold text-gray-800">
                Clinical Diet Planner
              </p>
              <div className="flex items-center gap-4">
                {[
                  "Patient Overview",
                  "Nutritional Goals",
                  "History",
                  "Export PDF",
                ].map((tab, i) => (
                  <span
                    key={tab}
                    className={`cursor-pointer text-xs font-medium ${
                      i === 1
                        ? "border-b-2 border-[#1a6b3a] pb-0.5 text-[#1a6b3a]"
                        : "text-gray-400"
                    }`}
                  >
                    {tab}
                  </span>
                ))}
                <button className="rounded-lg bg-[#1a6b3a] px-3 py-1.5 text-xs font-semibold text-white">
                  Save &amp; Publish
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Panel */}
              <div className="flex w-56 flex-col gap-4 overflow-y-auto border-r border-gray-100 p-4">
                {/* Patient */}
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a6b3a] text-xs font-bold text-white">
                    SJ
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">
                      Sarah Jenkins
                    </p>
                    <span className="rounded-full bg-green-100 px-1.5 py-0.5 text-[9px] font-medium text-[#1a6b3a]">
                      On Track
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    ["68.4 kg", "Weight"],
                    ["170 cm", "Height"],
                    ["22.1", "BMI"],
                  ].map(([val, lbl]) => (
                    <div key={lbl} className="rounded-lg bg-gray-50 p-1.5">
                      <p className="text-[10px] font-bold text-gray-800">
                        {val}
                      </p>
                      <p className="text-[9px] text-gray-400">{lbl}</p>
                    </div>
                  ))}
                </div>
                {/* Diet Calculator */}
                <div className="space-y-3 rounded-xl bg-gray-50 p-3">
                  <p className="text-xs font-bold text-gray-700">
                    Diet Calculator
                  </p>
                  <div>
                    <p className="mb-1 text-[9px] text-gray-400">
                      CALORIE DEFICIT GOAL
                    </p>
                    <div className="rounded-lg border border-gray-200 px-2 py-1">
                      <p className="text-xs font-semibold">500</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="mb-1 text-[9px] text-gray-400">GENDER</p>
                      <div className="rounded-lg border border-gray-200 px-2 py-1 text-xs font-medium text-gray-700">
                        Female
                      </div>
                    </div>
                    <div>
                      <p className="mb-1 text-[9px] text-gray-400">
                        ACTIVITY LEVEL
                      </p>
                      <div className="rounded-lg border border-gray-200 px-2 py-1 text-xs font-medium text-gray-700">
                        Moderate
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="mb-1 text-[9px] text-gray-400">
                      FIBER RECOMMENDATION
                    </p>
                    <div className="mb-1 h-1.5 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-[#1a6b3a]"
                        style={{ width: "60%" }}
                      />
                    </div>
                    <p className="text-xs font-bold text-gray-700">2.2g</p>
                  </div>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="mb-2 text-xs font-bold text-gray-700">
                    Calculated Targets
                  </p>
                  <div className="space-y-1">
                    {[
                      ["Protein", "85g"],
                      ["Carbs", "220g"],
                      ["Fat", "55g"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between text-[10px]">
                        <span className="text-gray-500">{k}</span>
                        <span className="font-bold text-gray-700">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Panel */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-800">
                    Daily Meal Structure
                  </p>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      meal: "Breakfast",
                      hint: "Suggested: 400-500 kcal",
                      item: "Greek Yogurt with Berries",
                      kcal: "312 kcal",
                    },
                    {
                      meal: "Lunch",
                      hint: "Suggested: 500-600 kcal",
                      item: null,
                      kcal: null,
                    },
                    {
                      meal: "Dinner",
                      hint: "Suggested: 550-650 kcal",
                      item: null,
                      kcal: null,
                    },
                  ].map(({ meal, hint, item, kcal }) => (
                    <div
                      key={meal}
                      className="overflow-hidden rounded-xl border border-gray-100"
                    >
                      <div className="flex items-center justify-between bg-gray-50 px-4 py-2.5">
                        <p className="text-xs font-bold text-gray-700">
                          {meal}
                        </p>
                        <p className="text-[10px] text-gray-400">{hint}</p>
                      </div>
                      {item && (
                        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e8f5ee]">
                              <Utensils className="h-3.5 w-3.5 text-[#1a6b3a]" />
                            </div>
                            <p className="text-xs font-medium text-gray-700">
                              {item}
                            </p>
                          </div>
                          <p className="text-xs font-bold text-[#1a6b3a]">
                            {kcal}
                          </p>
                        </div>
                      )}
                      <div className="border-t border-dashed border-gray-100 px-4 py-2">
                        <button className="text-[10px] font-medium text-gray-400 hover:text-[#1a6b3a]">
                          + ADD INGREDIENT
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   CTA
───────────────────────────────────────────── */
function CTA() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#e8f5ee] via-white to-[#d4eddf] px-10 py-16 shadow-inner">
          {/* Decorative blobs */}
          <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-[#1a6b3a]/10 blur-3xl" />
          <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-[#1a6b3a]/10 blur-3xl" />

          <h2 className="mb-4 text-4xl leading-tight font-extrabold text-gray-900 md:text-5xl">
            Start your healthy journey today.
          </h2>
          <p className="mx-auto mb-8 max-w-sm text-sm text-gray-500">
            Join thousands of patients and practitioners already using Healthia
            to transform outcomes and simplify care management.
          </p>
          <button className="rounded-full bg-[#1a6b3a] px-8 py-3.5 font-semibold text-white shadow-md transition-colors hover:bg-[#155730]">
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white py-12">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-4">
        <div>
          <p className="mb-2 text-lg font-bold text-[#1a6b3a]">Healthia</p>
          <p className="text-xs leading-relaxed text-gray-400">
            Empowering clinical precision with empathetic patient care design.
          </p>
        </div>
        {[
          {
            heading: "Platform",
            links: ["Privacy Policy", "Terms of Service", "Security"],
          },
          { heading: "Support", links: ["Help Center", "Contact Us"] },
        ].map(({ heading, links }) => (
          <div key={heading}>
            <p className="mb-3 text-xs font-bold tracking-wide text-gray-700 uppercase">
              {heading}
            </p>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-xs text-gray-400 transition-colors hover:text-[#1a6b3a]"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="md:text-right">
          <p className="text-xs text-gray-400">
            © 2024 Healthia Vitality. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ─────────────────────────────────────────────
   PAGE ROOT
───────────────────────────────────────────── */
export default function HealthiaLanding() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 antialiased">
      <Navbar />
      <main>
        <Hero />
        <Steps />
        <Capabilities />
        <AppPreview />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
