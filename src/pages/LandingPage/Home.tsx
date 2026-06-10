import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import {
  Activity,
  Brain,
  Calendar,
  ChevronRight,
  ClipboardList,
  Stethoscope,
  TrendingUp,
  User,
  Utensils,
  CheckCircle2,
  Menu,
  X,
  Mail,
  Phone,
  MapPin,
  Star,
  Shield,
  Zap,
  Heart,
  BarChart2,
  Send,
  Check,
} from "lucide-react"

/* ── Navbar ─────────────────────────────────── */
function Navbar() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const links = [
    "Features",
    "For Patients",
    "For Doctors",
    "Pricing",
    "About Us",
    "Blog",
    "Contact",
  ]

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <span className="text-xl font-bold tracking-tight text-[#1a6b3a]">
          Healthia
        </span>

        <ul className="hidden items-center gap-7 text-sm font-medium text-gray-600 md:flex">
          {links.map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="transition-colors hover:text-[#1a6b3a]"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="hidden text-sm font-medium text-gray-700 hover:text-[#1a6b3a] md:block"
          >
            Login
          </button>
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? (
              <X className="h-5 w-5 text-gray-600" />
            ) : (
              <Menu className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-gray-100 bg-white px-6 py-4 md:hidden">
          {links.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              className="block py-2 text-sm font-medium text-gray-600 hover:text-[#1a6b3a]"
              onClick={() => setOpen(false)}
            >
              {item}
            </a>
          ))}
          <button
            onClick={() => navigate("/login")}
            className="mt-3 w-full rounded-full bg-[#1a6b3a] py-2 text-sm font-semibold text-white"
          >
            Login / Sign Up
          </button>
        </div>
      )}
    </nav>
  )
}

/* ── Hero ────────────────────────────────────── */
interface Stats {
  totalPatients: number
  totalDoctors: number
  totalPlans: number
  totalAppointments: number
  satisfactionRate: number
}

