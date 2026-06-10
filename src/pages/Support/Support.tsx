import { useState } from "react"
import AuthNav from "../../components/AuthNav"
import Footer from "../../components/footer/Footer"
import leafImg from "../../assets/1.png"

const faqs = [
  {
    q: "How do I book an appointment?",
    a: "You can book an appointment through the 'Book Appointment' section after logging in to your account.",
  },
  {
    q: "How do I reset my password?",
    a: "Click on 'Forgot Password' on the login page and follow the instructions sent to your email.",
  },
  {
    q: "Can I cancel or reschedule an appointment?",
    a: "Yes, you can manage your appointments from the Appointments section in your dashboard.",
  },
  {
    q: "How do I update my profile information?",
    a: "Go to your Profile page from the navbar and click 'Edit Profile' to update your details.",
  },
  {
    q: "Who can I contact if I have a technical issue?",
    a: "Use the contact form on this page and our support team will get back to you within 24 hours.",
  },
]

export default function Support() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [form, setForm] = useState({ name: "", email: "", type: "", message: "" })
  const [submitted, setSubmitted] = useState(false)

  const set = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.type || !form.message) return
    setSubmitted(true)
    setForm({ name: "", email: "", type: "", message: "" })
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <div className="min-h-screen bg-[#f0f4f0] relative overflow-hidden">
      {/* Background leaf */}
      <img
        src={leafImg}
        alt=""
        className="pointer-events-none absolute -left-20 top-20 w-[420px] opacity-20 select-none"
      />

      <AuthNav />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-800">How can we help you?</h1>
          <p className="mt-2 text-gray-500">Fill out the form below or browse the FAQ section</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Contact Form */}
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-lg font-bold text-gray-800">Contact Us</h2>

            {submitted && (
              <div className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                ✓ Message sent! We'll get back to you within 24 hours.
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Name */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => set("name", e.target.value)}
                  placeholder="Dr. John Doe"
                  className="rounded-lg border border-gray-200 bg-[#f7f9f8] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#065F46]/30"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set("email", e.target.value)}
                  placeholder="you@healthia.com"
                  className="rounded-lg border border-gray-200 bg-[#f7f9f8] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#065F46]/30"
                />
              </div>

              {/* Issue Type */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Issue Type
                </label>
                <select
                  value={form.type}
                  onChange={e => set("type", e.target.value)}
                  className="rounded-lg border border-gray-200 bg-[#f7f9f8] px-4 py-2.5 text-sm text-gray-600 outline-none focus:ring-2 focus:ring-[#065F46]/30"
                >
                  <option value="">Select a category</option>
                  <option value="account">Account & Login</option>
                  <option value="appointment">Appointments</option>
                  <option value="billing">Billing</option>
                  <option value="technical">Technical Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Message
                </label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={e => set("message", e.target.value)}
                  placeholder="Describe your issue..."
                  className="rounded-lg border border-gray-200 bg-[#f7f9f8] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#065F46]/30 resize-none"
                />
              </div>

              <button
                type="submit"
                className="mt-2 rounded-xl bg-[#065F46] py-3 text-sm font-bold text-white transition-colors hover:bg-[#054d38]"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* FAQ */}
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-lg font-bold text-gray-800">Frequently Asked Questions</h2>
            <div className="flex flex-col gap-3">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-xl border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {faq.q}
                    <span className="ml-2 text-[#065F46] text-lg leading-none">
                      {openIndex === i ? "−" : "+"}
                    </span>
                  </button>
                  {openIndex === i && (
                    <div className="px-4 pb-4 text-sm text-gray-500 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}