function Hero({ stats }: { stats: Stats }) {
  return (
    <section className="bg-white pt-28 pb-20" id="features">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
        <div>
          <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-[#e8f5ee] px-3 py-1.5 text-xs font-semibold text-[#1a6b3a]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1a6b3a]" />
            CLINICAL NUTRITION PLATFORM
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

/* ── How It Works ────────────────────────────── */
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

function HowItWorks() {
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

/* ── For Doctors ─────────────────────────────── */
function ForDoctors({ stats }: { stats: Stats }) {
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

/* ── Features ────────────────────────────────── */
function Features() {
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

/* ── Pricing ─────────────────────────────────── */
function Pricing() {
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

/* ── Testimonials ────────────────────────────── */
function Testimonials() {
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

/* ── Contact ─────────────────────────────────── */
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (!form.name || !form.email || !form.message) return
    setSending(true)
    await new Promise((r) => setTimeout(r, 800)) // simulate
    setSent(true)
    setSending(false)
  }

  return (
    <section className="bg-white py-20" id="contact">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-bold tracking-widest text-[#1a6b3a] uppercase">
              Contact Us
            </p>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Get in Touch
            </h2>
            <p className="mb-8 text-sm leading-relaxed text-gray-500">
              Have questions about Healthia? We're here to help. Send us a
              message and we'll get back to you within 24 hours.
            </p>
            <div className="space-y-4">
              {[
                { icon: <Mail size={16} />, text: "support@healthia.com" },
                { icon: <Phone size={16} />, text: "+1 (800) HEALTHIA" },
                {
                  icon: <MapPin size={16} />,
                  text: "Cairo, Egypt & Worldwide",
                },
              ].map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-sm text-gray-600"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8f5ee] text-[#1a6b3a]">
                    {c.icon}
                  </div>
                  {c.text}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-gray-50 p-6">
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 py-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f5ee]">
                  <Check size={24} className="text-[#1a6b3a]" />
                </div>
                <p className="text-base font-bold text-gray-800">
                  Message Sent!
                </p>
                <p className="text-center text-sm text-gray-400">
                  We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <h3 className="font-bold text-gray-800">Send us a message</h3>
                {[
                  {
                    label: "Full Name",
                    key: "name",
                    type: "text",
                    placeholder: "Your name",
                  },
                  {
                    label: "Email",
                    key: "email",
                    type: "email",
                    placeholder: "your@email.com",
                  },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="mb-1 block text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      value={[f.key]}
                      onChange={(e) =>
                        setForm({ ...form, [f.key]: e.target.value })
                      }
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1a6b3a]"
                    />
                  </div>
                ))}
                <div>
                  <label className="mb-1 block text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
                    Message
                  </label>
                  <textarea
                    placeholder="How can we help you?"
                    rows={4}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1a6b3a]"
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={
                    sending || !form.name || !form.email || !form.message
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#1a6b3a] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#155730] disabled:opacity-50"
                >
                  {sending ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send size={14} /> Send Message
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── About Us ────────────────────────────────── */
function AboutUs() {
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
                value: "2024",
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

/* ── Blog ────────────────────────────────────── */
function Blog() {
  const posts = [
    {
      tag: "Nutrition",
      color: "bg-green-50 text-green-700",
      title: "5 Science-Backed Strategies for Sustainable Weight Loss",
      desc: "Discover evidence-based approaches that go beyond crash diets — focusing on long-term lifestyle changes that actually stick.",
      date: "Jun 5, 2026",
      readTime: "5 min read",
    },
    {
      tag: "Health Tips",
      color: "bg-blue-50 text-blue-700",
      title: "Why Tracking Your Daily Water Intake Matters More Than You Think",
      desc: "Hydration affects everything from energy levels to metabolism. Learn how proper water intake can transform your health journey.",
      date: "Jun 1, 2026",
      readTime: "3 min read",
    },
    {
      tag: "For Doctors",
      color: "bg-purple-50 text-purple-700",
      title: "How Digital Tools Are Transforming Nutritional Counseling",
      desc: "A look at how platforms like Healthia are helping nutritionists manage more patients with better outcomes and less admin overhead.",
      date: "May 28, 2026",
      readTime: "7 min read",
    },
  ]
  return (
    <section className="bg-gray-50 py-20" id="blog">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-bold tracking-widest text-[#1a6b3a] uppercase">
            Blog
          </p>
          <h2 className="text-2xl font-bold text-gray-900">
            Latest from Healthia
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Tips, insights, and updates from our team.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <div
              key={post.title}
              className="cursor-pointer rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${post.color}`}
              >
                {post.tag}
              </span>
              <h3 className="mt-3 mb-2 text-sm leading-snug font-bold text-gray-900">
                {post.title}
              </h3>
              <p className="mb-4 text-xs leading-relaxed text-gray-500">
                {post.desc}
              </p>
              <div className="flex items-center justify-between text-[10px] text-gray-400">
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── CTA ─────────────────────────────────────── */
function CTA() {
  const navigate = useNavigate()
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#e8f5ee] via-white to-[#d4eddf] px-10 py-16 shadow-inner">
          <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-[#1a6b3a]/10 blur-3xl" />
          <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-[#1a6b3a]/10 blur-3xl" />
          <h2 className="mb-4 text-4xl leading-tight font-extrabold text-gray-900 md:text-5xl">
            Start your healthy journey today.
          </h2>
          <p className="mx-auto mb-8 max-w-sm text-sm text-gray-500">
            Join thousands of patients and practitioners already using Healthia
            to transform outcomes.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="rounded-full bg-[#1a6b3a] px-8 py-3.5 font-semibold text-white shadow-md hover:bg-[#155730]"
            >
              Get Started — It's Free
            </button>
            <a
              href="#contact"
              className="rounded-full border border-[#1a6b3a] px-8 py-3.5 font-semibold text-[#1a6b3a] hover:bg-[#e8f5ee]"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Footer ──────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        {/* Brand */}
        <div>
          <p className="mb-1 text-lg font-bold text-[#1a6b3a]">Healthia</p>
          <p className="text-xs text-gray-400">
            Empowering clinical precision with empathetic patient care.
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex gap-3">
          <a
            href="https://wa.me/201000000000"
            target="_blank"
            rel="noreferrer"
            title="WhatsApp"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 transition-colors hover:bg-green-100"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-green-600">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.852L.057 23.5l5.797-1.522A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.371l-.36-.214-3.724.977.994-3.634-.234-.373A9.818 9.818 0 0112 2.182c5.42 0 9.818 4.398 9.818 9.818 0 5.421-4.398 9.818-9.818 9.818z" />
            </svg>
          </a>
          <a
            href="mailto:support@healthia.com"
            title="Email"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-[#e8f5ee]"
          >
            <Mail size={15} className="text-gray-500" />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            title="Instagram"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-50 transition-colors hover:bg-pink-100"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-pink-500">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>
        </div>

        <p className="text-xs text-gray-400">
          © 2026 Healthia. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

/* ── Page Root ───────────────────────────────── */
export default function HealthiaLanding() {
  const [stats, setStats] = useState<Stats>({
    totalPatients: 0,
    totalDoctors: 0,
    totalPlans: 0,
    totalAppointments: 0,
    satisfactionRate: 98,
  })

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/analytics/public-stats`
    )
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 antialiased">
      <Navbar />
      <main>
        <Hero stats={stats} />
        <HowItWorks />
        <Features />
        <ForDoctors stats={stats} />
        <Testimonials />
        <Pricing />
        <AboutUs />
        <Blog />
        <Contact />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
